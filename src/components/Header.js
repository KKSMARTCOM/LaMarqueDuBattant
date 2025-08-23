/**
 * Header.js
 * 
 * Description :
 * Composant principal de l'en-tête du site. Gère l'affichage de la barre de navigation,
 * du menu principal, du panier, de la barre de slogans animés et de la barre de catégories.
 *
 * Fonctionnalités principales :
 * - Affichage d'une bannière avec slogan animé
 * - Navigation principale avec menu déroulant (MegaMenu)
 * - Intégration du panier et de l'authentification utilisateur
 * - Affichage conditionnel de la barre de catégories
 * - Gestion des états de menu (mobile/desktop)
 *
 * Composants enfants :
 * - MegaMenu : Menu déroulant principal
 * - SloganBar : Bannière avec slogans animés
 * - CartIcon : Icône du panier avec compteur
 * - MenuPrincipal : Navigation principale
 * - UserAuthDrawer : Panneau d'authentification utilisateur
 * - CategoriesBar : Barre de catégories (optionnelle)
 *
 * Props :
 * - showCategoriesBar (boolean) : Affiche la barre de catégories si true
 * - opacity (number) : Opacité du header (0-100)
 *
 * Hooks personnalisés :
 * - useCart : Gestion du panier
 * - useArticles : Récupération des données des articles
 *
 * Comportement :
 * - Animation fluide des transitions
 * - Adaptation responsive (mobile/desktop)
 * - Gestion des événements de défilement
 */

import React, { useEffect, useState, useRef } from "react";
import { FiUser, FiX, FiMenu } from "react-icons/fi";
import { Link } from "react-router-dom";
import getImagePath from "./getImagePath";
import CategoriesBar from "./CategoriesBar";
import { useCart } from "./CartContext";
import useArticles from '../hooks/useArticles';
import { MegaMenu, SloganBar, CartIcon, MenuPrincipal } from './Header/index';
import UserAuthDrawer from './UserAuthDrawer';

// Liste des slogans animés affichés en haut du header
const phrases = [
  "La MARQUE DU BATTANT",
  "SÉRÉNITÉ EN TOUT TEMPS",
  "STAY STRONG",
  "HUMANITY",
  "HABILLEZ-VOUS COMME UN BATTANT"
];

/**
 * Composant principal Header
 * Gère l'affichage du header, la logique d'ouverture/fermeture des menus,
 * l'état global, et compose les sous-composants spécialisés.
 */
