import { useEffect, useState } from 'react';

import { fetchDesigns, searchDesignsApi } from '@/lib/api';
import type { Design } from '@/lib/types';

export function useDesignSearch(limit = 10) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Design[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    let stale = false;
    setSearching(true);

    const promise = query
      ? searchDesignsApi(query)
      : fetchDesigns();

    promise
      .then((r) => {
        if (!stale) setResults(limit ? r.slice(0, limit) : r);
      })
      .finally(() => {
        if (!stale) setSearching(false);
      });

    return () => { stale = true; };
  }, [query, limit]);

  return { query, setQuery, results, searching };
}
