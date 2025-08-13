/**
 * CartContext.js
 * 
 * Description :
 * Contexte global pour la gestion de l'état du panier dans toute l'application.
 * Ce contexte permet de gérer l'ouverture/fermeture du panier depuis n'importe quel composant
 * sans avoir à passer les props à travers plusieurs niveaux de composants (prop drilling).
 *
 * Fonctionnalités principales :
 * - Fournit un état global pour l'ouverture/fermeture du panier
 * - Expose des méthodes pour manipuler cet état (openCart, closeCart)
 * - Simplifie l'accès à ces fonctionnalités via un hook personnalisé
 *
 * Structure :
 * - CartProvider : Composant fournisseur du contexte
 * - useCart : Hook personnalisé pour accéder au contexte
 *
 * Utilisation :
 * 1. Envelopper l'application avec <CartProvider>
 * 2. Dans n'importe quel composant :
 *    const { cartOpen, openCart, closeCart } = useCart();
 */

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

