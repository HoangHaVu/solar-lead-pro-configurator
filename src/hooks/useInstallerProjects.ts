import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchInstallerProjects, updateProjectStatus, type Project } from '../services/data';

export function useInstallerProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { setIsLoading(false); return; }
    fetchInstallerProjects(user.id)
      .then(setProjects)
      .catch((e: Error) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, [user?.id]);

  async function moveProject(projectId: string, newStatus: Project['status']) {
    const snapshot = projects;
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status: newStatus } : p));
    try {
      await updateProjectStatus(projectId, newStatus);
    } catch (e) {
      setProjects(snapshot);
      setError((e as Error).message);
    }
  }

  return { projects, isLoading, error, moveProject };
}
