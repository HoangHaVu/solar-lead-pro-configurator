import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Sun, MoreVertical, Flame, Zap, Snowflake } from 'lucide-react';
import { computeLeadScore, getScoreResult } from '../../../utils/leadScore';

export type OfferStatus = 'created' | 'sent' | 'viewed' | 'accepted' | 'rejected';

const OFFER_BADGE: Record<OfferStatus, { label: string; classes: string }> = {
  created:  { label: 'Angebot erstellt',  classes: 'bg-slate-100 text-slate-500' },
  sent:     { label: 'Angebot versendet', classes: 'bg-blue-50 text-blue-600' },
  viewed:   { label: 'Angebot geöffnet',  classes: 'bg-purple-50 text-purple-600' },
  accepted: { label: 'Angenommen ✓',     classes: 'bg-green-50 text-green-700' },
  rejected: { label: 'Abgelehnt',         classes: 'bg-red-50 text-red-600' },
};

export interface LeadCardProps {
  id?: string;
  title: string;
  location: string;
  specs: string;
  price: string;
  date: string;
  createdAt?: string;
  statusColor?: string;
  statusText?: string;
  isClosed?: boolean;
  kwp?: number | null;
  investment?: number | null;
  zip?: string | null;
  score?: number | null;
  offerStatus?: OfferStatus;
  showClosingActions?: boolean;
  onWon?: () => void;
  onLost?: () => void;
}

function getSlaBadge(createdAt: string): { label: string; classes: string } | null {
  const hours = (Date.now() - new Date(createdAt).getTime()) / 3_600_000;
  if (hours < 2)   return null;
  if (hours < 24)  return { label: `${Math.floor(hours)}h ohne Reaktion`,   classes: 'bg-amber-50 text-amber-700' };
  if (hours < 48)  return { label: `${Math.floor(hours / 24)}T ohne Reaktion`, classes: 'bg-orange-50 text-orange-700' };
  return           { label: `⚠ ${Math.floor(hours / 24)}T — SLA überfällig`, classes: 'bg-red-50 text-red-700' };
}

const TIER_ICON = {
  heiss: Flame,
  warm: Zap,
  kalt: Snowflake,
};

export const LeadCard: React.FC<LeadCardProps> = ({
  id,
  title,
  location,
  specs,
  price,
  date,
  statusColor,
  statusText,
  isClosed,
  kwp,
  investment,
  zip,
  score: scoreProp,
  offerStatus,
  createdAt,
  showClosingActions,
  onWon,
  onLost,
}) => {
  const slaBadge = createdAt ? getSlaBadge(createdAt) : null;
  const navigate = useNavigate();
  const rawScore = scoreProp ?? computeLeadScore({ kwp, investment, zip });
  const { score, tier, label, color, bgColor } = getScoreResult(rawScore);
  const TierIcon = TIER_ICON[tier];

  return (
    <div
      draggable={!!id}
      onDragStart={(e) => {
        if (id) {
          e.dataTransfer.setData('leadId', id);
          e.dataTransfer.effectAllowed = 'move';
        }
      }}
      onClick={() => id && navigate(`/lead-details/${id}`)}
      className={`bg-white rounded-lg p-5 border border-slate-200 shadow-sm transition-all group ${
        id ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
      } ${isClosed ? 'opacity-70' : 'hover:shadow-md hover:border-secondary'}`}
    >
      <div className="flex justify-between items-start mb-3">
        <h4
          className={`font-bold text-primary group-hover:text-primary transition-colors ${
            isClosed ? 'line-through decoration-slate-400' : ''
          }`}
        >
          {title}
        </h4>
        <div className="flex items-center gap-1.5">
          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${bgColor} ${color}`}>
            <TierIcon className="w-3 h-3" />
            {label} {score}
          </span>
          <button
            className="text-slate-400 hover:text-primary transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
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
      <div className="flex flex-wrap gap-1.5 mb-2">
        {offerStatus && offerStatus !== 'created' && (
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${OFFER_BADGE[offerStatus].classes}`}>
            {OFFER_BADGE[offerStatus].label}
          </span>
        )}
        {slaBadge && (
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${slaBadge.classes}`}>
            {slaBadge.label}
          </span>
        )}
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

      {showClosingActions && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={onWon}
            className="flex-1 flex items-center justify-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 font-bold text-xs py-2 px-3 rounded-lg border border-green-200 transition-colors"
          >
            <span className="text-base">🎉</span>
            Auftrag gewonnen
          </button>
          <button
            onClick={onLost}
            className="flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 font-bold text-xs py-2 px-3 rounded-lg border border-slate-200 transition-colors"
          >
            Kein Auftrag
          </button>
        </div>
      )}
    </div>
  );
};
