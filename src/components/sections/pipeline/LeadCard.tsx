import React from 'react';
import { MapPin, Sun, MoreVertical } from 'lucide-react';

export interface LeadCardProps {
  title: string;
  location: string;
  specs: string;
  price: string;
  date: string;
  statusColor?: string;
  statusText?: string;
  isClosed?: boolean;
}

export const LeadCard: React.FC<LeadCardProps> = ({
  title,
  location,
  specs,
  price,
  date,
  statusColor,
  statusText,
  isClosed,
}) => {
  return (
    <div
      className={`bg-white rounded-lg p-5 border border-slate-200 shadow-sm transition-all cursor-grab group ${
        isClosed ? 'opacity-70 cursor-default' : 'hover:shadow-md hover:border-secondary'
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <h4
          className={`font-bold text-primary group-hover:text-primary transition-colors ${
            isClosed ? 'line-through decoration-slate-400' : ''
          }`}
        >
          {title}
        </h4>
        <button className="text-slate-400 hover:text-primary transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-slate-500">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{location}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <Sun className="w-4 h-4" />
          <span className="text-sm">{specs}</span>
        </div>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
        <div className={`font-bold ${isClosed ? 'text-slate-400' : 'text-primary'}`}>
          {price}
        </div>
        <div
          className={`text-xs font-medium flex items-center gap-1 ${
            statusColor ? `text-${statusColor}` : 'text-slate-400'
          }`}
        >
          {statusText || date}
        </div>
      </div>
    </div>
  );
};
