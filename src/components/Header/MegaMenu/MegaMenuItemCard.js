import React from 'react';
import { Link } from 'react-router-dom';

/**
 * MegaMenuItemCard - Carte d'article dans le MegaMenu
 * 
 * @param {Object} props - Les propriétés du composant
 * @param {Object} props.item - L'article à afficher
 * @param {string} props.item.id - ID de l'article
 * @param {string} props.item.title - Titre de l'article
 * @param {string} props.item.image - URL de l'image
 * @param {number} [props.item.price] - Prix de l'article
 * @param {number} [props.item.discount_percent] - Pourcentage de réduction
 * @param {Function} [props.onAddToCart] - Fonction appelée lors de l'ajout au panier
 * @param {string} [props.basePath] - Chemin de base pour les liens (défaut: '/product/')
 * @param {string} [props.className] - Classes CSS supplémentaires
 * @returns {JSX.Element} Le composant MegaMenuItemCard rendu
 */
const MegaMenuItemCard = ({ 
  item, 
  onAddToCart, 
  className = '' 
}) => {
  // Vérification des propriétés requises
  if (!item || !item.id || !item.title || !item.image) {
    console.error('MegaMenuItemCard: Missing required item properties', item);
    return null;
  }

  const hasDiscount = item.discount_percent > 0;
  const finalPrice = hasDiscount && item.price 
    ? (item.price - (item.price * item.discount_percent / 100)).toFixed(2)
    : item.price;

  return (
    <div 
      className={`w-[220px] h-[280px] group relative overflow-hidden shadow hover:shadow-lg border border-gray-100 bg-black flex flex-col justify-end ${className}`}
      style={{ cursor: 'pointer' }}
    >
      {/* Image de l'article */}
      <img
        src={item.image.startsWith('http') ? item.image : `/assets/images/ProductsImages/${item.image}`}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-300 group-hover:scale-105"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/assets/images/placeholder-product.jpg';
        }}
      />
      
      {/* Overlay de dégradé pour améliorer la lisibilité */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
      
      {/* Badge de réduction */}
      {hasDiscount && (
        <span className="absolute top-2 right-2 bg-white text-black text-[10px] md:text-[11px] font-bold px-2 py-1 z-20 shadow">
          -{item.discount_percent}%
        </span>
      )}
      
      {/* Contenu du bas de la carte */}
      <div className="relative z-20 p-4">
        <h3 className="font-thin text-xs text-white text-left mb-1">| {item.title}</h3>
        
        {item.price !== undefined && (
          <div className="flex items-center gap-2">
            {hasDiscount ? (
              <>
                <span className="text-white text-xs font-thin">{finalPrice}€</span>
                <span className="text-gray-300 text-xs line-through">{item.price}€</span>
              </>
            ) : (
              <span className="text-white text-sm font-bold">{item.price}€</span>
            )}
          </div>
        )}
        
        {/* Bouton d'action rapide */}
        {onAddToCart && (
          <button 
            className="mt-3 bg-white text-black text-xs font-semibold py-2 px-4 w-full text-center hover:bg-gray-100 transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(item);
            }}
          >
            Voir 
          </button>
        )}
      </div>
      
      {/* Lien vers la page de détail */}
      <Link 
        to={`/produit/${item.id}`}
        className="absolute inset-0 z-20"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default MegaMenuItemCard;
