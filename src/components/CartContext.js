// CartContext.js
// Contexte global pour la gestion de l'ouverture/fermeture du panier dans toute l'application
// Permet d'éviter le passage de props (prop drilling) et de simplifier la logique UI

import React, { createContext, useContext, useState } from 'react';

// Création du contexte
const CartContext = createContext();

/**
 * CartProvider : composant englobant qui fournit l'état du panier à toute l'app
 * Utilisation : englober <App /> ou la racine de l'application avec <CartProvider>
 */
export function CartProvider({ children }) {
  // État d'ouverture du panier (true = ouvert, false = fermé)
  const [cartOpen, setCartOpen] = useState(false);

  // Fonction pour ouvrir le panier
  const openCart = () => setCartOpen(true);
  // Fonction pour fermer le panier
  const closeCart = () => setCartOpen(false);

  // Valeur du contexte
  const value = { cartOpen, openCart, closeCart };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

/**
 * Hook personnalisé pour accéder facilement au contexte du panier
 * Utilisation : const { cartOpen, openCart, closeCart } = useCart();
 */
export function useCart() {
  return useContext(CartContext);
}

