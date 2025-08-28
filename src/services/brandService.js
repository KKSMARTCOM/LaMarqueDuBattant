/**
 * brandService.js
 * 
 * Description:
 *  Service de chargement/caching des informations de marque depuis
 *  `public/data/brandInfo.json` et helpers d'accès (brand, contact, legal, etc.).
 * 
 * Points clés:
 *  - Cache mémoire `brandData` pour éviter les rechargements.
 *  - Fournit des getters spécialisés par section.
 */

let brandData = null;

/**
 * Charge et met en cache les données de la marque.
 * @returns {Promise<Object>} L'objet complet de données de marque.
 */
export const fetchBrandData = async () => {
  if (!brandData) {
    try {
      const response = await fetch('/data/brandInfo.json');
      if (!response.ok) {
        throw new Error('Failed to fetch brand data');
      }
      brandData = await response.json();
    } catch (error) {
      console.error('Error loading brand data:', error);
      // Retourner des données par défaut en cas d'erreur
      brandData = {
        brand: { name: 'La Marque Du Battant' },
        contact: { email: 'contact@lamarquedubattant.com',
                    phone: '+229 50111555'
         },
        legal: {}
      };
    }
  }
  return brandData;
};

/**
 * Récupère les informations de la marque.
 * @returns {Promise<Object>} Objet `brand`.
 */
export const getBrandInfo = async () => {
  const data = await fetchBrandData();
  return data.brand;
};

/**
 * Récupère les informations de contact.
 * @returns {Promise<Object>} Objet `contact`.
 */
export const getContactInfo = async () => {
  const data = await fetchBrandData();
  return data.contact;
};

/**
 * Récupère les informations légales.
 * @returns {Promise<Object>} Objet `legal`.
 */
export const getLegalInfo = async () => {
  const data = await fetchBrandData();
  return data.legal;
};

/**
 * Récupère des statistiques si présentes.
 * @returns {Promise<Object>} Objet `stats` ou {}.
 */
export const getStats = async () => {
  const data = await fetchBrandData();
  return data.stats || {};
};

/**
 * Récupère la section "à propos" si présente.
 * @returns {Promise<Object>} Objet `about` ou {}.
 */
export const getAboutInfo = async () => {
  const data = await fetchBrandData();
  return data.about || {};
};

/**
 * Récupère les informations de livraison si présentes.
 * @returns {Promise<Object>} Objet `shipping` ou {}.
 */
export const getShippingInfo = async () => {
  const data = await fetchBrandData();
  return data.shipping || {};
};

/**
 * Récupère les informations de retours si présentes.
 * @returns {Promise<Object>} Objet `returns` ou {}.
 */
export const getReturnsInfo = async () => {
  const data = await fetchBrandData();
  return data.returns || {};
};

/**
 * Récupère les données d'une section spécifique d'une page
 * @param {string} pageName - Le nom de la page (ex: 'Accueil', 'Apropos')
 * @param {string} sectionName - Le nom de la section (ex: 'Hero', 'AboutSection')
 * @returns {Promise<Object>} Les données de la section demandée ou un objet vide
 */
export const getPageSection = async (pageName, sectionName) => {
  try {
    const data = await fetchBrandData();
    // Vérifier si la page et la section existent
    if (data?.PageData?.[pageName]?.[sectionName] !== undefined) {
      return data.PageData[pageName][sectionName];
    }
    console.log(`Section ${sectionName} non trouvée dans la page ${pageName}`);
    return {};
  } catch (error) {
    console.error('Erreur lors de la récupération des données de la section:', error);
    return {};
  }
};

/**
 * Récupère les informations SEO si présentes.
 * @returns {Promise<Object>} Objet `seo` ou {}.
 */
export const getSeoInfo = async () => {
  const data = await fetchBrandData();
  return data.seo || {};
};
