/**
 * filterArticles.js
 * 
 * Description :
 * Logique de filtrage des articles utilisant des valeurs de filtre dynamiques.
 * Les valeurs possibles sont chargées depuis le fichier productFilters.json
 *
 * Fonctionnalités :
 * - Filtrage par catégorie, remise, taille, sexe, prix, collections, etc.
 * - Gestion des valeurs de filtre dynamiques
 * - Compatible avec les filtres d'URL
 */

import { getFilterValues } from '../services/filterService';

// Cache pour les valeurs de filtre
let filterValuesCache = null;

// Charger les valeurs de filtre une seule fois
async function loadFilterValuesOnce() {
  if (!filterValuesCache) {
    try {
      const [categories, tailles, remises, sexe] = await Promise.all([
        getFilterValues('categories'),
        getFilterValues('tailles'),
        getFilterValues('remises'),
        getFilterValues('sexe')
      ]);
      
      filterValuesCache = {
        categories,
        tailles,
        remises: ['Sans remise', ...remises.filter(r => r !== 'Sans remise')],
        sexe
      };
    } catch (error) {
      console.error('Erreur lors du chargement des valeurs de filtre:', error);
      filterValuesCache = {
        categories: [],
        tailles: [],
        remises: ['Sans remise'],
        sexe: []
      };
    }
  }
  return filterValuesCache;
}

/**
 * Filtre les articles selon les critères spécifiés
 * @param {Object} options - Options de filtrage
 * @param {string} options.categorie - Catégorie à filtrer
 * @param {Array} options.remises - Tableau des remises à inclure
 * @param {Array} options.tailles - Tableau des tailles à inclure
 * @param {string} options.sexe - Sexe à filtrer
 * @param {number} options.prixMin - Prix minimum
 * @param {number} options.prixMax - Prix maximum
 * @param {boolean} options.nouveau - Si vrai, uniquement les nouveaux articles
 * @param {Array} options.collections - Tableau des collections à inclure
 * @param {Array} articles - Tableau des articles à filtrer
 * @returns {Promise<Array>} Tableau des articles filtrés
 */
export async function filtrer(options, articles) {
  // Charger les valeurs de filtre une seule fois (collections non nécessaires pour filtrer par id)
  const filterValues = await loadFilterValuesOnce();
  
  // Valider les options de filtre par rapport aux valeurs autorisées
  const validatedOptions = { ...options };
  
  // Valider la catégorie
  if (validatedOptions.categorie && filterValues.categories.length > 0) {
    if (!filterValues.categories.includes(validatedOptions.categorie)) {
      validatedOptions.categorie = '';
    }
  }
  
  // Valider les remises
  if (Array.isArray(validatedOptions.remises) && filterValues.remises.length > 0) {
    validatedOptions.remises = validatedOptions.remises.filter(remise => 
      filterValues.remises.includes(remise)
    );
  }
  
  // Valider les tailles
  if (Array.isArray(validatedOptions.tailles) && filterValues.tailles.length > 0) {
    validatedOptions.tailles = validatedOptions.tailles.filter(taille => 
      filterValues.tailles.includes(taille)
    );
  }
  
  // Valider le sexe
  if (validatedOptions.sexe && filterValues.sexe.length > 0) {
    if (!filterValues.sexe.includes(validatedOptions.sexe)) {
      validatedOptions.sexe = '';
    }
  }
  
  // Filtrer les articles selon les critères validés
  const filteredArticles = articles.filter(article => {
    // Catégorie : si non défini ou vide, valide
    if (options.categorie && options.categorie !== '') {
      if (article.category === undefined || article.category === null) {
        // Article sans catégorie : valide
      } else if (
        typeof article.category === 'string' &&
        typeof options.categorie === 'string' &&
        article.category.toLowerCase() !== options.categorie.toLowerCase()
      ) {
        return false;
      }
    }
    // Remises : si non défini ou vide, valide
    if (Array.isArray(validatedOptions.remises) && validatedOptions.remises.length > 0) {
      const discountPercent = Number(article.discount_percent) || 0;
      const hasDiscount = discountPercent > 0;
      
      // Vérifier si l'article correspond à une des options de remise sélectionnées
      const matchesAnyRemise = validatedOptions.remises.some(remise => {
        if (remise === 'Sans remise') {
          return !hasDiscount;
        } else if (remise.endsWith('%')) {
          const remiseValue = parseInt(remise.replace(/[^0-9]/g, ''), 10);
          return hasDiscount && discountPercent >= remiseValue;
        }
        return false;
      });
      
      if (!matchesAnyRemise) {
        return false;
      }
    }
    // Tailles : si non défini ou vide, valide
    if (Array.isArray(validatedOptions.tailles) && validatedOptions.tailles.length > 0) {
      if (!article.sizes || !Array.isArray(article.sizes)) {
        // Article sans tailles : valide uniquement si 'Sans taille' est sélectionné
        if (!validatedOptions.tailles.includes('Sans taille')) {
          return false;
        }
      } else if (!validatedOptions.tailles.some(taille => article.sizes.includes(taille))) {
        return false;
      }
    }
    // Sexe : si non défini ou vide, valide
    if (validatedOptions.sexe && validatedOptions.sexe !== '') {
      const articleSexe = article.sexe || '';
      if (articleSexe !== validatedOptions.sexe) {
        return false;
      }
    }
    // Prix min : si non défini, valide
    if (typeof options.prixMin === 'number') {
      if (article.price === undefined || article.price === null) {
        // Article sans prix : valide
      } else if (article.price < options.prixMin) {
        return false;
      }
    }
    // Prix max : si non défini, valide
    if (typeof options.prixMax === 'number') {
      if (article.price === undefined || article.price === null) {
        // Article sans prix : valide
      } else if (article.price > options.prixMax) {
        return false;
      }
    }
    
    // Filtre "Nouveautés" : si activé, ne garder que les articles ajoutés il y a moins d'une semaine
    if (options.nouveau) {
      if (!article.dateAdded) {
        return false; // Si pas de date d'ajout, on exclut l'article
      }
      
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      try {
        const articleDate = new Date(article.dateAdded);
        if (isNaN(articleDate.getTime())) {
          return false; // Date invalide
        }
        if (articleDate < oneWeekAgo) {
          return false; // Article trop ancien
        }
      } catch (e) {
        console.error('Erreur lors de la vérification de la date:', e);
        return false; // En cas d'erreur, on exclut l'article
      }
    }
    
    // Filtre par collection (par ID): si des IDs de collections sont sélectionnées
    if (Array.isArray(options.collections) && options.collections.length > 0) {
      const selectedIds = options.collections.map(Number);
      const artColId = Number(article.collectionId);
      if (!artColId || !selectedIds.includes(artColId)) {
        return false;
      }
    }
    
    return true;
  });
  
  return filteredArticles;
}