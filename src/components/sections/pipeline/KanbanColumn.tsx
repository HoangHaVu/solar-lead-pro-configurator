import React, { useState } from 'react';

interface KanbanColumnProps {
  title: string;
  count?: number;
  color: string;
  columnKey: string;
  onCardDrop: (itemId: string, newStatus: string) => void;
  children: React.ReactNode;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  count,
  color,
  columnKey,
  onCardDrop,
  children,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <div
      className={`flex-shrink-0 w-[320px] flex flex-col max-h-full rounded-xl transition-all duration-150 ${
        isDragOver ? 'ring-2 ring-secondary scale-[1.01]' : ''
      }`}
      onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }}
      onDragEnter={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsDragOver(false);
        }
      }}
      onDrop={(e) => {
        e.preventDefault();
        const leadId = e.dataTransfer.getData('leadId');
        if (leadId) onCardDrop(leadId, columnKey);
        setIsDragOver(false);
      }}
    >
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${color}`} />
          <h3 className="font-bold text-primary">{title}</h3>
          {count !== undefined && (
            <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">
              {count}
            </span>
          )}
        </div>
      </div>
      <div className={`flex-1 overflow-y-auto pr-2 space-y-4 pb-10 min-h-[80px] rounded-lg transition-colors ${
        isDragOver ? 'bg-secondary/10' : ''
      }`}>
        {children}
      </div>
    </div>
  );
};
