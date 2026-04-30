import React from 'react';
import { Phone, Mail, Clock, ShieldCheck } from 'lucide-react';

export const ChatSidebar: React.FC = () => {
  return (
    <div className="lg:col-span-4 flex flex-col gap-6">
      <div className="bg-white rounded-xl shadow-sm p-8 border border-slate-200/50 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
        <div className="flex flex-col items-center text-center mt-4">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md mb-4 relative">
            <img
              alt="Installateur Portrait"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAySVEGNsHf2LW0MDYJHHsqPuE_N5yxtsHCgT9FFNRvEUWQN-WaNRweMf8D8KZpAt0quyaRZPydnC2D6cqqjWo1M4VOfzwyjXUKdglptLpKQhlkauQWD2Z2kzNKW3Dz6MsCuiTQNthTwCRiZgPkMXdpm8smmoq420dkSi4Ssl0IaYQQVVU8u7zsi6HFqtdD7eRSX-v3bXSZs_dJOWQHWLRY8QZcNMWj4UZce78vhwUmWdsPxzaayTud9RXZcdtGPyQkYchpYAtbVrk"
            />
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <h3 className="text-xl font-bold text-primary">Lukas Weber</h3>
          <p className="text-sm font-bold text-secondary mt-1">Projektleiter Installation</p>
          <p className="text-xs text-slate-500 mt-4 max-w-[200px] leading-relaxed">
            Dein direkter Ansprechpartner für alle technischen und terminlichen Fragen vor Ort.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-3 text-slate-600">
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-primary">
              <Phone className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">+49 89 123 456 78</span>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-primary">
              <Mail className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">l.weber@solar-experten.de</span>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-primary">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">Mo - Fr, 08:00 - 17:00</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200/50">
        <div className="flex items-center gap-3 mb-2 text-primary">
          <ShieldCheck className="w-5 h-5 text-secondary" />
          <h4 className="text-sm font-bold">Sichere Kommunikation</h4>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Dieser Chat ist Ende-zu-Ende verschlüsselt und 100% DSGVO-konform. Es werden keine Daten an Dritte weitergegeben.
        </p>
      </div>
    </div>
  );
};
