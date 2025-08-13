import React, { useMemo } from 'react';
import MegaMenuNavColumn from '../MegaMenuNavColumn';
import MegaMenuRightColumn from '../MegaMenuRightColumn';
import MegaMenuFooter from '../MegaMenuFooter';
import getImagePath from '../../../getImagePath';

/**
 * Section Collection du MegaMenu
 * 
 * @param {Object} props - Les propriétés du composant
 * @param {Array} props.collections - Liste des collections à afficher
 * @param {boolean} props.loading - État de chargement
 * @param {Array} props.footerLinks - Liens à afficher dans le footer
 * @param {Function} props.onFooterLinkClick - Gestionnaire de clic sur les liens du footer
 * @param {Function} props.onNavItemClick - Gestionnaire de clic sur les éléments de navigation
 * @returns {JSX.Element} Le composant CollectionSection rendu
 */
const CollectionSection = ({ 
  collections = [], 
  loading = false, 
  footerLinks = [],
  onFooterLinkClick = () => {},
  onNavItemClick = () => {}
}) => {
  // Configuration des liens de navigation pour la section collection
  const collectionNavItems = useMemo(() => [
    { 
      label: 'Nouvelle collection', 
      value: 'nouvelle', 
      url: '/collection/nouvelle', 
    },
    { 
      label: 'Eté', 
      value: 'ete', 
      url: '/collection/ete', 
    },
    { 
      label: 'Hiver', 
      value: 'hiver', 
      url: '/collection/hiver', 
    },
    { 
      label: 'Automne', 
      value: 'automne', 
      url: '/collection/automne', 
    },
    { 
      label: 'Printemps', 
      value: 'printemps', 
      url: '/collection/printemps', 
    }
  ], []);
  
  // Sélectionne deux collections aléatoires de manière stable
  const selectedCollections = useMemo(() => {
    if (!collections || collections.length === 0) return [];
    
    // Si on a moins de 2 collections, on les prend toutes
    if (collections.length <= 2) return [...collections];
    
    // Créer une copie du tableau pour ne pas modifier l'original
    const shuffled = [...collections];
    
    // Mélanger le tableau (algorithme de Fisher-Yates)
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Prendre les deux premières collections du tableau mélangé
    return shuffled.slice(0, 2);
  }, [collections]);
  
  // Préparation des cartes de collection à afficher
  const collectionCards = useMemo(() => {
    if (!selectedCollections || selectedCollections.length === 0) return [];
    
    return selectedCollections.map(collection => ({
      ...(collection.images?.[0] || {}), // Prend la première image de la collection
      nom: collection.nom || 'Collection',
      collectionId: collection.id // Ajout d'un ID de collection pour la clé unique
    }));
  }, [selectedCollections]);

  // État de chargement des collections
  if (loading) {
    return <div className="flex-1 flex items-center justify-center text-gray-500 text-lg">Chargement...</div>;
  }
  
  // Vérification de la disponibilité des collections
  if (!collections || collections.length === 0) {
    return <div className="flex-1 flex items-center justify-center text-gray-500 text-lg">Aucune collection disponible</div>;
  }
  
  return (
    <>
      {/* Conteneur principal du menu */}
      <div className="flex-1 flex px-12 py-10 justify-start animate-mega-menu-content h-full relative">
        {/* Colonne de navigation */}
        <MegaMenuNavColumn 
          title="COLLECTION"
          items={collectionNavItems}
          className="mr-12"
        />
        
        {/* Cartes des collections */}
        <div className="flex flex-row gap-8 items-stretch">
          {collectionCards.map((card, index) => (
            <div 
              key={`${card.collectionId || index}`}
              className="w-[220px] h-[280px] group relative overflow-hidden shadow hover:shadow-lg border border-gray-100 bg-black flex flex-col justify-end cursor-pointer"
              onClick={() => onNavItemClick(`collection-${card.collectionId || index}`)}
            >
              {card.file ? (
                <img 
                  src={getImagePath(card.file, 'cover')} 
                  alt={card.nom} 
                  className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-300 group-hover:scale-105" 
                />
              ) : (
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Aucune image</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
              <div className="relative z-20 p-4 text-white">
                <h3 className="font-bold text-xs text-left mb-1">| {card.nom}</h3>
              </div>
            </div>
          ))}
        </div>
        
        {/* Colonne de droite avec image */}
        <MegaMenuRightColumn
          imageUrl={collections[0].images[0] ? getImagePath(collections[0].images[0].file, 'cover') : getImagePath('hero.webp', 'cover')}
          buttonText="DÉCOUVREZ"
          altText={collections[0].nom || "Collection"}
          onButtonClick={() => onFooterLinkClick('COLLECTION')}
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

export default CollectionSection;
