import React from 'react';
import { User, Mail, Phone, MapPin } from 'lucide-react';

interface Customer {
  full_name: string;
  phone: string | null;
  zip: string | null;
}

interface Props {
  customer: Customer;
  email?: string;
}

function initials(name: string): string {
  return name.split(' ').map((p) => p[0]).join('').toUpperCase().slice(0, 2);
}

export const CustomerDataSection: React.FC<Props> = ({ customer, email }) => {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200/50 p-8">
      <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
        <User className="text-slate-400 w-5 h-5" />
        Kundendaten
      </h2>

      <div className="flex items-start gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-primary font-bold text-2xl">
          {initials(customer.full_name)}
        </div>
        <div>
          <h3 className="text-lg font-bold text-primary">{customer.full_name}</h3>
          <p className="text-sm text-slate-500 font-medium">Privatkunde</p>
        </div>
      </div>

      <div className="space-y-6">
        {email && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-primary">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">E-Mail</div>
              <a className="text-sm font-bold text-primary hover:underline" href={`mailto:${email}`}>{email}</a>
            </div>
          </div>
        )}

        {customer.phone && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-primary">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Telefon</div>
              <a className="text-sm font-bold text-primary hover:underline" href={`tel:${customer.phone}`}>{customer.phone}</a>
            </div>
          </div>
        )}

        {customer.zip && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-primary shrink-0 mt-1">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PLZ / Region</div>
              <div className="text-sm font-bold text-primary">{customer.zip}</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
