// useArticles.js
// Hook personnalisé pour charger la liste des articles (articles.json) avec gestion du cache, du loading et des erreurs
// Permet d'éviter la duplication de logique dans tous les composants qui utilisent les articles

import { useEffect, useState } from 'react';
import fetchData from '../components/fetchData';

/**
 * useArticles : hook pour charger tous les articles
 * @returns { articles, loading, error, reload }
 */
export default function useArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Permet de forcer le rechargement si besoin
  const [reloadFlag, setReloadFlag] = useState(0);
  const reload = () => setReloadFlag(f => f + 1);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchData('/data/articles.json')
      .then(data => {
        if (isMounted) {
          setArticles(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      });
    return () => { isMounted = false; };
  }, [reloadFlag]);

  return { articles, loading, error, reload };
} 