import React, { useEffect, useRef, useState } from "react";
import getImagePath from "./getImagePath";
// Import du composant Link pour la navigation interne
import { Link } from "react-router-dom";

export default function AboutSection2() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

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

  return (
    <section 
      ref={sectionRef}
      className="w-full bg-black py-8 sm:py-12 md:py-16 xl:py-20 2xl:py-24 px-4 sm:px-6 md:px-10 xl:px-16 2xl:px-20 flex justify-center"
    >
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-14 xl:gap-20 2xl:gap-24">
        {/* Colonne de gauche - animation depuis la gauche */}
        <div className={`flex flex-col justify-start ${isVisible ? 'animate-slide-in-left' : 'opacity-0 translate-x-[-50px]'}`}>
          {/* Sous-titre */}
          <div className="text-white text-xs xl:text-sm 2xl:text-base text-left font-semibold mb-3 sm:mb-4 xl:mb-6 2xl:mb-8">Style</div>
          {/* Titre principal */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl xl:text-5xl 2xl:text-6xl font-extrabold text-white mb-6 sm:mb-8 md:mb-10 xl:mb-12 2xl:mb-16 leading-tight text-left">
            Découvrez notre histoire<br />et notre passion
          </h2>
          {/* Image principale à gauche avec texte en bas à gauche */}
          <div className="relative w-full h-[300px] sm:h-[400px] md:h-[550px] xl:h-[650px] 2xl:h-[750px] mb-0">
            <img src={getImagePath("cu2.jpg", "cover")} alt="about left" className="w-full h-full object-cover" />
            <span className="absolute bottom-3 sm:bottom-4 xl:bottom-6 2xl:bottom-8 left-3 sm:left-4 xl:left-6 2xl:left-8 text-white text-sm sm:text-base xl:text-lg 2xl:text-xl font-semibold bg-transparent bg-opacity-80 px-2 sm:px-3 xl:px-4 2xl:px-6 py-1 xl:py-2 2xl:py-3 rounded">
              | WOMEN'S COLLECTION
            </span>
          </div>
        </div>
        
        {/* Colonne de droite - animation depuis la droite */}
        <div className={`flex flex-col justify-start h-full ${isVisible ? 'animate-slide-in-right' : 'opacity-0 translate-x-[50px]'}`}>
          {/* Image en haut à droite avec texte en haut à droite */}
          <div className="relative w-full h-[300px] sm:h-[400px] md:h-[550px] xl:h-[650px] 2xl:h-[750px] mb-6 sm:mb-8 xl:mb-10 2xl:mb-12">
            <img src={getImagePath("ca5.jpg", "cover")} alt="about right" className="w-full h-full object-cover" />
            <span className="absolute top-3 sm:top-4 xl:top-6 2xl:top-8 right-3 sm:right-4 xl:right-6 2xl:right-8 text-white text-sm sm:text-base xl:text-lg 2xl:text-xl font-semibold bg-transparent bg-opacity-80 px-2 sm:px-3 xl:px-4 2xl:px-6 py-1 xl:py-2 2xl:py-3 rounded">
              | MEN'S COLLECTION
            </span>
          </div>
          {/* Texte descriptif */}
          <p className="text-white text-xs sm:text-sm xl:text-base 2xl:text-lg font-light mb-6 sm:mb-8 xl:mb-10 2xl:mb-12 text-left">
          Chez La Marque des Battants, chaque pièce raconte une histoire, la vôtre, et célèbre votre parcours. Nous croyons en une mode authentique et engagée, où chaque choix est porteur de sens. Rejoignez-nous et affichez fièrement vos couleurs : celles de la détermination et de la victoire.
          </p>
          {/* Boutons alignés à gauche */}
          <div className="flex flex-row gap-2 sm:gap-3 xl:gap-4 2xl:gap-6">
            {/* Bouton En savoir plus redirigeant vers la page À propos */}
            <Link to="/apropos" className="px-4 sm:px-5 xl:px-6 2xl:px-8 py-1.5 xl:py-2 2xl:py-3 border border-white text-white bg-transparent transition hover:bg-white hover:text-black text-xs xl:text-sm 2xl:text-base font-medium text-center">
              En savoir plus
            </Link>
            {/* Bouton Contact redirigeant vers la page À propos */}
            <Link to="/apropos" className="px-4 sm:px-5 xl:px-6 2xl:px-8 py-1.5 xl:py-2 2xl:py-3 border border-black text-black bg-white transition hover:bg-black hover:text-white hover:border-white text-xs xl:text-sm 2xl:text-base font-medium flex items-center gap-1 text-center">
              Contact <span className="text-sm sm:text-base xl:text-lg 2xl:text-xl">&gt;</span>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slide-in-left {
          animation: slideInLeft 1s ease-out forwards;
        }
        
        .animate-slide-in-right {
          animation: slideInRight 1s ease-out 0.3s forwards;
        }
      `}</style>
    </section>
  );
}
