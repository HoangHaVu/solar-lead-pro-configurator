import { supabase } from '../lib/supabase';

export interface Project {
  id: string;
  customer_id: string | null;
  installer_id: string | null;
  lead_id: string | null;
  status: 'angebot' | 'planung' | 'genehmigung' | 'installation' | 'inbetrieb';
  zip: string | null;
  kwp: number | null;
  investment: number | null;
  annual_savings: number | null;
  amortization: number | null;
  autarky: number | null;
  notes: string | null;
  created_at: string;
  installer?: { full_name: string; phone: string | null } | null;
  customer?: { id: string; full_name: string; phone: string | null; zip: string | null } | null;
  lead?: { first_name: string; last_name: string; email: string; phone: string | null; zip: string | null } | null;
}

export interface DocumentItem {
  id: string;
  title: string;
  meta: string | null;
  type: 'pdf' | 'bolt' | 'verified' | 'premium';
  status: 'signed' | 'pending' | 'received';
  status_text: string;
  is_downloadable: boolean;
}

export interface DiscountCode {
  id: string;
  created_by: string;
  code: string;
  label: string | null;
  percentage: number;
  active: boolean;
  min_investment: number | null;
  max_uses: number | null;
  uses_count: number;
  valid_until: string | null;
  created_at: string;
}

export interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  zip: string | null;
  // Dachkonfiguration
  roof_orientation: string | null;
  roof_area: number | null;
  construction_year: string | null;
  // Energiebedarf
  consumption: number | null;
  has_e_car: boolean | null;
  has_heat_pump: boolean | null;
  has_battery: boolean | null;
  electricity_price: number | null;
  // Berechnete Kennzahlen
  kwp: number | null;
  investment: number | null;
  annual_savings: number | null;
  amortization: number | null;
  autarky: number | null;
  profit_20_years: number | null;
  score: number | null;
  // Kontaktpräferenzen
  planning_horizon: 'sofort' | '3monate' | '12monate' | null;
  needs_financing: boolean | null;
  wants_zoom_call: boolean | null;
  status: 'neu' | 'kontaktiert' | 'angebot' | 'abschluss' | 'gewonnen' | 'verloren' | 'planung' | 'installation' | 'abgeschlossen';
  offer_status: 'created' | 'sent' | 'viewed' | 'accepted' | 'rejected';
  offer_sent_at: string | null;
  offer_viewed_at: string | null;
  payment_1_paid: boolean;
  payment_2_paid: boolean;
  payment_3_paid: boolean;
  // Rabatt
  discount_code: string | null;
  discount_percentage: number | null;
  discount_status: 'none' | 'code_applied' | 'requested' | 'approved' | 'rejected';
  final_price: number | null;
  discount_note: string | null;
  discount_requested_at: string | null;
  discount_resolved_at: string | null;
  created_at: string;
}

export interface Appointment {
  id: string;
  installer_id: string;
  title: string;
  type: 'beratung' | 'installation' | 'abnahme';
  starts_at: string;
  ends_at: string;
  location: string | null;
  notes: string | null;
  lead_id: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  customer_email: string | null;
}

const PROJECT_SELECT = '*, customer:profiles!customer_id(id, full_name, phone, zip), lead:leads!lead_id(first_name, last_name, email, phone, zip)';
const LEAD_SELECT = 'id, first_name, last_name, email, phone, zip, roof_orientation, roof_area, construction_year, consumption, has_e_car, has_heat_pump, has_battery, electricity_price, kwp, investment, annual_savings, amortization, autarky, profit_20_years, score, planning_horizon, needs_financing, wants_zoom_call, status, offer_status, offer_sent_at, offer_viewed_at, payment_1_paid, payment_2_paid, payment_3_paid, discount_code, discount_percentage, discount_status, final_price, discount_note, discount_requested_at, discount_resolved_at, created_at';

export async function fetchCustomerProject(customerId: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*, installer:profiles!installer_id(full_name, phone)')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data as Project | null;
}

export async function fetchCustomerDocuments(customerId: string): Promise<DocumentItem[]> {
  const { data, error } = await supabase
    .from('documents')
    .select('id, title, meta, type, status, status_text, is_downloadable')
    .eq('customer_id', customerId)
    .order('created_at');
  if (error) throw error;
  return (data ?? []) as DocumentItem[];
}

