/**
 * useCartItems.js
 *
 * Description:
 *  Hook personnalisé pour gérer le panier utilisateur via localStorage
 *  (lecture, écriture, synchronisation). Évite la duplication de logique
 *  dans les composants (CartDrawer, Header, etc.).
 */

import { useEffect, useState } from 'react';

/**
 * useCartItems : hook pour gérer le panier utilisateur.
 * @returns {{
 *  cartItems: Array,
 *  setCartItems: Function,
 *  addItem: Function,
 *  removeItem: Function,
 *  increment: Function,
 *  decrement: Function,
 *  loading: boolean,
 *  error: string|null,
 * }}
 */
export default function useCartItems() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Synchronisation du panier en temps réel (localStorage)
  useEffect(() => {
    const updateCart = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(cart);
        setLoading(false);
      } catch (err) {
        setError('Erreur de lecture du panier');
        setLoading(false);
      }
    };
    updateCart();
    window.addEventListener('storage', updateCart);
    const interval = setInterval(updateCart, 500);
    return () => {
      window.removeEventListener('storage', updateCart);
      clearInterval(interval);
    };
  }, []);

  // Ajoute un article au panier
  const addItem = (item) => {
    setCartItems(prev => {
      const idx = prev.findIndex(a => a.id === item.id && a.size === item.size && a.variant === item.variant);
      let updated;
      if (idx !== -1) {
        updated = [...prev];
        updated[idx].quantity = (updated[idx].quantity || 1) + (item.quantity || 1);
      } else {
        updated = [...prev, { ...item, quantity: item.quantity || 1 }];
      }
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  };

  // Incrémente la quantité d'un article
  const increment = (item) => {
    setCartItems(prev => {
      const updated = prev.map(art =>
        art.id === item.id && art.size === item.size && art.variant === item.variant
          ? { ...art, quantity: art.quantity + 1 }
          : art
      );
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  };

  // Décrémente la quantité d'un article (min 1)
  const decrement = (item) => {
    setCartItems(prev => {
      const updated = prev.map(art =>
        art.id === item.id && art.size === item.size && art.variant === item.variant && art.quantity > 1
          ? { ...art, quantity: art.quantity - 1 }
          : art
      );
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  };

  // Supprime un article du panier
  const removeItem = (item) => {
    setCartItems(prev => {
      const updated = prev.filter(art => !(art.id === item.id && art.size === item.size && art.variant === item.variant));
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  };

  return { cartItems, setCartItems, addItem, removeItem, increment, decrement, loading, error };
} 