import React, { useRef, useEffect, useState } from "react";
import getImagePath from "./getImagePath";

export default function HeroEvents() {
  // Ref pour observer l'entrée dans le viewport
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

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

  return (
    <section
      ref={sectionRef}
      className={`w-full bg-white  pt-12 pb-8 px-8 md:px-16 mt-16 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="w-full mx-auto">
        <h1 className="text-2xl md:text-4xl font-bold mb-4 text-left leading-tight">
          Découvrez nos événements passionnants et rejoignez-nous pour des moments inoubliables !
        </h1>
        <p className="text-xs md:text-sm mb-6 text-left">
          Participez à nos événements exclusifs et vivez des expériences uniques avec notre marque.
        </p>
        <div className="flex flex-row gap-3 mb-6">
          <button className="bg-black text-white px-4 py-2 text-xs font-medium">Explorer</button>
          <button className="bg-white border border-black text-black px-4 py-2 text-xs font-medium">S'inscrire</button>
        </div>
        <div className="w-full mt-2">
          <img
            src={getImagePath("event6.jpg", "events")}
            alt="Événement"
            className="w-full object-cover"
            style={{ aspectRatio: '2/1', maxHeight: 620 }}
          />
        </div>
      </div>
    </section>
  );
} 