/**
 * CartDrawer.js
 * 
 * Description :
 * Composant de panier latéral qui s'affiche par-dessus l'interface principale.
 * Gère l'affichage des articles du panier, la modification des quantités, la suppression d'articles
 * et la suggestion d'accessoires complémentaires.
 *
 * Fonctionnalités principales :
 * - Affichage des articles du panier avec image, nom, prix et quantité
 * - Modification des quantités (incrémentation/décrémentation)
 * - Suppression d'article du panier
 * - Calcul du sous-total et du total
 * - Affichage d'accessoires suggérés
 * - Gestion des états de chargement et d'erreur
 *
 * Hooks personnalisés utilisés :
 * - useCartItems : Gestion des articles du panier
 *
 * Props :
 * - open (boolean) : Contrôle l'affichage du panier
 * - onClose (function) : Fonction appelée pour fermer le panier
 *
 * Éléments d'interface :
 * - Overlay semi-transparent
 * - Panier coulissant depuis la droite
 * - Boutons d'action (continuer les achats, procéder au paiement)
 * - Liste des articles avec contrôles de quantité
 * - Section d'accessoires suggérés
 */

import React, { useState, useEffect } from "react";
import fetchData from "./fetchData";
import getImagePath from "./getImagePath";
import useCartItems from '../hooks/useCartItems';
import { generateCartWhatsAppMessage } from '../utils/whatsappUtils';

