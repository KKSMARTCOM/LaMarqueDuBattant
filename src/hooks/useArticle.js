// useArticle.js
// Hook personnalisé pour charger un article unique par id depuis articles.json
// Permet d'éviter la duplication de logique dans ProductQuickView, DetailsProduits, etc.

import { useEffect, useState } from 'react';
import fetchData from '../components/fetchData';

/**
 * useArticle : hook pour charger un article par id
 * @param {number|string} id - L'id de l'article à charger
 * @returns { article, loading, error, reload }
 */
export default function useArticle(id) {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadFlag, setReloadFlag] = useState(0);
  const reload = () => setReloadFlag(f => f + 1);

  useEffect(() => {
    if (!id) {
      setArticle(null);
      setLoading(false);
      setError(null);
      return;
    }
    let isMounted = true;
    setLoading(true);
    fetchData('/data/articles.json')
      .then(data => {
        if (isMounted) {
          const found = data.find(a => a.id === parseInt(id));
          setArticle(found || null);
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
  }, [id, reloadFlag]);

  return { article, loading, error, reload };
} 