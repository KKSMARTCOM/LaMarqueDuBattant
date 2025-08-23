import React, { useState } from "react";
import getImagePath from "./getImagePath";

// Tableau d'objets : chaque image est associée à son texte
const slides = [
  {
    image: "bo4.jpg",
    title: "Un club, une passion",
    desc: "Depuis 1987, notre club rassemble les passionnés de tennis de tout âge et tout niveau."
  },
  {
    image: "ca5.jpg",
    title: "Des événements toute l'année",
    desc: "Tournois, stages, animations : la vie du club est rythmée par de nombreux rendez-vous."
  },
  {
    image: "cu2.jpg",
    title: "Des infrastructures modernes",
    desc: "Profitez de terrains rénovés, d'un club house convivial et d'équipements de qualité."
  },
  {
    image: "hero.webp",
    title: "Une ambiance conviviale",
    desc: "Rejoignez une communauté soudée où le plaisir de jouer prime avant tout."
  },
  {
    image: "hero1.jpg",
    title: "Des coachs diplômés",
    desc: "Nos entraîneurs accompagnent petits et grands dans leur progression."
  },
  {
    image: "p1.jpg",
    title: "Ouvert à tous",
    desc: "Débutants ou confirmés, jeunes ou adultes, chacun trouve sa place au club."
  },
  {
    image: "th6.jpg",
    title: "Rejoignez-nous !",
    desc: "Venez découvrir le club lors d'une séance d'essai gratuite."
  }
];

export default function AboutSection() {
  // Index du slide courant
  const [current, setCurrent] = useState(0);
  // Pour l'animation (fade)
  const [fade, setFade] = useState(false);

  // Fonction pour passer à l'image précédente
  const prevImage = () => {
    setFade(true);
    setTimeout(() => {
      setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
      setFade(false);
    }, 200);
  };
  // Fonction pour passer à l'image suivante
  const nextImage = () => {
    setFade(true);
    setTimeout(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      setFade(false);
    }, 200);
  };

  return (
    // Section avec hauteur automatique sur mobile et pleine hauteur sur desktop
    <section className="w-full min-h-[65vh] md:h-screen bg-black flex items-stretch pt-16 md:pt-0 mt-0 md:mt-16">
      <div className="flex flex-col md:flex-row w-full h-full pb-2 md:pb-14">
        {/* Colonne texte : prend toute la hauteur disponible */}
        <div className="w-full md:w-1/2 p-4 md:p-8 flex flex-col justify-center">
          {/* Titre principal */}
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-left text-white">
            Découvrez notre univers
          </h2>
          <p className="text-sm md:text-base text-gray-300 mb-8 text-left">
            Nous sommes passionnés par la création de produits de qualité qui allient
            design moderne et fonctionnalité. Notre équipe d'experts s'engage à vous
            fournir les meilleures solutions pour répondre à vos besoins.
          </p>
          {/* Boutons */}
          <div className="flex flex-row gap-4">
            <a href="#AproposFeatureSection" className="bg-white rounded-md text-black px-2 md:px-6 py-2 md:py-2 font-semibold text-sm md:text-base hover:bg-gray-200 transition">Explorer</a>
            <a href="#contact-section" className="bg-transparent border border-white rounded-md text-white px-2 md:px-6 py-2 md:py-2 font-semibold text-sm md:text-base hover:bg-white/10 transition">Contactez-nous</a>
          </div>
        </div>
        {/* Colonne image+texte : prend toute la hauteur disponible */}
        <div className="w-full md:w-1/2 hidden lg:flex flex-col h-full">
          {/* Partie haute : image, prend 70% de la hauteur */}
          <div className="mb-4 rounded-md flex-1 relative overflow-hidden">
            <img
              src={getImagePath(slides[current].image, "cover")}
              alt={slides[current].title}
              className={`w-full h-full rounded-md object-cover transition-opacity duration-200 ${fade ? 'opacity-0' : 'opacity-100'}`}
              key={current}
            />
          </div>
          {/* Partie basse : texte dynamique, prend 30% de la hauteur */}
          <div className="bg-black pr-4 md:pr-8 py-6 md:py-0 px-2 md:px-0 flex flex-col justify-center flex-shrink-0">
            <h2 className="text-lg font-semibold mb-2 text-left text-white">{slides[current].title}</h2>
            <p className="text-sm text-gray-300 text-left">{slides[current].desc}</p>
            {/* Pagination et flèches */}
            <div className="flex flex-row items-center justify-between mt-6">
              {/* Pagination (points) */}
              <div className="flex flex-row gap-2">
                {slides.map((_, idx) => (
                  <span
                    key={idx}
                    className={`w-2 h-2 rounded-full inline-block ${idx === current ? 'bg-white' : 'bg-gray-500'}`}
                  ></span>
                ))}
              </div>
              {/* Flèches navigation */}
              <div className="flex flex-row gap-2">
                <button onClick={prevImage} className="w-8 h-8 rounded-md flex items-center justify-center border border-gray-400 hover:bg-gray-100 transition">
                  <span className="sr-only">Précédent</span>
                  <svg width="18" height="18" fill="#fff" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
                </button>
                <button onClick={nextImage} className="w-8 h-8 rounded-md flex items-center justify-center border border-gray-400 hover:bg-gray-100 transition">
                  <span className="sr-only">Suivant</span>
                  <svg width="18" height="18" fill="#fff" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 