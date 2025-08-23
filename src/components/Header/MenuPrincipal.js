import React from 'react';
//import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function MenuPrincipal({ handleMenuEnter, handleMenuLeave, megaMenuOpen, activeMenu }) {
  const navigate = useNavigate();
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
            <button onClick={() => navigate('/produits?remises=&tailles=&sexe=Homme')}>{menu}</button>
          ) : menu === 'FEMMES' ? (
            <button onClick={() => navigate('/produits?remises=&tailles=&sexe=Femme')}>{menu}</button>
          ) : menu === 'COLLECTION' ? (
            <button onClick={() => navigate('/produits')}>{menu}</button>
          ) : menu === 'EVENEMENTS' ? (
            <button onClick={() => navigate('/events')}>{menu}</button>
          ) : ( menu === 'SOLDE' ? (
            <button onClick={() => navigate('/produits?remises=-20%25%2C-30%25+et+plus%2C-10%25&tailles=&nouveau=false&collections=')}>{menu}</button>
          ) : menu
          )}
        </li>
      ))}
    </ul>
  );
} 