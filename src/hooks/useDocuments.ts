import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchCustomerDocuments, type DocumentItem } from '../services/data';

export function useDocuments() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { setIsLoading(false); return; }
    fetchCustomerDocuments(user.id)
      .then(setDocuments)
      .catch((e: Error) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, [user?.id]);

  return { documents, isLoading, error };
}
