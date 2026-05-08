// ============================================================
// PDF Design Tokens — Source of Truth für alle @react-pdf/renderer Dokumente
// Werte sind aligned mit tailwind.config.js
// ============================================================

export const PDF_COLORS = {
  // Brand — aligned mit tailwind.config.js
  primary:          '#000917',   // tailwind: primary
  primaryDark:      '#0D2137',   // tailwind: primary-container (Dunkles Blau, PDF-Header)
  secondary:        '#F59E0B',   // tailwind: secondary (Amber)
  amberLight:       '#FEF3C7',   // Amber-100

  // Status
  green:            '#16A34A',
  greenLight:       '#F0FDF4',
  greenBorder:      '#BBF7D0',
  blue:             '#2563EB',
  blueLight:        '#EFF6FF',
  blueBorder:       '#BFDBFE',
  red:              '#DC2626',
  redLight:         '#FEF2F2',

  // Neutrals — Slate-Skala
  slate50:          '#F8FAFC',
  slate100:         '#F1F5F9',
  slate200:         '#E2E8F0',
  slate400:         '#94A3B8',
  slate500:         '#64748B',
  slate700:         '#334155',
  white:            '#FFFFFF',
} as const;

// Font-Größen in pt (PDF-Einheit, nicht px)
export const PDF_FONT_SIZE = {
  xs:   7,   // Fußnoten, Labels uppercase
  sm:   8,   // Sekundäre Labels, Tabellenzellen
  base: 9,   // Fließtext, Metadaten
  md:   10,  // Hervorgehobener Text, Zwischensummen
  lg:   13,  // Kundennamen, Sektionsüberschriften
  xl:   14,  // Gesamtbeträge
  '2xl': 20, // Firmenname im Header
} as const;

// Gemeinsame StyleSheet-Bausteine (verwendbar in StyleSheet.create({ ...PDF_BASE }))
export const PDF_BASE = {
  // Seitenlayout
  page:         { fontFamily: 'Helvetica', backgroundColor: PDF_COLORS.white, paddingBottom: 60 },

  // Header (dunkles Blau mit Firmenname)
  header:       { backgroundColor: PDF_COLORS.primaryDark, padding: '24 32', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerLeft:   { flex: 1 },
  companyName:  { color: PDF_COLORS.white, fontSize: PDF_FONT_SIZE['2xl'], fontFamily: 'Helvetica-Bold' },
  companyTag:   { color: PDF_COLORS.slate400, fontSize: PDF_FONT_SIZE.xs, marginTop: 3 },
  accentBar:    { height: 4, backgroundColor: PDF_COLORS.secondary },
  body:         { padding: '24 32' },

  // Badge (oben rechts im Header)
  badge:        { backgroundColor: PDF_COLORS.secondary, borderRadius: 4, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' },
  badgeTxt:     { color: PDF_COLORS.primaryDark, fontSize: PDF_FONT_SIZE.base, fontFamily: 'Helvetica-Bold' },

  // Metadaten-Zeile (Datum, Nummer etc.)
  metaRow:      { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: PDF_COLORS.slate50, border: `1 solid ${PDF_COLORS.slate200}`, borderRadius: 6, padding: '12 16', marginBottom: 20 },
  metaBlock:    { flex: 1 },
  metaLabel:    { fontSize: PDF_FONT_SIZE.xs, color: PDF_COLORS.slate400, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 },
  metaValue:    { fontSize: PDF_FONT_SIZE.base, fontFamily: 'Helvetica-Bold', color: PDF_COLORS.primaryDark },

  // Sektions-Struktur
  sectionLabel: { fontSize: PDF_FONT_SIZE.sm, fontFamily: 'Helvetica-Bold', color: PDF_COLORS.secondary, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 },
  divider:      { height: 1, backgroundColor: PDF_COLORS.slate200, marginBottom: 14 },
  section:      { marginBottom: 20 },

  // Kunden-Box
  customerBox:  { backgroundColor: PDF_COLORS.slate50, border: `1 solid ${PDF_COLORS.slate200}`, borderRadius: 6, padding: '12 16', marginBottom: 20 },
  customerName: { fontSize: PDF_FONT_SIZE.lg, fontFamily: 'Helvetica-Bold', color: PDF_COLORS.primaryDark, marginBottom: 4 },
  customerLine: { fontSize: PDF_FONT_SIZE.base, color: PDF_COLORS.slate500, marginBottom: 2 },

  // Disclaimer / Rechtliches
  disclaimer:    { backgroundColor: PDF_COLORS.slate50, borderRadius: 4, padding: '8 12' },
  disclaimerTxt: { fontSize: PDF_FONT_SIZE.xs, color: PDF_COLORS.slate500, lineHeight: 1.5 },

  // Footer (fest unten)
  footer:    { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: PDF_COLORS.slate50, borderTop: `1 solid ${PDF_COLORS.slate200}`, padding: '10 32', flexDirection: 'row', justifyContent: 'space-between' },
  footerTxt: { fontSize: PDF_FONT_SIZE.xs, color: PDF_COLORS.slate400 },
} as const;