export default function CartDrawer({ open, onClose }) {
  // Utilisation du hook useCartItems pour gérer le panier
  const { cartItems, loading, error, increment, decrement, removeItem } = useCartItems();
  const [accessories, setAccessories] = useState([]);

  // Charger les accessoires seulement à l'ouverture du drawer
  useEffect(() => {
    if (open) {
      fetchData('/data/articles.json')
        .then((data) => {
          const filtered = data.filter((a) => a.category && a.category.toLowerCase() === 'accessoire');
          setAccessories(filtered);
        })
        .catch(() => setAccessories([]));
    }
  }, [open]);

  if (!open) return null;
  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={onClose}></div>
      {/* Drawer */}
      <aside className="fixed top-0 right-0 w-full max-w-xl h-full bg-white z-50 shadow-lg flex flex-col animate-slide-in font-light">
        {/* Contenu */}
        <div className="flex-1 flex flex-row h-0 min-h-0">
          {/* Wrapper accessoires à gauche (visible md+) */}
          <div className="w-48 border-r hidden md:flex flex-col h-full min-h-0">
            <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
              <h3 className="font-semibold mb-3 text-xs text-left">AJOUTEZ DES ACCESSOIRES ASSORTIS</h3>
              {accessories.map((acc, idx) => (
                <div key={idx} className="mb-8 group relative">
                  <img
                    src={getImagePath(acc.image, "products")}
                    alt={acc.title}
                    className="w-full h-52 object-cover mb-1 rounded-md "
                  />
                  {/* Bouton Ajouter au survol */}
                  <button
                    className="absolute rounded-md left-1/2 bottom-12 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-black text-white px-4 py-2 shadow transition-opacity duration-200 text-xs font-semibold"
                    style={{ zIndex: 2 }}
                    onClick={() => {
                      // Taille par défaut : première taille si disponible, sinon undefined
                      const size = Array.isArray(acc.sizes) && acc.sizes.length > 0 ? acc.sizes[0] : undefined;
                      if (!size) {
                        // Petite notif d'erreur si pas de taille
                        import('./cartUtils').then(({ showCartNotification }) => showCartNotification(acc, 1, false));
                        return;
                      }
                      import('./cartUtils').then(({ addToCartById }) => addToCartById(acc.id, size, 1));
                    }}
                  >
                    Ajouter
                  </button>
                  <div className="text-xs font-thin mb-1 text-left">{acc.title}</div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-thin text-black">
                      {acc.discount_percent > 0 
                        ? Math.round(acc.price * (1 - acc.discount_percent / 100)) 
                        : acc.price} FCFA
                    </span>
                    {acc.discount_percent > 0 && (
                      <>
                        <span className="text-gray-400 line-through text-[10px]">
                          {acc.price} FCFA
                        </span>
                        <span className="bg-red-100 text-red-800 text-[10px] font-medium px-1.5 py-0.5 rounded">
                          -{acc.discount_percent}%
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Wrapper panier à droite */}
          <div className="flex-[2.2] flex flex-col h-full min-h-0">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-bold text-left">PANIER D'ACHAT ({cartItems.length})</h2>
              <button onClick={onClose} className="text-xl font-bold text-gray-700 hover:text-black">&times;</button>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
              {loading ? (
                <div className="text-center text-gray-400 text-xs">Chargement du panier...</div>
              ) : error ? (
                <div className="text-center text-red-500 text-xs">{error}</div>
              ) : cartItems.length === 0 ? (
                <div className="text-left text-gray-500 mt-8 text-xs">Votre panier est vide.</div>
              ) : (
                [...cartItems].reverse().map((item, idx) => (
                  <div key={item.id} className="flex flex-col mb-4 border-b pb-3">
                    <div className="flex flex-row mb-4">
                      <div className="relative rounded-md">
                        <img src={getImagePath(item.image, "products")} alt={item.title} className="w-32 h-36 object-cover rounded-md mr-3 " />
                        {item.discountPercent > 0 && (
                          <span className="absolute top-2 right-4 rounded-md bg-black text-white text-[10px] font-medium px-1.5 py-0.5">
                            -{item.discountPercent}%
                          </span>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="font-thin text-xs mb-0.5 text-left">{item.title}</div>
                          <div className="text-[10px] text-gray-500 mb-0.5 text-left">{item.size} {item.variant && `- ${item.variant}`}</div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-black font-thin text-xs">{item.price} FCFA</span>
                            {item.oldPrice && (
                              <>
                                <span className="text-gray-400 line-through text-[10px]">{item.oldPrice} FCFA</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Bloc quantité */}
                    <div className="w-full flex flex-row items-center gap-2 mb-4">
                      <span className="text-xs text-gray-700 w-20 font-light">Quantité</span>
                      <div className="flex flex-1 border border-gray-300 bg-white rounded justify-between items-center px-2 py-1">
                        <button className="text-lg px-2 font-light hover:font-normal" onClick={() => decrement(item)}>-</button>
                        <span className="text-base font-light select-none">{item.quantity}</span>
                        <button className="text-lg px-2 font-light hover:font-normal" onClick={() => increment(item)}>+</button>
                      </div>
                      <button className="text-xl text-gray-700 hover:text-red-500 ml-2 cursor-pointer" onClick={() => removeItem(item)} title="Supprimer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2m2 0v12a2 2 0 01-2 2H8a2 2 0 01-2-2V7h12z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {/* Remise et total, toujours visible en bas */}
            <div className="border-t border-black p-4">
              <div className="flex items-center mb-2">
                <input type="text" placeholder="Remise..." className="border border-gray-300 rounded-md px-2 py-3 w-full text-xs mr-2 text-left" />
                <button className="slice flex justify-center  items-center border-[.1px] border-black rounded-md  px-3 py-2 text-xs ml-2" style={{ minWidth: 70 }}>
                  <span className="text">APPLY</span>
                </button>
              </div>
              {/* Calcul du total avec réductions */}
              {(() => {
                const subtotal = cartItems.reduce((sum, item) => {
                  // item.price contient déjà le prix réduit (voir cartUtils.js)
                  return sum + (item.price * item.quantity);
                }, 0);
                
                // Calcul des économies totales (pour affichage optionnel)
                const totalSavings = cartItems.reduce((sum, item) => {
                  return item.oldPrice 
                    ? sum + ((item.oldPrice - item.price) * item.quantity)
                    : sum;
                }, 0);
                
                return (
                  <button 
                    className="bouttonCheckout"
                    disabled={cartItems.length === 0}
                    onClick={() => {
                      const whatsappUrl = generateCartWhatsAppMessage(cartItems);
                      window.open(whatsappUrl, '_blank');
                    }}
                  >
                    <span className="text">
                      COMMANDER VIA WHATSAPP - {subtotal.toLocaleString('fr-FR')} FCFA
                    </span>
                    <span className="text-xs font-normal mt-1">
                      {totalSavings > 0 ? `Économies: ${totalSavings.toLocaleString('fr-FR')} FCFA` : ''}
                    </span>
                  </button>
                );
              })()}
              <div className="text-[10px] text-gray-500 mt-2 text-left">Vous pouvez bénéficier de la livraison gratuite</div>
            </div>
          </div>
        </div>
      </aside>
      <style jsx>{`
      .bouttonCheckout {
          width: 100%;
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          position: relative;
          overflow: hidden;
          border: 1px solid #18181a;
          border-radius: .4rem;
          color: #18181a;
          display: inline-block;
          font-size: 15px;
          text-decoration: none;
          cursor: pointer;
          background: #fff;
          user-select: none;
          -webkit-user-select: none;
          touch-action: manipulation;
          }

          .bouttonCheckout span:first-child {
          position: relative;
          transition: color 600ms cubic-bezier(0.48, 0, 0.12, 1);
          z-index: 10;
          }

          .bouttonCheckout span:last-child {
          width: 100%;
          color: white;
          display: block;
          position: absolute;
          bottom: 0;
          transition: all 500ms cubic-bezier(0.48, 0, 0.12, 1);
          z-index: 100;
          opacity: 0;
          top: 50%;
          left: 50%;
          transform: translateY(225%) translateX(-50%);
          height: 100%;
          line-height: 100%;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          }

          .bouttonCheckout:after {
          content: "";
          position: absolute;
          bottom: -50%;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: black;
          transform-origin: bottom center;
          transition: transform 600ms cubic-bezier(0.48, 0, 0.12, 1);
          transform: skewY(6deg) scaleY(0);
          z-index: 50;
          }

          .bouttonCheckout:hover:after {
          transform-origin: bottom center;
          transform: skewY(6deg) scaleY(2);
          }

          .bouttonCheckout:hover span:last-child {
          transform: translateX(-50%) translateY(-50%);
          opacity: 1;
          transition: all 900ms cubic-bezier(0.48, 0, 0.12, 1);
          }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in { animation: slideIn 0.3s ease-out; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

              .slice {
        --c1: #FFFFFF;
        --c2: #000000;
        --size-letter: 15px;
        padding: 0.5rem 0.75em;
        font-size: var(--size-letter);

        background-color: transparent;
        // On diminue la taille de la bordure en divisant par 12 au lieu de 6 (plus fin)
        border: calc(var(--size-letter) / 12) solid var(--c2);
        border-radius: 0;
        cursor: pointer;

        overflow: hidden;
        position: relative;
        transition: 300ms cubic-bezier(0.83, 0, 0.17, 1);

        & > .text {
          font-weight: 100;
          color: var(--c2);
          position: relative;
          z-index: 1;
          transition: color 700ms cubic-bezier(0.83, 0, 0.17, 1);
        }
      }

      .slice::after {
        content: "";

        width: 0;
        height: calc(300% + 1em);

        position: absolute;
        translate: -50% -50%;
        inset: 50%;
        rotate: 30deg;

        background-color: var(--c2);
        transition: 1000ms cubic-bezier(0.83, 0, 0.17, 1);
      }

      .slice:hover {
        & > .text {
          color: var(--c1);
        }
        &::after {
          width: calc(120% + 1em);
        }
      }

      .slice:active {
        scale: 0.98;
        filter: brightness(0.9);
}`}
      </style>
    </>
  );
} 