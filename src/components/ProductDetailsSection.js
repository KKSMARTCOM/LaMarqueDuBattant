/**
 * ProductDetailsSection.js
 * 
 * Description :
 * Composant principal pour l'affichage détaillé d'un produit.
 * Gère la galerie d'images, la sélection des tailles, l'ajout au panier et l'affichage
 * des informations détaillées du produit.
 *
 * Fonctionnalités principales :
 * - Galerie d'images avec navigation et miniatures
 * - Sélection de taille obligatoire avant ajout au panier
 * - Affichage des détails du produit (prix, description, etc.)
 * - Gestion des produits en rupture de stock
 * - Affichage des badges (Nouveau, Réduction)
 *
 * Props :
 * - product (Object) : Objet contenant les informations du produit
 *   - id (string/number) : Identifiant unique du produit
 *   - name (string) : Nom du produit
 *   - price (number) : Prix de base
 *   - discount_percent (number) : Pourcentage de réduction (optionnel)
 *   - description (string) : Description détaillée
 *   - image (string) : URL de l'image principale
 *   - secondaryImages (Array) : Tableau d'URLs des images secondaires
 *   - sizes (Array) : Tailles disponibles
 *   - stock (number) : Quantité disponible
 *
 * État local :
 * - currentImg (number) : Index de l'image actuellement affichée
 * - selectedSize (string) : Taille sélectionnée
 * - quantity (number) : Quantité sélectionnée
 * - showSuccess (boolean) : Affiche le message de succès
 *
 * Fonctionnalités avancées :
 * - Navigation clavier dans la galerie (flèches gauche/droite)
 * - Validation du formulaire avant ajout au panier
 * - Gestion des messages d'erreur et de succès
 * - Affichage conditionnel des boutons selon la disponibilité
 *
 * Exemple d'utilisation :
 * <ProductDetailsSection product={productData} />
 */

import React, { useState, useRef } from "react";
import getImagePath from "./getImagePath";
import { addToCartById } from "./cartUtils";
import { isNewProduct } from "../utils/priceUtils";

// --- Composant principal ---
export default function ProductDetailsSection({ product }) {
  // --- Gestion des images ---
  const allImages = [product.image, ...(product.secondaryImages || [])];
  const [currentImg, setCurrentImg] = useState(0);
  
  // Navigation entre les images
  const nextImage = () => {
    setCurrentImg((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImg((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  // Gestion du clavier pour la navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  };

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
      {/* --- Colonne gauche : galerie d'images --- */}
      <div className="w-full lg:flex-[1.2] h-96 lg:h-full relative group">
        <div className="w-full h-full relative" onKeyDown={handleKeyDown} tabIndex={0}>
          {/* Contenu de la galerie */}
          {/* Navigation */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/5 backdrop-blur-lg text-white p-2 rounded-full z-10 hover:bg-black/70"
            aria-label="Image précédente"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Image courante */}
          <img
            src={getImagePath(allImages[currentImg], 'products')}
            alt={product.title}
            className="w-full h-full object-cover"
          />
          
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/5 backdrop-blur-lg text-white p-2 rounded-full z-10 hover:bg-black/70"
            aria-label="Image suivante"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          {/* Pagination */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 rounded-full left-1/2 -translate-x-1/2 flex space-x-2">
              {allImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImg(i)}
                  className={`h-2 w-2 rounded-full border border-black/20 transition-all ${
                    i === currentImg ? 'w-6 bg-white' : 'w-2 bg-white/50'
                  }`}
                  aria-label={`Image ${i + 1}`}
                />
              ))}
            </div>
          )}
          {isNewProduct(product.dateAdded) && (
            <div className="absolute top-4 right-4 bg-black text-white text-xs font-medium px-2 py-1">
              NOUVEAU
            </div>
          )}
        </div>
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
                    `px-3 py-1 border border-black rounded-md bg-white text-black transition select-none
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
              className="w-12 h-8 sm:w-16 sm:h-10 border border-gray-400 rounded-md px-2 py-2"
              id="details-qty-input"
            />
            <button
              className={`flex-1 w-12 h-8 sm:w-16 sm:h-10 rounded-md  bg-black text-white font-semibold flex items-center justify-center gap-4 text-xs sm:text-base uppercase tracking-wider ${!selectedSize ? 'opacity-60 cursor-not-allowed' : 'hover:bg-white hover:text-black hover:border hover:border-black cursor-pointer'}`}
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
          <button className=" font-semibold mb-4 w-full rounded-md h-8 sm:h-full py-0 sm:py-2 bg-white border  border-black text-black hover:bg-black hover:text-white transition duration-200 ">Acheter maintenant</button>

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