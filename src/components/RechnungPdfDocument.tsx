import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import type { Project } from '../services/data';
import { PDF_COLORS as C, PDF_FONT_SIZE as F, PDF_BASE } from '../constants/pdfTheme';

export type RechnungType = 1 | 2 | 3;

const RATE: Record<RechnungType, { label: string; subLabel: string; percent: number }> = {
  1: { label: 'Abschlagsrechnung 1/3', subLabel: 'Anzahlung bei Auftragserteilung', percent: 30 },
  2: { label: 'Abschlagsrechnung 2/3', subLabel: 'Teilrechnung Materialbeschaffung & Montage', percent: 60 },
  3: { label: 'Schlussrechnung 3/3', subLabel: 'Restzahlung nach Abnahme & Inbetriebnahme', percent: 10 },
};

const s = StyleSheet.create({
  ...PDF_BASE,

  // Rechnungs-spezifische Styles
  leistungBox:      { backgroundColor: C.slate50, border: `1 solid ${C.slate200}`, borderRadius: 6, padding: '12 16' },
  leistungRow:      { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  leistungDesc:     { fontSize: F.base, color: C.slate700, flex: 1 },
  leistungMuted:    { fontSize: F.base, color: C.slate400, flex: 1 },
  leistungAmt:      { fontSize: F.base, fontFamily: 'Helvetica-Bold', color: C.primaryDark },
  leistungMutedAmt: { fontSize: F.base, color: C.slate400 },
  midDivider:       { height: 1, backgroundColor: C.slate200, marginVertical: 8 },
  totalBox:         { backgroundColor: C.primaryDark, borderRadius: 6, padding: '10 14', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  totalLabel:       { fontSize: F.md, fontFamily: 'Helvetica-Bold', color: C.white },
  totalValue:       { fontSize: F.xl, fontFamily: 'Helvetica-Bold', color: C.secondary },

  zahlungBox:       { backgroundColor: C.greenLight, border: `1 solid ${C.greenBorder}`, borderRadius: 6, padding: '12 16', marginBottom: 20 },
  zahlungTitle:     { fontSize: F.base, fontFamily: 'Helvetica-Bold', color: C.green, marginBottom: 8 },
  zahlungRow:       { flexDirection: 'row', marginBottom: 4 },
  zahlungLbl:       { fontSize: F.sm, color: C.slate500, width: 110 },
  zahlungVal:       { fontSize: F.sm, fontFamily: 'Helvetica-Bold', color: C.slate700, flex: 1 },
});

function formatEur(n: number | null): string {
  if (n == null) return '—';
  return n.toLocaleString('de-DE') + ' €';
}

interface Props {
  project: Project;
  rechnungType: RechnungType;
  installerName?: string;
  iban?: string;
  bic?: string;
}

export const RechnungPdfDocument: React.FC<Props> = ({
  project,
  rechnungType,
  installerName = 'PV Montage Nord',
  iban = 'DE89 3704 0044 0532 0130 00',
  bic = 'COBADEFFXXX',
}) => {
  const today = new Date();
  const dueDate = new Date(today);
  dueDate.setDate(dueDate.getDate() + 14);
  const fmt = (d: Date) => d.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });

  const totalInv = project.investment ?? 0;
  const rate = RATE[rechnungType];
  const amount = rechnungType === 3
    ? totalInv - Math.round(totalInv * 0.30) - Math.round(totalInv * 0.60)
    : Math.round(totalInv * rate.percent / 100);

  const rechnungNr = `RE-${today.getFullYear()}-${project.id.slice(0, 6).toUpperCase()}-${rechnungType}`;
  const leadName = `${project.lead?.first_name ?? ''} ${project.lead?.last_name ?? ''}`.trim();
  const customerName = project.customer?.full_name ?? (leadName || 'Endkunde');
  const customerZip  = project.customer?.zip ?? project.lead?.zip ?? project.zip ?? '—';
  const customerEmail = project.lead?.email ?? null;
  const customerPhone = project.customer?.phone ?? project.lead?.phone ?? null;

  return (
    <Document title={`${rate.label} ${rechnungNr}`} author={installerName}>
      <Page size="A4" style={s.page}>

        <View style={s.header}>
          <View style={s.headerLeft}>
            <Text style={s.companyName}>{installerName}</Text>
            <Text style={s.companyTag}>Zertifizierter Photovoltaik-Fachbetrieb</Text>
          </View>
          <View style={s.badge}>
            <Text style={s.badgeTxt}>{rate.label.toUpperCase()}</Text>
          </View>
        </View>
        <View style={s.accentBar} />

        <View style={s.body}>

          <View style={s.metaRow}>
            <View style={s.metaBlock}>
              <Text style={s.metaLabel}>Rechnungsdatum</Text>
              <Text style={s.metaValue}>{fmt(today)}</Text>
            </View>
            <View style={s.metaBlock}>
              <Text style={s.metaLabel}>Zahlungsziel</Text>
              <Text style={s.metaValue}>{fmt(dueDate)}</Text>
            </View>
            <View style={s.metaBlock}>
              <Text style={s.metaLabel}>Rechnungsnr.</Text>
              <Text style={s.metaValue}>{rechnungNr}</Text>
            </View>
            <View style={s.metaBlock}>
              <Text style={s.metaLabel}>Anteil</Text>
              <Text style={s.metaValue}>{rate.percent} % Gesamtinvestition</Text>
            </View>
          </View>

          <View style={s.section}>
            <Text style={s.sectionLabel}>Rechnungsempfänger</Text>
            <View style={s.divider} />
            <View style={s.customerBox}>
              <Text style={s.customerName}>{customerName}</Text>
              <Text style={s.customerLine}>PLZ / Standort: {customerZip}</Text>
              {customerEmail && <Text style={s.customerLine}>E-Mail: {customerEmail}</Text>}
              {customerPhone && <Text style={s.customerLine}>Telefon: {customerPhone}</Text>}
            </View>
          </View>

          <View style={s.section}>
            <Text style={s.sectionLabel}>Leistungsbeschreibung</Text>
            <View style={s.divider} />
            <View style={s.leistungBox}>
              <View style={s.leistungRow}>
                <Text style={s.leistungDesc}>
                  {`Photovoltaikanlage ${project.kwp ?? '—'} kWp\n${rate.subLabel}\nProjektnr.: #${project.id.slice(0, 8).toUpperCase()}`}
                </Text>
              </View>
              <View style={s.midDivider} />
              <View style={s.leistungRow}>
                <Text style={s.leistungMuted}>Nettobetrag (0 % MwSt. gem. § 12 Abs. 3 UStG)</Text>
                <Text style={s.leistungAmt}>{formatEur(amount)}</Text>
              </View>
              <View style={s.leistungRow}>
                <Text style={s.leistungMuted}>Umsatzsteuer 0 %</Text>
                <Text style={s.leistungMutedAmt}>0,00 €</Text>
              </View>
              <View style={s.totalBox}>
                <Text style={s.totalLabel}>Rechnungsbetrag (fällig bis {fmt(dueDate)})</Text>
                <Text style={s.totalValue}>{formatEur(amount)}</Text>
              </View>
            </View>
          </View>

          <View style={s.section}>
            <Text style={s.sectionLabel}>Zahlungsinformationen</Text>
            <View style={s.divider} />
            <View style={s.zahlungBox}>
              <Text style={s.zahlungTitle}>Bitte überweisen Sie den Betrag bis zum {fmt(dueDate)}:</Text>
              {([
                ['Empfänger', installerName],
                ['IBAN', iban],
                ['BIC / SWIFT', bic],
                ['Verwendungszweck', rechnungNr],
                ['Betrag', formatEur(amount)],
              ] as [string, string][]).map(([lbl, val]) => (
                <View key={lbl} style={s.zahlungRow}>
                  <Text style={s.zahlungLbl}>{lbl}</Text>
                  <Text style={s.zahlungVal}>{val}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={s.disclaimer}>
            <Text style={s.disclaimerTxt}>
              Diese Rechnung wird gem. § 12 Abs. 3 UStG mit 0 % Umsatzsteuer ausgestellt
              (Photovoltaikanlagen auf Wohngebäuden, gültig seit 01.01.2023).
              Gesamtinvestition der Anlage: {formatEur(totalInv)}. Diese Teilrechnung
              ({rate.percent} % = {formatEur(amount)}) entspricht dem vereinbarten Zahlungsplan.
              Bei Rückfragen: {installerName}.
            </Text>
          </View>

        </View>

        <View style={s.footer} fixed>
          <Text style={s.footerTxt}>{installerName} • info@pvmontage-nord.de • www.pvmontage-nord.de</Text>
          <Text style={s.footerTxt}>Rechnungsnr. {rechnungNr} • Ausgestellt am {fmt(today)}</Text>
        </View>

      </Page>
    </Document>
  );
};
