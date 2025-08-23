/**
 * ChangesCartContext.js
 *
 * Description:
 *  Contexte global pour gérer un "panier de changements" (batch) en admin.
 *  Permet d'ajouter des opérations (create/update/delete) puis de les appliquer en lot.
 *
 * Persistance:
 *  - Stockage local via localStorage (clé `lmdb_changes_cart`).
 *
 * API exposée (via hook/useChangesCart):
 *  - items: Array<{ id:string, createdAt:string, type:string, payload?:Object, targetId?:number|string, source?:string }>
 *  - count: number
 *  - isOpen: boolean
 *  - openModal(): void
 *  - closeModal(): void
 *  - addChange(change): void
 *  - removeChange(id): void
 *  - clear(): void
 */
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'lmdb_changes_cart';

/** @type {React.Context<null | {
 *  items: Array<any>,
 *  count: number,
 *  isOpen: boolean,
 *  openModal: Function,
 *  closeModal: Function,
 *  addChange: Function,
 *  removeChange: Function,
 *  clear: Function,
 * }>} */
const ChangesCartContext = createContext(null);

/**
 * Provider du contexte ChangesCart.
 * @param {{ children: React.ReactNode }} props
 */
export const ChangesCartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch (e) {
      console.warn('Failed to read changes cart from storage', e);
    }
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to persist changes cart to storage', e);
    }
  }, [items]);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  // Generate a lightweight id
  const genId = () => `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

  /**
   * Ajoute une opération au panier et ouvre la modale.
   * @param {{ type:'create'|'update'|'delete', payload?:Object, targetId?:number|string, source?:string }} change
   */
  const addChange = (change) => {
    // change: { type: 'create'|'update'|'delete', payload?, targetId?, source? }
    const item = {
      id: genId(),
      createdAt: new Date().toISOString(),
      ...change,
    };
    setItems((prev) => [item, ...prev]);
    setIsOpen(true); // Open cart to give feedback
  };

  /** Supprime une opération par id. */
  const removeChange = (id) => setItems((prev) => prev.filter((x) => x.id !== id));
  /** Vide le panier. */
  const clear = () => setItems([]);

  const value = useMemo(() => ({
    items,
    count: items.length,
    isOpen,
    openModal,
    closeModal,
    addChange,
    removeChange,
    clear,
  }), [items, isOpen]);

  return (
    <ChangesCartContext.Provider value={value}>
      {children}
    </ChangesCartContext.Provider>
  );
};

/**
 * Hook interne pour consommer le contexte ChangesCart.
 * @returns {NonNullable<React.ContextType<typeof ChangesCartContext>>}
 */
export const useChangesCartContext = () => {
  const ctx = useContext(ChangesCartContext);
  if (!ctx) throw new Error('useChangesCartContext must be used within ChangesCartProvider');
  return ctx;
};
