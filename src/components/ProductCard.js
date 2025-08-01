import React from "react";
import { Link } from "react-router-dom";
import getImagePath from "./getImagePath";

// Composant carte d'article réutilisable
export default function ProductCard({ article, isVisible, onEyeClick, index }) {
  return (
    <Link to={`/produit/${article.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        key={article.id}
        className={`flex flex-col h-full group ${isVisible ? 'animate-product-card' : 'opacity-0'}`}
        style={{
          animationDelay: isVisible ? `${0.3 + (index * 0.1)}s` : '0s'
        }}
      >
        {/* Image du produit avec tag de réduction et overlay des tailles */}
        <div className="relative mb-3 md:mb-4 overflow-hidden">
          {/* Tag de réduction en haut à gauche */}
          {article.discount_percent > 0 && (
            <span className="absolute top-2 right-2 bg-white text-black text-[10px] md:text-[11px] font-bold px-2 py-1 z-10 shadow">
              -{article.discount_percent}%
            </span>
          )}
          {/* Image du produit */}
          <img
            src={getImagePath(article.image, "products")}
            alt={article.title}
            className="w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Overlay dégradé pour les tailles */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          {/* Overlay des tailles disponibles au survol */}
          <div className="absolute inset-0 flex flex-col items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-black bg-opacity-0  text-white pl-4  mb-2 flex flex-col items-center z-10">
              <div className="flex items-center gap-4 pl-2">
                <span className="text-ellipsis md:text-lg font-normal uppercase tracking-wide">
                  {Array.isArray(article.sizes) && article.sizes.length > 0
                    ? article.sizes.join(' | ').toUpperCase()
                    : 'Aucune taille'}
                </span>
                <button
                  className="p-1 bg-black text-white hover:bg-white hover:text-black border border-black transition flex items-center justify-center"
                  title="Voir les tailles"
                  onClick={e => { e.preventDefault(); onEyeClick(article.id); }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z" />
                    <circle cx="12" cy="12" r="3.5" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            {/* Nom du produit et prix */}
            <div className="text-[11px] md:text-xs font-semibold text-left mb-1 md:mb-0.5">
              <span className="block sm:inline">{article.title}</span>
              <div className="flex justify-between sm:float-right sm:ml-2 mt-1 sm:mt-0">
                <span className="font-normal text-red-500 text-[10px] md:text-xs">{article.price} FCFA</span>
                <span className="font-normal text-gray-500 line-through text-[10px] md:text-xs ml-2">{article.discount_price} FCFA</span>
              </div>
            </div>
            {/* Variante ou description courte */}
            <div className="text-[10px] md:text-[11px] text-gray-500 mb-2 text-left">{article.variant}</div>
          </div>
        </div>
      </div>
    </Link>
  );
} 