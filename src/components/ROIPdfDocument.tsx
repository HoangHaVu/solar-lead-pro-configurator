import React from 'react';
import {
  Document, Page, View, Text, StyleSheet,
} from '@react-pdf/renderer';
import type { ConfigData, ROICalculations } from '../hooks/useConfigurator';
import { NATIONAL_GRANTS, getRegionalGrants, getStateLabel } from '../data/grants';

const C = {
  primary:   '#0D2137',
  amber:     '#F59E0B',
  amberLight:'#FEF3C7',
  slate50:   '#F8FAFC',
  slate100:  '#F1F5F9',
  slate200:  '#E2E8F0',
  slate400:  '#94A3B8',
  slate500:  '#64748B',
  slate700:  '#334155',
  white:     '#FFFFFF',
  green:     '#16A34A',
};

const s = StyleSheet.create({
  page:          { fontFamily: 'Helvetica', backgroundColor: C.white, paddingBottom: 48 },
  header:        { backgroundColor: C.primary, padding: '20 32', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle:   { color: C.white, fontSize: 18, fontFamily: 'Helvetica-Bold' },
  headerSub:     { color: '#94A3B8', fontSize: 9, marginTop: 3 },
  headerDate:    { color: '#94A3B8', fontSize: 9, textAlign: 'right' },
  accentBar:     { height: 4, backgroundColor: C.amber },

  body:          { padding: '24 32' },
  section:       { marginBottom: 20 },

  sectionLabel:  { fontSize: 8, fontFamily: 'Helvetica-Bold', color: C.amber, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 },
  divider:       { height: 1, backgroundColor: C.slate200, marginBottom: 16 },

  row:           { flexDirection: 'row', gap: 12 },
  col:           { flex: 1 },

  configBox:     { backgroundColor: C.slate50, borderRadius: 6, border: `1 solid ${C.slate200}`, padding: 12 },
  configRow:     { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  configLabel:   { fontSize: 8, color: C.slate500 },
  configValue:   { fontSize: 8, fontFamily: 'Helvetica-Bold', color: C.primary },

  metricGrid:    { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  metricBox:     { width: '30.5%', backgroundColor: C.slate50, border: `1 solid ${C.slate200}`, borderRadius: 6, padding: '10 12' },
  metricBoxHero: { width: '30.5%', backgroundColor: C.primary, borderRadius: 6, padding: '10 12' },
  metricLabel:   { fontSize: 7, color: C.slate400, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.8 },
  metricLabelHero: { fontSize: 7, color: '#94A3B8', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.8 },
  metricValue:   { fontSize: 16, fontFamily: 'Helvetica-Bold', color: C.primary },
  metricValueHero: { fontSize: 16, fontFamily: 'Helvetica-Bold', color: C.white },
  metricUnit:    { fontSize: 9, color: C.slate500 },
  metricUnitHero: { fontSize: 9, color: '#94A3B8' },

  grantRow:      { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8, gap: 8 },
  grantDot:      { width: 6, height: 6, borderRadius: 3, backgroundColor: C.amber, marginTop: 3 },
  grantTitle:    { fontSize: 8, fontFamily: 'Helvetica-Bold', color: C.primary, marginBottom: 2 },
  grantDesc:     { fontSize: 7, color: C.slate500 },
  grantBadge:    { fontSize: 7, fontFamily: 'Helvetica-Bold', color: C.amber },

  savingsBox:    { backgroundColor: C.amberLight, border: `1 solid ${C.amber}`, borderRadius: 6, padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  savingsLabel:  { fontSize: 8, color: C.slate700 },
  savingsValue:  { fontSize: 14, fontFamily: 'Helvetica-Bold', color: C.primary },

  footer:        { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: C.slate50, borderTop: `1 solid ${C.slate200}`, padding: '10 32', flexDirection: 'row', justifyContent: 'space-between' },
  footerText:    { fontSize: 7, color: C.slate400 },
  disclaimer:    { backgroundColor: C.slate100, borderRadius: 4, padding: '8 12', marginTop: 4 },
  disclaimerText:{ fontSize: 7, color: C.slate500, lineHeight: 1.5 },
});

const BUILDING_LABEL: Record<string, string> = {
  einfamilienhaus: 'Einfamilienhaus',
  zweifamilienhaus: 'Zweifamilienhaus',
  mehrfamilienhaus: 'Mehrfamilienhaus',
  firmengebaeude: 'Firmengebäude / Gewerbe',
  sonstiges: 'Sonstiges',
};
const ORIENTATION_LABEL: Record<string, string> = {
  sued: 'Süd', ostwest: 'Ost/West', nord: 'Nord',
};
const ROOF_LABEL: Record<string, string> = {
  satteldach: 'Satteldach', flachdach: 'Flachdach', pultdach: 'Pultdach',
};

interface Props {
  data: ConfigData;
  calculations: ROICalculations;
}

export const ROIPdfDocument: React.FC<Props> = ({ data, calculations }) => {
  const {
    kwp, investment, grantSavings, effectiveInvestment,
    annualSavings, amortization, profit20Years, autarky, annualYield, gridFeedIn,
  } = calculations;

  const regionalGrants = getRegionalGrants(data.zip);
  const stateLabel = getStateLabel(data.zip);
  const allGrants = [...regionalGrants, ...NATIONAL_GRANTS];
  const eegRevenue = Math.round(gridFeedIn * 0.082);
  const today = new Date().toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <Document title="Wirtschaftlichkeitsanalyse — SolarConfig" author="SolarConfig GmbH">
      <Page size="A4" style={s.page}>

        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.headerTitle}>SolarConfig</Text>
            <Text style={s.headerSub}>Persönliche Wirtschaftlichkeitsanalyse</Text>
          </View>
          <View>
            <Text style={s.headerDate}>Erstellt am {today}</Text>
            <Text style={s.headerDate}>PLZ {data.zip} — {stateLabel}</Text>
          </View>
        </View>
        <View style={s.accentBar} />

        <View style={s.body}>

          {/* Konfiguration */}
          <View style={s.section}>
            <Text style={s.sectionLabel}>Ihre Konfiguration</Text>
            <View style={s.divider} />
            <View style={s.row}>
              <View style={[s.col, s.configBox]}>
                <View style={s.configRow}>
                  <Text style={s.configLabel}>Gebäudetyp</Text>
                  <Text style={s.configValue}>{BUILDING_LABEL[data.buildingType] ?? data.buildingType}</Text>
                </View>
                <View style={s.configRow}>
                  <Text style={s.configLabel}>Dachtyp</Text>
                  <Text style={s.configValue}>{ROOF_LABEL[data.roofType] ?? data.roofType}</Text>
                </View>
                <View style={s.configRow}>
                  <Text style={s.configLabel}>Ausrichtung</Text>
                  <Text style={s.configValue}>{ORIENTATION_LABEL[data.orientation] ?? data.orientation}</Text>
                </View>
                <View style={[s.configRow, { marginBottom: 0 }]}>
                  <Text style={s.configLabel}>Dachneigung</Text>
                  <Text style={s.configValue}>{data.roofAngle}°</Text>
                </View>
              </View>
              <View style={[s.col, s.configBox]}>
                <View style={s.configRow}>
                  <Text style={s.configLabel}>Nutzbare Dachfläche</Text>
                  <Text style={s.configValue}>{data.area} m²</Text>
                </View>
                <View style={s.configRow}>
                  <Text style={s.configLabel}>Jahresstromverbrauch</Text>
                  <Text style={s.configValue}>{data.consumption.toLocaleString('de-DE')} kWh</Text>
                </View>
                <View style={s.configRow}>
                  <Text style={s.configLabel}>Stromspeicher</Text>
                  <Text style={s.configValue}>{data.battery ? 'Ja, gewünscht' : 'Nein'}</Text>
                </View>
                <View style={[s.configRow, { marginBottom: 0 }]}>
                  <Text style={s.configLabel}>Strompreis</Text>
                  <Text style={s.configValue}>{(data.electricityPrice * 100).toFixed(0)} ct/kWh</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Kennzahlen */}
          <View style={s.section}>
            <Text style={s.sectionLabel}>Ihre Ergebnisse auf einen Blick</Text>
            <View style={s.divider} />
            <View style={s.metricGrid}>
              <View style={s.metricBox}>
                <Text style={s.metricLabel}>Anlagenleistung</Text>
                <Text style={s.metricValue}>{kwp} <Text style={s.metricUnit}>kWp</Text></Text>
              </View>
              <View style={s.metricBox}>
                <Text style={s.metricLabel}>Jahresertrag</Text>
                <Text style={s.metricValue}>{annualYield.toLocaleString('de-DE')} <Text style={s.metricUnit}>kWh</Text></Text>
              </View>
              <View style={s.metricBox}>
                <Text style={s.metricLabel}>Autarkiegrad</Text>
                <Text style={s.metricValue}>{autarky} <Text style={s.metricUnit}>%</Text></Text>
              </View>
              <View style={s.metricBox}>
                <Text style={s.metricLabel}>Jahresersparnis</Text>
                <Text style={s.metricValue}>{annualSavings.toLocaleString('de-DE')} <Text style={s.metricUnit}>€</Text></Text>
              </View>
              <View style={s.metricBoxHero}>
                <Text style={s.metricLabelHero}>Amortisation</Text>
                <Text style={s.metricValueHero}>~ {amortization} <Text style={s.metricUnitHero}>Jahre</Text></Text>
              </View>
              <View style={s.metricBox}>
                <Text style={s.metricLabel}>Einspeisung/Jahr</Text>
                <Text style={s.metricValue}>{eegRevenue.toLocaleString('de-DE')} <Text style={s.metricUnit}>€</Text></Text>
              </View>
            </View>
          </View>

          {/* Investition + Förderung */}
          <View style={s.section}>
            <Text style={s.sectionLabel}>Investition & Förderungen</Text>
            <View style={s.divider} />
            <View style={s.row}>
              <View style={[s.col, s.configBox]}>
                <View style={s.configRow}>
                  <Text style={s.configLabel}>Investitionskosten (brutto)</Text>
                  <Text style={s.configValue}>ca. {investment.toLocaleString('de-DE')} €</Text>
                </View>
                {grantSavings > 0 && (
                  <View style={s.configRow}>
                    <Text style={s.configLabel}>Abzgl. Förderungen</Text>
                    <Text style={[s.configValue, { color: C.green }]}>− {grantSavings.toLocaleString('de-DE')} €</Text>
                  </View>
                )}
                <View style={[s.configRow, { marginBottom: 0, borderTop: `1 solid ${C.slate200}`, paddingTop: 5 }]}>
                  <Text style={[s.configLabel, { fontFamily: 'Helvetica-Bold' }]}>Effektive Investition</Text>
                  <Text style={[s.configValue, { fontSize: 10 }]}>ca. {effectiveInvestment.toLocaleString('de-DE')} €</Text>
                </View>
              </View>
              <View style={[s.col, s.savingsBox]}>
                <View>
                  <Text style={s.savingsLabel}>Gewinn nach 20 Jahren</Text>
                  <Text style={[s.savingsLabel, { fontSize: 7, color: C.slate500, marginTop: 2 }]}>nach Abzug der Investition</Text>
                </View>
                <Text style={s.savingsValue}>+ {profit20Years.toLocaleString('de-DE')} €</Text>
              </View>
            </View>
          </View>

          {/* Förderungen */}
          <View style={s.section}>
            <Text style={s.sectionLabel}>Anwendbare Förderprogramme ({allGrants.length})</Text>
            <View style={s.divider} />
            {allGrants.map((grant) => (
              <View key={grant.id} style={s.grantRow}>
                <View style={s.grantDot} />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={s.grantTitle}>{grant.title}</Text>
                    <Text style={s.grantBadge}>{grant.highlight}</Text>
                  </View>
                  <Text style={s.grantDesc}>{grant.description}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Disclaimer */}
          <View style={s.disclaimer}>
            <Text style={s.disclaimerText}>
              Diese Analyse basiert auf DWD-Einstrahlungsdaten für PLZ {data.zip}, einem Systemwirkungsgrad von 80 % sowie einem Strompreis von {(data.electricityPrice * 100).toFixed(0)} ct/kWh. Alle Angaben sind Prognosen und ohne Gewähr. Die tatsächlichen Werte können je nach Dachbeschaffenheit, Installationsqualität und Strompreisentwicklung abweichen. Förderungen sind ggf. zu beantragen und nicht automatisch zugesichert.
            </Text>
          </View>

        </View>

        {/* Footer */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>SolarConfig GmbH • datenschutz@solarconfig.de • solarconfig.de</Text>
          <Text style={s.footerText}>Erstellt am {today} • 100 % DSGVO-konform</Text>
        </View>

      </Page>
    </Document>
  );
};
