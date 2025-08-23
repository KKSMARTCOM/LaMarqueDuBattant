/**
 * useChangesCart.js
 *
 * Description:
 *  Hook mince qui délègue au contexte `ChangesCartContext`.
 *  Fournit un point d'import stable pour les composants.
 */
import { useChangesCartContext } from '../context/ChangesCartContext';

/**
 * Retourne l'API du panier de changements (ajout/suppression/clear, ouverture modale, etc.).
 * À utiliser dans les composants enfants de `ChangesCartProvider`.
 * @returns {{
 *  items: Array,
 *  count: number,
 *  isOpen: boolean,
 *  openModal: Function,
 *  closeModal: Function,
 *  addChange: Function,
 *  removeChange: Function,
 *  clear: Function,
 * }}
 */
export const useChangesCart = () => useChangesCartContext();

export default useChangesCart;
