import React from 'react';
import { Phone, Mail } from 'lucide-react';

interface Installer {
  full_name: string;
  phone: string | null;
}

interface Props {
  installer: Installer | null;
}

function initials(name: string): string {
  return name.split(' ').map((p) => p[0]).join('').toUpperCase().slice(0, 2);
}

export const ContactCard: React.FC<Props> = ({ installer }) => {
  const name  = installer?.full_name ?? 'Installateur';
  const phone = installer?.phone ?? null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200/50 p-8 flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-slate-100 to-transparent z-0"></div>
      <h3 className="text-lg font-bold text-primary mb-6 relative z-10">Dein Ansprechpartner</h3>
      <div className="flex flex-col items-center text-center mb-6 relative z-10">
        <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center border-4 border-white shadow-md mb-4">
          <span className="text-2xl font-black text-secondary">{initials(name)}</span>
        </div>
        <h4 className="text-lg font-bold text-primary">{name}</h4>
        <p className="text-sm text-slate-500">Projektleiter Installation</p>
      </div>
      <div className="flex flex-col gap-3 relative z-10 flex-1 justify-end">
        {phone && (
          <a
            className="flex items-center justify-center gap-2 w-full border border-slate-200 text-primary font-bold py-3 rounded-lg hover:bg-slate-50 transition-colors"
            href={`tel:${phone}`}
          >
            <Phone className="w-4 h-4" />
            {phone}
          </a>
        )}
        <button className="flex items-center justify-center gap-2 w-full bg-secondary text-primary font-bold py-3 rounded-lg hover:bg-secondary/90 transition-colors">
          <Mail className="w-4 h-4" />
          Nachricht schreiben
        </button>
      </div>
    </div>
  );
};
