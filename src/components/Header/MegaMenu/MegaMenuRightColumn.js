import React from 'react';

/**
 * MegaMenuRightColumn - Colonne de droite du MegaMenu avec une image et un bouton
 * 
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.imageUrl - URL de l'image à afficher
 * @param {string} props.altText - Texte alternatif pour l'image
 * @param {string} props.buttonText - Texte du bouton (défaut: "DÉCOUVREZ")
 * @param {string} props.clickurl - URL de destination lors du clic sur le bouton
 * @returns {JSX.Element} Le composant MegaMenuRightColumn rendu
 */
const MegaMenuRightColumn = ({ 
  imageUrl, 
  altText = "Mega menu", 
  buttonText = "DÉCOUVREZ", 
  clickurl 
}) => {
  return (
    <div 
      className="absolute right-0 top-0 h-full w-[340px] flex-shrink-0 animate-mega-menu-image"
      style={{ animationDelay: '0.4s' }}
    >
      <div className="relative rounded-md w-full h-full">
        {/* Image d'arrière-plan */}
        <img
          src={imageUrl}
          alt={altText}
          className="absolute inset-0 w-full h-full object-cover z-10"
        />
        
        {/* Bouton d'action principal */}
        <button 
          className="absolute left-1/2 bottom-12 -translate-x-1/2 bg-white rounded-md text-black px-8 py-3 font-semibold uppercase shadow text-[15px] tracking-wider z-20 hover:bg-gray-100 transition-colors"
          onClick={() => window.location.href = clickurl}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default MegaMenuRightColumn;
