/**
 * articleService.js
 * 
 * Service pour gérer les opérations CRUD sur les articles
 * Utilise le fichier public/data/articles.json comme source de données
 * 
 * Méthodes disponibles :
 * - getAll() : Récupère tous les articles
 * - getById(id) : Récupère un article par son ID
 * - create(article) : Crée un nouvel article
 * - update(id, article) : Met à jour un article existant
 * - delete(id) : Supprime un article
 */

const ARTICLES_PATH = '/data/articles.json';

/**
 * Récupère tous les articles
 * @returns {Promise<Array>} Liste des articles
 */
export const getAllArticles = async () => {
  try {
    const response = await fetch(ARTICLES_PATH);
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
 * Récupère un article par son ID
 * @param {number} id - ID de l'article
 * @returns {Promise<Object>} Article correspondant
 */
export const getArticleById = async (id) => {
  try {
    console.log(`Recherche de l'article avec l'ID:`, id, '(type:', typeof id, ')');
    const articles = await getAllArticles();
    console.log('Articles chargés:', articles);
    
    // Convertir l'ID en nombre pour la comparaison
    const articleId = typeof id === 'string' ? parseInt(id, 10) : id;
    const article = articles.find(article => article.id === articleId);
    
    console.log('Article trouvé:', article);
    return article || null;
  } catch (error) {
    console.error(`Erreur dans getArticleById(${id}):`, error);
    throw error;
  }
};

/**
 * Crée un nouvel article
 * @param {Object} article - Nouvel article à créer
 * @returns {Promise<Object>} Article créé avec son nouvel ID
 */
export const createArticle = async (article) => {
  try {
    const articles = await getAllArticles();
    // Génère un nouvel ID (max + 1)
    const newId = Math.max(...articles.map(a => a.id), 0) + 1;
    const newArticle = { ...article, id: newId };
    
    // En production, on enverrait une requête au serveur
    // Pour la démo, on simule juste la création
    return newArticle;
  } catch (error) {
    console.error('Erreur dans createArticle:', error);
    throw error;
  }
};

/**
 * Met à jour un article existant
 * @param {number} id - ID de l'article à mettre à jour
 * @param {Object} article - Nouvelles données de l'article
 * @returns {Promise<Object>} Article mis à jour
 */
export const updateArticle = async (id, article) => {
  try {
    const articles = await getAllArticles();
    const index = articles.findIndex(a => a.id === id);
    
    if (index === -1) {
      throw new Error(`Article avec l'ID ${id} non trouvé`);
    }
    
    const updatedArticle = { ...articles[index], ...article, id };
    
    // En production, on enverrait une requête au serveur
    // Pour la démo, on retourne simplement l'article mis à jour
    return updatedArticle;
  } catch (error) {
    console.error(`Erreur dans updateArticle(${id}):`, error);
    throw error;
  }
};

/**
 * Supprime un article
 * @param {number} id - ID de l'article à supprimer
 * @returns {Promise<boolean>} true si la suppression a réussi
 */
export const deleteArticle = async (id) => {
  try {
    const articles = await getAllArticles();
    const index = articles.findIndex(a => a.id === id);
    
    if (index === -1) {
      throw new Error(`Article avec l'ID ${id} non trouvé`);
    }
    
    // En production, on enverrait une requête au serveur
    // Pour la démo, on simule juste la suppression
    return true;
  } catch (error) {
    console.error(`Erreur dans deleteArticle(${id}):`, error);
    throw error;
  }
};

export default {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle
};
