import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsKpiCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  isPrimary?: boolean;
  progress?: number;
  progressLabel?: string;
}

export const StatsKpiCard: React.FC<StatsKpiCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  isPrimary,
  progress,
  progressLabel,
}) => {
  if (isPrimary) {
    return (
      <div className="bg-primary rounded-xl p-8 shadow-md flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute -top-4 -right-4 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Icon className="w-32 h-32 text-white" />
        </div>
        <div className="relative z-10 flex justify-between items-start mb-6">
          <div>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{title}</p>
            <h3 className="text-4xl font-black text-white mt-1">{value}</h3>
          </div>
        </div>
        <div className="relative z-10 flex flex-col gap-2">
          {progress !== undefined && (
            <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
              <div className="bg-secondary h-full rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
            </div>
          )}
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{progressLabel}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200/50 flex flex-col justify-between hover:border-primary/20 transition-colors">
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</p>
          <h3 className="text-3xl font-black text-primary mt-1">{value}</h3>
        </div>
        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-secondary">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {trend && (
        <div className={`flex items-center gap-2 text-xs font-bold ${trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
          {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{trend} zum Vormonat</span>
        </div>
      )}
    </div>
  );
};
