import React from 'react';
import { CalendarEvent } from './CalendarEvent';
import type { PersonColor } from './CalendarEvent';
import type { Appointment } from '../../../services/data';

const TYPE_MAP: Record<Appointment['type'], 'consultation' | 'installation' | 'acceptance'> = {
  beratung:     'consultation',
  installation: 'installation',
  abnahme:      'acceptance',
};

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

interface Props {
  appointments: Appointment[];
  currentDate: Date;
  onSelect: (appointment: Appointment) => void;
  personColorMap?: Record<string, PersonColor>;
}

export const CalendarGrid: React.FC<Props> = ({ appointments, currentDate, onSelect, personColorMap }) => {
  const year  = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth  = new Date(year, month + 1, 0).getDate();
  // JS: 0=Su → convert to 0=Mo
  const firstDayJS   = new Date(year, month, 1).getDay();
  const startOffset  = (firstDayJS + 6) % 7;
  const totalCells   = Math.ceil((startOffset + daysInMonth) / 7) * 7;

  // Group appointments by day number (only current month)
  const byDay: Record<number, Appointment[]> = {};
  appointments.forEach((a) => {
    const d = new Date(a.starts_at);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate();
      (byDay[day] ??= []).push(a);
    }
  });

  const cells = Array.from({ length: totalCells }, (_, i) => {
    const dayNum = i - startOffset + 1;
    return { dayNum, inMonth: dayNum >= 1 && dayNum <= daysInMonth };
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col" style={{ minHeight: 600 }}>
      {/* Days Header */}
      <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
        {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day) => (
          <div key={day} className="py-3 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div
        className="flex-1 grid grid-cols-7 bg-slate-100 gap-px"
        style={{ gridTemplateRows: `repeat(${totalCells / 7}, minmax(0, 1fr))` }}
      >
        {cells.map(({ dayNum, inMonth }, i) => {
          const events = inMonth ? (byDay[dayNum] ?? []) : [];
          const displayNum = !inMonth
            ? dayNum <= 0
              ? new Date(year, month, dayNum).getDate()
              : new Date(year, month + 1, dayNum - daysInMonth).getDate()
            : dayNum;

          return (
            <div key={i} className={`bg-white p-2 flex flex-col min-h-[80px] ${!inMonth ? 'opacity-40' : ''}`}>
              <span className={`text-xs font-bold mb-1 ${inMonth ? 'text-primary' : 'text-slate-400'}`}>
                {displayNum}
              </span>
              {events.map((a) => (
                <CalendarEvent
                  key={a.id}
                  title={a.title}
                  time={formatTime(a.starts_at)}
                  type={TYPE_MAP[a.type]}
                  colorOverride={personColorMap?.[a.installer_id]}
                  onClick={() => onSelect(a)}
                />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};
