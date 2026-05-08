// ============================================================
// React Design Tokens — Source of Truth für JS-Kontext
// Für Tailwind-Klassen: tailwind.config.js verwenden
// Diese Datei nur für: Inline-Styles, Chart-Farben, dynamische Berechnungen
// ============================================================

// Primäre Brand-Farben (identisch zu tailwind.config.js)
export const COLORS = {
  primary:          '#000917',
  primaryContainer: '#0D2137',
  secondary:        '#F59E0B',
  secondaryDark:    '#D97706',

  // Status
  success:          '#16A34A',
  successLight:     '#F0FDF4',
  warning:          '#F59E0B',
  warningLight:     '#FEF3C7',
  error:            '#DC2626',
  errorLight:       '#FEF2F2',
  info:             '#2563EB',
  infoLight:        '#EFF6FF',

  // Neutrals
  white:            '#FFFFFF',
  slate50:          '#F8FAFC',
  slate100:         '#F1F5F9',
  slate200:         '#E2E8F0',
  slate400:         '#94A3B8',
  slate500:         '#64748B',
  slate700:         '#334155',
  slate900:         '#0F172A',
} as const;

// Lead-Score Farben (Ampel-System) — aligned mit leadScore.ts
export const SCORE_COLORS = {
  heiss: { bg: 'bg-red-50',    text: 'text-red-600',    border: 'border-red-200',    hex: '#DC2626' },
  warm:  { bg: 'bg-amber-50',  text: 'text-amber-600',  border: 'border-amber-200',  hex: '#D97706' },
  kalt:  { bg: 'bg-blue-50',   text: 'text-blue-600',   border: 'border-blue-200',   hex: '#2563EB' },
} as const;

// Offer-Status Farben — aligned mit ProjectDetailsPage + LeadCard
export const OFFER_STATUS_COLORS = {
  created:  { bg: 'bg-slate-50',  text: 'text-slate-600',  border: 'border-slate-200'  },
  sent:     { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200'   },
  viewed:   { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  accepted: { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200'  },
  rejected: { bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200'    },
} as const;

// Projekt-Status Farben — aligned mit ProjectDetailsPage
export const PROJECT_STATUS_COLORS = {
  angebot:      { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-100'   },
  planung:      { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-100' },
  genehmigung:  { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-100'  },
  installation: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-100' },
  inbetrieb:    { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-100'  },
} as const;

// Zahlungsplan — Standard-Raten für Solar-Installationen (VOB-Konvention)
export const PAYMENT_PLAN_RATES = {
  rate1: { percent: 30, label: 'Anzahlung',          due: 'Bei Auftragserteilung'      },
  rate2: { percent: 60, label: 'Teilzahlung Montage', due: 'Ca. 4 Wochen vor Montage'  },
  rate3: { percent: 10, label: 'Schlussrechnung',     due: 'Nach Abnahme'               },
} as const;

// Chart-Farben (für BusinessStatsPage, ROIPage)
export const CHART_COLORS = {
  primary:   '#0D2137',
  secondary: '#F59E0B',
  success:   '#16A34A',
  muted:     '#94A3B8',
  grid:      '#E2E8F0',
} as const;
