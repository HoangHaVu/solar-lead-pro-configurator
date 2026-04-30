import React from 'react';
import { FileText, Download, Clock, CheckCircle, Zap, ShieldCheck } from 'lucide-react';

interface DocumentRowProps {
  title: string;
  meta: string;
  status: 'signed' | 'pending' | 'received';
  statusText: string;
  type: 'pdf' | 'bolt' | 'verified' | 'premium';
  isDownloadable: boolean;
}

export const DocumentRow: React.FC<DocumentRowProps> = ({ title, meta, status, statusText, type, isDownloadable }) => {
  const IconMap = {
    pdf: <FileText className="w-5 h-5" />,
    bolt: <Zap className="w-5 h-5" />,
    verified: <CheckCircle className="w-5 h-5" />,
    premium: <ShieldCheck className="w-5 h-5" />,
  };

  const StatusStyle = {
    signed: 'bg-blue-50 text-blue-700 border-blue-100',
    pending: 'bg-orange-50 text-orange-700 border-orange-100',
    received: 'bg-green-50 text-green-700 border-green-100',
  };

  const StatusDot = {
    signed: 'bg-blue-500',
    pending: 'bg-orange-500',
    received: 'bg-green-500',
  };

  return (
    <div className="group grid grid-cols-1 md:grid-cols-12 gap-4 p-6 items-center hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0">
      <div className="col-span-1 md:col-span-6 lg:col-span-7 flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
          {IconMap[type]}
        </div>
        <div>
          <h3 className="text-sm font-bold text-primary">{title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{meta}</p>
        </div>
      </div>
      <div className="col-span-1 md:col-span-4 lg:col-span-3 flex items-center">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${StatusStyle[status]}`}>
          <span className={`w-1.5 h-1.5 rounded-full mr-2 ${StatusDot[status]} ${status === 'pending' ? 'animate-pulse' : ''}`}></span>
          {statusText}
        </span>
      </div>
      <div className="col-span-1 md:col-span-2 flex md:justify-end">
        <button
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 w-full md:w-auto justify-center text-sm font-bold ${
            isDownloadable
              ? 'text-primary border border-slate-200 hover:border-primary hover:bg-slate-50'
              : 'text-slate-300 border border-slate-100 cursor-not-allowed'
          }`}
          disabled={!isDownloadable}
        >
          <Download className="w-4 h-4" />
          <span className="md:hidden">Herunterladen</span>
        </button>
      </div>
    </div>
  );
};
