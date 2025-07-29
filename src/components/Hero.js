import React, { useRef, useEffect } from "react";
import getImagePath from "./getImagePath";

export default function Hero() {
  // Ref pour focus automatique
  const sectionRef = useRef(null);

  useEffect(() => {
    // Met le focus sur la section à l'arrivée sur la page
    if (sectionRef.current) {
      sectionRef.current.focus();
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full h-screen bg-white flex items-center justify-start relative font-montserrat overflow-hidden "
      style={{
        backgroundImage: `url(${getImagePath("Elegant-Unity.png","cover")})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >

      {/* Texte en bas à gauche - responsive avec animation d'entrée */}
      <div className="absolute bottom-32 md:bottom-42 xl:bottom-32 2xl:bottom-40 left-4 md:left-8 xl:left-12 2xl:left-16 text-white drop-shadow-lg max-w-xs md:max-w-none z-20 pointer-events-auto animate-fade-in-up">
        <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl 2xl:text-7xl font-extrabold tracking-tight leading-tight animate-slide-up-delay-1">
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
