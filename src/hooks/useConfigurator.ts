import { useState } from 'react';
import { getIrradiationByZip } from '../data/plzIrradiation';
import { getGrantSubsidyTotal } from '../data/grants';
import { computeLeadScore } from '../utils/leadScore';

export type BuildingType = 'einfamilienhaus' | 'zweifamilienhaus' | 'mehrfamilienhaus' | 'firmengebaeude' | 'sonstiges';
export type OwnershipType = 'eigentuemer' | 'mieter';
export type PlanningHorizon = 'sofort' | '3monate' | '12monate' | '';

export interface ConfigData {
  zip: string;
  buildingType: BuildingType;
  ownershipType: OwnershipType;
  roofType: string;
  orientation: string;
  roofAngle: number;
  area: number;
  constructionYear: string;
  consumption: number;
  futureNeeds: {
    eCar: boolean;
    heatPump: boolean;
  };
  battery: boolean;
  electricityPrice: number;
  planningHorizon: PlanningHorizon;
  needsFinancing: boolean;
}

export interface ROICalculations {
  kwp: number;
  investment: number;
  grantSavings: number;
  effectiveInvestment: number;
  annualYield: number;
  adjustedConsumption: number;
  selfConsumedEnergy: number;
  gridFeedIn: number;
  autarky: number;
  annualSavings: number;
  amortization: number;
  profit20Years: number;
  irradiation: number;
  score: number;
  chartData: { year: number; value: number }[];
}

const ORIENTATION_FACTOR: Record<string, number> = {
  sued: 1.0,
  ostwest: 0.85,
  nord: 0.65,
};

const PERFORMANCE_RATIO = 0.80; // Systemwirkungsgrad inkl. Wechselrichter
const FEED_IN_TARIFF = 0.082;   // €/kWh, EEG 2024 (< 10 kWp)

// Quadratischer Abfall vom Optimum (32°); Min-Faktor 0.80
function getRoofAngleFactor(angle: number): number {
  const diff = Math.abs(angle - 32);
  return Math.max(0.80, 1.0 - (diff * diff) / 5000);
}

function calculateROI(data: ConfigData): ROICalculations {
  const orientationFactor = ORIENTATION_FACTOR[data.orientation] ?? 1.0;
  const roofAngleFactor = getRoofAngleFactor(data.roofAngle);
  const irradiation = getIrradiationByZip(data.zip);
  const kwp = Math.round(data.area * 0.18 * orientationFactor * 10) / 10;

  const adjustedConsumption = data.consumption
    + (data.futureNeeds.eCar ? 2500 : 0)
    + (data.futureNeeds.heatPump ? 3000 : 0);

  const annualYield = Math.round(kwp * irradiation * PERFORMANCE_RATIO * roofAngleFactor);

  // Gewerbe: hoher Tagesverbrauch → besserer Eigenverbrauch ohne Speicher
  const selfConsumptionRate = data.buildingType === 'firmengebaeude'
    ? (data.battery ? 0.80 : 0.60)
    : (data.battery ? 0.65 : 0.30);
  const selfConsumedEnergy = Math.min(
    Math.round(annualYield * selfConsumptionRate),
    adjustedConsumption
  );
  const autarky = Math.round((selfConsumedEnergy / adjustedConsumption) * 100);
  const gridFeedIn = annualYield - selfConsumedEnergy;

  const batteryAddon = data.battery ? 6000 : 0;
  const constructionAddon = data.constructionYear === 'pre1980' ? 2000 : 0;
  const investment = Math.round(kwp * 1800) + batteryAddon + constructionAddon;

  const grantSavings = getGrantSubsidyTotal(data.zip);
  const effectiveInvestment = Math.max(0, investment - grantSavings);

  const annualSavings = Math.round(
    selfConsumedEnergy * data.electricityPrice + gridFeedIn * FEED_IN_TARIFF
  );
  const amortization = Math.round(effectiveInvestment / annualSavings);
  const profit20Years = Math.round(annualSavings * 20 - effectiveInvestment);

  const chartData = Array.from({ length: 21 }, (_, year) => ({
    year,
    value: annualSavings * year - effectiveInvestment,
  }));

  const score = computeLeadScore({
    kwp,
    investment,
    zip: data.zip,
    isOwner: data.ownershipType === 'eigentuemer',
    hasBattery: data.battery,
    area: data.area,
    planningHorizon: data.planningHorizon,
  });

  return {
    kwp,
    investment,
    grantSavings,
    effectiveInvestment,
    annualYield,
    adjustedConsumption,
    selfConsumedEnergy,
    gridFeedIn,
    autarky,
    annualSavings,
    amortization,
    profit20Years,
    irradiation,
    score,
    chartData,
  };
}

export const useConfigurator = (initialZip = '') => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<ConfigData>({
    zip: initialZip,
    buildingType: 'einfamilienhaus',
    ownershipType: 'eigentuemer',
    roofType: 'Satteldach',
    orientation: 'sued',
    roofAngle: 35,
    area: 80,
    constructionYear: 'after2010',
    consumption: 4500,
    futureNeeds: { eCar: false, heatPump: false },
    battery: true,
    electricityPrice: 0.32,
    planningHorizon: '',
    needsFinancing: false,
  });

  const nextStep = () => setStep((s) => Math.min(s + 1, 7));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const updateData = (newData: Partial<ConfigData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const calculations = calculateROI(data);

  return { step, data, calculations, nextStep, prevStep, updateData };
};
