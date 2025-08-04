/**
 * Calcule le prix réduit en fonction du prix d'origine et du pourcentage de réduction
 * @param {number} originalPrice - Le prix d'origine
 * @param {number} discountPercent - Le pourcentage de réduction (ex: 20 pour 20%)
 * @returns {number} Le prix après réduction
 */
export const calculateDiscountedPrice = (originalPrice, discountPercent) => {
  if (!originalPrice || !discountPercent || discountPercent <= 0) {
    return originalPrice;
  }
  const discountAmount = (originalPrice * discountPercent) / 100;
  return Math.max(0, originalPrice - discountAmount);
};

/**
 * Vérifie si un article est considéré comme nouveau (ajouté il y a moins d'une semaine)
 * @param {string} dateAdded - La date d'ajout de l'article au format ISO 8601
 * @returns {boolean} true si l'article est considéré comme nouveau, false sinon
 */
export const isNewProduct = (dateAdded) => {
  if (!dateAdded) return false;
  
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  
  const addedDate = new Date(dateAdded);
  return addedDate > oneWeekAgo;
};
