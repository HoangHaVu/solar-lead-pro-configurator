import { supabase } from '../lib/supabase';
import type { ConfigData, ROICalculations } from '../hooks/useConfigurator';

export interface LeadContact {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  wantsZoomCall: boolean;
}

export async function submitLead(
  contact: LeadContact,
  config: ConfigData,
  calc: ROICalculations
): Promise<void> {
  const { error } = await supabase.from('leads').insert({
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

    kwp: calc.kwp,
    investment: calc.investment,
    annual_savings: calc.annualSavings,
    amortization: calc.amortization,
    autarky: calc.autarky,
    profit_20_years: calc.profit20Years,
  });

  if (error) throw new Error(error.message);
}
