import React from 'react';

interface StatTileProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  trend?: string;
  variant?: 'light' | 'dark';
}

export const StatTile: React.FC<StatTileProps> = ({ icon, label, value, unit, trend, variant = 'light' }) => {
  if (variant === 'dark') {
    return (
      <div className="bg-primary rounded-xl p-6 shadow-sm relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-[#1a3a5c] opacity-80 z-0"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-white/10 rounded-lg text-secondary">
              {icon}
            </div>
          </div>
          <p className="text-sm text-slate-400 mb-1">{label}</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-bold text-white">{value}</h2>
            <span className="text-sm text-slate-400">{unit}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200/50 hover:shadow-md hover:border-primary transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-slate-50 rounded-lg text-primary">
          {icon}
        </div>
        {trend && (
          <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
            {trend}
          </span>
        )}
      </div>
      <p className="text-sm text-slate-500 mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <h2 className="text-3xl font-bold text-primary">{value}</h2>
        <span className="text-sm text-slate-500">{unit}</span>
      </div>
    </div>
  );
};
