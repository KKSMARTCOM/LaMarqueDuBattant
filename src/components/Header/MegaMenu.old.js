import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
// Composants partagés
import NavigationColumn from './MegaMenu/NavigationColumn';
import ProductCards from './MegaMenu/ProductCards';
import FeaturedImage from './MegaMenu/FeaturedImage';
import FooterLinks from './MegaMenu/FooterLinks';

// Configuration des menus
const MENU_CONFIG = {
  // Configuration pour le menu HOMMES
  HOMMES: {
    title: 'HOMMES',
    navigationLinks: [
      { label: 'Nouveautés', value: '/hommes?filter=nouveautes' },
      { label: 'Vêtements', value: '/hommes?categorie=vetements' },
      { label: 'Chaussures', value: '/hommes?categorie=chaussures' },
      { label: 'Accessoires', value: '/hommes?categorie=accessoires' },
      { label: 'Collection', value: '/collection' },
      { label: 'Tous les produits', value: '/hommes' }
    ],
    featuredImage: 'hommes-header.jpg',
    featuredButtonText: 'DÉCOUVREZ LA COLLECTION HOMME',
    featuredButtonUrl: '/hommes'
  },
  
  // Configuration pour le menu FEMMES
  FEMMES: {
    title: 'FEMMES',
    navigationLinks: [
      { label: 'Nouveautés', value: '/femmes?filter=nouveautes' },
      { label: 'Vêtements', value: '/femmes?categorie=vetements' },
      { label: 'Chaussures', value: '/femmes?categorie=chaussures' },
      { label: 'Accessoires', value: '/femmes?categorie=accessoires' },
      { label: 'Collection', value: '/collection' },
      { label: 'Tous les produits', value: '/femmes' }
    ],
    featuredImage: 'femmes-header.jpg',
    featuredButtonText: 'DÉCOUVREZ LA COLLECTION FEMME',
    featuredButtonUrl: '/femmes'
  },
  
  // Configuration pour le menu SALE
  SALE: {
    title: 'SOLDES',
    navigationLinks: [
      { label: 'Hommes', value: '/hommes?filter=solde' },
      { label: 'Femmes', value: '/femmes?filter=solde' },
      { label: 'Accessoires', value: '/accessoires?filter=solde' },
      { label: 'Jusqu\'à -50%', value: '/soldes?discount=50' },
      { label: 'Toutes les promos', value: '/soldes' }
    ],
    featuredImage: 'sale-header.jpg',
    featuredButtonText: 'VOIR TOUTES LES PROMOTIONS',
    featuredButtonUrl: '/soldes'
  },
  
  // Configuration pour le menu COLLECTION
  COLLECTION: {
    title: 'COLLECTION',
    navigationLinks: [
      { label: 'Nouvelle collection', value: '/collection/nouvelle' },
      { label: 'Été', value: '/collection/ete' },
      { label: 'Hiver', value: '/collection/hiver' },
      { label: 'Automne', value: '/collection/automne' },
      { label: 'Printemps', value: '/collection/printemps' }
    ],
    featuredImage: 'collection-header.jpg',
    featuredButtonText: 'DÉCOUVREZ NOTRE COLLECTION',
    featuredButtonUrl: '/collection'
  },
  
  // Configuration pour le menu ÉVÉNEMENTS
  EVENEMENTS: {
    title: 'ÉVÉNEMENTS',
    navigationLinks: [
      { label: 'Tous les événements', value: 'all' },
      { label: 'Événements à venir', value: 'futurs' },
      { label: 'Événements passés', value: 'passe' },
      { label: 'Défilés', value: 'defiles' },
      { label: 'Expositions', value: 'expositions' },
      { label: 'Autres événements', value: 'autres' }
    ],
    featuredImage: 'evenements-header.jpg',
    featuredButtonText: 'VOIR TOUS LES ÉVÉNEMENTS',
    featuredButtonUrl: '/evenements'
  }
};

// Configuration des liens du pied de page
const FOOTER_LINKS = [
  { label: 'HOMMES', url: '/hommes' },
  { label: 'FEMMES', url: '/femmes' },
  { label: 'ACCESSOIRES', url: '/accessoires' },
  { label: 'COLLECTION', url: '/collection' },
  { label: 'ÉVÉNEMENTS', url: '/evenements' },
  { label: 'SOLDES', url: '/soldes' }
];