export async function fetchInstallerLeads(installerId: string): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select(LEAD_SELECT)
    .eq('installer_id', installerId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Lead[];
}

export async function fetchLeadById(leadId: string): Promise<Lead | null> {
  const { data, error } = await supabase
    .from('leads')
    .select(LEAD_SELECT)
    .eq('id', leadId)
    .maybeSingle();
  if (error) throw error;
  return data as Lead | null;
}

export async function updateLeadStatus(leadId: string, status: Lead['status']): Promise<void> {
  const { error } = await supabase.from('leads').update({ status }).eq('id', leadId);
  if (error) throw error;
}

export async function updateLeadOfferStatus(
  leadId: string,
  offerStatus: Lead['offer_status'],
  extra?: { offer_sent_at?: string; offer_viewed_at?: string }
): Promise<void> {
  const { error } = await supabase
    .from('leads')
    .update({ offer_status: offerStatus, ...extra })
    .eq('id', leadId);
  if (error) throw error;
}

export async function createProjectFromLead(lead: Lead, installerId: string): Promise<string> {
  const { data, error } = await supabase
    .from('projects')
    .insert({
      installer_id: installerId,
      lead_id: lead.id,
      zip: lead.zip,
      kwp: lead.kwp,
      investment: lead.investment,
      annual_savings: lead.annual_savings,
      status: 'planung',
    })
    .select('id')
    .single();
  if (error) throw error;
  await updateLeadStatus(lead.id, 'gewonnen');
  return (data as { id: string }).id;
}

export async function createManualProject(params: {
  installerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  zip?: string;
  kwp?: number;
  investment?: number;
  status: Project['status'];
}): Promise<string> {
  const { data: lead, error: leadError } = await supabase
    .from('leads')
    .insert({
      installer_id: params.installerId,
      first_name:   params.firstName,
      last_name:    params.lastName,
      email:        params.email,
      phone:        params.phone  || null,
      zip:          params.zip    || null,
      kwp:          params.kwp    ?? null,
      investment:   params.investment ?? null,
      status:       'gewonnen',
    })
    .select('id')
    .single();
  if (leadError) throw leadError;

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert({
      installer_id: params.installerId,
      lead_id:      (lead as { id: string }).id,
      zip:          params.zip         || null,
      kwp:          params.kwp         ?? null,
      investment:   params.investment  ?? null,
      status:       params.status,
    })
    .select('id')
    .single();
  if (projectError) throw projectError;

  return (project as { id: string }).id;
}

export async function updateProjectStatus(projectId: string, status: Project['status']): Promise<void> {
  const { error } = await supabase.from('projects').update({ status }).eq('id', projectId);
  if (error) throw error;
}

export async function updateProjectNotes(projectId: string, notes: string): Promise<void> {
  const { error } = await supabase.from('projects').update({ notes }).eq('id', projectId);
  if (error) throw error;
}

export async function fetchInstallerAppointments(installerId: string): Promise<Appointment[]> {
  const { data, error } = await supabase
    .from('appointments')
    .select('id, installer_id, title, type, starts_at, ends_at, location, notes, lead_id, customer_name, customer_phone, customer_email')
    .eq('installer_id', installerId)
    .order('starts_at');
  if (error) throw error;
  return (data ?? []) as Appointment[];
}

export async function fetchAppointmentsByLeadId(leadId: string): Promise<Appointment[]> {
  const { data, error } = await supabase
    .from('appointments')
    .select('id, installer_id, title, type, starts_at, ends_at, location, notes, lead_id, customer_name, customer_phone, customer_email')
    .eq('lead_id', leadId)
    .order('starts_at');
  if (error) throw error;
  return (data ?? []) as Appointment[];
}

export async function fetchAppointmentsByCustomerId(customerId: string): Promise<Appointment[]> {
  const { data, error } = await supabase
    .from('appointments')
    .select('id, installer_id, title, type, starts_at, ends_at, location, notes, lead_id, customer_name, customer_phone, customer_email')
    .eq('customer_id', customerId)
    .order('starts_at');
  if (error) throw error;
  return (data ?? []) as Appointment[];
}

export async function fetchTeamAppointments(): Promise<Appointment[]> {
  const { data, error } = await supabase
    .from('appointments')
    .select('id, installer_id, title, type, starts_at, ends_at, location, notes, lead_id, customer_name, customer_phone, customer_email')
    .order('starts_at');
  if (error) throw error;
  return (data ?? []) as Appointment[];
}

