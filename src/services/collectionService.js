/**
 * Service pour charger les collections depuis le fichier JSON
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

export const getCollectionById = async (id) => {
  try {
    const { collections } = await loadCollections();
    return collections.find(collection => collection.id === id);
  } catch (error) {
    console.error('Erreur lors de la récupération de la collection:', error);
    return null;
  }
};