/**
 * MegaMenu - Composant principal du menu déroulant
 * 
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.menu - Le menu actuellement sélectionné (ex: 'HOMMES', 'FEMMES', 'SALE')
 * @param {Array} props.articles - Liste des articles à afficher
 * @param {boolean} props.loading - État de chargement
 * @returns {JSX.Element} Le composant MegaMenu rendu
 */
export default function MegaMenu({ menu, articles, loading }) {
  // =========================================================================
  // ÉTATS
  // =========================================================================
  
  // Récupération de la configuration du menu actif
  const menuConfig = MENU_CONFIG[menu] || {};
  /**
   * État pour la gestion des événements
   */
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [selectedEventFilter, setSelectedEventFilter] = useState('futurs');
  
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

  /**
   * Options de filtrage pour les événements
   * @type {Array<{label: string, value: string}>}
   */
  const eventFilters = [
    { label: 'Futurs', value: 'futurs' },
    { label: 'Récents', value: 'recents' },
    { label: 'Il y a un mois', value: 'mois' },
    { label: 'Passé', value: 'passe' },
  ];
  
  /**
   * Récupère toutes les images de toutes les collections visibles
   * @type {Array}
   */
  const allCollectionImages = collections.flatMap(col =>
    (col.images || []).map(img => ({
      ...img,
      collectionNom: col.nom
    }))
  );

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

  // =========================================================================
  // EFFETS (suite)
  // =========================================================================
  
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

  /**
   * Gère le diaporama automatique pour les collections
   */
  useEffect(() => {
    if (menu !== 'COLLECTION' || allCollectionImages.length < 2) return;
    
    const interval = setInterval(() => {
      setImageIndex(idx => (idx + 1) % allCollectionImages.length);
    }, 2500);
    
    return () => clearInterval(interval);
  }, [menu, allCollectionImages.length]);
  
  /**
   * Réinitialise l'index de l'image lors du changement de menu
   */
  useEffect(() => {
    setImageIndex(0);
  }, [menu]);

  // =========================================================================
  // DONNÉES CALCULÉES
  // =========================================================================
  
  /**
   * Configuration du menu actif avec les données dynamiques
   */
  const activeMenu = useMemo(() => {
    const config = { ...(MENU_CONFIG[menu] || {}) };
    
    // Personnalisations spécifiques au menu
    if (menu === 'COLLECTION' && collections.length > 0) {
      // Ajout des cartes de collection
      config.collectionCards = collections.length > 1 
        ? [
            { ...collections[1]?.images?.[0], nom: collections[0]?.nom },
            { ...collections[2]?.images?.[0], nom: collections[1]?.nom }
          ]
        : collections[0]?.images?.slice(0, 2).map(img => ({
            ...img,
            nom: collections[0]?.nom
          })) || [];
    }
    
    // Filtrage des événements pour le menu ÉVÉNEMENTS
    if (menu === 'EVENEMENTS') {
      config.filteredEvents = events
        .filter(event => {
          const eventDate = new Date(event.date);
          const now = new Date();
          
          switch(selectedEventFilter) {
            case 'futurs': return eventDate >= now;
            case 'passe': return eventDate < now;
            case 'mois': 
              const oneMonthAgo = new Date();
              oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
              return eventDate >= oneMonthAgo && eventDate <= now;
            case 'recents':
              return eventDate <= now;
            default: return true;
          }
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 2); // On ne garde que les 2 prochains événements
    }
    
    return config;
  }, [menu, collections, events, selectedEventFilter]);
  
  // =========================================================================
  // RENDU
  // =========================================================================
  
  // Si pas de menu sélectionné, on ne rend rien
  if (!menu) return null;
  
  // Rendu du menu COLLECTION
  if (menu === 'COLLECTION') {
    return (
      <div className="fixed left-0 right-0 top-[100px] bg-white shadow-lg z-50 h-[calc(100vh-100px)] overflow-y-auto">
        <div className="flex-1 flex px-12 py-10 justify-start animate-mega-menu-content h-full relative pr-[340px]">
          {/* Colonne de navigation */}
          <NavigationColumn 
            title={activeMenu.title}
            links={activeMenu.navigationLinks}
            className="mr-12"
          />
          
          {/* Cartes de collection */}
          <div className="flex-1">
            {collectionsLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-500">Chargement des collections...</div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-6">
                {activeMenu.collectionCards?.map((card, index) => (
                  <div key={index} className="relative group cursor-pointer">
                    <img 
                      src={card.image} 
                      alt={card.nom} 
                      className="w-full h-64 object-cover"
                    />
                    <div className="mt-2 text-sm font-medium">{card.nom}</div>
                    <div className="text-xs text-gray-500">Découvrir</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Image en vedette */}
          <FeaturedImage 
            image={activeMenu.featuredImage}
            alt={activeMenu.title}
            buttonText="DÉCOUVRIR"
            buttonUrl={activeMenu.featuredButtonUrl}
            className="absolute right-0 top-0 h-full"
          />
        </div>
        
        {/* Liens du pied de page */}
        <FooterLinks links={FOOTER_LINKS} />
      </div>
    );
  }
  
  // Rendu du menu ÉVÉNEMENTS
  if (menu === 'EVENEMENTS') {
    return (
      <div className="fixed left-0 right-0 top-[100px] bg-white shadow-lg z-50 h-[calc(100vh-100px)] overflow-y-auto">
        <div className="flex-1 flex px-12 py-10 justify-start animate-mega-menu-content h-full relative pr-[340px]">
          {/* Colonne de navigation */}
          <div className="flex flex-col mr-12">
            <NavigationColumn 
              title={activeMenu.title}
              links={activeMenu.navigationLinks}
              className="mb-8"
            />
            
            {/* Filtres d'événements */}
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-3">FILTRER PAR</h4>
              <div className="space-y-2">
                {eventFilters.map(filter => (
                  <div key={filter.value} className="flex items-center">
                    <input
                      type="radio"
                      id={`filter-${filter.value}`}
                      name="event-filter"
                      checked={selectedEventFilter === filter.value}
                      onChange={() => setSelectedEventFilter(filter.value)}
                      className="mr-2"
                    />
                    <label htmlFor={`filter-${filter.value}`} className="text-sm cursor-pointer">
                      {filter.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Liste des événements */}
          <div className="flex-1">
            {eventsLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-500">Chargement des événements...</div>
              </div>
            ) : (
              <div className="grid gap-6">
                {activeMenu.filteredEvents?.map((event, index) => (
                  <div key={index} className="border-b pb-4">
                    <div className="text-sm text-gray-500">
                      {new Date(event.date).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <h3 className="text-lg font-medium">{event.title}</h3>
                    <p className="text-sm text-gray-600">{event.description}</p>
                    <button 
                      className="mt-2 text-sm text-blue-600 hover:underline"
                      onClick={() => navigate(`/evenements/${event.id}`)}
                    >
                      En savoir plus
                    </button>
                  </div>
                ))}
                
                {!eventsLoading && (!activeMenu.filteredEvents || activeMenu.filteredEvents.length === 0) && (
                  <div className="text-gray-500 text-center py-8">
                    Aucun événement à afficher pour le moment.
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Image en vedette */}
          <FeaturedImage 
            image={activeMenu.featuredImage}
            alt={activeMenu.title}
            buttonText="VOIR TOUS LES ÉVÉNEMENTS"
            buttonUrl={activeMenu.featuredButtonUrl}
            className="absolute right-0 top-0 h-full"
          />
        </div>
        
        {/* Liens du pied de page */}
        <FooterLinks links={FOOTER_LINKS} />
      </div>
    );
  }
  
  // Rendu par défaut pour les autres menus (HOMMES, FEMMES, SALE)
  return (
    <div className="fixed left-0 right-0 top-[100px] bg-white shadow-lg z-50 h-[calc(100vh-100px)] overflow-y-auto">
      <div className="flex-1 flex px-12 py-10 justify-start animate-mega-menu-content h-full relative pr-[340px]">
        {/* Colonne de navigation */}
        <NavigationColumn 
          title={activeMenu.title}
          links={activeMenu.navigationLinks}
          className="mr-12"
        />
        
        {/* Cartes de produits */}
        <div className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Chargement des produits...</div>
            </div>
          ) : (
            <ProductCards 
              products={articles?.slice(0, 4) || []} // Limite à 4 produits
              onAddToCart={(product) => console.log('Ajouter au panier:', product)}
              className="grid grid-cols-2 gap-6"
            />
          )}
        </div>
        
        {/* Image en vedette */}
        <FeaturedImage 
          image={activeMenu.featuredImage}
          alt={activeMenu.title}
          buttonText={activeMenu.featuredButtonText}
          buttonUrl={activeMenu.featuredButtonUrl}
          className="absolute right-0 top-0 h-full"
        />
      </div>
      
      {/* Liens du pied de page */}
      <FooterLinks links={FOOTER_LINKS} />
    </div>
  );
}
    }
    
    // Vérification de la disponibilité des collections
    const collection = collections[0];
    if (!collection) {
      return <div className="flex-1 flex items-center justify-center text-gray-500 text-lg">Aucune collection disponible</div>;
    }
    // Liens de navigation pour la section collection
    const collectionLinks = ['Nouvelle collection', 'Eté', 'Hiver', 'Automne', 'Printemps'];
    
    // Préparation des cartes de collection à afficher
    // On essaie d'afficher des images de collections différentes si possible
    let collectionCards = [];
    
    // Si on a plusieurs collections, on prend une image de chaque
    if (collections.length > 1) {
      collectionCards = [
        // Première carte : première image de la deuxième collection
        { ...collections[1].images[0], nom: collections[0].nom },
        // Deuxième carte : première image de la troisième collection
        { ...collections[2].images[0], nom: collections[1].nom }
      ];
    } 
    // Si une seule collection, on prend ses deux premières images
    else if (collections.length === 1) {
      collectionCards = collections[0].images
        .slice(0, 2) // Prendre les deux premières images
        .map(img => ({ 
          ...img, 
          nom: collections[0].nom 
        }));
    }
    return (
      <>
        {/* =========================================================== */}
        {/* SECTION PRINCIPALE DU MEGAMENU - COLLECTION */}
        {/* =========================================================== */}
        
        {/* Conteneur principal du menu */}
        <div className="flex-1 flex px-12 py-10 justify-start animate-mega-menu-content h-full relative">
          
          {/* ========================================================= */}
          {/* COLONNE DE GAUCHE : LIENS DE NAVIGATION */}
          {/* ========================================================= */}
          <div 
            className="flex flex-col mr-12 min-w-[180px] items-start text-left animate-mega-menu-column" 
            style={{ animationDelay: '0.1s' }}
          >
            {/* Titre de la section */}
            <span className="font-bold text-[13px] mb-3 tracking-wide uppercase">
              COLLECTION
            </span>
            
            {/* Liste des liens de navigation */}
            {collectionLinks.map(link => (
              <a 
                key={link} 
                className="text-[12px] text-black mb-2 hover:underline cursor-pointer text-left"
              >
                {link}
              </a>
            ))}
          </div>
          
          {/* ========================================================= */}
          {/* CARTES DES COLLECTIONS */}
          {/* ========================================================= */}
          <div className="flex flex-row gap-8 items-stretch">
            {collectionCards.map(card => (
              // Carte individuelle de collection
              <div 
                key={card.file} 
                className="w-[220px] h-[280px] group relative overflow-hidden shadow hover:shadow-lg border border-gray-100 bg-black flex flex-col justify-end"
              >
                {/* Image de la collection */}
                <img 
                  src={getImagePath(card.file, 'cover')} 
                  alt={card.text} 
                  className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-300 group-hover:scale-105" 
                />
                
                {/* Overlay de dégradé pour améliorer la lisibilité */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
                
                {/* Titre de la collection */}
                <div className="relative z-20 p-4 text-white">
                  <h3 className="font-bold text-xs text-left mb-1">| {card.nom}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================== */}
        {/* COLONNE DE DROITE : IMAGE EN GRAND FORMAT */}
        {/* =========================================================== */}
        <div 
          className="relative w-[340px] h-full flex-shrink-0 flex items-center justify-center animate-mega-menu-image" 
          style={{ animationDelay: '0.4s' }}
        >
          {/* Diaporama des images de collection */}
          {allCollectionImages.map((img, idx) => (
            <img
              key={img.file + '-' + idx}
              src={getImagePath(img.file, 'cover')}
              alt={img.text || img.collectionNom}
              className={`absolute top-0 left-0 w-full h-full object-cover z-10 transition-opacity duration-700 ${
                imageIndex === idx ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ transitionProperty: 'opacity' }}
            />
          ))}
          
          {/* Bouton d'action principal */}
          <button className="absolute left-1/2 bottom-12 -translate-x-1/2 bg-white text-black px-8 py-3 font-semibold uppercase shadow text-[15px] tracking-wider z-20">
            DÉCOUVREZ
          </button>
        </div>
        
        {/* =========================================================== */}
        {/* BARRE DE LIENS INFÉRIEURE */}
        {/* =========================================================== */}
        <div 
          className="px-12 absolute left-0 bottom-0 w-full bg-white border-t border-gray-200 flex justify-start space-x-8 py-2 text-[10px] animate-mega-menu-footer" 
          style={{ animationDelay: '0.5s' }}
        >
          {megaMenuFooterLinks.map((link, i) => (
            <a 
              key={i} 
              className="text-black hover:underline cursor-pointer"
            >
              {link}
            </a>
          ))}
        </div>
      </>
    );
  }

  // =========================================================================
  // RENDU DU MENU ÉVÉNEMENTS
  // =========================================================================
  if (menu === 'EVENEMENTS') {
    // Tri des événements par date croissante et sélection des deux premiers
    const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
    const filteredEvents = sortedEvents.slice(0, 2); // On ne garde que les 2 prochains événements
    return (
      <>
        {/* =========================================================== */}
        {/* SECTION PRINCIPALE DU MEGAMENU - ÉVÉNEMENTS */}
        {/* =========================================================== */}
        <div className="flex-1 flex px-12 py-10 justify-start animate-mega-menu-content h-full relative pr-[340px]">
          
          {/* ========================================================= */}
          {/* COLONNE DE GAUCHE : FILTRES D'ÉVÉNEMENTS */}
          {/* ========================================================= */}
          <div 
            className="flex flex-col mr-12 min-w-[180px] items-start text-left animate-mega-menu-column" 
            style={{ animationDelay: '0.1s' }}
          >
            <span className="font-bold text-[13px] mb-3 tracking-wide uppercase">
              EVENEMENTS
            </span>
            
            {/* Liste des filtres d'événements (actuellement désactivés) */}
            {eventFilters.map(f => (
              <button
                key={f.value}
                className="text-[12px] mb-2 text-left hover:underline cursor-pointer text-gray-700"
                style={{ outline: 'none' }}
                disabled
              >
                {f.label}
              </button>
            ))}
          </div>
          {/* ========================================================= */}
          {/* CARTES D'ÉVÉNEMENTS */}
          {/* ========================================================= */}
          <div className="flex flex-row gap-8 items-stretch">
            {eventsLoading ? (
              // État de chargement
              <div className="text-gray-500 text-sm">Chargement...</div>
            ) : filteredEvents.length === 0 ? (
              // Aucun événement à afficher
              <div className="text-gray-500 text-sm">Aucun événement</div>
            ) : (
              // Affichage des cartes d'événements
              filteredEvents.map(event => (
                <div 
                  key={event.id} 
                  className="w-[230px] h-[280px] group relative overflow-hidden shadow hover:shadow-lg border border-gray-100 bg-black flex flex-col justify-end"
                >
                  {/* Image de l'événement */}
                  <img
                    src={getImagePath(event.image, 'events')}
                    alt={event.titre}
                    className="absolute inset-0 w-full h-full object-cover z-0"
                  />
                  
                  {/* Overlay de dégradé avec effet de flou au survol */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10 transition-all duration-200 group-hover:backdrop-blur-sm" />
                  
                  {/* Contenu textuel de la carte */}
                  <div className="absolute left-0 bottom-0 w-full p-3 z-20">
                    <div className="text-[11px] md:text-xs font-semibold text-left mb-1 md:mb-0.5 text-white drop-shadow">
                      {event.titre}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] md:text-xs text-gray-200 drop-shadow">
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                      <span className="ml-2">{event.lieu}</span>
                    </div>
                  </div>
                  
                  {/* Bouton "Voir" qui apparaît au survol */}
                  <Link
                    to={"/events"}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 z-30"
                    style={{ textDecoration: 'none' }}
                  >
                    <span className="bg-white text-black px-6 py-2 font-semibold text-sm tracking-wider shadow-lg flex items-center gap-2">
                      Voir <span className="text-lg">&gt;</span>
                    </span>
                  </Link>
                </div>
              ))
            )}
          </div>
          {/* ========================================================= */}
          {/* COLONNE DE DROITE : IMAGE EN GRAND FORMAT */}
          {/* ========================================================= */}
          <div 
            className="absolute right-0 top-0 w-[340px] h-full flex flex-col items-center justify-center animate-mega-menu-image flex-shrink-0" 
            style={{ animationDelay: '0.4s' }}
          >
            {/* Image d'arrière-plan pour la section événements */}
            <img
              src={megaMenuImages['EVENEMENTS']}
              alt="Mega menu"
              className="absolute top-0 left-0 w-full h-full object-cover z-10"
            />
            
            {/* Bouton d'action principal */}
            <button 
              className="absolute left-1/2 bottom-12 -translate-x-1/2 bg-white text-black px-8 py-3 font-semibold uppercase shadow text-[15px] tracking-wider z-20"
              onClick={() => {
                // TODO: Ajouter la navigation vers la page événements
                navigate('/events');
              }}
            >
              DÉCOUVREZ
            </button>
          </div>
        </div>
        
        {/* =========================================================== */}
        {/* BARRE DE LIENS INFÉRIEURE */}
        {/* =========================================================== */}
        <div 
          className="px-12 absolute left-0 bottom-0 w-full bg-white border-t border-gray-200 flex justify-start space-x-8 py-2 text-[10px] animate-mega-menu-footer" 
          style={{ animationDelay: '0.5s' }}
        >
          {megaMenuFooterLinks.map((link, i) => (
            <a 
              key={i} 
              className="text-black hover:underline cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                // TODO: Ajouter la navigation vers les différentes sections
                console.log(`Navigation vers: ${link}`);
              }}
            >
              {link}
            </a>
          ))}
        </div>
      </>
    );
  }

  // =========================================================================
  // PRÉPARATION DES DONNÉES POUR LES MENUS CLASSIQUES (HOMMES, FEMMES, SALE)
  // =========================================================================
  let filtered = [];
  
  // Filtrage des articles en fonction du menu sélectionné
  if (menu === 'HOMMES') {
    filtered = articles.filter(a => a.sexe && a.sexe.toLowerCase() === 'homme');
  } else if (menu === 'FEMMES') {
    filtered = articles.filter(a => a.sexe && a.sexe.toLowerCase() === 'femme');
  } else if (menu === 'SALE') {
    // Pour la section SALE, on filtre les articles avec une réduction
    filtered = articles.filter(a => a.discount_percent && a.discount_percent > 0);
  }
  
  // Extraction des catégories uniques et sélection des 2 premiers articles
  const categories = [...new Set(filtered.map(a => a.category))];
  const articlesToShow = filtered.slice(0, 2); // On ne garde que 2 articles pour l'affichage

  // Si le menu n'est pas reconnu ou que les données sont en cours de chargement
  if (!['HOMMES', 'FEMMES', 'SALE'].includes(menu) || loading) return null;

  return (
    <>
      {/* =========================================================== */}
      {/* SECTION PRINCIPALE DU MEGAMENU - MENUS CLASSIQUES */}
      {/* =========================================================== */}
      <div className="flex-1 flex px-12 py-10 justify-start animate-mega-menu-content">
        
        {/* ========================================================= */}
        {/* COLONNE DE GAUCHE : CATÉGORIES */}
        {/* ========================================================= */}
        <div 
          className="flex flex-col mr-12 min-w-[180px] items-start text-left animate-mega-menu-column" 
          style={{ animationDelay: '0.1s' }}
        >
          <span className="font-bold text-[13px] mb-3 tracking-wide uppercase">
            {menu}
          </span>
          
          {/* Liste des catégories disponibles */}
          {categories.map((cat, idx) => (
            <a 
              key={cat+idx} 
              className="text-[12px] text-black mb-2 hover:underline cursor-pointer text-left"
              onClick={() => {
                // TODO: Ajouter la navigation vers la page produits avec le filtre de catégorie
                navigate(`/products?categorie=${encodeURIComponent(cat)}`);
              }}
            >
              {cat}
            </a>
          ))}
        </div>
        {/* ========================================================= */}
        {/* CARTES DES ARTICLES MIS EN AVANT */}
        {/* ========================================================= */}
        <div className="flex flex-row gap-8">
          {articlesToShow.map((article, idx) => (
            <div 
              key={article.id} 
              className="w-[230px] h-[280px] group relative overflow-hidden shadow hover:shadow-lg border border-gray-100 bg-black"
              onClick={() => {
                // Navigation vers la page de détail de l'article
                navigate(`/product/${article.id}`);
              }}
              style={{ cursor: 'pointer' }}
            >
              {/* Image de l'article */}
              <img
                src={article.image && article.image.startsWith('http') ? article.image : `/assets/images/ProductsImages/${article.image}`}
                alt={article.title}
                className="absolute inset-0 w-full h-full object-cover z-0"
                onError={(e) => {
                  e.target.onerror = null; // Évite les boucles d'erreur
                  e.target.src = '/assets/images/placeholder-product.jpg';
                }}
              />
              
              {/* Badge de réduction (si applicable) */}
              {article.discount_percent > 0 && (
                <span className="absolute top-2 right-2 bg-white text-black text-[10px] md:text-[11px] font-bold px-2 py-1 z-10 shadow">
                  -{article.discount_percent}%
                </span>
              )}
              
              {/* Overlay avec détails de l'article (apparaît au survol) */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4 z-10">
                <div className="text-white text-sm font-medium mb-1">{article.title}</div>
                <div className="flex items-center gap-2">
                  {article.discount_percent > 0 ? (
                    // Affichage du prix barré + prix réduit si réduction
                    <>
                      <span className="text-white text-sm font-bold">
                        {(article.price - (article.price * article.discount_percent / 100)).toFixed(2)}€
                      </span>
                      <span className="text-gray-300 text-xs line-through">{article.price}€</span>
                      <span className="text-red-400 text-xs font-bold ml-1">-{article.discount_percent}%</span>
                    </>
                  ) : (
                    // Affichage du prix normal
                    <span className="text-white text-sm font-bold">{article.price}€</span>
                  )}
                </div>
                
                {/* Bouton d'action rapide (apparaît au survol) */}
                <button 
                  className="mt-3 bg-white text-black text-xs font-semibold py-2 px-4 w-full text-center hover:bg-gray-100 transition-colors duration-200"
                  onClick={(e) => {
                    e.stopPropagation(); // Empêche la navigation vers la fiche produit
                    // TODO: Ajouter l'article au panier
                    console.log('Ajouter au panier:', article.id);
                  }}
                >
                  AJOUTER AU PANIER
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* ========================================================= */}
      {/* COLONNE DE DROITE : IMAGE EN GRAND FORMAT */}
      {/* ========================================================= */}
      <div 
        className="relative w-[340px] h-full flex-shrink-0 flex items-center justify-center animate-mega-menu-image" 
        style={{ animationDelay: '0.4s' }}
      >
        <img
          src={megaMenuImages[menu || 'HOMMES']}
          alt="Mega menu"
          className="absolute top-0 left-0 w-full h-full object-cover z-10"
        />
        <button 
          className="absolute left-1/2 bottom-12 -translate-x-1/2 bg-white text-black px-8 py-3 font-semibold uppercase shadow text-[15px] tracking-wider z-20"
          onClick={() => {
            // Navigation vers la page appropriée selon le menu
            const targetPage = menu === 'SALE' ? '/soldes' : `/${menu.toLowerCase()}`;
            navigate(targetPage);
          }}
        >
          DÉCOUVREZ
        </button>
      </div>
      
      {/* ========================================================= */}
      {/* BARRE DE LIENS INFÉRIEURE */}
      {/* ========================================================= */}
      <div 
        className="px-12 absolute left-0 bottom-0 w-full bg-white border-t border-gray-200 flex justify-start space-x-8 py-2 text-[10px] animate-mega-menu-footer" 
        style={{ animationDelay: '0.5s' }}
      >
        {megaMenuFooterLinks.map((link, i) => (
          <a 
            key={i} 
            className="text-black hover:underline cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              // TODO: Implémenter la navigation pour chaque lien
              console.log(`Navigation vers: ${link}`);
            }}
          >
            {link}
          </a>
        ))}
      </div>
    </>
  );
} 