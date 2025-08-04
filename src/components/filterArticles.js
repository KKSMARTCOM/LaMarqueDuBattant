// Fonction de filtrage des articles
// options = { categorie, remises, tailles, couleur, prixMin, prixMax, collections, nouveau }
// articles = tableau d'articles (chaque article doit avoir les propriétés correspondantes)
import { loadCollections } from '../services/collectionService';

// Fonction utilitaire pour charger les collections une seule fois
let collectionsCache = null;

async function loadCollectionsOnce() {
  if (!collectionsCache) {
    try {
      const { collections } = await loadCollections();
      collectionsCache = collections || [];
    } catch (error) {
      console.error('Erreur lors du chargement des collections:', error);
      collectionsCache = [];
    }
  }
  return collectionsCache;
}

export async function filtrer(options, articles) {
  // Charger les collections une seule fois au début
  const collections = await loadCollectionsOnce();
  
  // Filtrer les articles selon les critères
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
    if (Array.isArray(options.remises) && options.remises.length > 0) {
      const discountPercent = Number(article.discount_percent) || 0;
      
      // Vérifier si l'article est en remise
      const hasDiscount = discountPercent > 0;
      
      // Vérifier si l'article correspond à une des options de remise sélectionnées
      const matchesAnyRemise = options.remises.some(remise => {
        if (remise === 'Sans remise') {
          return !hasDiscount;
        } else if (remise === '-30% et plus') {
          return hasDiscount && discountPercent >= 30;
        } else if (remise.startsWith('-') && remise.endsWith('%')) {
          const remiseValue = parseInt(remise.slice(1, -1), 10);
          return hasDiscount && discountPercent === remiseValue;
        }
        return false;
      });
      
      if (!matchesAnyRemise) {
        return false;
      }
    }
    // Tailles : si non défini ou vide, valide
    if (Array.isArray(options.tailles) && options.tailles.length > 0) {
      if (!article.sizes) {
        // Article sans tailles : valide
      } else if (!options.tailles.some(taille => article.sizes.includes(taille))) {
        return false;
      }
    }
    // Sexe : si non défini ou vide, valide
    if (options.sexe && options.sexe !== '') {
      if (article.sexe === undefined || article.sexe === null) {
        // Article sans sexe : valide
      } else if (article.sexe !== options.sexe) {
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
    
    // Filtre par collection : si des collections sont sélectionnées
    if (Array.isArray(options.collections) && options.collections.length > 0) {
      // Vérifier si l'article appartient à une collection
      if (!article.collectionId) {
        return false; // Si l'article n'a pas de collection, on l'exclut
      }
      
      // Trouver la collection de l'article
      const articleCollection = collections.find(c => c.id === article.collectionId);
      
      // Vérifier si la catégorie de la collection de l'article est dans les collections sélectionnées
      if (!articleCollection || !options.collections.includes(articleCollection.categorie)) {
        return false;
      }
    }
    
    return true;
  });
  
  return filteredArticles;
}