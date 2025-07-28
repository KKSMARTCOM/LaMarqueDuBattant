import React from 'react';
import { Link } from 'react-router-dom';

/**
 * MegaMenuNavColumn - Colonne de navigation du MegaMenu
 * 
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.title - Titre de la colonne
 * @param {Array<{label: string, url: string}>} props.items - Tableau des éléments de navigation
 * @param {string} [props.className] - Classes CSS supplémentaires
 * @param {Object} [props.style] - Styles inline supplémentaires
 * @returns {JSX.Element} Le composant MegaMenuNavColumn rendu
 */
const MegaMenuNavColumn = ({ 
  title, 
  items = [], 
  className = '', 
  style = {}
}) => {
  return (
    <div 
      className={`flex flex-col mr-12 min-w-[180px] items-start text-left animate-mega-menu-column ${className}`}
      style={{ animationDelay: '0.1s', ...style }}
    >
      <span className="font-bold text-[13px] mb-3 tracking-wide uppercase">
        {title}
      </span>
      
      {items.map((item, index) => (
        <Link
          key={index}
          to={item.url || '#'}
          className="text-[12px] text-black mb-2 hover:underline cursor-pointer text-left"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
};

export default MegaMenuNavColumn;
