import { getIrradiationByZip } from '../data/plzIrradiation';

export type ScoreTier = 'heiss' | 'warm' | 'kalt';

export interface ScoreResult {
  score: number;
  tier: ScoreTier;
  label: string;
  color: string;
  bgColor: string;
}

export interface LeadScoreParams {
  kwp?: number | null;
  investment?: number | null;
  zip?: string | null;
  isOwner?: boolean | null;
  hasBattery?: boolean | null;
  area?: number | null;
  planningHorizon?: string | null;
}

// Erzeugt einen 0-100 Score. Fehlende Felder werden neutral bewertet.
export function computeLeadScore(params: LeadScoreParams): number {
  const { kwp, investment, zip, isOwner, hasBattery, area, planningHorizon } = params;
  let score = 0;

  // Anlagengröße (0–25 Punkte): ≥ 10 kWp = voll
  if (kwp != null) {
    score += Math.min(25, (kwp / 10) * 25);
  }

  // Investitionsvolumen (0–20 Punkte): ≥ 15.000 € = voll
  if (investment != null) {
    score += Math.min(20, (investment / 15000) * 20);
  }

  // Einstrahlungswert per PLZ (0–25 Punkte): 1.100 kWh/m²/a = voll
  if (zip) {
    const irr = getIrradiationByZip(zip);
    score += Math.min(25, (irr / 1100) * 25);
  } else {
    score += 12; // neutraler Mittelwert wenn unbekannt
  }

  // Eigentümerstatus (0–20 Punkte): Eigentümer = deutlich höhere Abschlussquote
  if (isOwner === true) score += 20;
  else if (isOwner === false) score += 0;
  else score += 8; // unbekannt → leichter Abzug

  // Speicher gewünscht (0–10 Punkte): höhere Investitionsbereitschaft
  if (hasBattery === true) score += 10;

  // Planungshorizont (0–10 Punkte): sofort = maximale Kaufbereitschaft
  if (planningHorizon === 'sofort') score += 10;
  else if (planningHorizon === '3monate') score += 5;

  return Math.min(100, Math.round(score));
}

export function getScoreResult(score: number): ScoreResult {
  if (score >= 70) {
    return { score, tier: 'heiss', label: 'Heiß', color: 'text-orange-700', bgColor: 'bg-orange-100 border-orange-300' };
  }
  if (score >= 40) {
    return { score, tier: 'warm', label: 'Warm', color: 'text-amber-700', bgColor: 'bg-amber-100 border-amber-300' };
  }
  return { score, tier: 'kalt', label: 'Kalt', color: 'text-slate-500', bgColor: 'bg-slate-100 border-slate-300' };
}
