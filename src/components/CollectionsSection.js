import React, { useEffect, useRef, useState } from "react";
import getImagePath from "./getImagePath";

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
  const [isVisible, setIsVisible] = useState(false);

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
    <section ref={sectionRef} className="w-full bg-white py-12 sm:py-14 md:py-16 xl:py-20 2xl:py-24 px-4 sm:px-6 md:px-9 xl:px-12 2xl:px-16" style={{ fontFamily: 'Commissioner, sans-serif' }}>
      <div className="max-w-6xl mx-auto w-full flex flex-col items-center">
        {/* Sous-titre avec animation */}
        <div className={`text-black text-xs xl:text-sm 2xl:text-base font-medium mb-2 sm:mb-3 xl:mb-4 2xl:mb-6 mt-2 transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}>Collection</div>
        
        {/* Titre principal avec animation */}
        <h2 className={`text-2xl sm:text-3xl md:text-4xl xl:text-5xl 2xl:text-6xl font-extrabold text-black text-center mb-2 sm:mb-3 xl:mb-4 2xl:mb-6 leading-tight px-2 transition-all duration-700 ease-out delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}>
          Découvrez notre nouvelle<br />collection
        </h2>
        
        {/* Description avec animation */}
        <p className={`text-black text-xs sm:text-sm xl:text-base 2xl:text-lg font-light text-center mb-8 sm:mb-10 md:mb-12 xl:mb-16 2xl:mb-20 max-w-xs sm:max-w-md md:max-w-xl xl:max-w-2xl 2xl:max-w-3xl px-2 transition-all duration-700 ease-out delay-400 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}>
          Des vêtements qui allient style et confort.
        </p>
        
        {/* Grille des cartes responsive avec animations séquentielles */}
        <div className="w-full px-2 sm:px-4 xl:px-6 2xl:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 xl:gap-8 2xl:gap-10">
          {/* Carte 1 - toujours asymétrique, image à côté du texte */}
          <div className={`border border-gray-800 bg-white flex flex-row h-full min-h-[200px] sm:min-h-[220px] xl:min-h-[280px] 2xl:min-h-[320px] lg:col-span-2 transition-all duration-700 ease-out delay-600 ${
            isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
          }`}>
            {/* Partie gauche texte */}
            <div className="flex flex-col justify-between p-4 sm:p-5 md:p-6 xl:p-8 2xl:p-10 w-3/5">
              <div>
                <div className="text-xs xl:text-sm 2xl:text-base text-left text-black font-semibold mb-1 sm:mb-2 xl:mb-3 2xl:mb-4">Mode</div>
                <div className="text-base sm:text-lg xl:text-xl 2xl:text-2xl text-left font-bold text-black mb-1 xl:mb-2 2xl:mb-3">Tendances de la saison</div>
                <div className="text-xs xl:text-sm 2xl:text-base text-left text-black font-light mb-4 sm:mb-6 xl:mb-8 2xl:mb-10">Explorez nos pièces incontournables pour cette saison.</div>
              </div>
              <button className="text-xs xl:text-sm 2xl:text-base text-black font-medium flex items-center gap-1 group">
                Voir <span className="text-sm sm:text-base xl:text-lg 2xl:text-xl group-hover:translate-x-1 transition">&gt;</span>
              </button>
            </div>
            {/* Image à droite */}
            <div className="w-2/5 h-full">
              <img src={getImagePath("Collection/Black-and-White Portrait.png", "cover")} alt="tendance" className="w-full h-full object-cover" />
            </div>
          </div>
          
          {/* Carte 2 avec animation */}
          <div className={`border border-gray-800 bg-white flex flex-col h-full min-h-[200px] sm:min-h-[220px] xl:min-h-[280px] 2xl:min-h-[320px] transition-all duration-700 ease-out delay-800 ${
            isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
          }`}>
            <div className="flex flex-col justify-between p-4 sm:p-5 md:p-6 xl:p-8 2xl:p-10 flex-1">
              <div>
                <div className="text-xs xl:text-sm 2xl:text-base text-left text-black font-semibold mb-1 sm:mb-2 xl:mb-3 2xl:mb-4">Été</div>
                <div className="text-base sm:text-lg xl:text-xl 2xl:text-2xl text-left font-bold text-black mb-1 xl:mb-2 2xl:mb-3">Nouveautés</div>
                <div className="text-xs xl:text-sm 2xl:text-base text-left text-black font-light mb-4 sm:mb-6 xl:mb-8 2xl:mb-10">Découvrez les dernières tendances à ne pas manquer.</div>
              </div>
              <button className="text-xs xl:text-sm 2xl:text-base text-black font-medium flex items-center gap-1 group">
                Explorer <span className="text-sm sm:text-base xl:text-lg 2xl:text-xl group-hover:translate-x-1 transition">&gt;</span>
              </button>
            </div>
            <img src={getImagePath("p1.jpg", "cover")} alt="nouveautes" className="w-full h-32 sm:h-36 md:h-40 xl:h-48 2xl:h-56 object-cover" />
          </div>
          
          {/* Carte 3 avec animation */}
          <div className={`border border-gray-800 bg-white flex flex-col h-full min-h-[200px] sm:min-h-[220px] xl:min-h-[280px] 2xl:min-h-[320px] sm:col-span-2 lg:col-span-1 transition-all duration-700 ease-out delay-1000 ${
            isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
          }`}>
            <div className="flex flex-col justify-between p-4 sm:p-5 md:p-6 xl:p-8 2xl:p-10 flex-1">
              <div>
                <div className="text-xs xl:text-sm 2xl:text-base text-left text-black font-semibold mb-1 sm:mb-2 xl:mb-3 2xl:mb-4">Événements</div>
                <div className="text-base sm:text-lg xl:text-xl 2xl:text-2xl text-left font-bold text-black mb-1 xl:mb-2 2xl:mb-3">À venir</div>
                <div className="text-xs xl:text-sm 2xl:text-base text-left text-black font-light mb-4 sm:mb-6 xl:mb-8 2xl:mb-10">Participez à nos événements exclusifs et promotions.</div>
              </div>
              <button className="text-xs xl:text-sm 2xl:text-base text-black font-medium flex items-center gap-1 group">
                Inscription <span className="text-sm sm:text-base xl:text-lg 2xl:text-xl group-hover:translate-x-1 transition">&gt;</span>
              </button>
            </div>
            <img src={getImagePath("Relaxing on Sandy Beach.png", "cover")} alt="evenements" className="w-full h-32 sm:h-36 md:h-40 xl:h-48 2xl:h-56 object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
} 