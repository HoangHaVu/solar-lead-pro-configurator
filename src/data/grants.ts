export interface Grant {
  id: string;
  title: string;
  description: string;
  type: 'national' | 'regional';
  highlight: string;
  icon: string;
}

export const NATIONAL_GRANTS: Grant[] = [
  {
    id: 'mwst',
    title: '0 % Mehrwertsteuer',
    description:
      'Seit dem 01.01.2023 entfällt die Umsatzsteuer auf Lieferung und Installation von PV-Anlagen und Batteriespeichern auf Wohngebäuden bundesweit.',
    type: 'national',
    highlight: '~19 % Sofortersparnis',
    icon: 'percent',
  },
  {
    id: 'eeg',
    title: 'EEG Einspeisevergütung',
    description:
      'Für eingespeisten Strom erhältst du 20 Jahre lang eine staatlich garantierte Vergütung von 8,2 ct/kWh (bis 10 kWp) bzw. 7,1 ct/kWh (bis 40 kWp).',
    type: 'national',
    highlight: '20 Jahre garantiert',
    icon: 'bolt',
  },
  {
    id: 'kfw270',
    title: 'KfW 270 – Erneuerbare Energien',
    description:
      'Zinsgünstiger Kredit der KfW-Bank für Errichtung, Erweiterung und Erwerb von PV-Anlagen. Finanzierung bis 150 Mio. €, Laufzeit bis 30 Jahre.',
    type: 'national',
    highlight: 'Kredit ab 5,21 % eff. p.a.',
    icon: 'account_balance',
  },
];

