/**
 * filterService.js
 * 
 * Description:
 *  Service utilitaire pour charger les valeurs de filtres produits
 *  à partir de `public/data/productFilters.json`, et fournir des
 *  aides (map couleurs, map collections, validation de valeur).
 * 
 * Points clés:
 *  - Cache mémoire `filtersCache` pour éviter les rechargements.
 *  - API: `loadProductFilters`, `getFilterValues`, `getColorCodeMap`,
 *         `getCollectionsMap`, `isValidFilterValue`.
 */

/** @type {null | Record<string, any>} Cache des filtres chargés */
let filtersCache = null;

/**
 * Charge les filtres depuis le fichier JSON.
 * @returns {Promise<Object>} Objet contenant les clés: categories, collections, couleurs, remises, tailles, sexe.
 */
export async function loadProductFilters() {
  if (filtersCache) {
    return filtersCache;
  }

  try {
    const response = await fetch('/data/productFilters.json');
    if (!response.ok) {
      throw new Error('Failed to load product filters');
    }
    filtersCache = await response.json();
    return filtersCache;
  } catch (error) {
    console.error('Error loading product filters:', error);
    // Retourne des valeurs par défaut en cas d'erreur
    return {
      categories: [],
      collections: [],
      couleurs: [],
      remises: [],
      tailles: [],
      sexe: []
    };
  }
}

/**
 * Récupère les valeurs possibles pour un filtre spécifique.
 * @param {string} filterName Nom du filtre ("categories", "collections", etc.).
 * @returns {Promise<Array>} Tableau des valeurs possibles pour ce filtre. Tableau vide si absent.
 */
export async function getFilterValues(filterName) {
  const filters = await loadProductFilters();
  return filters[filterName] || [];
}

/**
 * Construit une map nom->code pour les couleurs depuis les filtres.
 * @returns {Promise<Object<string,string>>} Map: nom couleur (lowercase) -> code hex.
 */
export async function getColorCodeMap() {
  const couleurs = await getFilterValues('couleurs');
  if (!Array.isArray(couleurs)) return {};
  return couleurs.reduce((acc, c) => {
    if (c && typeof c === 'object' && c.name && c.code) {
      acc[String(c.name).toLowerCase()] = c.code;
    }
    return acc;
  }, {});
}

/**
 * Construit une map id->name pour les collections.
 * @returns {Promise<Object<number,string>>} Map: id numérique -> nom de collection.
 */
export async function getCollectionsMap() {
  const collections = await getFilterValues('collections');
  if (!Array.isArray(collections)) return {};
  return collections.reduce((acc, c) => {
    if (c && typeof c === 'object' && typeof c.id !== 'undefined') {
      acc[c.id] = c.name || '';
    }
    return acc;
  }, {});
}

/**
 * Vérifie si une valeur est valide pour un filtre donné.
 * @param {string} filterName Nom du filtre.
 * @param {string} value Valeur à vérifier.
 * @returns {Promise<boolean>} True si la valeur est valide (présente dans la liste des valeurs).
 */
export async function isValidFilterValue(filterName, value) {
  const values = await getFilterValues(filterName);
  return values.includes(value);
}
