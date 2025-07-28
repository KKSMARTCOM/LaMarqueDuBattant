import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import getImagePath from '../../../getImagePath';
import MegaMenuNavColumn from '../MegaMenuNavColumn';
import MegaMenuRightColumn from '../MegaMenuRightColumn';
import MegaMenuFooter from '../MegaMenuFooter';

/**
 * Section Événements du MegaMenu
 * 
 * @param {Object} props - Les propriétés du composant
 * @param {Array} props.events - Liste des événements à afficher
 * @param {boolean} props.loading - État de chargement
 * @param {string} props.selectedFilter - Filtre d'événement sélectionné
 * @param {Function} props.onFilterChange - Gestionnaire de changement de filtre
 * @param {Array} props.footerLinks - Liens à afficher dans le footer
 * @param {Function} props.onFooterLinkClick - Gestionnaire de clic sur les liens du footer
 * @returns {JSX.Element} Le composant EventsSection rendu
 */
const EventsSection = ({ 
  events = [], 
  loading = false, 
  selectedFilter = 'tous',
  onFilterChange = () => {},
  footerLinks = [],
  onFooterLinkClick = () => {}
}) => {
  // Configuration des filtres d'événements
  const eventFilters = useMemo(() => [
    { 
      label: 'Tous les événements', 
      value: 'tous', 
      onClick: () => onFilterChange('tous') 
    },
    { 
      label: 'Événements à venir', 
      value: 'futurs', 
      onClick: () => onFilterChange('futurs') 
    },
    { 
      label: 'Événements passés', 
      value: 'passes', 
      onClick: () => onFilterChange('passes') 
    },
    
  ], [onFilterChange]);

  // Filtrage des événements en fonction du filtre sélectionné
  const filteredEvents = useMemo(() => {
    if (!events || events.length === 0) return [];
    
    const now = new Date();
    return events
      .filter(event => {
        const eventDate = new Date(event.date);
        if (selectedFilter === 'futurs') return eventDate >= now;
        if (selectedFilter === 'passes') return eventDate < now;
        return true; // Tous les événements
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 2); // On ne garde que les 2 premiers événements
  }, [events, selectedFilter]);

  // État de chargement
  if (loading) {
    return <div className="flex-1 flex items-center justify-center text-gray-500 text-lg">Chargement des événements...</div>;
  }

  return (
    <>
      <div className="flex-1 flex px-12 py-10 justify-start animate-mega-menu-content h-full relative">
        {/* Colonne de gauche : Filtres d'événements */}
        <MegaMenuNavColumn 
          title="ÉVÉNEMENTS"
          items={eventFilters}
          className="mr-12"
          itemClassName={({ isActive }) => 
            `text-[12px] mb-2 text-left hover:underline cursor-pointer ${isActive ? 'font-bold' : 'text-gray-700'}`
          }
        />
        
        {/* Cartes d'événements */}
        <div className="flex flex-row gap-8 items-stretch">
          {filteredEvents.length === 0 ? (
            <div className="text-gray-500 text-sm">Aucun événement à afficher</div>
          ) : (
            filteredEvents.map(event => (
              <div 
                key={event.id} 
                className="w-[230px] h-[280px] group relative overflow-hidden shadow hover:shadow-lg border border-gray-100 bg-black flex flex-col justify-end"
              >
                {/* Image de l'événement */}
                <img
                  src={getImagePath(event.image, 'events')}
                  alt={event.titre}
                  className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Overlay de dégradé avec effet de flou au survol */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10 group-hover:backdrop-blur-sm transition-all duration-300" />
                
                {/* Contenu de l'événement */}
                <div className="relative z-20 p-4 text-white">
                  <div className="text-[10px] uppercase tracking-wider mb-1">
                    {new Date(event.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <h3 className="font-bold text-sm mb-2">{event.titre}</h3>
                  <p className="text-xs text-gray-300 line-clamp-2">{event.description}</p>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Colonne de droite avec image */}
        <MegaMenuRightColumn
          imageUrl={getImagePath('hero.webp', 'cover')}
          buttonText="TOUS LES ÉVÉNEMENTS"
          altText="Événements"
          onButtonClick={() => {
            if (typeof onFooterLinkClick === 'function') {
              onFooterLinkClick('events');
            }
          }}
        />
      </div>

      {/* Barre de liens inférieure */}
      <MegaMenuFooter 
        links={footerLinks} 
        onLinkClick={onFooterLinkClick}
        className="absolute bottom-0 left-0 w-full"
      />
    </>
  );
};

export default EventsSection;
