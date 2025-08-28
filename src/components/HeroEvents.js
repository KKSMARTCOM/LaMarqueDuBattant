import React, { useRef, useEffect, useState } from "react";
import getImagePath from "./getImagePath";
import { getPageSection } from "../services/brandService";

export default function HeroEvents() {
  // Ref pour observer l'entrée dans le viewport
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [sectionData, setSectionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 


   // Chargement initial des données
    useEffect(() => {
      
      const loadSectionData = async () => {
        try {
          console.log("Début du chargement de la section Events...");
          const data = await getPageSection('Events', 'HeroEvents');
          console.log("Données reçues:", data);
          
          if (data) {
            console.log("Données à stocker:", {
              title: data.title,
              description: data.description,
              image: data.image
            });
            
            setSectionData({
              title: data.title,
              description: data.description,
              image: data.image
            });
          }
        } 
      catch (error) {
          console.log('Erreur lors du chargement des données de la section:', error);
        }finally {
          setIsLoading(false);
        }
      };
  
      loadSectionData();
    }, []);
    console.log("Données chargées22:", sectionData);
  // Intersection Observer pour déclencher l'animation
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
 
   // Afficher un indicateur de chargement pendant le chargement des données
   if (isLoading) {
    return (
      <section className="w-full bg-white py-8 sm:py-12 md:py-16 xl:py-20 2xl:py-24 px-4 sm:px-6 md:px-9 xl:px-12 2xl:px-16" style={{ fontFamily: 'Commissioner, sans-serif' }}>
        <div className="w-full py-20 flex justify-center items-center bg-white">
          <div className="animate-pulse text-black text-2xl"> <h2>Chargement des collections...</h2></div>
        </div>
      </section>
    );
  }
  else{
  return (
    <section
      ref={sectionRef}
      className={`w-full bg-white  pt-12 pb-8 px-8 md:px-16 mt-16 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="w-full mx-auto">
        <h1 className="text-2xl md:text-4xl font-bold mb-4 text-left leading-tight">
          {sectionData.title}
        </h1>
        <p className="text-xs md:text-sm mb-6 text-left">
          {sectionData.description}
        </p>
        <div className="flex flex-row gap-3 mb-6">
          <a href="#EventSection" className="bg-black rounded-md hover:bg-black/20 hover:text-black transition-all duration-700 ease-out text-white px-4 py-2 text-xs font-medium">Explorer</a>
          <a href="#cta-collection" className="bg-white border border-black rounded-md hover:bg-white/20 transition-all duration-700 ease-out text-black px-4 py-2 text-xs font-medium">S'inscrire</a>
        </div>
        <div className="w-full mt-2 rounded-md">
          <img
            src={getImagePath(sectionData.image, "events")}
            alt="Événement"
            className="w-full object-cover"
            style={{ aspectRatio: '2/1', maxHeight: 620 }}
          />
        </div>
      </div>
    </section>
  );}
} 