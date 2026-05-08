import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, User, Mail, Phone, MapPin, Zap, Euro, FolderOpen, Loader, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { createManualProject } from '../../../services/data';
import type { Project } from '../../../services/data';

interface Props {
  onClose: () => void;
}

const STATUS_OPTIONS: { value: Project['status']; label: string }[] = [
  { value: 'planung',     label: 'In Planung' },
  { value: 'genehmigung', label: 'Genehmigung läuft' },
  { value: 'installation',label: 'In Installation' },
];

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
        {label}{required && <span className="text-secondary ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = 'w-full bg-slate-50 border border-slate-200 text-primary rounded-xl pl-9 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-colors placeholder:text-slate-300';

export const NewProjectModal: React.FC<Props> = ({ onClose }) => {
  const { user }   = useAuth();
  const navigate   = useNavigate();

  const [firstName,  setFirstName]  = useState('');
  const [lastName,   setLastName]   = useState('');
  const [email,      setEmail]      = useState('');
  const [phone,      setPhone]      = useState('');
  const [zip,        setZip]        = useState('');
  const [kwp,        setKwp]        = useState('');
  const [investment, setInvestment] = useState('');
  const [status,     setStatus]     = useState<Project['status']>('planung');
  const [saving,     setSaving]     = useState(false);
  const [error,      setError]      = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError('');
    try {
      const projectId = await createManualProject({
        installerId: user.id,
        firstName:   firstName.trim(),
        lastName:    lastName.trim(),
        email:       email.trim(),
        phone:       phone.trim()      || undefined,
        zip:         zip.trim()        || undefined,
        kwp:         kwp    ? parseFloat(kwp)    : undefined,
        investment:  investment ? parseFloat(investment) : undefined,
        status,
      });
      navigate(`/project-details/${projectId}`);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Etwas ist schiefgelaufen.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-primary/60 backdrop-blur-sm" />

      {/* Card */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center">
              <FolderOpen className="w-4.5 h-4.5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-black text-primary leading-tight">Neues Projekt</h2>
              <p className="text-xs text-slate-400">Manueller Eintrag — ohne Konfigurator-Lead</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-primary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-7 py-6 space-y-6">

          {/* Kundendaten */}
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Kundendaten</p>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Vorname" required>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input className={inputCls} placeholder="Max" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                  </div>
                </Field>
                <Field label="Nachname" required>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input className={inputCls} placeholder="Mustermann" value={lastName} onChange={e => setLastName(e.target.value)} required />
                  </div>
                </Field>
              </div>

              <Field label="E-Mail" required>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input className={inputCls} type="email" placeholder="max@beispiel.de" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Telefon">
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input className={inputCls} type="tel" placeholder="+49 171 …" value={phone} onChange={e => setPhone(e.target.value)} />
                  </div>
                </Field>
                <Field label="PLZ">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input className={inputCls} placeholder="80331" maxLength={5} value={zip} onChange={e => setZip(e.target.value)} />
                  </div>
                </Field>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-100" />

          {/* Anlagendaten */}
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
              Anlage <span className="normal-case tracking-normal font-normal">(optional — kann später ergänzt werden)</span>
            </p>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Anlagengröße (kWp)">
                  <div className="relative">
                    <Zap className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input className={inputCls} type="number" min="0" step="0.1" placeholder="10.5" value={kwp} onChange={e => setKwp(e.target.value)} />
                  </div>
                </Field>
                <Field label="Investition (€)">
                  <div className="relative">
                    <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input className={inputCls} type="number" min="0" step="100" placeholder="18000" value={investment} onChange={e => setInvestment(e.target.value)} />
                  </div>
                </Field>
              </div>

              <Field label="Projektstatus">
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as Project['status'])}
                  className="w-full bg-slate-50 border border-slate-200 text-primary rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none transition-colors"
                >
                  {STATUS_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </Field>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-slate-200 text-slate-500 font-bold py-3 rounded-xl hover:bg-slate-50 transition-colors text-sm"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-secondary text-primary font-black py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? <Loader className="w-4 h-4 animate-spin" /> : <FolderOpen className="w-4 h-4" />}
              {saving ? 'Wird erstellt…' : 'Projekt erstellen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
