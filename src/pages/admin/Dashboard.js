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
import { Routes, Route, Link, Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FiHome, 
  FiShoppingBag, 
  FiUsers, 
  FiTag, 
  FiFileText, 
  FiChevronLeft, 
  FiChevronRight, 
  FiSettings, 
  FiLogOut,
} from 'react-icons/fi';
import getImagePath from '../../components/getImagePath';
import DashboardHome from './DashboardHome';
import ArticlesList from './ArticlesList';
import ArticleForm from './ArticleForm';
import ProductSheet from './ProductSheet';
import useChangesCart from '../../hooks/useChangesCart';
import EventsList from './EventsList';
import EventForm from './EventForm';
import SiteInfoForm from './SiteInfoForm';

/**
 * Composant Sidebar - Barre latérale de navigation du tableau de bord
 * 
 * @param {boolean} isCollapsed - État de réduction de la barre latérale
 * @param {function} toggleSidebar - Fonction pour basculer l'état de réduction
 * 
 * Fonctionnalités :
 * - Affiche la navigation principale de l'administration
 * - Gère la déconnexion de l'utilisateur
 * - Affiche les compteurs de modifications en attente
 * - Adapte l'interface en mode réduit/étendu
 */
const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activePath, setActivePath] = useState('');
  const { count, openModal } = useChangesCart();
  const { user, logout } = useAuth(); // Accès aux méthodes d'authentification

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
      className={`${isCollapsed ? 'w-20' : 'w-72'} 
      bg-gradient-to-b from-black/100 to-black/80 text-white min-h-screen flex flex-col transition-all duration-300 ease-in-out relative border-r border-gray-700`}
    >
      {/* Bouton de basculement */}
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-6 bg-white hover:bg-gray-100 rounded-full p-1.5 shadow-lg text-gray-800 z-10 transition-all duration-200 transform hover:scale-110"
        aria-label={isCollapsed ? 'Déplier le menu' : 'Replier le menu'}
      >
        {isCollapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
      </button>

      {/* En-tête avec logo */}
      <div className={`p-4 ${isCollapsed ? 'px-2' : 'px-6'} flex flex-col items-center justify-center border-b border-gray-700 pb-6`}>
        <Link to="/" className="flex flex-row items-center justify-center w-full group">
          <div className={`${isCollapsed ? 'w-12 h-12' : 'w-14 h-14'} mb-2 overflow-hidden rounded-full bg-white p-1.5 transition-all duration-300 group-hover:shadow-lg group-hover:scale-105`}>
            <img 
              src={getImagePath('LOGO_LMDB_noir_sb.png', 'logo')} 
              alt="La Marque du Battant" 
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/LOGO_LMDB_noir_sb.png';
              }}
            />
          </div>
        </Link>
        {!isCollapsed && (
          <div className="text-center">
            <h1 className="text-lg font-bold text-white">
              La Marque du Battant
            </h1>
            <p className="text-xs text-gray-400 mt-1">Tableau de bord</p>
          </div>
        )}
      </div>
      
      {/* Bouton Nouveau avec menu déroulant */}
      <div className={`border-b mb-4 border-gray-700 px-4 py-3 ${isCollapsed ? 'px-2' : 'px-4'}`}>
        <div className="relative group">
          <button
            className={`flex items-center justify-center w-full px-3 py-3 text-sm font-medium text-black bg-white rounded-md hover:bg-white/80 transition-colors duration-300 ${
              isCollapsed ? 'justify-center p-2' : 'px-4'
            }`}
            title="Créer un nouvel élément"
          >
            <svg className={`h-4 w-4 ${!isCollapsed ? 'mr-2' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {!isCollapsed && 'Nouveau'}
          </button>
          
          {/* Menu déroulant */}
          <div className="absolute left-0 right-0 mt-1 w-full bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <Link
              to="/admin/articles/nouveau"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Nouvel article
            </Link>
            <Link
              to="/admin/events/nouveau"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Nouvel événement
            </Link>
          </div>
        </div>
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
      
      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 ">
        {menuItems.map((item) => {
          const isActive = activePath === item.path || 
                         (item.path !== '/admin' && activePath.startsWith(item.path));
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-white/10 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              } ${isCollapsed ? 'justify-center px-2' : 'pl-4'}`}
            >
              <span className={`flex-shrink-0 transition-transform duration-200 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                {React.cloneElement(item.icon, {
                  className: `h-5 w-5 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`
                })}
              </span>
              {!isCollapsed && (
                <>
                  <span className="ml-3">{item.label}</span>
                  {count > 0 && item.path === '/admin/changes' && (
                    <span className="ml-auto inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold bg-red-500 text-white">
                      {count}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>
      
      {/* Section du bas */}
      <div className="mt-auto pt-2">
        {/* Paramètres */}
        <Link
          to={"/admin/parametres"}
          className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg mx-2 transition-all duration-200 ${
            activePath === "/admin/parametres" 
              ? 'bg-white/10 text-white shadow-lg'
              : 'text-gray-300 hover:bg-white/5 hover:text-white'
          } ${isCollapsed ? 'justify-center px-2' : 'pl-4'}`}
        >
          <span className={`flex-shrink-0 transition-transform duration-200 ${activePath === "/admin/parametres" ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
            {React.cloneElement(<FiSettings className="h-5 w-5" />, {
              className: `h-5 w-5 ${activePath === "/admin/parametres" ? 'scale-110' : 'group-hover:scale-110'}`
            })}
          </span>
          {!isCollapsed && <span className="ml-3">Paramètres</span>}
        </Link>

        {/* Bouton de déconnexion */}
        <button
          onClick={() => {
            logout();
            navigate('/admin/login');
          }}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-4'} py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-lg mx-2 transition-colors duration-200`}
          title={isCollapsed ? "Se déconnecter" : ""}
        >
          <FiLogOut className="h-5 w-5" />
          {!isCollapsed && <span className="ml-3">Se déconnecter</span>}
        </button>
      </div>
      {/* Footer avec copyright */}
      {!isCollapsed && (
        <div className="text-[10px] text-gray-500 text-center mt-2 px-2 pb-4">
          &copy; {new Date().getFullYear()} La Marque du Battant
        </div>
      )}
    </div>
  );
};

// Layout principal du tableau de bord
const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  
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
        <Route path="parametres" element={<div>Paramètres (à implémenter)</div>} />
        {/* Redirection pour les routes inconnues */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
};

export default Dashboard;
