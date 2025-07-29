import React from 'react';
import { Link } from 'react-router-dom';

export default function MenuPrincipal({ handleMenuEnter, handleMenuLeave, megaMenuOpen, activeMenu }) {
  return (
    <ul className="hidden lg:flex space-x-4 text-white font-light uppercase text-xs">
      {['HOMMES', 'FEMMES', 'COLLECTION', 'EVENEMENTS', 'SOLDE'].map((menu, idx) => (
        <li
          key={menu}
          onMouseEnter={() => handleMenuEnter(menu)}
          onMouseLeave={handleMenuLeave}
          className={
            `relative cursor-pointer transition-colors duration-150 px-3 py-1 ` +
            (menu === 'SOLDE' ? 'text-red-500' : 'text-white') +
            (megaMenuOpen && activeMenu === menu
              ? ' bg-transparent border-b-2 border-b-white text-white font-extrabold'
              : '')
          }
        >
          {menu === 'HOMMES' ? (
            <Link to="/produits?remises=&tailles=&sexe=Homme" className="block w-full h-full">{menu}</Link>
          ) : menu === 'FEMMES' ? (
            <Link to="/produits?remises=&tailles=&sexe=Femme" className="block w-full h-full">{menu}</Link>
          ) : menu === 'COLLECTION' ? (
            <Link to="/produits" className="block w-full h-full">{menu}</Link>
          ) : menu === 'EVENEMENTS' ? (
            <Link to="/events" className="block w-full h-full">{menu}</Link>
          ) : ( menu === 'SOLDE' ? (
            <Link to="/produits?remises=-10%25%2C-20%25%2C-30%25+et+plus&tailles=&sexe=Femme" className="block w-full h-full">{menu}</Link>
          ) : menu
          )}
        </li>
      ))}
    </ul>
  );
} 