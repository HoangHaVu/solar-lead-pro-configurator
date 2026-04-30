import { useState } from 'react';
import { getIrradiationByZip } from '../data/plzIrradiation';

export interface ConfigData {
  zip: string;
  roofType: string;
  orientation: string;
  area: number;
  constructionYear: string;
  consumption: number;
  futureNeeds: {
    eCar: boolean;
    heatPump: boolean;
  };
  battery: boolean;
  electricityPrice: number;
}

export interface ROICalculations {
  kwp: number;
  investment: number;
  annualYield: number;
  adjustedConsumption: number;
  selfConsumedEnergy: number;
  gridFeedIn: number;
  autarky: number;
  annualSavings: number;
  amortization: number;
  profit20Years: number;
  irradiation: number;
  chartData: { year: number; value: number }[];
}

const ORIENTATION_FACTOR: Record<string, number> = {
  sued: 1.0,
  ostwest: 0.85,
  nord: 0.65,
};

const PERFORMANCE_RATIO = 0.80; // Systemwirkungsgrad inkl. Wechselrichter
const FEED_IN_TARIFF = 0.082;   // €/kWh, EEG 2024 (< 10 kWp)

function calculateROI(data: ConfigData): ROICalculations {
  const orientationFactor = ORIENTATION_FACTOR[data.orientation] ?? 1.0;
  const irradiation = getIrradiationByZip(data.zip);
  const kwp = Math.round(data.area * 0.18 * orientationFactor * 10) / 10;

  const adjustedConsumption = data.consumption
    + (data.futureNeeds.eCar ? 2500 : 0)
    + (data.futureNeeds.heatPump ? 3000 : 0);

  const annualYield = Math.round(kwp * irradiation * PERFORMANCE_RATIO);

  // Mit Speicher: ~65% Eigenverbrauch, ohne: ~30%
  const selfConsumptionRate = data.battery ? 0.65 : 0.30;
  const selfConsumedEnergy = Math.min(
    Math.round(annualYield * selfConsumptionRate),
    adjustedConsumption
  );
  const autarky = Math.round((selfConsumedEnergy / adjustedConsumption) * 100);
  const gridFeedIn = annualYield - selfConsumedEnergy;

  const batteryAddon = data.battery ? 6000 : 0;
  const constructionAddon = data.constructionYear === 'pre1980' ? 2000 : 0;
  const investment = Math.round(kwp * 1800) + batteryAddon + constructionAddon;

  const annualSavings = Math.round(
    selfConsumedEnergy * data.electricityPrice + gridFeedIn * FEED_IN_TARIFF
  );
  const amortization = Math.round(investment / annualSavings);
  const profit20Years = Math.round(annualSavings * 20 - investment);

  const chartData = Array.from({ length: 21 }, (_, year) => ({
    year,
    value: annualSavings * year - investment,
  }));

  return {
    kwp,
    investment,
    annualYield,
    adjustedConsumption,
    selfConsumedEnergy,
    gridFeedIn,
    autarky,
    annualSavings,
    amortization,
    profit20Years,
    irradiation,
    chartData,
  };
}

export const useConfigurator = (initialZip = '') => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<ConfigData>({
    zip: initialZip,
    roofType: 'Satteldach',
    orientation: 'sued',
    area: 80,
    constructionYear: 'after2010',
    consumption: 4500,
    futureNeeds: { eCar: false, heatPump: false },
    battery: true,
    electricityPrice: 0.32,
  });

  const nextStep = () => setStep((s) => Math.min(s + 1, 6));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const updateData = (newData: Partial<ConfigData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const calculations = calculateROI(data);

  return { step, data, calculations, nextStep, prevStep, updateData };
};
