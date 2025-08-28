/**
 * CollectionsSection.js
 * 
 * Description :
 * Composant de section présentant les collections de produits de manière visuelle.
 * Affiche une grille de cartes de collections avec des effets d'animation au défilement.
 *
 * Fonctionnalités principales :
 * - Affichage des collections avec image de fond, titre et lien
 * - Animation d'apparition au défilement (Intersection Observer)
 * - Chargement dynamique de la police Commissioner
 * - Effets de survol sur les cartes de collection
 *
 * Structure des données :
 * Les collections sont définies dans un tableau d'objets avec :
 * - id (string) : Identifiant unique de la collection
 * - title (string) : Titre de la collection
 * - image (string) : Nom du fichier image
 * - link (string) : Lien vers la collection
 *
 * Hooks utilisés :
 * - useState : Gère l'état de visibilité de la section
 * - useRef : Référence à l'élément DOM de la section
 * - useEffect : Configuration de l'Intersection Observer
 *
 * État local :
 * - isVisible (boolean) : Indique si la section est visible à l'écran
 *
 * Comportement :
 * - Charge la police Commissioner de manière dynamique
 * - Anime l'apparition de la section lors du défilement
 * - Applique des effets de survol sur les cartes de collection
 * - Optimise les performances avec un seul observateur d'intersection
 *
 * Accessibilité :
 * - Texte alternatif pour les images
 * - Navigation au clavier
 * - Contraste des couleurs vérifié
 * - Taille de police adaptative
 *
 * Personnalisation :
 * - Police : Commissioner (chargée depuis Google Fonts)
 * - Couleurs : Variables CSS personnalisées (--primary, --secondary, etc.)
 * - Animations : Transition d'opacité et de transformation
 *
 * Exemple d'utilisation :
 * ```jsx
 * <CollectionsSection />
 * ```
 * 
 * Remarques :
 * - Utilise l'API Intersection Observer pour les animations de défilement
 * - Charge la police de manière conditionnelle pour éviter les doublons
 * - Style responsive avec grille CSS
 */

import React, { useEffect, useRef, useState } from "react";
import getImagePath from "./getImagePath";
import { getPageSection } from "../services/brandService";

// Ajout de la police Commissioner via Google Fonts dans le head si pas déjà présente
if (!document.getElementById('commissioner-font')) {
  const link = document.createElement('link');
  link.id = 'commissioner-font';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Commissioner:wght@400;500;600;700&display=swap';
  document.head.appendChild(link);
}