export async function fetchInstallerProfiles(): Promise<{ id: string; full_name: string }[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name')
    .in('role', ['installer', 'owner'])
    .order('full_name');
  if (error) throw error;
  return (data ?? []) as { id: string; full_name: string }[];
}

export async function fetchCustomerIdForLead(leadId: string): Promise<string | null> {
  const { data } = await supabase
    .from('projects')
    .select('customer_id')
    .eq('lead_id', leadId)
    .not('customer_id', 'is', null)
    .maybeSingle();
  return (data as { customer_id: string } | null)?.customer_id ?? null;
}

export async function createAppointment(
  installerId: string,
  data: {
    title: string;
    type: Appointment['type'];
    starts_at: string;
    ends_at: string;
    location?: string | null;
    notes?: string | null;
    lead_id?: string | null;
    customer_id?: string | null;
    customer_name?: string | null;
    customer_phone?: string | null;
    customer_email?: string | null;
  },
): Promise<Appointment> {
  const { data: row, error } = await supabase
    .from('appointments')
    .insert({ installer_id: installerId, ...data })
    .select('id, installer_id, title, type, starts_at, ends_at, location, notes, lead_id, customer_name, customer_phone, customer_email')
    .single();
  if (error) throw error;
  return row as Appointment;
}

export async function updateAppointment(
  id: string,
  data: Partial<Pick<Appointment, 'title' | 'type' | 'starts_at' | 'ends_at' | 'location' | 'notes' | 'lead_id' | 'customer_name' | 'customer_phone' | 'customer_email'>>,
): Promise<void> {
  const { error } = await supabase.from('appointments').update(data).eq('id', id);
  if (error) throw error;
}

