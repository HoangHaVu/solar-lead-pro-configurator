import React from 'react';
import { User, Mail, Phone, MapPin } from 'lucide-react';

export const CustomerDataSection: React.FC = () => {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200/50 p-8">
      <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
        <User className="text-slate-400 w-5 h-5" />
        Kundendaten
      </h2>
      
      <div className="flex items-start gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-primary font-bold text-2xl">
          MM
        </div>
        <div>
          <h3 className="text-lg font-bold text-primary">Max Mustermann</h3>
          <p className="text-sm text-slate-500 font-medium">Privatkunde</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-primary">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">E-Mail</div>
            <a className="text-sm font-bold text-primary hover:underline" href="mailto:m.mustermann@example.com">m.mustermann@example.com</a>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-primary">
            <Phone className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Telefon</div>
            <a className="text-sm font-bold text-primary hover:underline" href="tel:+491234567890">+49 123 456 7890</a>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-primary shrink-0 mt-1">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Installationsort</div>
            <div className="text-sm font-bold text-primary leading-relaxed">Sonnenallee 42<br/>10115 Berlin<br/>Deutschland</div>
          </div>
        </div>
      </div>
    </section>
  );
};
