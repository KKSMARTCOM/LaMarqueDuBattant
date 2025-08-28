import React, { useEffect, useRef, useState } from "react";
import getImagePath from "./getImagePath";

// Images CoverImage utilisées dans la galerie





// Hook pour le nombre d'images visibles (3 desktop, 1 mobile)
function useResponsivePerPage() {
  const [perPage, setPerPage] = useState(window.innerWidth >= 768 ? 3 : 1);
  useEffect(() => {
    function handleResize() {
      setPerPage(window.innerWidth >= 768 ? 3 : 1);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return perPage;
}

export default function ImageGallerySection() {
// Images CoverImage utilisées dans la galerie
const [coverImages, setCoverImages] = useState([]);

const images = coverImages.map((img) => ({
  src: getImagePath(img, "events"),
  alt: img.replace(/\..+$/, ""),
}));

  useEffect(() => {
    // Chargement direct du fichier JSON
    fetch('/data/brandInfo.json')
      .then(response => response.json())
      .then(data => {
        const galleryImages = data.PageData?.Events?.ImageGallerySection?.images || [];
        setCoverImages(galleryImages);
        
      })
      .catch(error => {
        console.error("Erreur lors du chargement des images:", error);
      });
  }, []);
  console.log(coverImages);
  const sliderRef = useRef(null);
  const cardRef = useRef(null); // Pour mesurer la largeur d'une image
  const perPage = useResponsivePerPage();
  const [cardWidth, setCardWidth] = useState(0);

  // Mesure la largeur d'une image à l'affichage ou au resize
  useEffect(() => {
    if (cardRef.current) {
      setCardWidth(cardRef.current.offsetWidth);
    }
    const handleResize = () => {
      if (cardRef.current) setCardWidth(cardRef.current.offsetWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [perPage]);

  // Scroll à gauche d'une image
  const prev = () => {
    if (sliderRef.current && cardWidth) {
      sliderRef.current.scrollBy({
        left: -cardWidth,
        behavior: 'smooth'
      });
    }
  };
  // Scroll à droite d'une image
  const next = () => {
    if (sliderRef.current && cardWidth) {
      sliderRef.current.scrollBy({
        left: cardWidth,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="w-full bg-white py-16 px-4 md:px-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">
        {/* Colonne texte */}
        <div className="w-full md:w-1/3 flex flex-col items-start justify-center mb-8 md:mb-0">
          <h2 className="text-3xl md:text-4xl font-bold text-left">Galerie d'Images</h2>
          <p className="text-sm md:text-base text-left mt-2">
            Découvrez les événements à venir de notre marque.
          </p>
        </div>
        {/* Colonne galerie scrollable */}
        
        <div className="w-full md:w-2/3 flex px-2 md:px-16 flex-col items-center">
          {/* Slider horizontal d'images */}
          <div className="overflow-x-auto hide-scrollbar w-full" style={{ scrollSnapType: 'x mandatory' }} ref={sliderRef}>
            <div
              className="flex gap-2 transition-all duration-300"
              style={{ scrollBehavior: 'smooth' }}
            >
              {images.map((img, index) => (
                <div
                  key={img.src}
                  ref={index === 0 ? cardRef : undefined} // On référence la première image pour mesurer sa largeur
                  data-gallery-card
                  className="min-w-[180px] max-w-[180px] aspect-square bg-gray-200 flex items-center justify-center"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover object-center select-none rounded-none"
                    draggable={false}
                    style={{ background: '#e0e0e0' }}
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Flèches de navigation et pagination sur la même ligne */}
          <div className="flex items-center justify-between w-full mt-6 px-2">
            {/* Flèches de navigation */}
            <div className="flex items-center gap-4">
              <button
                className="w-9 h-9  border border-gray-400 flex items-center justify-center hover:bg-gray-200 transition"
                onClick={prev}
                aria-label="Précédent"
              >
                <span className="text-xl">&#8592;</span>
              </button>
              <button
                className="w-9 h-9  border border-gray-400 flex items-center justify-center hover:bg-gray-200 transition"
                onClick={next}
                aria-label="Suivant"
              >
                <span className="text-xl">&#8594;</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Style pour masquer la scrollbar */}
      <style jsx>{`
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
} 