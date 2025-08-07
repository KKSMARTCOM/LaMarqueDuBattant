import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
// import articles from "../data/articles.json";
import ProductCard from "./ProductCard";
import ProductQuickView from "./ProductQuickView";
import useArticles from '../hooks/useArticles';

// Ajout dynamique de la police Commissioner via Google Fonts dans le head du document
if (!document.getElementById('commissioner-font')) {
  const link = document.createElement('link');
  link.id = 'commissioner-font';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Commissioner:wght@400;500;600;700&display=swap';
  document.head.appendChild(link);
}

export default function ProductsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  // État pour la vue rapide
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [quickViewId, setQuickViewId] = useState(null);
  // Utilisation du hook useArticles pour charger les articles
  const { articles, loading, error } = useArticles();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1, // Déclenche quand 10% de la section est visible
        rootMargin: '0px 0px -50px 0px' // Déclenche un peu avant
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
    return <section ref={sectionRef} className="w-full bg-white py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 flex justify-center items-center" style={{ fontFamily: 'Commissioner, sans-serif' }}>Chargement des articles...</section>;
  }
  if (error) {
    return <section ref={sectionRef} className="w-full bg-white py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 flex justify-center items-center text-red-500" style={{ fontFamily: 'Commissioner, sans-serif' }}>Erreur : {error}</section>;
  }
  return (
    // Section principale de la grille de produits
    <section 
      ref={sectionRef}
      className="w-full bg-white  py-12 md:py-16 lg:py-20 px-4 sm:px-6 lg:px-8" 
      style={{ fontFamily: 'Commissioner, sans-serif' }}
    >
      <div className="max-w-7xl mx-auto pb-8 md:pb-12">
        {/* En-tête de la section avec animation */}
        <div className={`mb-2 text-xs text-black text-left ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
          Tendances
        </div>
        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 md:mb-12 gap-4 ${isVisible ? 'animate-fade-in-delay-1' : 'opacity-0'}`}>
          {<h2 className="text-2xl md:text-3xl font-bold text-left">Products</h2>
          /*<Link to="/produits">
            <button className="border border-black px-4 py-2 text-xs hover:bg-black hover:text-white transition-colors duration-200 self-start sm:self-auto">
              View all
            </button>
          </Link>*/}
        </div>
        
        {/* Grille de produits responsive avec animations */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-1 sm:gap-x-2 gap-y-4">
          {/* On limite à 8 articles (2 lignes de 4) */}
          {articles.slice(0, 8).map((article, index) => (
            <ProductCard
              key={article.id}
              article={article}
              isVisible={isVisible}
              index={index}
              onEyeClick={(id) => {
                setQuickViewId(id);
                setQuickViewOpen(true);
              }}
            />
          ))}
        </div>
        
        {/* Bouton Découvrir centré sous la grille avec animation */}
        <div className={`flex justify-center mt-8 md:mt-10 ${isVisible ? 'animate-fade-in-delay-4' : 'opacity-0'}`}>
          <Link to="/produits">
            <button className="px-6 md:px-8 py-2 md:py-3 rounded-md border border-black text-xs font-semibold hover:bg-black hover:text-white transition-colors duration-200">
              Découvrir plus <span>&gt;</span>
            </button>
          </Link>
        </div>
      </div>

      {/* QuickView modal */}
      <ProductQuickView
        articleId={quickViewId}
        open={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
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
        
        @keyframes productCard {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        .animate-fade-in-delay-1 {
          animation: fadeIn 0.8s ease-out 0.2s forwards;
          opacity: 0;
        }
        
        .animate-fade-in-delay-4 {
          animation: fadeIn 0.8s ease-out 1.2s forwards;
          opacity: 0;
        }
        
        .animate-product-card {
          animation: productCard 0.8s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
}
