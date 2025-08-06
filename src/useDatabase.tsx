import { useState, useEffect } from 'react';

interface DatabaseData {
  common: any;
  home_page: any;
  pages: any;
  global_assets: any;
  meta_data: any;
}

export const useDatabase = () => {
  const [data, setData] = useState<DatabaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDatabase = async () => {
      try {
        const response = await fetch('/database.json');
        if (!response.ok) {
          throw new Error('Impossible de charger la base de données');
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    loadDatabase();
  }, []);

  return { data, loading, error };
};

