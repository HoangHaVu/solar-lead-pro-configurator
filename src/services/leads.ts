import { supabase } from '../lib/supabase';
import type { ConfigData, ROICalculations } from '../hooks/useConfigurator';

// installer_id ist optional — wenn gesetzt, wird der Webhook ausgelöst
export async function triggerWebhook(leadId: string, installerId: string): Promise<void> {
  try {
    await supabase.functions.invoke('forward-lead', {
      body: { lead_id: leadId, installer_id: installerId },
    });
  } catch {
    // Fire-and-forget: Webhook-Fehler blockieren die Lead-Submission nicht
  }
}

export interface LeadContact {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  wantsZoomCall: boolean;
}

export async function trackWizardEvent(sessionId: string, event: string, step: number, zip?: string): Promise<void> {
  try {
    await supabase.from('wizard_events').insert({ session_id: sessionId, event, step, zip: zip || null });
  } catch { /* fire-and-forget */ }
}

export async function submitLead(
  contact: LeadContact,
  config: ConfigData,
  calc: ROICalculations,
  installerId?: string,
  photo?: File | null,
): Promise<void> {
  const { data, error } = await supabase.from('leads').insert({
    first_name: contact.firstName,
    last_name: contact.lastName,
    email: contact.email,
    phone: contact.phone || null,
    wants_zoom_call: contact.wantsZoomCall,

    zip: config.zip,
    roof_orientation: config.orientation,
    roof_area: config.area,
    construction_year: config.constructionYear,
    consumption: config.consumption,
    has_e_car: config.futureNeeds.eCar,
    has_heat_pump: config.futureNeeds.heatPump,
    has_battery: config.battery,
    electricity_price: config.electricityPrice,
    planning_horizon: config.planningHorizon || null,
    needs_financing: config.needsFinancing,

    kwp: calc.kwp,
    investment: calc.investment,
    annual_savings: calc.annualSavings,
    amortization: calc.amortization,
    autarky: calc.autarky,
    profit_20_years: calc.profit20Years,
    score: calc.score,
    ...(installerId ? { installer_id: installerId } : {}),
  }).select('id').single();

  if (error) throw new Error(error.message);

  // Foto-Upload fire-and-forget
  if (data?.id && photo) {
    try {
      const ext = photo.name.split('.').pop() ?? 'jpg';
      const path = `${data.id}/dach.${ext}`;
      const { data: uploaded } = await supabase.storage.from('lead-photos').upload(path, photo, { upsert: true });
      if (uploaded) {
        const { data: urlData } = supabase.storage.from('lead-photos').getPublicUrl(path);
        await supabase.from('leads').update({ photo_url: urlData.publicUrl }).eq('id', data.id);
      }
    } catch { /* Upload-Fehler blockieren nie */ }
  }

  // Webhook fire-and-forget — blockiert Submission nie
  if (data?.id && installerId) {
    triggerWebhook(data.id, installerId);
  }
}
