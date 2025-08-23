import React, { useMemo } from 'react';
import MegaMenuNavColumn from '../MegaMenuNavColumn';
import MegaMenuItemCard from '../MegaMenuItemCard';
import MegaMenuRightColumn from '../MegaMenuRightColumn';
import MegaMenuFooter from '../MegaMenuFooter';

/**
 * Section d'articles du MegaMenu (utilisée pour HOMMES, FEMMES, SALE)
 * 
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.title - Titre de la section
 * @param {Array} props.articles - Liste des articles à afficher
 * @param {Array} props.footerLinks - Liens à afficher dans le footer
 * @param {Function} props.onFooterLinkClick - Gestionnaire de clic sur les liens du footer
 * @param {string} props.rightColumnImage - Image à afficher dans la colonne de droite
 * @returns {JSX.Element} Le composant ArticlesSection rendu
 */
const ArticlesSection = ({ 
  title, 
  articles = [], 
  footerLinks = [],
  onFooterLinkClick = () => {},
  onNavItemClick = () => {},
  rightColumnImage
}) => {
  // Configuration des liens de navigation
  const navItems = useMemo(() => {
    if (title.toLowerCase() === 'soldes' || title.toLowerCase() === 'sale') {
      return [
        { label: 'Hommes', url: '/produits?sexe=homme&remises=-10%,-20%,-30%,-40%,-50%' },
        { label: 'Femmes', url: '/produits?sexe=femme&remises=-10%,-20%,-30%,-40%,-50%' },
        { label: 'Accessoires', url: '/produits?categorie=accessoires&remises=-10%,-20%,-30%,-40%,-50%' },
        { label: 'Jusqu\'à -50%', url: '/produits?remises=-10%,-20%,-30%,-40%,-50%' },
        { label: 'Toutes les promos', url: '/produits?remises=-10%,-20%,-30%,-40%,-50%' }
      ];
    }
    
    if (title.toLowerCase() === 'hommes') {
      return [
        { label: 'Nouveautés', url: '/produits?sexe=homme&nouveaute=true' },
        { label: 'Vêtements', url: '/produits?sexe=homme&categorie=vetements' },
        { label: 'Chaussures', url: '/produits?sexe=homme&categorie=chaussures' },
        { label: 'Accessoires', url: '/produits?sexe=homme&categorie=accessoires' },
        { label: 'Collection', url: '/produits?collection=true' },
        { label: 'Produits hommes', url: '/produits?sexe=homme' }
      ];
    }
    
    // Par défaut pour Femmes
    return [
      { label: 'Nouveautés', url: '/produits?sexe=femme&nouveaute=true' },
      { label: 'Vêtements', url: '/produits?sexe=femme&categorie=vetements' },
      { label: 'Chaussures', url: '/produits?sexe=femme&categorie=chaussures' },
      { label: 'Accessoires', url: '/produits?sexe=femme&categorie=accessoires' },
      { label: 'Collection', url: '/produits?collection=true' },
      { label: 'Produits femmes', url: '/produits?sexe=femme' }
    ];
  }, [title]);

  // Sélection des articles à afficher (limités à 2 pour l'exemple)
  const displayedArticles = useMemo(() => {
    return articles.slice(0, 2);
  }, [articles]);

  return (
    <>
      <div className="flex-1 flex px-12 py-10 justify-start animate-mega-menu-content h-full relative">
        {/* Colonne de navigation */}
        <MegaMenuNavColumn 
          title={title}
          items={navItems}
          className="mr-12"
          onItemClick={onFooterLinkClick}
        />
        
        {/* Cartes d'articles */}
        <div className="flex flex-row gap-8 items-stretch">
          {displayedArticles.map(article => (
            <MegaMenuItemCard
              key={article.id}
              item={article}
              onAddToCart={() => console.log('Ajouter au panier:', article.id)}
              className="w-[220px]"
            />
          ))}
        </div>
        
        {/* Colonne de droite avec image */}
        <MegaMenuRightColumn
          imageUrl={rightColumnImage}
          buttonText="VOIR TOUT"
          altText={title}
          clickurl='/produits'
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

export default ArticlesSection;
