// Fonction de filtrage des articles
// options = { categorie, remises, tailles, couleur, prixMin, prixMax }
// articles = tableau d'articles (chaque article doit avoir les propriétés correspondantes)

export function filtrer(options, articles) {
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
      if (article.discount_percent === undefined || article.discount_percent === null) {
        // Article sans remise : on considère "Sans remise"
        if (!options.remises.includes('Sans remise')) {
          return false;
        }
      } else {
        const remiseStr = `-${article.discount_percent}%`;
        if (!options.remises.includes(remiseStr)) {
          return false;
        }
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
    return true;
  });
  
  return filteredArticles;
}