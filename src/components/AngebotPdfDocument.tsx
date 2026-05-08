import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import type { Project } from '../services/data';
import { PDF_COLORS as C, PDF_FONT_SIZE as F, PDF_BASE } from '../constants/pdfTheme';

const s = StyleSheet.create({
  ...PDF_BASE,

  // Angebots-spezifische Styles
  // Technik-Grid
  specGrid:     { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  specBox:      { width: '22%', backgroundColor: C.slate50, border: `1 solid ${C.slate200}`, borderRadius: 6, padding: '10 12' },
  specLabel:    { fontSize: F.xs, color: C.slate400, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 },
  specValue:    { fontSize: F.xl, fontFamily: 'Helvetica-Bold', color: C.primaryDark },
  specUnit:     { fontSize: F.sm, color: C.slate500 },

  // Investition
  investRow:    { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  investLabel:  { fontSize: F.base, color: C.slate500 },
  investValue:  { fontSize: F.base, fontFamily: 'Helvetica-Bold', color: C.primaryDark },
  totalRow:     { flexDirection: 'row', justifyContent: 'space-between', borderTop: `1.5 solid ${C.primaryDark}`, paddingTop: 8, marginTop: 4 },
  totalLabel:   { fontSize: F.md, fontFamily: 'Helvetica-Bold', color: C.primaryDark },
  totalValue:   { fontSize: F.lg, fontFamily: 'Helvetica-Bold', color: C.primaryDark },

  // Wirtschaftlichkeit
  roiGrid:      { flexDirection: 'row', gap: 10, marginBottom: 20 },
  roiBox:       { flex: 1, backgroundColor: C.primaryDark, borderRadius: 6, padding: '12 14' },
  roiLabel:     { fontSize: F.xs, color: C.slate400, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 },
  roiValue:     { fontSize: 15, fontFamily: 'Helvetica-Bold', color: C.white },
  roiUnit:      { fontSize: F.base, color: C.slate400 },
  roiBoxLight:  { flex: 1, backgroundColor: C.amberLight, border: `1 solid ${C.secondary}`, borderRadius: 6, padding: '12 14' },
  roiLabelL:    { fontSize: F.xs, color: C.slate500, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 },
  roiValueL:    { fontSize: 15, fontFamily: 'Helvetica-Bold', color: C.primaryDark },

  // Zahlungsplan
  zpTable:      { marginBottom: 20 },
  zpHeader:     { flexDirection: 'row', backgroundColor: C.primaryDark, borderRadius: '4 4 0 0', padding: '6 10' },
  zpRow:        { flexDirection: 'row', borderLeft: `1 solid ${C.slate200}`, borderRight: `1 solid ${C.slate200}`, borderBottom: `1 solid ${C.slate200}`, padding: '8 10' },
  zpRowAlt:     { flexDirection: 'row', backgroundColor: C.slate50, borderLeft: `1 solid ${C.slate200}`, borderRight: `1 solid ${C.slate200}`, borderBottom: `1 solid ${C.slate200}`, padding: '8 10' },
  zpColDesc:    { flex: 3 },
  zpColPerc:    { flex: 1, textAlign: 'center' },
  zpColAmt:     { flex: 2, textAlign: 'right' },
  zpColWhen:    { flex: 2, textAlign: 'right' },
  zpHeadTxt:    { fontSize: F.xs, fontFamily: 'Helvetica-Bold', color: C.white, textTransform: 'uppercase', letterSpacing: 0.8 },
  zpCellDesc:   { fontSize: F.sm, color: C.slate700 },
  zpCellMuted:  { fontSize: F.xs, color: C.slate400, marginTop: 2 },
  zpCellPerc:   { fontSize: F.sm, fontFamily: 'Helvetica-Bold', color: C.slate500, textAlign: 'center' },
  zpCellAmt:    { fontSize: F.sm, fontFamily: 'Helvetica-Bold', color: C.primaryDark, textAlign: 'right' },
  zpCellWhen:   { fontSize: F.xs, color: C.slate500, textAlign: 'right' },
  zpNote:       { fontSize: F.xs, color: C.slate400, marginTop: 6, fontStyle: 'italic' },

  // Gültigkeit
  validityBox:  { backgroundColor: C.slate100, borderRadius: 6, padding: '10 14', marginBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  validityText: { fontSize: F.sm, color: C.slate700, flex: 1 },
});

interface Props {
  project: Project;
  installerName?: string;
}

function formatEur(n: number | null): string {
  if (n == null) return '—';
  return n.toLocaleString('de-DE') + ' €';
}

export const AngebotPdfDocument: React.FC<Props> = ({ project, installerName = 'PV Montage Nord' }) => {
  const today = new Date();
  const validUntil = new Date(today);
  validUntil.setDate(validUntil.getDate() + 30);

  const fmt = (d: Date) => d.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });
  const offerNumber = `PV-${today.getFullYear()}-${project.id.slice(0, 6).toUpperCase()}`;

  const customerName = project.customer?.full_name ?? 'Endkunde';
  const customerZip  = project.customer?.zip ?? project.zip ?? '—';

  // Investitionsaufschlüsselung (geschätzt aus Gesamt)
  const totalInv = project.investment ?? 0;
  const hardware   = Math.round(totalInv * 0.60);
  const wechselr   = Math.round(totalInv * 0.12);
  const montage    = Math.round(totalInv * 0.20);
  const anschluss  = totalInv - hardware - wechselr - montage;

  const profit20 = project.annual_savings != null
    ? Math.round(project.annual_savings * 20 - totalInv)
    : null;

  return (
    <Document title={`Angebot ${offerNumber} — ${customerName}`} author={installerName}>
      <Page size="A4" style={s.page}>

        {/* Header */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            <Text style={s.companyName}>{installerName}</Text>
            <Text style={s.companyTag}>Zertifizierter Photovoltaik-Fachbetrieb</Text>
          </View>
          <View style={s.badge}>
            <Text style={s.badgeTxt}>ANGEBOT {offerNumber}</Text>
          </View>
        </View>
        <View style={s.accentBar} />

        <View style={s.body}>

          {/* Metadaten */}
          <View style={s.metaRow}>
            <View style={s.metaBlock}>
              <Text style={s.metaLabel}>Angebotsdatum</Text>
              <Text style={s.metaValue}>{fmt(today)}</Text>
            </View>
            <View style={s.metaBlock}>
              <Text style={s.metaLabel}>Gültig bis</Text>
              <Text style={s.metaValue}>{fmt(validUntil)}</Text>
            </View>
            <View style={s.metaBlock}>
              <Text style={s.metaLabel}>Standort</Text>
              <Text style={s.metaValue}>PLZ {customerZip}</Text>
            </View>
            <View style={s.metaBlock}>
              <Text style={s.metaLabel}>Angebotsnr.</Text>
              <Text style={s.metaValue}>{offerNumber}</Text>
            </View>
          </View>

          {/* Kunde */}
          <View style={s.section}>
            <Text style={s.sectionLabel}>Angebot für</Text>
            <View style={s.divider} />
            <View style={s.customerBox}>
              <Text style={s.customerName}>{customerName}</Text>
              <Text style={s.customerLine}>PLZ / Standort: {customerZip}</Text>
              {project.customer?.phone && (
                <Text style={s.customerLine}>Telefon: {project.customer.phone}</Text>
              )}
            </View>
          </View>

          {/* Technische Spezifikation */}
          <View style={s.section}>
            <Text style={s.sectionLabel}>Technische Spezifikation</Text>
            <View style={s.divider} />
            <View style={s.specGrid}>
              <View style={s.specBox}>
                <Text style={s.specLabel}>Anlagenleistung</Text>
                <Text style={s.specValue}>{project.kwp ?? '—'} <Text style={s.specUnit}>kWp</Text></Text>
              </View>
              <View style={s.specBox}>
                <Text style={s.specLabel}>Jahresertrag (est.)</Text>
                <Text style={s.specValue}>
                  {project.kwp != null ? Math.round(project.kwp * 950).toLocaleString('de-DE') : '—'}
                  <Text style={s.specUnit}> kWh</Text>
                </Text>
              </View>
              <View style={s.specBox}>
                <Text style={s.specLabel}>Autarkiegrad</Text>
                <Text style={s.specValue}>{project.autarky ?? '—'} <Text style={s.specUnit}>%</Text></Text>
              </View>
              <View style={s.specBox}>
                <Text style={s.specLabel}>Module</Text>
                <Text style={s.specValue}>
                  {project.kwp != null ? Math.ceil(project.kwp / 0.4) : '—'}
                  <Text style={s.specUnit}> St.</Text>
                </Text>
              </View>
            </View>
          </View>

          {/* Investition */}
          <View style={s.section}>
            <Text style={s.sectionLabel}>Investitionsübersicht (inkl. 0 % MwSt.)</Text>
            <View style={s.divider} />
            {[
              ['PV-Module & Wechselrichter', hardware + wechselr],
              ['Montage & Gerüst',           montage],
              ['Netzanschluss & Anmeldung',  anschluss],
            ].map(([label, val]) => (
              <View key={label as string} style={s.investRow}>
                <Text style={s.investLabel}>{label as string}</Text>
                <Text style={s.investValue}>{formatEur(val as number)}</Text>
              </View>
            ))}
            <View style={s.totalRow}>
              <Text style={s.totalLabel}>Gesamtinvestition (brutto, 0 % MwSt.)</Text>
              <Text style={s.totalValue}>{formatEur(totalInv)}</Text>
            </View>
          </View>

          {/* Wirtschaftlichkeit */}
          <View style={s.section}>
            <Text style={s.sectionLabel}>Wirtschaftlichkeit auf einen Blick</Text>
            <View style={s.divider} />
            <View style={s.roiGrid}>
              <View style={s.roiBox}>
                <Text style={s.roiLabel}>Jährliche Ersparnis</Text>
                <Text style={s.roiValue}>{formatEur(project.annual_savings)} <Text style={s.roiUnit}>/Jahr</Text></Text>
              </View>
              <View style={s.roiBox}>
                <Text style={s.roiLabel}>Amortisation</Text>
                <Text style={s.roiValue}>~ {project.amortization ?? '—'} <Text style={s.roiUnit}>Jahre</Text></Text>
              </View>
              <View style={s.roiBoxLight}>
                <Text style={s.roiLabelL}>Gewinn nach 20 Jahren</Text>
                <Text style={s.roiValueL}>
                  {profit20 != null ? `+ ${profit20.toLocaleString('de-DE')} €` : '—'}
                </Text>
              </View>
            </View>
          </View>

          {/* Zahlungsplan */}
          <View style={s.section}>
            <Text style={s.sectionLabel}>Zahlungsplan (3 Raten, 0 % MwSt.)</Text>
            <View style={s.divider} />
            <View style={s.zpTable}>
              <View style={s.zpHeader}>
                <View style={s.zpColDesc}><Text style={s.zpHeadTxt}>Rechnung</Text></View>
                <View style={s.zpColPerc}><Text style={s.zpHeadTxt}>Anteil</Text></View>
                <View style={s.zpColAmt}><Text style={s.zpHeadTxt}>Betrag</Text></View>
                <View style={s.zpColWhen}><Text style={s.zpHeadTxt}>Fälligkeit</Text></View>
              </View>
              {([
                ['Abschlagsrechnung 1', 'Anzahlung', 30, Math.round(totalInv * 0.30), 'Bei Auftragserteilung'],
                ['Abschlagsrechnung 2', 'Materialbeschaffung & Montage', 60, Math.round(totalInv * 0.60), 'Ca. 4 Wochen vor Montage'],
                ['Schlussrechnung', 'Nach Abnahme & Inbetriebnahme', 10, totalInv - Math.round(totalInv * 0.30) - Math.round(totalInv * 0.60), 'Nach Abnahme'],
              ] as [string, string, number, number, string][]).map(([label, sub, perc, amount, when], i) => (
                <View key={label} style={i % 2 === 1 ? s.zpRowAlt : s.zpRow}>
                  <View style={s.zpColDesc}>
                    <Text style={s.zpCellDesc}>{label}</Text>
                    <Text style={s.zpCellMuted}>{sub}</Text>
                  </View>
                  <View style={s.zpColPerc}><Text style={s.zpCellPerc}>{perc} %</Text></View>
                  <View style={s.zpColAmt}><Text style={s.zpCellAmt}>{formatEur(amount)}</Text></View>
                  <View style={s.zpColWhen}><Text style={s.zpCellWhen}>{when}</Text></View>
                </View>
              ))}
            </View>
            <Text style={s.zpNote}>
              Alle Rechnungen werden mit 0 % MwSt. gem. § 12 Abs. 3 UStG ausgestellt. Zahlungsziel: 14 Tage netto.
            </Text>
          </View>

          {/* Gültigkeitshinweis */}
          <View style={s.validityBox}>
            <Text style={s.validityText}>
              Dieses Angebot ist gültig bis zum <Text style={{ fontFamily: 'Helvetica-Bold' }}>{fmt(validUntil)}</Text>.
              Preise können sich aufgrund von Materialkosten und Förderprogrammen ändern.
              Bei Fragen stehen wir Ihnen jederzeit zur Verfügung.
            </Text>
          </View>

          {/* Disclaimer */}
          <View style={s.disclaimer}>
            <Text style={s.disclaimerTxt}>
              Alle Angaben basieren auf Ihren Angaben und sind unverbindliche Schätzwerte. Tatsächliche Erträge
              können abhängig von Wetter, Ausrichtung und Verbrauch abweichen. Die 0 % MwSt. gilt für
              Wohngebäude gem. § 12 Abs. 3 UStG. Förderungen sind separat zu beantragen.
            </Text>
          </View>

        </View>

        {/* Footer */}
        <View style={s.footer} fixed>
          <Text style={s.footerTxt}>{installerName} • info@pvmontage-nord.de • www.pvmontage-nord.de</Text>
          <Text style={s.footerTxt}>Angebotsnr. {offerNumber} • Erstellt am {fmt(today)}</Text>
        </View>

      </Page>
    </Document>
  );
};
