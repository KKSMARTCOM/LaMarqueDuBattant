/**
 * collectionService.js
 * 
 * Description:
 *  Service pour charger les collections et exposer des utilitaires
 *  à partir de `public/data/collection.json`.
 * 
 * Points clés:
 *  - `loadCollections` renvoie la liste des collections et les catégories uniques.
 *  - `getCollectionById` lit via `loadCollections` et effectue une recherche par id.
 */

/**
 * Charge les collections depuis le JSON public.
 * @returns {Promise<{collections:Array<Object>, categories:Array<string>}>}
 */
export const loadCollections = async () => {
  try {
    const response = await fetch('/data/collection.json');
    if (!response.ok) {
      throw new Error('Erreur lors du chargement des collections');
    }
    const collections = await response.json();
    // Extraire les catégories uniques des collections
    const categories = [...new Set(collections.map(collection => collection.categorie))];
    return {
      collections,
      categories
    };
  } catch (error) {
    console.error('Erreur dans collectionService:', error);
    return {
      collections: [],
      categories: []
    };
  }
};

/**
 * Récupère une collection par son identifiant.
 * @param {number} id Identifiant numérique de la collection.
 * @returns {Promise<Object|null>} La collection ou null si non trouvée.
 */
export const getCollectionById = async (id) => {
  try {
    const { collections } = await loadCollections();
    return collections.find(collection => collection.id === id);
  } catch (error) {
    console.error('Erreur lors de la récupération de la collection:', error);
    return null;
  }
};