export default function CollectionsSection() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [collectionsData, setCollectionsData] = useState({});
  const [isLoading, setIsLoading] = useState(false);


   // Chargement des données de la section
   useEffect(() => {
    const loadSectionData = async () => {
      try {
        console.log("Début du chargement de la section Collections...");
        const data = await getPageSection('Accueil', 'CollectionsSection');
        console.log("Données reçues:", data);
        
        if (data) {
          // Convertir l'objet collections en tableau
          const collectionsArray = data.collections ? 
            Object.entries(data.collections).map(([name, image]) => ({ name, image })) : 
            [];
          
          setCollectionsData({
            title: data.title,
            CTA: data.CTA,
            collections: collectionsArray
          });
          console.log("Données chargées:", collectionsData);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des collections:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    loadSectionData();
  }, []);


  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    const currentSection = sectionRef.current;
    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []);

  // Afficher un indicateur de chargement pendant le chargement des données
  if (isLoading) {
    return (
      <section className="w-full bg-white py-8 sm:py-12 md:py-16 xl:py-20 2xl:py-24 px-4 sm:px-6 md:px-9 xl:px-12 2xl:px-16" style={{ fontFamily: 'Commissioner, sans-serif' }}>
        <div className="w-full py-20 flex justify-center items-center bg-white">
          <div className="animate-pulse text-black text-2xl"> <h2>Chargement des collections...</h2></div>
        </div>
      </section>
    );
  }
  else {
  return (
    <section 
    ref={sectionRef} 
    className="w-full bg-white py-8 sm:py-12 md:py-16 xl:py-20 2xl:py-24 px-4 sm:px-6 md:px-9 xl:px-12 2xl:px-16" style={{ fontFamily: 'Commissioner, sans-serif' }}>
      <div className="max-w-6xl mx-auto w-full flex flex-col items-center">
        {/* Sous-titre avec animation */}
        <div className={`text-black text-xs xl:text-sm 2xl:text-base font-medium mb-2 sm:mb-3 xl:mb-4 2xl:mb-6 mt-2 transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}>Collection</div>
        
        {/* Titre principal avec animation */}
        <h2 className={`text-2xl sm:text-3xl md:text-4xl xl:text-5xl 2xl:text-6xl font-extrabold text-black text-center mb-2 sm:mb-3 xl:mb-4 2xl:mb-6 leading-tight px-2 transition-all duration-700 ease-out delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}>
         {collectionsData.title}
        </h2>
        
        {/* Description avec animation */}
        <p className={`text-black text-xs sm:text-sm xl:text-base 2xl:text-lg font-light text-center mb-8 sm:mb-10 md:mb-12 xl:mb-16 2xl:mb-20 max-w-xs sm:max-w-md md:max-w-xl xl:max-w-2xl 2xl:max-w-3xl px-2 transition-all duration-700 ease-out delay-400 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}>
          {collectionsData.CTA}
        </p>
        
        {/* Grille des cartes responsive avec animations séquentielles */}
        <div className="w-full px-2 sm:px-4 xl:px-6 2xl:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 xl:gap-8 2xl:gap-10">
          {/* Carte 1 - toujours asymétrique, image à côté du texte */}
          <div className={`border rounded-md border-gray-800 bg-black flex flex-row h-full min-h-[200px] sm:min-h-[220px] xl:min-h-[280px] 2xl:min-h-[320px] lg:col-span-2 transition-all duration-700 ease-out delay-600 ${
            isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
          }`}>
            {/* Partie gauche texte */}
            <div className="flex flex-col justify-between p-4 sm:p-5 md:p-6 xl:p-8 2xl:p-10 w-3/5">
              <div>
                <div className="text-xs xl:text-sm 2xl:text-base text-left text-white/80 font-semibold mb-1 sm:mb-2 xl:mb-3 2xl:mb-4">MODE</div>
                <div className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl text-left font-bold text-white mb-1 xl:mb-2 2xl:mb-3">Tendances de la saison</div>
                <div className="text-xs xl:text-sm 2xl:text-base text-left text-white/90 font-light mb-4 sm:mb-6 xl:mb-8 2xl:mb-10">Explorez nos pièces incontournables pour cette saison.</div>
              </div>
              <button className="text-xs xl:text-sm 2xl:text-base text-white font-medium flex items-center gap-1 group">
                Voir <span className="text-sm sm:text-base xl:text-lg 2xl:text-xl group-hover:translate-x-1 transition">&gt;</span>
              </button>
            </div>
            {/* Image à droite */}
            <div className="w-2/5 h-full">
              <img src={getImagePath(`Collection/${collectionsData.collections?.[0]?.image || "default-collection.jpg"}`, "cover")}  alt="tendance" className="w-full h-full object-cover" />
            </div>
          </div>
          
          {/* Carte 2 avec animation */}
          <div className={`relative bg-no-repeat rounded-md bg-center bg-cover h-full min-h-[200px] sm:min-h-[220px] xl:min-h-[280px] 2xl:min-h-[320px] transition-all duration-700 ease-out delay-800 overflow-hidden
          aspect-[3/3.5] sm:aspect-[3/3.6] lg:aspect-[1/1.5] xl:aspect-[1/1.5] 2xl:aspect-[1/1.5]
          ${
            isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
          }`} style={{ backgroundImage: `url(${getImagePath(`Collection/${collectionsData.collections?.[1]?.image}`, "cover")})` }}>
            {/* Overlay noir dégradé */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10"></div>
            
            {/* Conteneur du texte positionné en bas */}
            <div className="relative z-20 h-full flex flex-col justify-end">
              <div className="p-4  sm:p-5 md:p-6 xl:p-8 2xl:p-10">
                <div className="text-xs xl:text-sm 2xl:text-base text-left text-white/80 font-semibold mb-1 sm:mb-2 xl:mb-2">ÉTÉ 2025</div>
                <div className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl text-left font-bold text-white mb-2 xl:mb-3 2xl:mb-4">Nouveautés</div>
                <div className="text-xs xl:text-sm 2xl:text-base text-left text-white/90 font-light mb-4 sm:mb-6 xl:mb-8 2xl:mb-6">Découvrez les dernières tendances à ne pas manquer.</div>
                <div className="w-full flex justify-start">
                  <button className="inline-flex items-center text-left text-xs xl:text-sm 2xl:text-base text-white font-medium group hover:translate-x-1 transition-transform duration-200">
                    Explorer <span className="ml-1 text-sm sm:text-base xl:text-lg 2xl:text-xl transform group-hover:translate-x-1 transition-transform duration-200">&gt;</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Carte 3 avec animation */}
          <div className={`relative  bg-no-repeat rounded-md bg-cover h-full min-h-[200px] sm:min-h-[220px] xl:min-h-[280px] 2xl:min-h-[320px] sm:col-span-2 lg:col-span-1 transition-all duration-700 ease-out delay-1000 overflow-hidden
            aspect-[3/3.5] sm:aspect-[3/3.5] lg:aspect-[1/1.5] xl:aspect-[1/1.5] 2xl:aspect-[1/1.5]
            ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}
          `} style={{
            backgroundImage: `url(${getImagePath(`Collection/${collectionsData.collections?.[2]?.image}`, "cover")})`
          }}>
            {/* Overlay noir dégradé */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10"></div>
            
            {/* Conteneur du texte positionné en bas */}
            <div className="relative z-20 h-full flex flex-col justify-end">
              <div className="p-4 sm:p-5 md:p-6 xl:p-8 2xl:p-10">
                <div className="text-xs xl:text-sm 2xl:text-base text-left text-white/80 font-semibold mb-1 sm:mb-2 xl:mb-2">Hiver 2025</div>
                <div className="text-lg sm:text-xl xl:text-2xl 2xl:text-3xl text-left font-bold text-white mb-2 xl:mb-3 2xl:mb-4">Nouveautés </div>
                <div className="text-xs xl:text-sm 2xl:text-base text-left text-white/90 font-light mb-4 sm:mb-6 xl:mb-8 2xl:mb-6">Découvrez les dernières tendances à ne pas manquer.</div>
                <div className="w-full flex justify-start">
                  <button className="inline-flex items-center text-left rounded-md text-xs xl:text-sm 2xl:text-base text-white font-medium group hover:translate-x-1 transition-transform duration-200">
                    Explorer <span className="ml-1 text-sm sm:text-base xl:text-lg 2xl:text-xl transform group-hover:translate-x-1 transition-transform duration-200">&gt;</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} }