import React from 'react';
import { Calendar, Sun, Clock } from 'lucide-react';
import type { Project } from '../../../services/data';

const PHASE_LABELS: Record<string, string> = {
  angebot:      'Phase: Angebot erstellt',
  planung:      'Phase: Planung aktiv',
  genehmigung:  'Phase: Genehmigung läuft',
  installation: 'Phase: Installation aktiv',
  inbetrieb:    'Phase: In Betrieb',
};

const PHASE_DESCRIPTIONS: Record<string, string> = {
  angebot:
    'Wir haben dir ein maßgeschneidertes Angebot erstellt. Bitte prüfe es und melde dich bei Fragen.',
  planung:
    'Unsere Ingenieure prüfen die statischen Gegebenheiten deines Daches und erstellen die finalen String-Pläne für die Solarmodule.',
  genehmigung:
    'Die Netzanmeldung und Genehmigungsunterlagen wurden eingereicht. Wir warten auf die Bestätigung des Netzbetreibers.',
  installation:
    'Deine Solaranlage wird derzeit installiert. Unsere Techniker sind vor Ort und halten dich auf dem Laufenden.',
  inbetrieb:
    'Deine Solaranlage ist vollständig installiert und in Betrieb. Herzlichen Glückwunsch!',
};

interface Props {
  project: Project;
}

export const ProjectSpecsSection: React.FC<Props> = ({ project }) => {
  const phaseLabel = PHASE_LABELS[project.status] ?? 'Status unbekannt';
  const phaseDesc  = PHASE_DESCRIPTIONS[project.status] ?? '';

  return (
    <div className="lg:col-span-2 flex flex-col gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/50 p-8 flex-1">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
            <Clock className="text-secondary w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-primary mb-2">{phaseLabel}</h4>
            <p className="text-slate-600 leading-relaxed">{phaseDesc}</p>
          </div>
        </div>
        {project.notes && (
          <div className="bg-slate-50 p-6 rounded-lg border border-slate-200/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="text-primary w-6 h-6" />
              <div>
                <p className="text-sm text-slate-500">Notiz vom Installateur</p>
                <p className="text-base text-primary font-bold">{project.notes}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/50 p-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
            <Sun className="text-primary w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Anlagengröße</p>
            <p className="text-lg text-primary font-bold">
              {project.kwp != null ? `${project.kwp} kWp` : '—'}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/50 p-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
            <Calendar className="text-primary w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Amortisation</p>
            <p className="text-lg text-primary font-bold">
              {project.amortization != null ? `${project.amortization} Jahre` : '—'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
