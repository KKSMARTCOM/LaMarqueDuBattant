/**
 * Hero.js
 * 
 * Description :
 * Composant de bannière principale (hero) avec diaporama d'images en arrière-plan.
 * Affiche une série d'images avec des effets de transition fluides et des boutons d'appel à l'action.
 *
 * Fonctionnalités principales :
 * - Diaporama automatique des images de fond
 * - Effet de fondu entre les transitions
 * - Boutons d'appel à l'action personnalisables
 * - Affichage d'un texte d'accroche
 * - Indicateurs de diapositive
 *
 * Configuration :
 * - Les images sont définies dans le tableau `backgroundImages`
 * - Délai entre les diapositives : 5 secondes
 * - Durée de la transition de fondu : 1 seconde
 *
 * État local :
 * - currentImageIndex (number) : Index de l'image actuellement affichée
 * - isChanging (boolean) : État de la transition entre deux images
 *
 * Comportement :
 * - Défilement automatique toutes les 5 secondes
 * - Arrêt du défilement au survol
 * - Navigation manuelle via les indicateurs
 * - Réinitialisation du timer lors d'un changement manuel
 *
 * Accessibilité :
 * - Texte alternatif pour les images
 * - Navigation au clavier
 * - Indicateurs de position cliquables
 *
 * Personnalisation :
 * - Images : à placer dans le dossier public/images
 * - Texte : modifiable directement dans le composant
 * - Boutons : personnalisables dans la méthode render()
 *
 * Exemple d'utilisation :
 * ```jsx
 * <Hero />
 * ```
 * 
 * Remarques :
 * - Utilise la fonction getImagePath pour résoudre les chemins d'accès
 * - Animation CSS personnalisée pour l'effet de fondu
 * - Gestion des timeouts pour les animations
 */

import React, { useState, useEffect } from "react";
import getImagePath from "./getImagePath";
import { getPageSection } from "../services/brandService";

// Images par défaut en cas d'erreur de chargement
const defaultBackgroundImages = [
  "Elegant-Unity.png"
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isChanging, setIsChanging] = useState(false);
  const [heroData, setHeroData] = useState({
    title: "SUMMER SALE",
    subtitle: "NEW STYLES ADDED",
    backgroundImages: defaultBackgroundImages,
    slides: []
  });

  // Charger les données du hero
  useEffect(() => {
    const loadHeroData = async () => {
      try {
        const data = await getPageSection('Accueil', 'Hero');
        if (data?.slides?.length) {
          setHeroData(prev => ({
            ...prev,
            slides: data.slides,
            backgroundImages: data.slides.map(slide => slide.image)
          }));
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données du hero:', error);
      }
    };

    loadHeroData();
  }, []);

  // Effet pour gérer le changement automatique des slides
  useEffect(() => {
    let timeoutId;
    const interval = setInterval(() => {
      // Déclencher l'animation de fondu
      setIsChanging(true);
      
      // Changer de slide après le début de l'animation
      timeoutId = setTimeout(() => {
        setCurrentSlide(prev => {
          const totalSlides = heroData.slides.length || 1;
          return (prev + 1) % totalSlides;
        });
        // Réinitialiser l'opacité après le changement
        setTimeout(() => setIsChanging(false), 50);
      }, 500);
      
    }, 7000); // Changement toutes les 7 secondes

    // Nettoyage
    return () => {
      clearInterval(interval);
      clearTimeout(timeoutId);
    };
  }, [heroData.slides.length]);

  return (
    <section
      className="w-full h-screen bg-white flex items-center justify-start relative font-montserrat overflow-hidden"
      style={{
        backgroundImage: `url(${getImagePath(
          (heroData.slides[currentSlide]?.image || heroData.backgroundImages[0]), 
          "cover"
        )})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: 'fixed',
        willChange: 'opacity',
        transition: 'opacity 1s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: isChanging ? 0 : 1,
        position: 'relative',
        overflow: 'hidden'
      }}
    >

      {/* Texte en bas à gauche - responsive avec animation d'entrée */}
      <div className="absolute bottom-32 md:bottom-42 xl:bottom-32 2xl:bottom-40 left-4 md:left-8 xl:left-12 2xl:left-16 text-white drop-shadow-lg max-w-xs md:max-w-none z-20 pointer-events-auto animate-fade-in-up">
        <h1 className="text-left text-3xl sm:text-4xl md:text-5xl xl:text-6xl 2xl:text-7xl font-extrabold tracking-tight leading-tight animate-slide-up-delay-1">
          {heroData.slides[currentSlide]?.title || heroData.title}
        </h1>
        <p className="text-left text-lg sm:text-xl md:text-2xl xl:text-3xl 2xl:text-4xl mt-2 xl:mt-4 2xl:mt-6 font-medium tracking-wide animate-slide-up-delay-2">
          {heroData.slides[currentSlide]?.description || heroData.subtitle}
        </p>
      </div>
      

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out forwards;
        }
        
        .animate-slide-up-delay-1 {
          animation: slideUp 0.8s ease-out 0.3s forwards;
          opacity: 0;
        }
        
        .animate-slide-up-delay-2 {
          animation: slideUp 0.8s ease-out 0.6s forwards;
          opacity: 0;
        }
        
        .animate-fade-in-delay-3 {
          animation: fadeIn 0.8s ease-out 0.9s forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
}
