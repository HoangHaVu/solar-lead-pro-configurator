import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchCustomerProject, type Project } from '../services/data';

export function useProject() {
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { setIsLoading(false); return; }
    fetchCustomerProject(user.id)
      .then(setProject)
      .catch((e: Error) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, [user?.id]);

  return { project, isLoading, error };
}
