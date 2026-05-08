import React from 'react';

export interface PersonColor {
  bg: string; border: string; text: string; dot: string;
}

interface CalendarEventProps {
  title: string;
  time: string;
  type: 'consultation' | 'installation' | 'acceptance';
  colorOverride?: PersonColor;
  span?: 'start' | 'end' | 'middle' | 'single';
  onClick?: () => void;
}

export const CalendarEvent: React.FC<CalendarEventProps> = ({ title, time, type, colorOverride, span = 'single', onClick }) => {
  const TypeStyles = {
    consultation: 'bg-blue-50 border-blue-200 text-blue-700',
    installation: 'bg-orange-50 border-orange-200 text-orange-700',
    acceptance: 'bg-green-50 border-green-200 text-green-700',
  };

  const SpanStyles = {
    single: 'rounded-lg border-l-4 mx-1',
    start: 'rounded-l-lg border-l-4 ml-1',
    end: 'rounded-r-lg mr-1',
    middle: '',
  };

  const DotStyles = {
    consultation: 'bg-blue-500',
    installation: 'bg-orange-500',
    acceptance: 'bg-green-500',
  };

  const colorClass = colorOverride
    ? `${colorOverride.bg} ${colorOverride.border} ${colorOverride.text}`
    : TypeStyles[type];
  const dotClass = colorOverride ? colorOverride.dot : DotStyles[type];

  return (
    <div onClick={onClick} className={`mt-1 px-2 py-1.5 text-[10px] font-bold cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all group ${colorClass} ${SpanStyles[span]}`}>
      <div className="flex items-center gap-1.5 truncate">
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClass}`}></span>
        <span className="truncate">{title}</span>
      </div>
      <div className="opacity-60 truncate pl-3">{time}</div>
    </div>
  );
};