export async function deleteAppointment(id: string): Promise<void> {
  const { error } = await supabase.from('appointments').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchInstallerFirstProject(installerId: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select(PROJECT_SELECT)
    .eq('installer_id', installerId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data as Project | null;
}

export async function fetchInstallerProjects(installerId: string): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select(PROJECT_SELECT)
    .eq('installer_id', installerId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Project[];
}

export async function fetchInstallerProjectById(installerId: string, projectId: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select(PROJECT_SELECT)
    .eq('id', projectId)
    .eq('installer_id', installerId)
    .maybeSingle();
  if (error) throw error;
  return data as Project | null;
}

// ── Rabatt-System ────────────────────────────────────────────────────

export async function fetchDiscountCodes(): Promise<DiscountCode[]> {
  const { data, error } = await supabase
    .from('discount_codes')
    .select('*')
    .eq('active', true)
    .order('created_at');
  if (error) throw error;
  return (data ?? []) as DiscountCode[];
}

export async function fetchOwnerDiscountCodes(ownerId: string): Promise<DiscountCode[]> {
  const { data, error } = await supabase
    .from('discount_codes')
    .select('*')
    .eq('created_by', ownerId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as DiscountCode[];
}

export async function createDiscountCode(params: {
  createdBy: string;
  code: string;
  label?: string;
  percentage: number;
  min_investment?: number | null;
  max_uses?: number | null;
  valid_until?: string | null;
}): Promise<DiscountCode> {
  const { data, error } = await supabase
    .from('discount_codes')
    .insert({
      created_by: params.createdBy,
      code: params.code,
      label: params.label ?? null,
      percentage: params.percentage,
      min_investment: params.min_investment ?? null,
      max_uses: params.max_uses ?? null,
      valid_until: params.valid_until ?? null,
    })
    .select('*')
    .single();
  if (error) throw error;
  return data as DiscountCode;
}

export async function toggleDiscountCode(id: string, active: boolean): Promise<void> {
  const { error } = await supabase.from('discount_codes').update({ active }).eq('id', id);
  if (error) throw error;
}

export async function deleteDiscountCode(id: string): Promise<void> {
  const { error } = await supabase.from('discount_codes').delete().eq('id', id);
  if (error) throw error;
}

export async function redeemDiscountCode(
  installerId: string,
  code: string,
  investment: number,
): Promise<{ success: boolean; percentage: number | null; reason: string }> {
  const { data, error } = await supabase.rpc('redeem_discount_code', {
    p_installer_id: installerId,
    p_code: code,
    p_investment: investment,
  });
  if (error) throw new Error(error.message);
  const result = (data as Array<{ success: boolean; percentage: number | null; reason: string }>)?.[0];
  return result ?? { success: false, percentage: null, reason: 'Keine Antwort vom Server' };
}

export async function applyDiscountCode(
  leadId: string,
  code: string,
  percentage: number,
  basePrice: number,
): Promise<void> {
  const finalPrice = Math.round(basePrice * (1 - percentage / 100));
  const { error } = await supabase.from('leads').update({
    discount_code: code,
    discount_percentage: percentage,
    discount_status: 'code_applied',
    final_price: finalPrice,
    discount_note: null,
    discount_requested_at: null,
    discount_resolved_at: null,
  }).eq('id', leadId);
  if (error) throw error;
}

export async function requestDiscount(
  leadId: string,
  percentage: number,
  note: string,
  basePrice: number,
): Promise<void> {
  const finalPrice = Math.round(basePrice * (1 - percentage / 100));
  const { error } = await supabase.from('leads').update({
    discount_code: null,
    discount_percentage: percentage,
    discount_status: 'requested',
    final_price: finalPrice,
    discount_note: note || null,
    discount_requested_at: new Date().toISOString(),
    discount_resolved_at: null,
  }).eq('id', leadId);
  if (error) throw error;
}

export async function resolveDiscountRequest(leadId: string, approved: boolean): Promise<void> {
  const { error } = await supabase.from('leads').update({
    discount_status: approved ? 'approved' : 'rejected',
    discount_resolved_at: new Date().toISOString(),
    ...(approved ? {} : { final_price: null, discount_percentage: null }),
  }).eq('id', leadId);
  if (error) throw error;
}

export async function clearDiscount(leadId: string): Promise<void> {
  const { error } = await supabase.from('leads').update({
    discount_code: null,
    discount_percentage: null,
    discount_status: 'none',
    final_price: null,
    discount_note: null,
    discount_requested_at: null,
    discount_resolved_at: null,
  }).eq('id', leadId);
  if (error) throw error;
}

export async function fetchPendingDiscountRequests(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select(LEAD_SELECT)
    .eq('discount_status', 'requested')
    .order('discount_requested_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Lead[];
}

// ─── Öffentliches Installer-Profil ───────────────────────────────────────────

export interface InstallerPublicProfile {
  id: string;
  full_name: string;
  company_name: string | null;
  website: string | null;
  bio: string | null;
  zip: string | null;
  phone: string | null;
  is_verified: boolean;
  email: string;
}

export async function fetchInstallerPublicProfile(installerId: string): Promise<InstallerPublicProfile | null> {
  const { data, error } = await supabase.rpc('get_installer_public_profile', { installer_uuid: installerId });
  if (error || !data) return null;
  return data as InstallerPublicProfile;
}

// ─── Wizard Drop-off Auswertung ──────────────────────────────────────────────

export interface WizardStepStat {
  step: number;
  label: string;
  sessions: number;
  dropoff: number;
  dropoffPct: number;
}

export async function fetchWizardDropoffStats(): Promise<WizardStepStat[]> {
  const { data } = await supabase
    .from('wizard_events')
    .select('session_id, event, step')
    .eq('event', 'step_entered');

  if (!data?.length) return [];

  const STEP_LABELS: Record<number, string> = {
    1: 'Gebäudetyp',
    2: 'Dach',
    3: 'Energie',
    4: 'Förderungen',
    5: 'Ergebnis',
    6: 'Kontaktformular',
    7: 'Bestätigung',
  };

  // Eindeutige Sessions pro Schritt
  const perStep = new Map<number, Set<string>>();
  for (const row of data) {
    if (!perStep.has(row.step)) perStep.set(row.step, new Set());
    perStep.get(row.step)!.add(row.session_id);
  }

  const steps = [1, 2, 3, 4, 5, 6, 7].filter(s => perStep.has(s));
  return steps.map((step, i) => {
    const sessions = perStep.get(step)?.size ?? 0;
    const nextSessions = i < steps.length - 1 ? (perStep.get(steps[i + 1])?.size ?? 0) : sessions;
    const dropoff = Math.max(0, sessions - nextSessions);
    return {
      step,
      label: STEP_LABELS[step] ?? `Schritt ${step}`,
      sessions,
      dropoff,
      dropoffPct: sessions > 0 ? Math.round((dropoff / sessions) * 100) : 0,
    };
  });
}
