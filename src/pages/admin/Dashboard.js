/**
 * Dashboard.js
 * 
 * Description:
 * Ce composant est le conteneur principal du tableau de bord d'administration.
 * Il gère la structure de base, la navigation et le routage de l'interface d'administration.
 *
 * Fonctionnalités principales :
 * - Définit la structure de mise en page avec une barre latérale et une zone de contenu
 * - Gère le routage des différentes sections de l'administration
 * - Fournit une navigation cohérente à travers l'interface
 *
 * Structure du composant :
 * - Sidebar : Barre de navigation latérale avec les liens principaux
 * - DashboardLayout : Structure de base du tableau de bord (sidebar + contenu)
 * - Dashboard : Configuration des routes et intégration du layout
 *
 * Routes gérées :
 * - /admin : Page d'accueil du tableau de bord
 * - /admin/articles : Liste des articles
 * - /admin/articles/nouveau : Formulaire de création d'article
 * - /admin/articles/:id/modifier : Formulaire de modification d'article
 *
 * Utilisation :
 * - Ce composant est utilisé comme point d'entrée pour toutes les routes /admin/*
 * - Il est intégré dans le routeur principal de l'application
 */

import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Outlet, Navigate, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiShoppingBag, 
  FiTag, 
  FiUsers, 
  FiSettings, 
  FiFileText,
  FiChevronLeft, 
  FiChevronRight,
  FiInstagram,
  FiFacebook,
  FiLinkedin,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import getImagePath from '../../components/getImagePath';
import DashboardHome from './DashboardHome';
import ArticlesList from './ArticlesList';
import ArticleForm from './ArticleForm';
import ProductSheet from './ProductSheet';
import useChangesCart from '../../hooks/useChangesCart';
import EventsList from './EventsList';
import EventForm from './EventForm';
import SiteInfoForm from './SiteInfoForm';

