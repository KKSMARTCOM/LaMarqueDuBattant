/**
 * useArticle.js
 * 
 * Description :
 * Hook personnalisé pour récupérer les données d'un article spécifique à partir de son ID.
 * Gère le chargement asynchrone, les erreurs et permet le rechargement des données.
 *
 * Fonctionnalités principales :
 * - Récupération d'un article par son ID depuis le fichier articles.json
 * - Gestion des états de chargement et d'erreur
 * - Possibilité de forcer le rechargement des données
 * - Annulation des requêtes en cas de démontage du composant
 *
 * @param {string|number} id - L'identifiant unique de l'article à récupérer
 * 
 * @returns {Object} Un objet contenant :
 *   - article {Object|null} : Les données de l'article ou null si non chargé
 *   - loading {boolean} : État de chargement
 *   - error {Error|null} : Erreur éventuelle
 *   - reload {Function} : Fonction pour forcer le rechargement
 *
 * Gestion des erreurs :
 * - Si l'ID est invalide, retourne { article: null, loading: false, error: null }
 * - En cas d'erreur de chargement, stocke l'erreur dans l'état
 *
 * Utilisation typique :
 * ```jsx
 * const { article, loading, error, reload } = useArticle(articleId);
 * 
 * if (loading) return <div>Chargement...</div>;
 * if (error) return <div>Erreur : {error.message}</div>;
 * if (!article) return <div>Article non trouvé</div>;
 * 
 * return <div>{article.name}</div>;
 * ```
 */

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