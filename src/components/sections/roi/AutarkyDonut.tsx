import React from 'react';

export const AutarkyDonut: React.FC<{ percentage: number }> = ({ percentage }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/50 hover:shadow-md hover:border-primary transition-all flex flex-col items-center justify-center relative overflow-hidden">
      <p className="text-sm text-slate-500 absolute top-6 left-6">Autarkiegrad</p>
      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 absolute top-6 right-6">Diese Woche</span>
      
      <div className="w-32 h-32 relative mt-6">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Track */}
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            className="text-slate-100"
          />
          {/* Progress */}
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            strokeDasharray="251.2"
            strokeDashoffset={251.2 - (251.2 * percentage) / 100}
            strokeLinecap="round"
            className="text-secondary"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-black text-primary">{percentage}%</span>
        </div>
      </div>
    </div>
  );
};
