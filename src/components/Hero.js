import React, { useState, useEffect } from "react";
import getImagePath from "./getImagePath";

// Tableau des images de fond pour le diaporama
const backgroundImages = [
  "Elegant-Unity.png",
  "Urban Fashion Trio.png",
  "Stylish Portrait with Gradient Background.png",
  "Monochromatic Fashion Portrait.png",
  "Stylish Young Man in Black Outfit.png",
  "Relaxing on Sandy Beach.png"
];

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isChanging, setIsChanging] = useState(false);

  // Effet pour gérer le changement automatique des images
  useEffect(() => {
    let timeoutId;
    const interval = setInterval(() => {
      // Déclencher l'animation de fondu
      setIsChanging(true);
      
      // Changer l'image après le début de l'animation
      timeoutId = setTimeout(() => {
        setCurrentImageIndex((prevIndex) => {
          const nextIndex = prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1;
          // S'assurer que l'index est valide
          return nextIndex < backgroundImages.length ? nextIndex : 0;
        });
        // Laisser un petit délai avant de réinitialiser l'opacité
        setTimeout(() => setIsChanging(false), 50);
      }, 500); // Durée de l'animation de fondu
      
    }, 17000); // Changement toutes les 17 secondes

    // Nettoyage des timeouts et de l'intervalle
    return () => {
      clearInterval(interval);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <section
      className="w-full h-screen bg-white flex items-center justify-start relative font-montserrat overflow-hidden"
      style={{
        backgroundImage: `url(${getImagePath(backgroundImages[currentImageIndex], "cover")})`,
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
          SUMMER SALE
        </h1>
        <p className="text-left text-lg sm:text-xl md:text-2xl xl:text-3xl 2xl:text-4xl mt-2 xl:mt-4 2xl:mt-6 font-medium tracking-wide animate-slide-up-delay-2">
          NEW STYLES ADDED
        </p>
      </div>
      
      {/* Bouton en bas, pleine largeur - responsive avec animation d'entrée 
      <div className="absolute left-0 right-0 bottom-0 z-20 pointer-events-auto animate-fade-in-delay-3">
        <Link to="/produits" className="block w-full">
          <button className="w-full bg-white text-black py-2 font-semibold uppercase text-sm md:text-base xl:text-lg 2xl:text-xl tracking-wider rounded-none hover:bg-gray-100 transition-colors duration-200">
            ACHETER MAINTENANT
          </button>
        </Link>
      </div>*/}

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
