import React from 'react';
import { Phone, Mail } from 'lucide-react';

export const ContactCard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200/50 p-8 flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-slate-100 to-transparent z-0"></div>
      <h3 className="text-lg font-bold text-primary mb-6 relative z-10">Dein Ansprechpartner</h3>
      <div className="flex flex-col items-center text-center mb-6 relative z-10">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md mb-4">
          <img
            alt="Foto Ansprechpartner"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAySVEGNsHf2LW0MDYJHHsqPuE_N5yxtsHCgT9FFNRvEUWQN-WaNRweMf8D8KZpAt0quyaRZPydnC2D6cqqjWo1M4VOfzwyjXUKdglptLpKQhlkauQWD2Z2kzNKW3Dz6MsCuiTQNthTwCRiZgPkMXdpm8smmoq420dkSi4Ssl0IaYQQVVU8u7zsi6HFqtdD7eRSX-v3bXSZs_dJOWQHWLRY8QZcNMWj4UZce78vhwUmWdsPxzaayTud9RXZcdtGPyQkYchpYAtbVrk"
          />
        </div>
        <h4 className="text-lg font-bold text-primary">Lukas Weber</h4>
        <p className="text-sm text-slate-500">Projektleiter Installation</p>
      </div>
      <div className="flex flex-col gap-3 relative z-10 flex-1 justify-end">
        <a
          className="flex items-center justify-center gap-2 w-full border border-slate-200 text-primary font-bold py-3 rounded-lg hover:bg-slate-50 transition-colors"
          href="tel:+49123456789"
        >
          <Phone className="w-4 h-4" />
          0800 123 456 78
        </a>
        <button className="flex items-center justify-center gap-2 w-full bg-secondary text-primary font-bold py-3 rounded-lg hover:bg-secondary/90 transition-colors">
          <Mail className="w-4 h-4" />
          Nachricht schreiben
        </button>
      </div>
    </div>
  );
};
