import React from 'react';
import { MoreVertical } from 'lucide-react';

export const LeadDevelopmentChart: React.FC = () => {
  const data = [
    { label: 'Jan', value: 40 },
    { label: 'Feb', value: 55 },
    { label: 'Mär', value: 45 },
    { label: 'Apr', value: 70 },
    { label: 'Mai', value: 60 },
    { label: 'Jun', value: 85, highlight: true },
  ];

  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200/50">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-lg font-black text-primary">Lead-Entwicklung</h3>
        <button className="text-slate-400 hover:text-primary transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <div className="h-64 flex flex-col justify-end relative">
        {/* Y-Axis Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pr-10">
          {[150, 100, 50, 0].map((val) => (
            <div key={val} className="flex items-center gap-4 w-full">
              <span className="text-[10px] font-bold text-slate-300 w-6 text-right">{val}</span>
              <div className="flex-1 border-t border-slate-100"></div>
            </div>
          ))}
        </div>

        {/* Bars */}
        <div className="flex items-end justify-around pl-10 h-full relative z-10">
          {data.map((item, i) => (
            <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group">
              <div 
                className={`w-1/2 max-w-[40px] rounded-t-lg transition-all duration-500 hover:opacity-80 ${
                  item.highlight ? 'bg-secondary' : 'bg-primary'
                }`}
                style={{ height: `${item.value}%` }}
              >
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded transition-opacity">
                  {Math.round(item.value * 1.5)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* X-Axis Labels */}
      <div className="flex justify-around pl-10 mt-6">
        {data.map((item, i) => (
          <span 
            key={i} 
            className={`text-[10px] font-bold uppercase tracking-widest flex-1 text-center ${
              item.highlight ? 'text-primary' : 'text-slate-400'
            }`}
          >
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
};
