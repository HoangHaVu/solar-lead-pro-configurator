import React from 'react';
import { CalendarEvent } from './CalendarEvent';

export const CalendarGrid: React.FC = () => {
  const days = Array.from({ length: 35 }, (_, i) => i - 5); // Simple mock grid

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[700px]">
      {/* Days Header */}
      <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
        {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day) => (
          <div key={day} className="py-3 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-5 bg-slate-100 gap-px">
        {days.map((dayNum, i) => {
          const isCurrentMonth = dayNum > 0 && dayNum <= 31;
          const displayNum = dayNum <= 0 ? 30 + dayNum : dayNum > 31 ? dayNum - 31 : dayNum;

          return (
            <div key={i} className={`bg-white p-2 flex flex-col min-h-0 ${!isCurrentMonth ? 'opacity-40' : ''}`}>
              <span className={`text-xs font-bold mb-1 ${isCurrentMonth ? 'text-primary' : 'text-slate-400'}`}>
                {displayNum}
              </span>
              
              {/* Mock Events */}
              {dayNum === 3 && (
                <CalendarEvent title="Familie Weber" time="10:00 - Beratung" type="consultation" />
              )}
              
              {dayNum === 5 && (
                <CalendarEvent title="Müller GmbH" time="Tag 1" type="installation" span="start" />
              )}
              
              {dayNum === 6 && (
                <CalendarEvent title="Müller GmbH" time="Tag 2" type="installation" span="end" />
              )}

              {dayNum === 11 && (
                <CalendarEvent title="Schulz EFH" time="14:00 - Abnahme" type="acceptance" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
