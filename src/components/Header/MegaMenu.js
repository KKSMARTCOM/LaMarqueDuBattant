import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import getImagePath from '../getImagePath';

// Import des composants de section
import CollectionSection from './MegaMenu/sections/CollectionSection';
import ArticlesSection from './MegaMenu/sections/ArticlesSection';
import EventsSection from './MegaMenu/sections/EventsSection';

/**
 * MegaMenu - Composant principal du menu déroulant
 * 
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.menu - Le menu actuellement sélectionné (ex: 'HOMMES', 'FEMMES', 'SOLDE')
 * @param {Array} props.articles - Liste des articles à afficher
 * @param {boolean} props.loading - État de chargement
 * @param {Function} props.onClose - Fonction à appeler pour fermer le menu
 * @returns {JSX.Element} Le composant MegaMenu rendu
 */
export default function MegaMenu({ menu, articles, loading, onClose }) {
  // =========================================================================
  // CONFIGURATION
  // =========================================================================

  /**
   * Mappage des images d'en-tête pour chaque section du menu
   * @type {Object.<string, string>}
   */
  const megaMenuImages = {
    HOMMES: getImagePath("hero1.jpg", "cover"),
    FEMMES: getImagePath("hero.webp", "cover"),
    COLLECTION: getImagePath("hero.webp", "cover"),
    EVENEMENTS: getImagePath("hero.webp", "cover"),
    SOLDE: getImagePath("hero.webp", "cover"),
  };

  /**
   * Liens à afficher dans le pied du menu
   * @type {string[]}
   */
  const megaMenuFooterLinks = [
    'ACCUEIL', 'PRODUITS', 'EVENEMENTS', 'COLLECTION', 'SOLDE'
  ];

  // =========================================================================
  // ÉTATS
  // =========================================================================

  /**
   * État pour la gestion des événements
   */
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [selectedEventFilter, setSelectedEventFilter] = useState('tous');
  
  /**
   * État pour la gestion des collections
   */
  const [collections, setCollections] = useState([]);
  const [collectionsLoading, setCollectionsLoading] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  
  /**
   * Hook de navigation
   */
  const navigate = useNavigate();

  // =========================================================================
  // EFFETS
  // =========================================================================

  /**
   * Charge les événements lorsque le menu 'ÉVÉNEMENTS' est sélectionné
   */
  useEffect(() => {
    if (menu === 'EVENEMENTS') {
      setEventsLoading(true);
      fetch('/data/events.json')
        .then(res => res.json())
        .then(data => {
          setEvents(data);
          setEventsLoading(false);
        })
        .catch((error) => {
          console.error('Erreur lors du chargement des événements:', error);
          setEventsLoading(false);
        });
    }
  }, [menu]);

  /**
   * Charge les collections lorsque le menu 'COLLECTION' est sélectionné
   */
  useEffect(() => {
    if (menu === 'COLLECTION') {
      setCollectionsLoading(true);
      fetch('/data/collection.json')
        .then(res => res.json())
        .then(data => {
          setCollections(data.filter(col => col.visible !== false));
          setCollectionsLoading(false);
        })
        .catch((error) => {
          console.error('Erreur lors du chargement des collections:', error);
          setCollectionsLoading(false);
        });
    }
  }, [menu]);

  // =========================================================================
  // GESTIONNAIRES D'ÉVÉNEMENTS
  // =========================================================================

  /**
   * Gestionnaire de clic sur les liens du footer
   * @param {string} link - Lien sur lequel l'utilisateur a cliqué
   */
  const handleFooterLinkClick = (link) => {
    // Fermer le menu déroulant
    if (typeof onClose === 'function') {
      onClose();
    }
    
    // Navigation vers la section correspondante
    let path = "";
    if (link === "ACCUEIL"){
      path = "/";
    }
    else if(link === "PRODUITS"){
      path = "/produits";
    }
    else if(link === "EVENEMENTS"){
      path = "/events";
    }
    else if(link === "COLLECTION"){
      path = "/produits";
    }
    else{
      path = "/produits";
    }
    navigate(path);
  };

  /**
   * Gestionnaire de clic sur un élément de navigation
   * @param {string} value - URL ou chemin de navigation
   */
  const handleNavItemClick = (value) => {
    // Fermer le menu déroulant
    if (typeof onClose === 'function') {
      onClose();
    }
    
    // Si la valeur commence par /, c'est une URL complète
    if (value.startsWith('/')) {
      navigate(value);
    } else {
      // Sinon, on construit le chemin à partir du menu actuel
      const path = `/${menu.toLowerCase()}/${value.toLowerCase()}`;
      navigate(path);
    }
  };

  // =========================================================================
  // RENDU PRINCIPAL
  // =========================================================================
  
  // Sélection du composant de section à afficher en fonction du menu actif
  const renderSection = () => {
    switch (menu) {
      case 'COLLECTION':
        return (
          <CollectionSection 
            collections={collections}
            loading={collectionsLoading}
            footerLinks={megaMenuFooterLinks}
            onFooterLinkClick={handleFooterLinkClick}
            onNavItemClick={handleNavItemClick}
          />
        );
        
      case 'HOMMES':
      case 'FEMMES':
      case 'SOLDE':
        // Filtrage des articles en fonction du menu sélectionné
        const filteredArticles = menu === 'HOMMES' 
          ? articles.filter(a => a.sexe && a.sexe.toLowerCase() === 'homme')
          : menu === 'FEMMES'
          ? articles.filter(a => a.sexe && a.sexe.toLowerCase() === 'femme')
          : articles.filter(a => a.discount_percent && a.discount_percent > 0);
          
        return (
          <ArticlesSection
            title={menu}
            articles={filteredArticles}
            footerLinks={megaMenuFooterLinks}
            onFooterLinkClick={handleFooterLinkClick}
            rightColumnImage={megaMenuImages[menu] || 'hero.webp'}
          />
        );
        
      case 'EVENEMENTS':
        return (
          <EventsSection
            events={events}
            loading={eventsLoading}
            selectedFilter={selectedEventFilter}
            onFilterChange={setSelectedEventFilter}
            footerLinks={megaMenuFooterLinks}
            onFooterLinkClick={handleFooterLinkClick}
          />
        );
        
      default:
        return null;
    }
  };
  
  // Rendu du contenu du menu en fonction de la section active
  return renderSection();
}
