import React from 'react';
import { Download } from 'lucide-react';

export const AmortizationChart: React.FC = () => {
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
            <span className="text-xs text-slate-500">Investition (18.500 €)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-secondary"></div>
            <span className="text-xs text-slate-500">Gespart (2.450 €)</span>
          </div>
        </div>
      </div>

      <div className="relative h-64 w-full border-b border-l border-slate-200 pt-4 pr-4">
        {/* Y-Axis Labels */}
        <div className="absolute left-[-45px] top-0 h-full flex flex-col justify-between items-end py-4 text-[10px] text-slate-400 font-bold hidden sm:flex">
          <span>20k €</span>
          <span>15k €</span>
          <span>10k €</span>
          <span>5k €</span>
          <span>0</span>
        </div>

        {/* Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between z-0">
          <div className="w-full border-t border-slate-50 border-dashed h-0 mt-4"></div>
          <div className="w-full border-t border-slate-50 border-dashed h-0"></div>
          <div className="w-full border-t border-slate-50 border-dashed h-0"></div>
          <div className="w-full border-t border-slate-50 border-dashed h-0"></div>
        </div>

        {/* Investment Line */}
        <div className="absolute left-0 bottom-[75%] w-full h-[2px] bg-slate-100 z-10 shadow-[0_0_10px_rgba(0,0,0,0.02)]"></div>

        {/* Savings Path */}
        <div className="absolute left-0 bottom-0 w-full h-full z-20 flex items-end">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="savingsGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0,100 L0,95 L20,85 L40,70 L60,65 L80,45 L100,30 L100,100 Z"
              fill="url(#savingsGradient)"
            />
            <path
              d="M0,95 L20,85 L40,70 L60,65 L80,45 L100,30"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="100" cy="30" fill="#f59e0b" r="4" stroke="white" strokeWidth="2" />
          </svg>
        </div>

        {/* X-Axis Labels */}
        <div className="absolute bottom-[-30px] left-0 w-full flex justify-between text-[10px] text-slate-400 font-bold px-2">
          <span>2023</span>
          <span>2024</span>
          <span>2025</span>
          <span>2026</span>
          <span>2027</span>
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
