import React, { useRef, useEffect, useState } from "react";
import getImagePath from "./getImagePath";

// Section feature de la page À propos, fidèle à la maquette fournie
export default function AproposFeatureSection() {
  const [featureData, setFeatureData] = useState({});
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

  // Récupération des données depuis brandInfo.json
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data/brandInfo.json');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des données');
        }
        const data = await response.json();
        // Accès correct aux données de la section AproposFeatureSection
        const featureSectionData = data.PageData?.Apropos?.AproposFeatureSection;
        console.log('Données chargées:', featureSectionData);
        setFeatureData(featureSectionData || {});
      } catch (err) {
        console.log("Il y a une erreur ")
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
    console.log('Verif',featureData);
  // Intersection Observer pour déclencher l'animation
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

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-16 bg-black min-h-[400px]">
        <div className="text-white">Chargement en cours...</div>
      </div>
    );
  }



  return (
    <>
      <section 
        id="AproposFeatureSection"
        ref={sectionRef}
        className={`w-full flex flex-col justify-center items-center py-2 md:py-16 bg-black px-4 sm:px-8 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="w-full max-w-7xl bg-white/10 border border-white/50 rounded-md flex flex-col md:flex-row overflow-hidden h-auto md:h-[500px] lg:h-[600px]">
          {/* Image à gauche ou en haut */}
          <div className="w-full md:w-1/2 h-48 md:h-full flex-shrink-0 flex items-stretch">
            <img
              src={getImagePath(featureData.image, "cover")}
              alt={featureData.title}
              className="w-full h-full object-cover object-center"
              style={{height: '100%', minHeight: 0, background: '#f3f3f3'}}
            />
          </div>
          {/* Bloc texte à droite ou en bas */}
          <div className="w-full md:w-1/2 flex flex-col justify-center px-8 py-6 sm:px-10 sm:py-8 md:px-12 md:py-10 gap-4 items-start text-left">
            {/* Logo responsive */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-start mb-2">
              <img src={getImagePath(featureData.Logo , "logo")} alt="logo" className="w-12 h-12 sm:w-16 sm:h-16 md:w-16 md:h-16 object-contain" />
            </div>
            {/* Titre principal */}
            <h2 className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-2 leading-tight text-left">
              {featureData.title}
            </h2>
            {/* Description */}
            <p className="text-gray-300 text-xs sm:text-sm md:text-base font-normal leading-relaxed text-left">
              {featureData.description}
            </p>
          </div>
        </div>
      </section>
    </>
  );
} 