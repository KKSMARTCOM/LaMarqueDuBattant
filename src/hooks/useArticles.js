/**
 * useArticles.js
 * 
 * Description :
 * Hook personnalisé pour charger et gérer la liste des articles depuis le fichier articles.json.
 * Fournit une interface simple pour accéder aux articles avec gestion du chargement et des erreurs.
 *
 * Fonctionnalités principales :
 * - Chargement asynchrone des articles depuis le fichier JSON
 * - Gestion des états de chargement et d'erreur
 * - Possibilité de forcer un rechargement des données
 * - Nettoyage automatique des abonnements
 *
 * Valeur de retour (objet) :
 * - articles {Array} : Tableau des articles chargés (vide par défaut)
 * - loading {boolean} : État de chargement (true pendant le chargement)
 * - error {Error|null} : Erreur éventuelle lors du chargement
 * - reload {Function} : Fonction pour forcer un rechargement des données
 *
 * Gestion des erreurs :
 * - En cas d'erreur lors du chargement, l'erreur est stockée dans l'état 'error'
 * - Les composants utilisateurs doivent gérer l'affichage des erreurs
 *
 * Exemple d'utilisation :
 * ```jsx
 * const { articles, loading, error, reload } = useArticles();
 * 
 * if (loading) return <div>Chargement en cours...</div>;
 * if (error) return <div>Erreur: {error.message}</div>;
 * 
 * return (
 *   <div>
 *     {articles.map(article => (
 *       <ArticleCard key={article.id} article={article} />
 *     ))}
 *   </div>
 * );
 * ```
 * 
 * Optimisations :
 * - Évite les fuites de mémoire avec le flag isMounted
 * - Ne recharge pas les données si le composant est démonté
 */

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