// Regionale Förderungen nach PLZ-Präfix (erste Ziffer)
const REGIONAL_GRANTS: Record<string, Grant[]> = {
  // PLZ 0x — Sachsen & Thüringen
  '0': [
    {
      id: 'sab',
      title: 'SAB Sachsen Solar',
      description:
        'Die Sächsische Aufbaubank (SAB) fördert Photovoltaikanlagen und Batteriespeicher mit zinsgünstigen Darlehen und Zuschüssen für Haushalte in Sachsen.',
      type: 'regional',
      highlight: 'Zuschuss bis 5.000 €',
      icon: 'solar_power',
    },
    {
      id: 'thuefonds',
      title: 'ThüringenFonds Solar',
      description:
        'Die Thüringer Aufbaubank (TAB) unterstützt Investitionen in erneuerbare Energien mit günstigen Darlehen für Privatpersonen und kleine Unternehmen.',
      type: 'regional',
      highlight: 'Darlehen ab 1,5 % p.a.',
      icon: 'park',
    },
  ],
  // PLZ 1x — Berlin & Brandenburg
  '1': [
    {
      id: 'bene',
      title: 'BENE Berlin SolarPLUS',
      description:
        'Das Berliner Programm für Nachhaltige Entwicklung (BENE) fördert PV-Anlagen mit Speicher auf Berliner Wohngebäuden mit einem direkten Investitionszuschuss.',
      type: 'regional',
      highlight: 'Zuschuss bis 10.000 €',
      icon: 'apartment',
    },
    {
      id: 'ilb',
      title: 'ILB Brandenburg Solar',
      description:
        'Die Investitionsbank des Landes Brandenburg (ILB) bietet zinsgünstige Darlehen für Photovoltaik- und Speicheranlagen auf Brandenburger Grundstücken.',
      type: 'regional',
      highlight: 'Darlehen ab 2,0 % p.a.',
      icon: 'forest',
    },
  ],
  // PLZ 2x — Hamburg & Schleswig-Holstein
  '2': [
    {
      id: 'hamburgenergie',
      title: 'HamburgEnergie Solar',
      description:
        'Das Hamburger Förderprogramm für erneuerbare Energien unterstützt PV-Anlagen auf Wohn- und Gewerbegebäuden mit Investitionszuschüssen.',
      type: 'regional',
      highlight: 'Zuschuss bis 2.500 €',
      icon: 'water',
    },
    {
      id: 'eksh',
      title: 'EKSH Schleswig-Holstein',
      description:
        'Die Gesellschaft für Energie und Klimaschutz SH (EKSH) fördert innovative Energieprojekte inkl. PV-Anlagen mit Zuschüssen für private Haushalte.',
      type: 'regional',
      highlight: 'Zuschuss bis 3.000 €',
      icon: 'wind_power',
    },
  ],
  // PLZ 3x — Niedersachsen & Hessen (Nord)
  '3': [
    {
      id: 'nbank',
      title: 'NBank Energieeinsparung',
      description:
        'Die Investitions- und Förderbank Niedersachsen (NBank) fördert Photovoltaikanlagen auf privaten Wohngebäuden mit zinsgünstigen Darlehen.',
      type: 'regional',
      highlight: 'Darlehen ab 1,8 % p.a.',
      icon: 'eco',
    },
  ],
  // PLZ 4x & 5x — Nordrhein-Westfalen
  '4': [
    {
      id: 'progress-nrw',
      title: 'progres.nrw Klimaschutztechnik',
      description:
        'Das NRW-Förderprogramm unterstützt Investitionen in klimaschützende Technologien inkl. PV-Anlagen und Batteriespeicher für Privathaushalte.',
      type: 'regional',
      highlight: 'Zuschuss bis 7.500 €',
      icon: 'factory',
    },
  ],
  '5': [
    {
      id: 'progress-nrw-5',
      title: 'progres.nrw Klimaschutztechnik',
      description:
        'Das NRW-Förderprogramm unterstützt Investitionen in klimaschützende Technologien inkl. PV-Anlagen und Batteriespeicher für Privathaushalte.',
      type: 'regional',
      highlight: 'Zuschuss bis 7.500 €',
      icon: 'factory',
    },
    {
      id: 'kef-rlp',
      title: 'KEF Rheinland-Pfalz',
      description:
        'Die Klimaschutz- und Energieagentur Rheinland-Pfalz (KEF-RLP) fördert PV-Anlagen und Speicher mit Direktzuschüssen für private Eigentümer.',
      type: 'regional',
      highlight: 'Zuschuss bis 4.000 €',
      icon: 'castle',
    },
  ],
  // PLZ 6x — Hessen & Rheinland-Pfalz
  '6': [
    {
      id: 'huk',
      title: 'Hessen-Umwelt-Kredit',
      description:
        'Die Wirtschafts- und Infrastrukturbank Hessen (WIBank) bietet über den Hessen-Umwelt-Kredit zinsgünstige Darlehen für PV-Anlagen auf Wohngebäuden.',
      type: 'regional',
      highlight: 'Darlehen ab 1,25 % p.a.',
      icon: 'account_tree',
    },
    {
      id: 'kef-rlp-6',
      title: 'KEF Rheinland-Pfalz',
      description:
        'Die Klimaschutz- und Energieagentur RLP fördert PV-Anlagen und Speicher mit Direktzuschüssen für private Eigentümer in Rheinland-Pfalz.',
      type: 'regional',
      highlight: 'Zuschuss bis 4.000 €',
      icon: 'castle',
    },
  ],
  // PLZ 7x — Baden-Württemberg
  '7': [
    {
      id: 'lbank',
      title: 'L-Bank Energiesparen Plus',
      description:
        'Die Staatsbank für Baden-Württemberg (L-Bank) fördert über das Programm "Energiesparen Plus" Photovoltaikanlagen und Speicher mit attraktiven Darlehen.',
      type: 'regional',
      highlight: 'Darlehen ab 1,0 % p.a.',
      icon: 'castle',
    },
  ],
  // PLZ 8x & 9x — Bayern
  '8': [
    {
      id: 'bayernfonds',
      title: 'BayernFonds Solaroffensive',
      description:
        'Die LfA Förderbank Bayern unterstützt die Installation von PV-Anlagen und Speichern im Rahmen der Bayerischen Solaroffensive mit günstigen Krediten.',
      type: 'regional',
      highlight: 'Kredit ab 0,95 % p.a.',
      icon: 'wb_sunny',
    },
  ],
  '9': [
    {
      id: 'bayernfonds-9',
      title: 'BayernFonds Solaroffensive',
      description:
        'Die LfA Förderbank Bayern unterstützt PV-Anlagen und Speicher im Rahmen der Bayerischen Solaroffensive mit günstigen Krediten für Privatpersonen.',
      type: 'regional',
      highlight: 'Kredit ab 0,95 % p.a.',
      icon: 'wb_sunny',
    },
  ],
};

export function getRegionalGrants(zip: string): Grant[] {
  if (!zip || zip.length < 1) return [];
  return REGIONAL_GRANTS[zip[0]] ?? [];
}

export function getStateLabel(zip: string): string {
  if (!zip || zip.length < 1) return 'Deutschland';
  const labels: Record<string, string> = {
    '0': 'Sachsen / Thüringen',
    '1': 'Berlin / Brandenburg',
    '2': 'Hamburg / Schleswig-Holstein',
    '3': 'Niedersachsen / Hessen',
    '4': 'Nordrhein-Westfalen',
    '5': 'NRW / Rheinland-Pfalz',
    '6': 'Hessen / Rheinland-Pfalz',
    '7': 'Baden-Württemberg',
    '8': 'Bayern',
    '9': 'Bayern / Franken',
  };
  return labels[zip[0]] ?? 'Deutschland';
}
