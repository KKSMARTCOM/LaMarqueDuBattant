import React from 'react';

/**
 * MegaMenuFooter - Barre de liens inférieure du MegaMenu
 * 
 * @param {Object} props - Les propriétés du composant
 * @param {Array<string>} props.links - Tableau des liens à afficher
 * @param {Function} props.onLinkClick - Fonction appelée lors du clic sur un lien
 * @returns {JSX.Element} Le composant MegaMenuFooter rendu
 */
const MegaMenuFooter = ({ links, onLinkClick }) => {
  return (
    <div 
      className="px-12 absolute left-0 bottom-0 w-full bg-white border-t border-gray-200 flex justify-start space-x-8 py-2 text-[10px] animate-mega-menu-footer" 
      style={{ animationDelay: '0.5s' }}
    >
      {links.map((link, i) => (
        <a 
          href="#none"
          key={i} 
          className="text-black hover:underline cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            onLinkClick?.(link);
          }}
        >
          {link}
        </a>
      ))}
    </div>
  );
};

export default MegaMenuFooter;
