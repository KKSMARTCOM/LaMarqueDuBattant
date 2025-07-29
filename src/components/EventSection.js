import React, { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import getImagePath from "./getImagePath";

// Catégories fixes pour le filtrage
const categories = [
  "Tous",
  "Future",
  "Passé"
];

function formatDate(dateStr) {
  const d = new Date(dateStr);
  const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
  const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"];
  return {
    day: days[d.getDay()],
    date: d.getDate().toString().padStart(2, "0"),
    month: months[d.getMonth()],
    year: d.getFullYear(),
  };
}

export default function EventSection() {
  // Animation d'entrée
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    const currentSection = sectionRef.current;
    if (currentSection) observer.observe(currentSection);
    return () => {
      if (currentSection) observer.unobserve(currentSection);
    };
  }, []);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/events.json")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // État pour la catégorie sélectionnée
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  // Fonction de filtrage selon la catégorie sélectionnée
  const filteredEvents = events.filter(event => {
    if (selectedCategory === "Tous") return true;
    const eventDate = new Date(event.date);
    const now = new Date();
    if (selectedCategory === "Future") {
      return eventDate >= now;
    }
    if (selectedCategory === "Passé") {
      return eventDate < now;
    }
    return true;
  });

  // État pour le formulaire de newsletter
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    // Simulation d'envoi du formulaire
    setTimeout(() => {
      console.log('Email enregistré :', email);
      setIsSubscribed(true);
      setEmail('');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <section
      ref={sectionRef}
      className={`w-full bg-white pt-8 pb-16 px-4 md:px-16 mt-12 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
    <div>
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-xs font-thin mb-2 mt-2 text-gray-400 ">Événements</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 ">
            {selectedCategory === 'Future' ? 'Prochains événements' : 
             selectedCategory === 'Passé' ? 'Événements passés' : 'Tous nos événements'}
          </h2>
          <p className="text-sm text-gray-700 mb-8">
            {selectedCategory === 'Future' ? 'Découvrez nos événements à venir' : 
             selectedCategory === 'Passé' ? 'Revivez nos événements passés' : 
             'Découvrez tous nos événements'}
          </p>
          <div className="flex flex-wrap justify-center border-b border-gray-200 pb-10 gap-2 mb-8">
            {categories.map((cat, idx) => (
              <button
                key={cat}
                className={`px-4 py-1 border text-xs focus:outline-none transition-all duration-150 ${selectedCategory === cat ? 'bg-black text-white border-black ring-2 ring-black' : 'bg-white text-black border-transparent hover:bg-gray-100'}`}
                tabIndex={0}
                onClick={() => setSelectedCategory(cat)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setSelectedCategory(cat); }}
                aria-pressed={selectedCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        {loading ? (
          <div className="text-center text-gray-400 py-12">Chargement des événements...</div>
        ) : filteredEvents.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center py-12 px-4">
            <h3 className="text-xl font-semibold mb-4">Aucun événement {selectedCategory === 'Future' ? 'à venir' : selectedCategory === 'Passé' ? 'passé' : 'disponible'} pour le moment</h3>
            <p className="text-gray-600 mb-6">
              Restez informé de nos prochains événements en vous abonnant à notre newsletter.
            </p>
            {!isSubscribed ? (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse email"
                  className="flex-1 px-4 py-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-black"
                  required
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-1 bg-black text-white ring-2 ring-black hover:bg-gray-800 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Envoi...' : 'M\'inscrire'}
                </button>
              </form>
            ) : (
              <div className="text-green-600 bg-green-50 px-4 py-3 rounded">
                Merci pour votre inscription ! Vous serez informé des prochains événements.
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredEvents.map((event, idx) => {
              const f = formatDate(event.date);
              // Animation d'entrée séquentielle : fade + slide-up
              return (
                <div
                  key={event.id || idx}
                  className={`flex flex-col border border-black bg-white h-full transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: isVisible ? `${idx * 80 + 100}ms` : '0ms' }}
                >
                  {/* Image avec badge date en overlay */}
                  <div className="relative w-full h-56 md:h-64">
                    <img
                      src={getImagePath(event.image, "events")}
                      alt={event.titre}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-white shadow px-3 py-2 flex flex-col items-center text-xs font-semibold min-w-[56px]">
                      <span className="text-[10px] font-normal mb-0.5">{f.day}</span>
                      <span className="text-2xl font-bold leading-none">{f.date}</span>
                      <span className="text-[10px] font-normal mt-0.5">{f.month} {f.year}</span>
                    </div>
                  </div>
                  {/* Bloc blanc avec contenu */}
                  <div className="flex-1 flex flex-col px-4 py-5 text-left">
                    <span className="text-[11px] font-medium mb-1 bg-gray-100 px-2 py-0.5 rounded w-fit">{event.type}</span>
                    <div className="font-bold text-base mb-1">{event.titre}</div>
                    <div className="text-xs text-gray-700 mb-1">{event.lieu}</div>
                    <div className="text-xs text-gray-700 mb-3">{event.description}</div>
                    <Link 
                      to={`/events/${event.id}`} 
                      className="text-xs font-medium mt-auto flex items-center gap-1 hover:underline"
                      aria-label={`Voir les détails de l'événement ${event.titre}`}
                    >
                      {event.cta || "Voir événement"} <span className="text-lg leading-none">&rarr;</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
} 