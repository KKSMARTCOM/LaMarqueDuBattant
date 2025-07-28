import React, { useEffect, useRef, useState } from "react";
import { addToCartById } from "./cartUtils";
import useArticle from '../hooks/useArticle';

export default function ProductQuickView({ articleId, open, onClose }) {
  // Utilisation du hook useArticle pour charger l'article
  const { article, loading, error } = useArticle(articleId);
  const wrapperRef = useRef(null);
  // État pour la taille sélectionnée
  const [selectedSize, setSelectedSize] = useState(null);

  // Fermer au clic extérieur
  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose]);

  // Animation d'ouverture/fermeture
  return (
    <div
      className={`fixed inset-0 z-50 flex justify-end items-stretch transition-all duration-300 ${open ? "pointer-events-auto bg-black/30 backdrop-blur-sm" : "pointer-events-none"}`}
      style={{ fontFamily: 'Commissioner, sans-serif' }}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={wrapperRef}
        className={`bg-white shadow-2xl h-full w-full max-w-full min-w-0 sm:max-w-[60vw] sm:min-w-[300px] lg:max-w-[33vw] lg:min-w-[400px] flex flex-col transition-transform duration-300  ${open ? "translate-x-0" : "translate-x-full"}`}
        style={{
        boxShadow: "-8px 0 32px rgba(0,0,0,0.12)",
        }}
      >
        {/* Header fermeture */}
        <div className="flex items-center justify-between px-2 pt-2 pb-4 border-b border-gray-300 sticky top-0 bg-white z-10">
          <h2 className=" ml-6 text-3xl font-lightt- tracking-wide ">Vue Rapide </h2>
          <button onClick={onClose} className="text-2xl p-2 hover:bg-gray-100 rounded-full">&times;</button>
        </div>
        {/* Contenu */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-4  pb-2 sm:pb-4 lg:pb-6">
          {loading && <div>Chargement...</div>}
          {error && <div className="text-red-500">Erreur : {error}</div>}
          {!loading && !error && article && (
            <>
              {/* Image en background */}
              <div
                className="w-full mb-1 shadow "
                style={{
                  backgroundImage: `url(${process.env.PUBLIC_URL + "/assets/images/ProductsImages/" + article.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  height: "400px",
                  backgroundColor: "#f7f7f7",
                }}
              />
              <div className="pb-4 px-2 sm:pb-6 sm:px-2 lg:px-6">
                {/* Catégorie + titre */}
                <div className="text-gray-400 text-left text-sm mb-1">{article.category}</div>
                <div className="text-2xl font-semibold text-left mb-0">{article.title}</div>
                {/* Prix */}
                <div className="text-lg text-left font-light mb-4">€{article.price}</div>
                {/* Tailles */}
                <div className="mb-4">
                  <div className="text-left text-sm mb-1">Taille</div>
                  <div className="flex gap-2 flex-wrap">
                    {Array.isArray(article.sizes) && article.sizes.length > 0 ? (
                      article.sizes.map((size) => (
                        <label key={size} className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="hidden peer"
                            checked={selectedSize === size}
                            onChange={() => setSelectedSize(size)}
                          />
                          <span className={
                            `px-3 py-1 border border-gray-300 bg-white text-black transition select-none
                            peer-checked:bg-black peer-checked:text-white
                            flex items-center justify-center w-12 h-8 text-sm font-extralight`
                          }>
                            {size}
                          </span>
                        </label>
                      ))
                    ) : (
                      <span className="text-gray-400">Aucune taille</span>
                    )}
                  </div>
                </div>
                {/* Bouton ajouter au panier (inactif pour l'instant) */}
                <button
                  className={`w-full py-3 bg-black text-white font-semibold mb-2 ${!selectedSize ? 'cursor-not-allowed opacity-60' : 'hover:bg-white hover:text-black hover:border hover:border-black cursor-pointer'}`}
                  disabled={!selectedSize}
                  onClick={async () => {
                    if (!selectedSize) return;
                    await addToCartById(article.id, selectedSize, 1);
                  }}
                >
                  AJOUTER AU PANIER
                </button>
                {/* Lien fiche produit */}
                <a href="#" className="text-gray-500 underline text-sm">Voir les détails du produit +</a>
              </div>
            </>
          )}
          {!loading && !error && !article && (
            <div className="text-gray-400">Aucun article trouvé.</div>
          )}
        </div>
      </div>
      {/* Animation CSS */}
      <style>{`
        .translate-x-0 { transform: translateX(0); }
        .translate-x-full { transform: translateX(100%); }
      `}</style>
    </div>
  );
} 