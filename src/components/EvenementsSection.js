import React, { useEffect, useRef, useState } from "react";
import getImagePath from "./getImagePath";
import fetchData from "./fetchData";
import { Link } from "react-router-dom";

export default function EvenementsSection() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Animation Intersection Observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    const currentSection = sectionRef.current; // Correction ESLint : copie la ref
    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []);

  useEffect(() => {
    // Chargement dynamique des événements
    fetchData('/data/events.json')
      .then(data => setEvents(data.slice(0, 3))) // On garde 3 cartes désormais
      .catch(() => setEvents([]));
  }, []);

  return (
    <section ref={sectionRef} className="w-full bg-white py-12 sm:py-14 md:py-16 xl:py-20 2xl:py-24 px-4 sm:px-6 md:px-8 xl:px-12 2xl:px-16" style={{ fontFamily: 'Commissioner, sans-serif' }}>
      <div className="w-full flex flex-col items-center">
        {/* Sous-titre avec animation */}
        <div className={`text-black text-xs xl:text-sm 2xl:text-base font-medium mb-2 sm:mb-3 xl:mb-4 2xl:mb-6 mt-2 text-center transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}>Événements</div>
        
        {/* Titre principal avec animation */}
        <h2 className={`text-2xl sm:text-3xl md:text-4xl xl:text-5xl 2xl:text-6xl font-extrabold text-black text-center mb-2 sm:mb-3 xl:mb-4 2xl:mb-6 leading-tight px-2 transition-all duration-700 ease-out delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}>
          Événements
        </h2>
        
        {/* Description avec animation */}
        <p className={`text-black text-xs sm:text-sm xl:text-base 2xl:text-lg font-light text-center mb-8 sm:mb-10 md:mb-12 xl:mb-16 2xl:mb-20 max-w-xs sm:max-w-lg md:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl px-2 transition-all duration-700 ease-out delay-400 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}>
          Explorez nos prochains événements et assurez-vous de ne pas les rater !
        </p>
        
        {/* Grille des cartes responsive avec animations séquentielles */}
        <div className="w-full min-h-0 h-full px-0 sm:px-2 md:px-4 xl:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 sm:mb-10 xl:mb-12 2xl:mb-16"> {/* 3 colonnes sur desktop, gap réduit, prend toute la largeur */}
            {events.map((event, idx) => (
            <div key={event.id} className={`border border-gray-800 bg-white flex flex-col h-full  min-h-[280px] sm:min-h-[300px] xl:min-h-[400px] 2xl:min-h-[500px] overflow-hidden transition-all duration-700 ease-out ${idx === 0 ? 'delay-600' : 'delay-800'} ${
              isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
            }`}>
              <div className="relative">
                <img src={getImagePath(event.image, "events")} alt={event.titre} className="w-full h-60 sm:h-72 md:h-80 xl:h-96 2xl:h-[500px] object-cover" />
                <div className="absolute top-2 sm:top-3 xl:top-4 2xl:top-6 right-2 sm:right-3 xl:right-4 2xl:right-6 bg-white border border-gray-300 px-2 sm:px-3 xl:px-4 2xl:px-6 py-1.5 sm:py-2 xl:py-3 2xl:py-4 text-center shadow text-[10px] sm:text-xs xl:text-sm 2xl:text-base">
                  <div className="font-medium">{new Date(event.date).toLocaleDateString('fr-FR', { weekday: 'short' })}</div>
                  <div className="text-xl sm:text-2xl xl:text-3xl 2xl:text-4xl font-bold leading-none">{new Date(event.date).getDate()}</div>
                  <div className="uppercase tracking-wide">{new Date(event.date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}</div>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 sm:gap-2 xl:gap-3 2xl:gap-4 p-3 sm:p-4 xl:p-6 2xl:p-8 flex-1">
                <div className="text-left">
                  <span className="inline-block bg-gray-100 border border-gray-300 text-gray-800 text-[10px] sm:text-xs xl:text-sm 2xl:text-base px-2 py-1 xl:px-3 xl:py-2 2xl:px-4 2xl:py-3 rounded mb-1.5 sm:mb-2 xl:mb-3 2xl:mb-4 text-left">{event.type}</span>
                </div>
                <div className="text-base sm:text-lg xl:text-xl 2xl:text-2xl font-bold text-black text-left">{event.titre}</div>
                <div className="text-[10px] sm:text-xs xl:text-sm 2xl:text-base text-black text-left">{event.lieu}</div>
                <div className="text-[10px] sm:text-xs xl:text-sm 2xl:text-base text-black font-light mb-2 sm:mb-3 xl:mb-4 2xl:mb-6 text-left">{event.description}</div>
                <Link to={`/events/${event.id}`} className="text-[10px] sm:text-xs xl:text-sm 2xl:text-base text-black font-medium flex items-center gap-1 group w-fit text-left">
                  {event.cta} <span className="text-sm sm:text-base xl:text-lg 2xl:text-xl group-hover:translate-x-1 transition">&gt;</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {/* Bouton Voir tout avec animation */}
        {/* Utilisation de Link pour la redirection vers /events */}
        <Link
          to="/events"
          className={`border border-gray-800 px-5 sm:px-6 xl:px-8 2xl:px-10 py-1.5 sm:py-2 xl:py-3 2xl:py-4 text-black text-xs sm:text-sm xl:text-base 2xl:text-lg font-medium hover:bg-black hover:text-white  mx-auto block transition-all duration-700 ease-out delay-1000 ${
            isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
          }`}
        >
          Voir tout
        </Link>
      </div>
    </section>
  );
} 