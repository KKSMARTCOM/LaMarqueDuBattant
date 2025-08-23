/**
 * articleService.js
 * 
 * Description:
 *  Service HTTP pour gérer les opérations CRUD sur les articles côté serveur
 *  (API Node `server/`). Les lectures ne proviennent plus directement de
 *  `public/data/articles.json` mais via l'API.
 * 
 * Points clés:
 *  - Toutes les méthodes sont asynchrones et utilisent `fetch`.
 *  - Les erreurs réseau ou HTTP non-OK lèvent une exception (à gérer par l'appelant).
 *  - `applyBatch` supporte les retours 200 (succès total) et 207 (succès partiel).
 * 
 * Méthodes principales:
 *  - getAllArticles(): Promise<Array>
 *  - getArticleById(id): Promise<Object|null>
 *  - createArticle(article): Promise<Object>
 *  - updateArticle(id, articleData): Promise<Object>
 *  - deleteArticle(id): Promise<boolean>
 *  - getNextArticleId(): Promise<number>
 *  - applyBatch(changes): Promise<{success:boolean, results:Array, total:number}>
 * 
 * Exemple d'usage:
 *  ```js
 *  import { getAllArticles, updateArticle } from '@/services/articleService';
 *  const articles = await getAllArticles();
 *  await updateArticle(12, { title: 'Nouveau titre' });
 *  ```
 */

/**
 * Base URL de l'API serveur.
 * Ajuster via variables d'environnement si nécessaire.
 * @type {string}
 */
const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Clé de stockage local pour le panier de changements (voir `ChangesCartContext`).
 * Utilisée ici pour calculer le prochain ID en tenant compte des créations en attente.
 */
const CART_STORAGE_KEY = 'lmdb_changes_cart';

/**
 * Récupère tous les articles.
 * @returns {Promise<Array<Object>>} Liste des articles.
 * @throws {Error} En cas d'échec réseau/HTTP.
 */
export const getAllArticles = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/articles`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des articles');
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur dans getAllArticles:', error);
    throw error;
  }
};

/**
 * Applique un lot de changements (create/update/delete) côté serveur.
 * @param {Array<{type:'create'|'update'|'delete', payload?:Object, targetId?:number|string}>} changes
 * @returns {Promise<{success:boolean, results:Array, total:number}>}
 * @throws {Error} En cas d'échec réseau/HTTP.
 */
export const applyBatch = async (changes) => {
  try {
    const response = await fetch(`${API_BASE_URL}/articles/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ changes })
    });

    // 200 OK means full success; 207 means partial success. Treat both as OK but inspect body
    if (!response.ok && response.status !== 207) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Erreur lors de l\'application du batch');
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur dans applyBatch:', error);
    throw error;
  }
};

/**
 * Récupère un article par son ID.
 * @param {number|string} id ID de l'article.
 * @returns {Promise<Object|null>} Article ou null si non trouvé.
 * @throws {Error} En cas d'échec réseau/HTTP.
 */
export const getArticleById = async (id) => {
  try {
    const articles = await getAllArticles();
    const articleId = typeof id === 'string' ? parseInt(id, 10) : id;
    return articles.find(article => article.id === articleId) || null;
  } catch (error) {
    console.error(`Erreur dans getArticleById(${id}):`, error);
    throw error;
  }
};

/**
 * Crée un nouvel article.
 * @param {Object} article Données du nouvel article.
 * @returns {Promise<Object>} Article créé (incluant son ID).
 * @throws {Error} En cas d'échec réseau/HTTP.
 */
export const createArticle = async (article) => {
  try {
    const response = await fetch(`${API_BASE_URL}/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(article)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la création de l\'article');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur dans createArticle:', error);
    throw error;
  }
};

/**
 * Met à jour un article existant.
 * @param {number|string} id ID de l'article à mettre à jour.
 * @param {Object} articleData Nouvelles données de l'article.
 * @returns {Promise<Object>} Article mis à jour.
 * @throws {Error} En cas d'échec réseau/HTTP.
 */
export const updateArticle = async (id, articleData) => {
  try {
    const articleId = typeof id === 'string' ? parseInt(id, 10) : id;
    const response = await fetch(`${API_BASE_URL}/articles/${articleId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Erreur lors de la mise à jour de l'article ${id}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Erreur dans updateArticle(${id}):`, error);
    throw error;
  }
};

/**
 * Supprime un article.
 * @param {number|string} id ID de l'article à supprimer.
 * @returns {Promise<boolean>} true si la suppression a réussi.
 * @throws {Error} En cas d'échec réseau/HTTP.
 */
export const deleteArticle = async (id) => {
  try {
    const articleId = typeof id === 'string' ? parseInt(id, 10) : id;
    const response = await fetch(`${API_BASE_URL}/articles/${articleId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Erreur lors de la suppression de l'article ${id}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Erreur dans deleteArticle(${id}):`, error);
    throw error;
  }
};

/**
 * Récupère le prochain ID disponible pour un nouvel article.
 *
 * Stratégie:
 *  - lit la liste actuelle des articles (API) pour obtenir `maxExistingId`;
 *  - lit le panier local (localStorage) pour trouver le plus grand ID déjà
 *    alloué aux créations en attente (`type === 'create'`) -> `maxCartCreateId`;
 *  - retourne `Math.max(maxExistingId, maxCartCreateId) + 1`.
 *
 * @returns {Promise<number>} Prochain ID disponible.
 * @throws {Error} En cas d'échec de lecture des articles.
 */
export const getNextArticleId = async () => {
  try {
    // 1) Max des IDs existants côté serveur/API
    const articles = await getAllArticles();
    const maxExistingId = articles.length > 0
      ? Math.max(...articles.map(a => Number(a.id) || 0))
      : 0;

    // 2) Max des IDs déjà attribués aux créations en attente dans le panier (localStorage)
    let maxCartCreateId = 0;
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem(CART_STORAGE_KEY) : null;
      if (raw) {
        const items = JSON.parse(raw);
        if (Array.isArray(items)) {
          for (const it of items) {
            if (it && it.type === 'create') {
              const pid = it.payload?.id;
              const num = Number(pid);
              if (!Number.isNaN(num)) {
                maxCartCreateId = Math.max(maxCartCreateId, num);
              }
            }
          }
        }
      }
    } catch (e) {
      // Si parsing/accès échoue, on ignore simplement la contribution du panier
      maxCartCreateId = 0;
    }

    // 3) Calcul final
    return Math.max(maxExistingId, maxCartCreateId) + 1;
  } catch (error) {
    console.error('Erreur dans getNextArticleId:', error);
    throw error;
  }
};

// Export par défaut pour la rétrocompatibilité
const articleService = {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  getNextArticleId,
  applyBatch,
};

export default articleService;
