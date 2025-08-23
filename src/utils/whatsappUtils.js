import { getContactInfo } from '../services/brandService';

// Récupérer le numéro de téléphone de contact
let PHONE_NUMBER = '';

// Charger le numéro de téléphone au démarrage
(async () => {
  try {
    const contactInfo = await getContactInfo();
    // Nettoyer le numéro de téléphone (supprimer les espaces et le +)
    PHONE_NUMBER = contactInfo.phone.replace(/[\s+]/g, '');
  } catch (error) {
    console.error('Erreur lors du chargement du numéro de téléphone:', error);
    // Valeur par défaut en cas d'erreur
    PHONE_NUMBER = '22900000000';
  }
})()



/**
 * Génère un lien WhatsApp pour un produit unique
 */
export const generateProductWhatsAppMessage = (product, selectedSize = null) => {
  const price = product.discount_percent > 0
    ? `${(product.price * (1 - product.discount_percent / 100)).toFixed(0)} FCFA (au lieu de ${product.price} FCFA, économie de ${Math.round(product.price * product.discount_percent / 100)} FCFA)`
    : `${product.price} FCFA`;

  let message = `Bonjour, je souhaite commander ce produit :\n\n` +
    `*${product.title}*\n` +
    `Référence: *${product.id}\n` +
    `Prix: ${price}\n`;
 
  if (selectedSize) {
    message += `Taille: ${selectedSize}\n`;
  }
  
  if (product.description) {
    message += `\nDescription: ${product.description.substring(0, 150)}...\n`;
  }
  
  return encodeURI(`https://wa.me/${PHONE_NUMBER}?text=${message}`);
};

/**
 * Génère un lien WhatsApp pour le panier complet
 */
export const generateCartWhatsAppMessage = (cartItems) => {
  let message = 'Bonjour, je souhaite commander les articles suivants :\n\n';
  message += `*RÉFÉRENCE DE COMMANDE: ${Date.now()}\n\n`;
  
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalSavings = cartItems.reduce((sum, item) => 
    item.oldPrice ? sum + ((item.oldPrice - item.price) * item.quantity) : sum, 0);
  
  cartItems.forEach((item, index) => {
    message += `*${index + 1}. ${item.title}*\n` +
      `- Référence: *${item.id}\n` +
      `- Quantité: ${item.quantity}\n` +
      (item.size ? `- Taille: ${item.size}\n` : '') +
      `- Prix unitaire: ${item.price} FCFA\n` +
      `- Total: ${item.price * item.quantity} FCFA\n\n`;
  });
  
  message += `\n*Récapitulatif de commande*\n` +
    `Sous-total: ${subtotal.toLocaleString('fr-FR')} FCFA\n`;
  
  if (totalSavings > 0) {
    message += `Économies: ${totalSavings.toLocaleString('fr-FR')} FCFA\n`;
  }
  
  message += `\nMerci de me contacter pour finaliser la commande.`;
  
  return encodeURI(`https://wa.me/${PHONE_NUMBER}?text=${message}`);
};
