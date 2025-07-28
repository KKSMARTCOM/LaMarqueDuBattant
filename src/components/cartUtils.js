// Utilitaire pour gérer le panier dans localStorage

/**
 * Ajoute un article au panier (localStorage)
 * @param {Object} item - L'article à ajouter (doit contenir au moins id, title, image, price, [size], [variant], etc.)
 * @param {number} [quantity=1] - Quantité à ajouter
 * @returns {string} - Message de succès ou d'erreur
 */
export function addToCart(item, quantity = 1) {
  if (!item || !item.id) return "Article invalide";
  try {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    // Recherche d'un article identique (id + taille + variante)
    const idx = cart.findIndex(
      (a) => a.id === item.id &&
        (a.size === item.size || (!a.size && !item.size)) &&
        (a.variant === item.variant || (!a.variant && !item.variant))
    );
    if (idx !== -1) {
      // Déjà présent : on incrémente la quantité
      cart[idx].quantity = (cart[idx].quantity || 1) + quantity;
    } else {
      // Nouveau : on ajoute avec la quantité
      cart.push({ ...item, quantity });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    showCartNotification(item, quantity);
    return "Ajouté au panier !";
  } catch {
    return "Erreur lors de l'ajout au panier";
  }
}

/**
 * Affiche une petite notification (toast) lors de l'ajout au panier
 * @param {Object} item - L'article ajouté
 * @param {number} quantity - Quantité ajoutée
 */
export function showCartNotification(item, quantity, success = true) {
  // Overlay sombre
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100vw';
  overlay.style.height = '100vh';
  overlay.style.background = 'rgba(0,0,0,0.18)';
  overlay.style.zIndex = 9998;
  overlay.style.opacity = '0';
  overlay.style.transition = 'opacity 0.3s';

  // Création d'une petite modal centrée
  const modal = document.createElement('div');
  modal.style.position = 'fixed';
  modal.style.top = '50%';
  modal.style.left = '50%';
  modal.style.transform = 'translate(-50%, -50%) scale(0.95)';
  modal.style.background = '#111';
  modal.style.color = '#fff';
  modal.style.padding = '32px 32px 24px 32px';
  modal.style.borderRadius = 'Opx';
  modal.style.fontSize = '16px';
  modal.style.zIndex = 9999;
  modal.style.boxShadow = '0 8px 32px rgba(0,0,0,0.18)';
  modal.style.display = 'flex';
  modal.style.flexDirection = 'column';
  modal.style.alignItems = 'center';
  modal.style.opacity = '0';
  modal.style.transition = 'opacity 0.3s, transform 0.3s';
  // Icône SVG
  const icon = document.createElement('div');
  icon.innerHTML = success
    ? `<svg width="32" height="32" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#fff"/><path d="M10 17l4 4 8-9" stroke="#111" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    : `<svg width="32" height="32" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#fff"/><path d="M12 12l8 8M20 12l-8 8" stroke="#111" stroke-width="2.2" stroke-linecap="round"/></svg>`;
  icon.style.marginBottom = '12px';
  modal.appendChild(icon);
  // Message
  const msg = document.createElement('div');
  msg.innerText = success
    ? `${quantity} × ${item.title} ajouté au panier !`
    : `${quantity} × ${item.title} n'a pas pu être ajouté.`;
  msg.style.marginTop = '2px';
  msg.style.fontWeight = '500';
  msg.style.textAlign = 'center';
  modal.appendChild(msg);
  document.body.appendChild(overlay);
  document.body.appendChild(modal);
  setTimeout(() => {
    overlay.style.opacity = '1';
    modal.style.opacity = '1';
    modal.style.transform = 'translate(-50%, -50%) scale(1)';
  }, 10);
  setTimeout(() => {
    overlay.style.opacity = '0';
    modal.style.opacity = '0';
    modal.style.transform = 'translate(-50%, -50%) scale(0.95)';
    setTimeout(() => {
      document.body.removeChild(modal);
      document.body.removeChild(overlay);
    }, 350);
  }, 1800);
}

/**
 * Ajoute un article au panier à partir de son id, taille et quantité.
 * Va chercher les infos dans articles.json (public/data).
 * @param {number} id - L'id de l'article à ajouter
 * @param {string} size - La taille choisie
 * @param {number} quantity - Quantité à ajouter
 * @returns {Promise<string>} - Message de succès ou d'erreur
 */
export async function addToCartById(id, size, quantity = 1) {
  if (!id || !size) return "Paramètres manquants";
  try {
    // Récupérer la liste des articles
    const res = await fetch(process.env.PUBLIC_URL + '/data/articles.json');
    const articles = await res.json();
    const article = articles.find(a => a.id === id);
    if (!article) return "Article introuvable";
    if (!article.sizes || !article.sizes.includes(size)) return "Taille non disponible";
    // Construire l'objet à ajouter
    const item = {
      id: article.id,
      title: article.title,
      image: article.image,
      price: article.price,
      size,
    };
    // Lire le panier actuel
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    // Chercher si déjà présent (id + size)
    const idx = cart.findIndex(a => a.id === id && a.size === size);
    if (idx !== -1) {
      cart[idx].quantity = (cart[idx].quantity || 1) + quantity;
    } else {
      cart.push({ ...item, quantity });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    showCartNotification(item, quantity);
    return "Ajouté au panier !";
  } catch {
    return "Erreur lors de l'ajout au panier";
  }
} 