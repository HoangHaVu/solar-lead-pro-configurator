import React from 'react';

interface KanbanColumnProps {
  title: string;
  count?: number;
  color: string;
  children: React.ReactNode;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, count, color, children }) => {
  return (
    <div className="flex-shrink-0 w-[320px] flex flex-col max-h-full">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${color}`}></div>
          <h3 className="font-bold text-primary">{title}</h3>
          {count !== undefined && (
            <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">
              {count}
            </span>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 pb-10">
        {children}
      </div>
    </div>
  );
};