// Composant Sidebar pour la navigation
const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const location = useLocation();
  const [activePath, setActivePath] = useState('');
  const { count, openModal } = useChangesCart();

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  const menuItems = [
    { path: '/admin', icon: <FiHome className="h-5 w-5" />, label: 'Tableau de bord' },
    { path: '/admin/articles', icon: <FiShoppingBag className="h-5 w-5" />, label: 'Articles' },
    { path: '/admin/events', icon: <FiUsers className="h-5 w-5" />, label: 'Événements' },
    { path: '/admin/collections', icon: <FiTag className="h-5 w-5" />, label: 'Collections' },
    { path: '/admin/site-info', icon: <FiFileText className="h-5 w-5" />, label: 'Site Infos' },
    ];

  return (
    <div 
      className={`${isCollapsed ? 'w-20' : 'w-64'} 
      bg-black/95 text-white min-h-screen flex flex-col transition-all duration-300 ease-in-out relative`}
    >
      {/* Bouton de basculement */}
      <button 
        onClick={toggleSidebar}
        className="absolute -right-5 top-6 bg-white rounded-full p-1 shadow-md text-gray-700 z-10"
        aria-label={isCollapsed ? 'Déplier le menu' : 'Replier le menu'}
      >
        {isCollapsed ? <FiChevronRight size={20} /> : <FiChevronLeft size={20} />}
      </button>
      
      <div className={`p-4 ${isCollapsed ? 'px-2' : 'px-4'} flex flex-col items-center justify-center `}>
        <Link to="/" className="flex flex-row items-center justify-center w-full">
          <img 
            src={getImagePath('LOGO_LMDB.svg', 'logo')} 
            alt="La Marque du Battant" 
            className={`${isCollapsed ? 'w-13 h-13' : 'w-14 h-14'} mb-2 cursor-pointer hover:opacity-80 transition-opacity duration-200`}
            onError={(e) => {
              console.log('Erreur de chargement du logo');
              e.target.style.display = 'none';
            }}
          />
          {!isCollapsed && (
            <span className="text-sm font-black text-left text-gray-300">
              La Marque du Battant <span className="text-xs text-gray-500">Admin</span>
            </span>
          )}
        </Link>
      </div>
      
      {/* Bouton Nouvel article */}
      <div className={`border-b mb-4 border-gray-700 px-4 py-3 ${isCollapsed ? 'px-2' : 'px-4'}`}>
        <Link
          to="/admin/articles/nouveau"
          className={`flex items-center justify-center w-full px-3 py-3 text-sm font-medium text-black bg-white rounded-md  hover:bg-white/80 transition-colors duration-300 ${
            isCollapsed ? 'justify-center p-2' : 'px-4'
          }`}
          title="Créer un nouvel article"
        >
          <svg className={`h-4 w-4 ${!isCollapsed ? 'mr-2' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {!isCollapsed && 'Nouvel article'}
        </Link>
        {/* Bouton Panier de modifications */}
        <button
          onClick={openModal}
          className={`mt-3 relative flex items-center justify-center w-full px-3 py-3 text-sm font-medium rounded-md border border-white/20 text-white hover:bg-white/10 transition-colors duration-300 ${
            isCollapsed ? 'justify-center p-2' : 'px-4'
          }`}
          title="Ouvrir le panier de modifications"
        >
          <span className={`inline-flex items-center ${!isCollapsed ? 'mr-2' : ''}`}>
            {/* simple icon */}
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 6h15l-1.5 9h-12z" />
              <path d="M6 6l-2 0" />
              <circle cx="9" cy="21" r="1" />
              <circle cx="18" cy="21" r="1" />
            </svg>
          </span>
          {!isCollapsed && 'Panier de modifications'}
          {count > 0 && (
            <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-red-600 rounded-full">
              {count}
            </span>
          )}
        </button>
      </div>
      
    <nav className="flex-1 space-y-1 mt-1">
            {menuItems.map((item) => (
            <Link
                key={item.path}
                to={item.path}
                className={`flex items-center  px-2 py-2 mx-4 rounded-md  transition-colors group ${
                activePath === item.path 
                    ? 'bg-white bg-opacity-15 backdrop-blur-2xl text-white' 
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? item.label : ''}
            >
                <span className={activePath === item.path ? 'text-white' : 'text-gray-300 group-hover:text-white'}>
                {React.cloneElement(item.icon, { className: 'h-4 w-4' })}
                </span>
                {!isCollapsed && <span className="ml-3 text-sm">{item.label}</span>}
            </Link>
            ))}
            <div className="h-12 mx-4 mt-6  border-gray-700 border-b"></div>
            <Link
                key={"/admin/parametres"}
                to={"/admin/parametres"}
                className={`flex items-center  px-2 py-4  mx-4 rounded-md  transition-colors group ${
                activePath === "/admin/parametres" 
                    ? 'bg-white bg-opacity-15 backdrop-blur-2xl text-white' 
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                } ${isCollapsed ? 'justify-center' : ''}`}
                title={isCollapsed ? "Paramètres" : ''}
            >
                <span className={activePath === "/admin/parametres" ? 'text-white' : 'text-gray-300 group-hover:text-white'}>
                {React.cloneElement(<FiSettings className="h-5 w-5" />, { className: 'h-4 w-4' })}
                </span>
                {!isCollapsed && <span className="ml-3 text-sm">Paramètres</span>}
            </Link>
    </nav>
    
      <div className={`pt-4 rounded-md bg-white/20 mt-4 ${isCollapsed ? 'mx-2 mb-12 ' : 'mx-4 mb-4'}`}>
        <div className={`flex   ${isCollapsed ? 'flex-col items-center space-y-3' : 'flex-row justify-center space-x-4'} p-3`}>
          <a 
            href="https://www.instagram.com/lamarquedubattant" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors duration-200"
            title="Instagram"
          >
            <FiInstagram size={isCollapsed ? 16 : 18} />
          </a>
          <a 
            href="https://www.facebook.com/lamarquedubattant" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors duration-200"
            title="Facebook"
          >
            <FiFacebook size={isCollapsed ? 16 : 18} />
          </a>
          <a 
            href="https://x.com/lamarquedubattant" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors duration-200"
            title="X (anciennement Twitter)"
          >
            <FaXTwitter size={isCollapsed ? 16 : 18} />
          </a>
          <a 
            href="https://www.linkedin.com/company/lamarquedubattant" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors duration-200"
            title="LinkedIn"
          >
            <FiLinkedin size={isCollapsed ? 16 : 18} />
          </a>
          <a 
            href="https://wa.me/221785936061" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors duration-200"
            title="WhatsApp"
          >
            <FaWhatsapp size={isCollapsed ? 16 : 18} />
          </a>
        </div>
        {!isCollapsed && (
          <div className="text-[10px] text-gray-500 text-center mt-2 px-2">
            © {new Date().getFullYear()} La Marque du Battant
          </div>
        )}
      </div>
    </div>
  );
};

// Layout principal du tableau de bord
const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Fonction pour basculer l'état de la sidebar
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Fermer la sidebar sur mobile lors de la navigation
  const handleNavigation = () => {
    if (window.innerWidth < 768) {
      setIsCollapsed(true);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      <div 
        className={`flex-1 overflow-auto transition-all duration-300 ${
          isCollapsed ? 'md:ml-2' : 'md:ml-4'
        }`}
        onClick={handleNavigation}
        style={{ overscrollBehavior: 'contain' }}
      >
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

// Composant principal qui définit les routes
const Dashboard = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="articles">
          <Route index element={<ArticlesList />} />
          <Route path="nouveau" element={<ArticleForm />} />
          <Route path=":id/modifier" element={<ArticleForm />} />
          <Route path=":id" element={<ProductSheet />} />
        </Route>
        <Route path="events">
          <Route index element={<EventsList />} />
          <Route path="nouveau" element={<EventForm />} />
          <Route path=":id/modifier" element={<EventForm />} />
        </Route>
        <Route path="site-info" element={<SiteInfoForm />} />
        {/* Redirection pour les routes inconnues */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
};

export default Dashboard;
