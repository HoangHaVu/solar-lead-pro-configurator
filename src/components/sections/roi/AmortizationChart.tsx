import React from 'react';
import { Download } from 'lucide-react';

interface Props {
  investment: number;
  annualSavings: number;
  amortization: number;
  createdAt: string;
}

export const AmortizationChart: React.FC<Props> = ({ investment, annualSavings, amortization, createdAt }) => {
  const startYear = new Date(createdAt).getFullYear();
  const currentYear = new Date().getFullYear();
  const yearsElapsed = currentYear - startYear;
  const currentSavings = Math.min(yearsElapsed * annualSavings, investment);

  const maxY = Math.ceil(investment / 5000) * 5000;
  const yLabels = [maxY, Math.round(maxY * 0.75), Math.round(maxY * 0.5), Math.round(maxY * 0.25), 0];

  const xLabels = Array.from({ length: amortization + 1 }, (_, i) => startYear + i);
  const investmentYPercent = (1 - investment / maxY) * 100;

  // SVG path: linear progression from 0 to investment over amortization years
  const points = xLabels.map((_, i) => {
    const savings = Math.min((i / amortization) * investment, investment);
    const x = (i / amortization) * 100;
    const y = 100 - (savings / maxY) * 100;
    return `${x},${y}`;
  });
  const pathD = `M${points.join(' L')}`;
  const areaD = `M0,100 L${points.join(' L')} L100,100 Z`;

  const fmt = (n: number) =>
    n >= 1000 ? `${Math.round(n / 1000)}k €` : `${n} €`;

  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200/50 mb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h3 className="text-xl font-bold text-primary">Amortisationsfortschritt</h3>
          <p className="text-sm text-slate-500 mt-1">Bereits gespart vs. Investition</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-200 border border-slate-300"></div>
            <span className="text-xs text-slate-500">Investition ({fmt(investment)})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-secondary"></div>
            <span className="text-xs text-slate-500">Gespart ({fmt(currentSavings)})</span>
          </div>
        </div>
      </div>

      <div className="relative h-64 w-full border-b border-l border-slate-200 pt-4 pr-4 ml-12">
        {/* Y-Axis Labels */}
        <div className="absolute left-[-48px] top-0 h-full flex flex-col justify-between items-end py-1 text-[10px] text-slate-400 font-bold">
          {yLabels.map((v) => <span key={v}>{fmt(v)}</span>)}
        </div>

        {/* Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between z-0 pointer-events-none">
          {yLabels.map((v) => (
            <div key={v} className="w-full border-t border-slate-50 border-dashed h-0"></div>
          ))}
        </div>

        {/* Investment Line */}
        <div
          className="absolute left-0 w-full h-[2px] bg-slate-200 z-10"
          style={{ top: `${investmentYPercent}%` }}
        ></div>

        {/* Savings area + path */}
        <div className="absolute left-0 bottom-0 w-full h-full z-20 flex items-end">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="savingsGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={areaD} fill="url(#savingsGradient)" />
            <path d={pathD} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={((yearsElapsed / amortization) * 100).toFixed(1)} cy={(100 - (currentSavings / maxY) * 100).toFixed(1)} r="4" fill="#f59e0b" stroke="white" strokeWidth="2" />
          </svg>
        </div>

        {/* X-Axis Labels */}
        <div className="absolute bottom-[-28px] left-0 w-full flex justify-between text-[10px] text-slate-400 font-bold px-1">
          {xLabels.filter((_, i) => i % Math.max(1, Math.floor(xLabels.length / 6)) === 0).map((y) => (
            <span key={y}>{y}</span>
          ))}
        </div>
      </div>

      <div className="mt-14 flex justify-end">
        <button className="flex items-center gap-2 text-sm font-bold text-primary hover:text-secondary transition-colors">
          Report herunterladen
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
