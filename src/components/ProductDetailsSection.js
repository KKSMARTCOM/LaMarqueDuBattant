// --- Imports React et hooks ---
import React, { useState, useRef } from "react";
import getImagePath from "./getImagePath";
import { addToCartById } from "./cartUtils";
import { isNewProduct } from "../utils/priceUtils";

// --- Composant principal ---
export default function ProductDetailsSection({ product }) {
  // --- Gestion des images (prévu pour plusieurs images) ---
  const images = product.images || [product.image];
  const [currentImg] = useState(0);

  // --- Sélection de taille ---
  const [selectedSize, setSelectedSize] = useState(null);

  // --- Gestion des onglets (Détails, Expédition, Retours) ---
  const [activeTab, setActiveTab] = useState('Détails');

  // --- Ref pour la div scrollable (colonne de droite) ---
  const scrollableRef = useRef(null);

  // --- Contenu des onglets ---
  const tabContent = {
    'Détails': product.details || "Ce t-shirt est fabriqué à partir de matériaux de haute qualité pour assurer confort et durabilité. Il est disponible en plusieurs tailles. Idéal pour toutes les occasions.",
    'Expédition': "Expédition rapide sous 24/48h.",
    'Retours': "Retours gratuits sous 30 jours."
  };

  // --- Sécurité : si pas de produit, ne rien afficher ---
  if (!product) return null;

  // --- Gestion du scroll global sur la section (pour rediriger le scroll vers la colonne de droite sur desktop) ---
  const handleSectionWheel = (e) => {
    if (scrollableRef.current) {
      scrollableRef.current.scrollTop += e.deltaY;
      e.preventDefault();
    }
  };

  // --- Rendu principal ---
  return (
    <section
      className="w-full mt-16 lg:mt-16 lg:h-screen flex flex-col lg:flex-row"
      onWheel={handleSectionWheel}
      style={{ overscrollBehavior: 'none' }}
    >
      {/* --- Colonne gauche : image produit (background cover) --- */}
      <div className="w-full lg:flex-[1.2] h-64 lg:h-full relative">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url(${getImagePath(images[currentImg], "products")})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
        ></div>
        {isNewProduct(product.dateAdded) && (
          <div className="absolute top-4 right-4 bg-black text-white text-xs font-medium px-2 py-1">
            NOUVEAU
          </div>
        )}
      </div>

      {/* --- Colonne droite : détails produit --- */}
      <div className="flex-1 lg:h-full bg-white flex items-center justify-center overflow-hidden w-full">
        {/*
          - overflow-y-auto (scroll vertical) uniquement sur desktop
          - scrollbar masquée sur tous les supports (voir style inline + style JSX plus bas)
        */}
        <div
          ref={scrollableRef}
          className="w-full  px-2 sm:px-16 py-4 sm:py-8 flex flex-col gap-3 sm:gap-4 lg:h-full lg:overflow-y-auto animate-fade-in-up"
          style={{
            scrollbarWidth: 'none', // Masque la scrollbar sur Firefox
            msOverflowStyle: 'none', // Masque la scrollbar sur IE/Edge
          }}
        >
          {/* --- Fil d'Ariane --- */}
          <div className="text-xs text-left text-gray-500 mb-2">
            Voir tout {'>'} Vêtements {'>'} <span className="font-semibold text-black">{product.title}</span>
          </div>

          {/* --- Titre et catégorie --- */}
          <div className="flex flex-col sm:mt-10">
            <span className="text-xs sm:text-sm text-gray-400 text-left uppercase font-normal mb-1">{product.category}</span>
            <span className="text-2xl sm:text-4xl text-left font-sans font-bold mb-0">{product.title}</span>
          </div>

          {/* --- Prix avec réduction --- */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-2">
            {product.discount_percent > 0 ? (
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-2xl font-extralight text-black">
                  {Math.round(product.price * (1 - product.discount_percent / 100))} FCFA
                </span>
                <span className="text-xs sm:text-xl text-gray-500 line-through">
                  {product.price} FCFA
                </span>
                <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded">
                  -{product.discount_percent}%
                </span>
              </div>
            ) : (
              <span className="text-xs sm:text-2xl font-extralight">
                {product.price} FCFA
              </span>
            )}
          </div>

          {/* --- Description courte --- */}
          <div className="text-xs sm:text-sm text-gray-700 text-left mb-2">{product.summary}</div>

          {/* --- Sélecteurs de taille (checkbox stylisées) --- */}
          <div className="flex flex-col gap-2 mb-2">
            <label className="text-sm sm:text-base font-semibold text-left">Taille</label>
            <div className="flex gap-2">
              {Array.isArray(product.sizes) && product.sizes.map(size => (
                <label key={size} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="hidden peer"
                    checked={selectedSize === size}
                    onChange={() => setSelectedSize(size)}
                  />
                  <span className={
                    `px-3 py-1 border border-black bg-white text-black transition select-none
                    peer-checked:bg-black peer-checked:text-white
                    flex items-center justify-center w-12 h-8 sm:w-16 sm:h-10 text-base font-medium`
                  }>
                    {size}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* --- Quantité et bouton panier --- */}
          <div className="flex items-center gap-2 mb-0">
            <input
              type="number"
              min={1}
              defaultValue={1}
              className="w-12 h-8 sm:w-16 sm:h-10 border border-gray-400 px-2 py-2"
              id="details-qty-input"
            />
            <button
              className={`flex-1 w-12 h-8 sm:w-16 sm:h-10  bg-black text-white font-semibold flex items-center justify-center gap-4 text-xs sm:text-base uppercase tracking-wider ${!selectedSize ? 'opacity-60 cursor-not-allowed' : 'hover:bg-white hover:text-black hover:border hover:border-black cursor-pointer'}`}
              disabled={!selectedSize}
              onClick={async () => {
                if (!selectedSize) return;
                const qty = parseInt(document.getElementById('details-qty-input').value, 10) || 1;
                await addToCartById(product.id, selectedSize, qty);
              }}
            >
              <span>AJOUTER AU PANIER</span>
              <span className="flex items-center gap-1">
                <span className="text-lg">●</span> {selectedSize}
              </span>
            </button>
          </div>
          <button className=" font-semibold mb-4 w-full h-8 sm:h-full py-0 sm:py-2 bg-white border  border-black text-black hover:bg-black hover:text-white transition duration-200 ">Acheter maintenant</button>

          {/* --- Message livraison --- */}
          <div className="text-xs text-gray-500 mb-2">Livraison gratuite dès 50€</div>

          {/* --- Onglets Détails/Expédition/Retours --- */}
          <nav className="flex gap-8 border-b border-gray-200 mb-2 text-sm">
            {['Détails', 'Expédition', 'Retours'].map(tab => (
              <button
                key={tab}
                className={
                  'relative pb-2 px-0 font-medium transition-colors ' +
                  (activeTab === tab ? 'text-black' : 'text-gray-500 hover:text-black')
                }
                onClick={() => setActiveTab(tab)}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-black rounded"></span>
                )}
              </button>
            ))}
          </nav>
          <div className="text-xs sm:text-sm text-gray-800 mt-2 whitespace-pre-line">
            {tabContent[activeTab]}
          </div>
        </div>
      </div>
      {/*
        Style local pour masquer la scrollbar sur tous les navigateurs (Chrome/Webkit)
        Le scroll reste fonctionnel !
      */}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
// --- Fin du composant ProductDetailsSection --- 