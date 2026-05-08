import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, FolderOpen, Zap, Euro, CheckCircle } from 'lucide-react';
import { InstallerSideNavBar } from '../components/layout/InstallerSideNavBar';
import { InstallerTopAppBar } from '../components/layout/InstallerTopAppBar';
import { KanbanColumn } from '../components/sections/pipeline/KanbanColumn';
import { useInstallerProjects } from '../hooks/useInstallerProjects';
import type { Project } from '../services/data';

const KANBAN_COLUMNS: { key: Project['status']; label: string; color: string; done?: boolean }[] = [
  { key: 'planung',      label: 'In Planung',      color: 'bg-indigo-400' },
  { key: 'genehmigung',  label: 'Genehmigung',      color: 'bg-amber-400' },
  { key: 'installation', label: 'In Installation',  color: 'bg-purple-400' },
  { key: 'inbetrieb',   label: 'Abgeschlossen',    color: 'bg-green-400',  done: true },
];

const ProjectKanbanCard: React.FC<{
  project: Project;
  onClick: () => void;
  onDragStart: (e: React.DragEvent) => void;
  done?: boolean;
}> = ({ project, onClick, onDragStart, done }) => {
  const name = project.customer?.full_name
    ?? (project.lead ? `${project.lead.first_name} ${project.lead.last_name}` : null)
    ?? 'Unbekannter Kunde';

  return (
    <div
      draggable={!done}
      onDragStart={!done ? onDragStart : undefined}
      onClick={onClick}
      className={`rounded-xl border p-4 shadow-sm transition-all duration-200 group cursor-pointer ${
        done
          ? 'bg-green-50/60 border-green-100 opacity-75 hover:opacity-100'
          : 'bg-white border-slate-200 hover:shadow-md hover:border-primary/30 cursor-grab active:cursor-grabbing'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <p className="font-bold text-primary text-sm leading-tight truncate">{name}</p>
        {done && <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />}
      </div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
        #{project.id.slice(0, 8).toUpperCase()}
      </p>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className={`rounded-lg p-2 flex items-center gap-1.5 ${done ? 'bg-green-100/50' : 'bg-slate-50'}`}>
          <Zap className="w-3 h-3 text-slate-400 shrink-0" />
          <p className="text-xs font-bold text-primary truncate">
            {project.kwp != null ? `${project.kwp} kWp` : '—'}
          </p>
        </div>
        <div className={`rounded-lg p-2 flex items-center gap-1.5 ${done ? 'bg-green-100/50' : 'bg-slate-50'}`}>
          <Euro className="w-3 h-3 text-slate-400 shrink-0" />
          <p className="text-xs font-bold text-primary truncate">
            {project.investment != null ? `${project.investment.toLocaleString('de-DE')} €` : '—'}
          </p>
        </div>
      </div>

      <p className="text-xs text-slate-400 text-right font-medium group-hover:text-primary transition-colors">
        Details →
      </p>
    </div>
  );
};

export const ProjectsPage: React.FC = () => {
  const { projects, isLoading, moveProject } = useInstallerProjects();
  const navigate = useNavigate();

  const boardProjects = projects.filter(p => p.status !== 'angebot');
  const activeCount = boardProjects.filter(p => p.status !== 'inbetrieb').length;
  const doneCount = boardProjects.filter(p => p.status === 'inbetrieb').length;

  function handleCardDrop(projectId: string, newStatus: string) {
    moveProject(projectId, newStatus as Project['status']);
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <InstallerSideNavBar />
      <div className="flex flex-col min-h-screen lg:pl-64">
        <InstallerTopAppBar />
        <main className="flex-1 w-full px-4 md:px-8 py-8 flex flex-col">

          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 max-w-[1400px] mx-auto w-full">
            <div>
              <h1 className="text-xl md:text-3xl font-black text-primary">Projekte</h1>
              <p className="text-slate-500 mt-1 text-sm">
                {isLoading ? '…' : `${activeCount} laufend · ${doneCount} abgeschlossen`}
              </p>
            </div>
            <div className="flex gap-3">
              <div className="bg-white rounded-xl border border-slate-200 px-5 py-3 text-center shadow-sm min-w-[80px]">
                <p className="text-2xl font-black text-primary">{isLoading ? '—' : activeCount}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Laufend</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 px-5 py-3 text-center shadow-sm min-w-[80px]">
                <p className="text-2xl font-black text-green-600">{isLoading ? '—' : doneCount}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fertig</p>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-24">
              <Sun className="w-10 h-10 text-secondary animate-spin" />
            </div>
          ) : boardProjects.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-16 text-center max-w-[600px] mx-auto mt-8">
              <FolderOpen className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="font-bold text-slate-400">Noch keine Projekte vorhanden.</p>
              <p className="text-sm text-slate-400 mt-1">
                Neue Projekte entstehen wenn du einen Lead als gewonnen markierst.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-5 min-w-max">
                {KANBAN_COLUMNS.map(col => {
                  const cards = boardProjects.filter(p => p.status === col.key);
                  return (
                    <KanbanColumn
                      key={col.key}
                      title={col.label}
                      count={cards.length}
                      color={col.color}
                      columnKey={col.key}
                      onCardDrop={col.done ? (_id, _s) => {} : handleCardDrop}
                    >
                      {cards.length === 0 ? (
                        <div className={`flex items-center justify-center h-24 text-sm font-medium border-2 border-dashed rounded-xl ${
                          col.done
                            ? 'border-green-200 text-green-300'
                            : 'border-slate-200 text-slate-300'
                        }`}>
                          {col.done ? 'Noch keine abgeschlossenen Projekte' : 'Keine Projekte'}
                        </div>
                      ) : (
                        cards.map(project => (
                          <ProjectKanbanCard
                            key={project.id}
                            project={project}
                            done={col.done}
                            onClick={() => navigate(`/project-details/${project.id}`)}
                            onDragStart={(e) => {
                              e.dataTransfer.setData('leadId', project.id);
                              e.dataTransfer.effectAllowed = 'move';
                            }}
                          />
                        ))
                      )}
                    </KanbanColumn>
                  );
                })}
              </div>
            </div>
          )}
        </main>

        <footer className="w-full border-t border-slate-200 mt-auto py-12 px-8 flex flex-col md:flex-row justify-between items-center max-w-[1400px] mx-auto gap-4 text-xs text-slate-400 font-medium uppercase tracking-wider">
          <p>© 2026 SolarKonfigurator. 100% DSGVO-konform.</p>
          <ul className="flex flex-wrap items-center gap-6">
            <li><Link className="hover:text-primary transition-colors" to="/impressum">Impressum</Link></li>
            <li><Link className="hover:text-primary transition-colors" to="/datenschutz">Datenschutz</Link></li>
          </ul>
        </footer>
      </div>
    </div>
  );
};