export default function Header({ showCategoriesBar, opacity = 80 }) {
  // Index du slogan affiché
  const [index, setIndex] = useState(0);
  // Animation de fade pour le slogan
  const [fade, setFade] = useState(true);
  // Ouverture du mega menu (desktop)
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  // Menu principal actuellement survolé
  const [activeMenu, setActiveMenu] = useState(null);
  // Header opaque si scroll
  const [isScrolled, setIsScrolled] = useState(false);
  // Ouverture du menu mobile
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Ref pour gérer le délai de fermeture du mega menu
  const hideTimeoutRef = useRef(null);
  // Nombre d'articles dans le panier
  const [cartCount, setCartCount] = useState(0);
  const [userDrawerOpen, setUserDrawerOpen] = useState(false);

  // Fonction pour ouvrir le drawer du panier (depuis le contexte global)
  const { openCart } = useCart();
  // Chargement des articles (pour le mega menu)
  const { articles, loading: articlesLoading } = useArticles();

  // Met à jour le badge du panier dynamiquement en écoutant localStorage
  useEffect(() => {
    // Fonction pour compter les articles dans le panier (localStorage)
    const updateCartCount = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartCount(cart.length);
      } catch {
        setCartCount(0);
      }
    };
    // Initialisation au montage
    updateCartCount();
    // Écoute les changements du localStorage (d'autres onglets/fenêtres)
    window.addEventListener('storage', updateCartCount);
    // Timer pour détecter les changements dans le même onglet
    const interval = setInterval(updateCartCount, 500);
    return () => {
      window.removeEventListener('storage', updateCartCount);
      clearInterval(interval);
    };
  }, []);

  // Animation cyclique du slogan
  useEffect(() => {
    const timeout1 = setTimeout(() => setFade(false), 2200);
    const timeout2 = setTimeout(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
      setFade(true);
    }, 2500);
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, [index]);

  // Effet de scroll pour rendre le header opaque
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Gestion du survol des items du menu principal (ouvre le mega menu)
  const handleMenuEnter = (menu) => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    setActiveMenu(menu);
    setMegaMenuOpen(true);
  };

  // Gestion de la sortie du survol (ferme le mega menu avec délai)
  const handleMenuLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(false);
      setActiveMenu(null);
    }, 300);
  };

  // Empêche la fermeture du mega menu si la souris revient dessus
  const handleMegaMenuEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
  };

  // Ferme le mega menu si la souris quitte la zone
  const handleMegaMenuLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setMegaMenuOpen(false);
      setActiveMenu(null);
    }, 300);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-30 font-montserrat">
      {/* Drawer de connexion/inscription */}
      <UserAuthDrawer open={userDrawerOpen} onClose={() => setUserDrawerOpen(false)} />
      {/* Barre supérieure animée avec le slogan */}
      <SloganBar phrases={phrases} index={index} fade={fade} />
      {/* Barre de navigation principale */}
      <nav
        className={
          `flex items-center px-4 py-2 min-h-0 h-12 transition-colors duration-300 ` +
          (
            isScrolled
              ? 'bg-black bg-opacity-100 backdrop-blur-2xl'
              : `bg-black ${opacity !== undefined ? `bg-opacity-${opacity}` : 'bg-opacity-0'} backdrop-blur-sm`
          )
        }
      >
        <div className="flex items-center flex-1">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src={getImagePath('LOGO_LMDB.svg', 'logo')} 
              alt="Logo" 
              className="max-h-10 md:max-h-14 w-12 mr-2 cursor-pointer hover:opacity-80 transition-opacity duration-200" 
              style={{ minHeight: '40px' }}
              onError={(e) => {
                console.log('Erreur de chargement du logo');
                e.target.style.display = 'none';
              }}
            />
          </Link>
          {/* Menu principal (desktop) */}
          <MenuPrincipal handleMenuEnter={handleMenuEnter} handleMenuLeave={handleMenuLeave} megaMenuOpen={megaMenuOpen} activeMenu={activeMenu} />
        </div>
        <div className="flex items-center space-x-2 ml-auto">
          {/* Barre de recherche (desktop) */}
          <input
            type="text"
            placeholder="Rechercher..."
            className="hidden md:block bg-transparent border border-white  pr-8 pl-3 py-1 text-white placeholder-white text-[10px]"
            style={{ fontFamily: 'Montserrat, Arial, Helvetica, sans-serif' }}
          />
         
          {/* Icône utilisateur */}
          <span className="text-white text-2xl font-sans cursor-pointer p-2" onClick={() => setUserDrawerOpen(true)}><FiUser /></span>
          {/* Icône panier + badge */}
          <CartIcon cartCount={cartCount} openCart={openCart} />
          {/* Menu mobile (hamburger) */}
          <button 
            className="lg:hidden text-white text-2xl ml-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>
      {/* Overlay pour le menu mobile */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed top-0 left-0 w-full h-full z-40 bg-black bg-opacity-60  backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      {/* Menu mobile intégré ici */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed top-0 left-0 w-full h-2.5/3 z-50 bg-black  overflow-y-auto flex flex-col">
          <div className="  x-4 py-6 w-full h-1/2 flex flex-col items-center">
            {/* Bouton de fermeture en haut à droite */}
            <div className="flex justify-end w-full mb-4">
              <button className="text-white text-3xl" onClick={() => setMobileMenuOpen(false)}>
                <FiX />
              </button>
            </div>
            <ul className="space-y-4 text-white font-semibold uppercase text-lg w-full">
              {['HOMMES', 'FEMMES', 'COLLECTION', 'EVENEMENTS', 'SOLDE'].map((menu, idx) => (
                <li
                  key={menu}
                  className={`cursor-pointer transition-colors duration-150 py-2 border-b border-gray-700 ${
                    menu === 'SOLDE' ? 'text-red-500' : 'text-white'
                  }`}
                >
                  {menu === 'COLLECTION' ? (
                    <Link to="/produits" className="block w-full h-full">
                      {menu}
                    </Link>
                  ) : menu === 'EVENEMENTS' ? (
                    <Link to="/events" className="block w-full h-full">
                      {menu}
                    </Link>
                  ) : menu === 'SOLDE' ? (
                    <Link to="/produits?remises=-10%25%2C-20%25%2C-30%25+et+plus&tailles=&sexe=Femme" className="block w-full h-full">
                      {menu}
                    </Link>
                  ) : menu === 'HOMMES' ? (
                    <Link to="/produits?remises=&tailles=&sexe=Homme" className="block w-full h-full">
                      {menu}
                    </Link>
                  ) : menu === 'FEMMES' ? (
                    <Link to="/produits?remises=&tailles=&sexe=Femme" className="block w-full h-full">
                      {menu}
                    </Link>
                  ) : (
                    <span className="block w-full h-full">{menu}</span>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-4  border-t border-gray-700 w-full flex flex-col items-center">
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full bg-transparent border border-white  px-3 py-2 text-white placeholder-white text-base"
                style={{ fontFamily: 'Montserrat, Arial, Helvetica, sans-serif' }}
              />
            </div>
          </div>
        </div>
      )}
      {/* Barre de catégories (optionnelle) */}
      {showCategoriesBar && <CategoriesBar show={true} />}
      {/* Mega menu (desktop) */}
      {megaMenuOpen && (
        <div
          className="hidden lg:flex fixed left-0 w-full z-30 bg-white border-b border-gray-200 shadow-lg"
          style={{ top: '70px', height: '370px' }}
          onMouseEnter={handleMegaMenuEnter}
          onMouseLeave={handleMegaMenuLeave}
        >
          {/* Mega menu complet géré par le sous-composant */}
          <MegaMenu 
            menu={activeMenu} 
            articles={articles} 
            loading={articlesLoading} 
            onClose={() => setMegaMenuOpen(false)} 
          />
        </div>
      )}
      <style jsx>{`
      .btnAbout {
      padding: 0.20rem 0.5rem;
      background-color:transparent;
      color: #fff;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 10px;
      font-weight: 500;
      text-align: center;
      text-decoration: none;
      border: 1px solid #fff;
      border-radius: 3px;
      font-family: "Montserrat", sans-serif;
      overflow: hidden;
      cursor: pointer;
      }
      .btnAbout:after {
      content: " ";
        width: 0%;
        height: 100%;
        background: #ffffff;
        color : #000000;
        position: absolute;
        transition: all 0.4s ease-in-out;
        right: 0;
      }
      .btnAbout:hover::after {
        right: auto;
        left: 0;
        width: 100%;
      }
      .btnAbout span {
        text-align: center;
        text-decoration: none;
        width: 100%;
        color: #fff;
        font-size: 1.125em;
        font-weight: 500;
        letter-spacing: 0.2em;
        z-index: 20;
        transition: all 0.3s ease-in-out;
      }
      .btnAbout:hover span {
        color: #000000;
        animation: scaleUp 0.3s ease-in-out;
      }
      @keyframes scaleUp {
      0% {
        transform: scale(1);
      }

      50% {
        transform: scale(0.95);
      }

      100% {
        transform: scale(1);
      }
    }
      `}</style>
    </header>
  );
}
