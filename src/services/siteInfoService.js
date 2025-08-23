/**
 * siteInfoService.js
 * 
 * Service pour gérer les opérations liées aux informations du site
 * - Récupération des informations actuelles
 * - Mise à jour des informations
 */

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Met à jour les informations du site
 * @param {Object} siteData - Les données du site à mettre à jour
 * @returns {Promise<Object>} - La réponse du serveur
 */
export const updateSiteInfo = async (siteData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/site-info`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(siteData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Erreur lors de la mise à jour des informations du site');
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur dans updateSiteInfo:', error);
    throw error;
  }
};

/**
 * Sauvegarde les informations du site avec gestion des erreurs
 * @param {Object} siteData - Les données du site à sauvegarder
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const saveSiteInfo = async (siteData) => {
  try {
    const response = await updateSiteInfo(siteData);
    return {
      success: true,
      message: 'Les modifications ont été enregistrées avec succès',
      data: response
    };
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    return {
      success: false,
      message: error.message || 'Une erreur est survenue lors de la sauvegarde',
      error: error
    };
  }
};

export default {
  updateSiteInfo,
  saveSiteInfo
};
