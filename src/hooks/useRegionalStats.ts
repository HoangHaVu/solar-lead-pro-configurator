import { useState, useEffect } from 'react';
import { fetchRegionalLeadCount, fetchTotalLeadCount } from '../services/stats';

export function useRegionalStats(zip: string) {
  const [regionalCount, setRegionalCount] = useState<number | null>(null);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  useEffect(() => {
    fetchTotalLeadCount().then(setTotalCount).catch(() => {});
  }, []);

  useEffect(() => {
    if (!zip || zip.length < 2) return;
    setRegionalCount(null);
    fetchRegionalLeadCount(zip).then(setRegionalCount).catch(() => {});
  }, [zip]);

  return { regionalCount, totalCount };
}
