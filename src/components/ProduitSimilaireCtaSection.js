import React, { useEffect, useRef, useState } from "react";
import ProductCard from "./ProductCard";
import ProductQuickView from "./ProductQuickView";
import { Link } from "react-router-dom";
import useArticles from '../hooks/useArticles';

function useResponsivePerPage() {
  const [perPage, setPerPage] = useState(4);
  useEffect(() => {
    function handleResize() {
      // Garde toujours 4 articles par page pour maintenir la même apparence
      setPerPage(4);
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return perPage;
}

export default function ProduitSimilaireCtaSection({ currentProduct }) {
  // Utilisation du hook useArticles pour charger les articles
  const { articles } = useArticles();
  const [similaires, setSimilaires] = useState([]);
  // Pour la quickview
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [quickViewId, setQuickViewId] = useState(null);

  // Pagination responsive : recalcule le nombre de pages à chaque changement de taille ou de liste
  const [page, setPage] = useState(0);
  const sliderRef = useRef(null);
  const cardRef = useRef(null);
  const perPage = useResponsivePerPage();
  const [cardWidth, setCardWidth] = useState(0);
  const [gap, setGap] = useState(0);

  // Met à jour la largeur d'une carte et le gap
  useEffect(() => {
    if (sliderRef.current && cardRef.current) {
      const cardRect = cardRef.current.getBoundingClientRect();
      setCardWidth(cardRect.width);
      // Gap = différence entre la gauche de la carte suivante et la droite de la carte courante
      const cards = sliderRef.current.querySelectorAll('[data-article-card]');
      if (cards.length > 1) {
        const gapValue = cards[1].getBoundingClientRect().left - cards[0].getBoundingClientRect().right;
        setGap(gapValue);
      } else {
        setGap(0);
      }
    }
  }, [similaires.length, perPage]);

  // Met à jour le nombre de pages à chaque changement de perPage, cardWidth, gap ou de la liste
  useEffect(() => {
    if (!sliderRef.current || !cardWidth) return;
    const pages = Math.max(1, Math.ceil(similaires.length / perPage));
    setPage((p) => Math.min(p, pages - 1));
  }, [perPage, cardWidth, gap, similaires.length]);

  useEffect(() => {
    if (articles.length && currentProduct) {
      const filtered = articles.filter(
        (a) => a.category === currentProduct.category && a.id !== currentProduct.id
      );
      setSimilaires(filtered.slice(0, 12)); // max 12 pour la démo
      setPage(0); // reset page si changement de produit
    }
  }, [articles, currentProduct]);

  // Pour l’animation d’apparition (optionnel)
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 200);
  }, []);

  // Scroll le slider à la bonne page quand page change
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || !cardWidth) return;
    const pageW = cardWidth * perPage + gap * (perPage - 1);
    slider.scrollTo({
      left: page * pageW,
      behavior: "smooth"
    });
  }, [page, perPage, cardWidth, gap]);

  // Synchronise la page active avec le scroll manuel
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || !cardWidth) return;
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollLeft = slider.scrollLeft;
          const pageW = cardWidth * perPage + gap * (perPage - 1);
          const newPage = Math.round(scrollLeft / pageW);
          if (newPage !== page) setPage(newPage);
          ticking = false;
        });
        ticking = true;
      }
    };
    slider.addEventListener('scroll', handleScroll, { passive: true });
    return () => slider.removeEventListener('scroll', handleScroll);
  }, [page, perPage, cardWidth, gap]);

  return (
    <section className="w-full mt-10 px-2 sm:px-4 md:px-8 py-8 sm:py-12 md:py-16 bg-white flex flex-col gap-12 md:gap-16">
      {/* Partie Produits similaires */}
      <div className="max-w-full mx-auto w-full">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs text-gray-500 mb-1">Élégance</div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-1">Products</h2>
            <div className="text-xs text-gray-400">Dimensions : S, M, L, XL</div>
          </div>
          <Link to="/produits">
            <button className=" px-4 py-2 text-sm  border border-black text-black font-medium hover:bg-black  hover:text-white transition">View all</button>
          </Link>
        </div>
        <div className="overflow-x-auto hide-scrollbar" style={{ scrollSnapType: 'x mandatory' }}>
          <div
            ref={sliderRef}
            className="flex gap-2  transition-all duration-300"
            style={{ scrollBehavior: 'smooth' }}
          >
            {similaires.map((article, index) => (
              <div key={article.id} className="min-w-[270px] max-w-[270px] flex-1">
                <ProductCard
                  article={article}
                  isVisible={isVisible}
                  index={index}
                  onEyeClick={(id) => {
                    setQuickViewId(id);
                    setQuickViewOpen(true);
                  }}
                  ref={index === 0 ? cardRef : undefined}
                  data-article-card
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Partie CTA */}
      <div className="max-w-5xl mx-auto w-full border border-gray-300 my-8 py-8 sm:py-12 px-2 sm:px-6 flex flex-col items-center text-center bg-white">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">Ajoutez ce produit à votre panier</h3>
        <p className="text-gray-600 mb-6 max-w-xl text-sm sm:text-base">Profitez de cette offre exclusive et ne manquez pas l'occasion d'acquérir cet article unique.</p>
        <div className="flex flex-col justify-center sm:flex-row gap-3 sm:gap-4 w-full max-w-xs sm:max-w-none mx-auto">
          <button className="w-full sm:w-auto px-6 py-2 bg-black text-white font-medium hover:bg-white hover:text-black hover:border transition">Ajouter</button>
          <button className="w-full sm:w-auto px-6 py-2 border border-black text-black font-medium hover:bg-black   hover:text-white transition">Acheter</button>
        </div>
      </div>
      <style jsx>{`
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        @keyframes productCard {
          from { opacity: 0; transform: translateY(40px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-product-card { animation: productCard 0.8s ease-out forwards; opacity: 0; }
      `}</style>
      {/* QuickView modal */}
      <ProductQuickView
        articleId={quickViewId}
        open={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </section>
  );
} 