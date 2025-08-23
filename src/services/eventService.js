/**
 * eventService.js
 *
 * Service HTTP pour gérer les opérations CRUD sur les événements côté serveur
 * (API Node `server/`). Miroir de articleService pour la ressource "events".
 */

// Utiliser un chemin relatif pour tirer parti du proxy CRA (voir package.json -> proxy)
const API_BASE_URL = '/api';
const CART_STORAGE_KEY = 'lmdb_changes_cart';

/**
 * Récupère tous les événements.
 * @returns {Promise<Array<Object>>}
 */
export const getAllEvents = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/events`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    throw new Error("Erreur lors de la récupération des événements");
  }
};

/**
 * Récupère un événement par ID.
 * @param {number|string} id
 * @returns {Promise<Object|null>}
 */
export const getEventById = async (id) => {
  const events = await getAllEvents();
  const eventId = typeof id === 'string' ? parseInt(id, 10) : id;
  return events.find(e => e.id === eventId) || null;
};

/**
 * Crée un événement.
 * @param {Object} eventData
 * @returns {Promise<Object>}
 */
export const createEvent = async (eventData) => {
  const res = await fetch(`${API_BASE_URL}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(eventData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Erreur lors de la création de l\'événement');
  }
  return res.json();
};

/**
 * Met à jour un événement.
 * @param {number|string} id
 * @param {Object} data
 */
export const updateEvent = async (id, data) => {
  const eventId = typeof id === 'string' ? parseInt(id, 10) : id;
  const res = await fetch(`${API_BASE_URL}/events/${eventId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Erreur lors de la mise à jour de l'événement ${eventId}`);
  }
  return res.json();
};

/**
 * Supprime un événement.
 * @param {number|string} id
 */
export const deleteEvent = async (id) => {
  const eventId = typeof id === 'string' ? parseInt(id, 10) : id;
  const res = await fetch(`${API_BASE_URL}/events/${eventId}`, { method: 'DELETE' });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Erreur lors de la suppression de l'événement ${eventId}`);
  }
  return true;
};

/**
 * Applique un lot de changements sur les événements.
 * @param {Array} changes
 */
export const applyBatch = async (changes) => {
  const res = await fetch(`${API_BASE_URL}/events/batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ changes }),
  });
  if (!res.ok && res.status !== 207) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Erreur lors de l\'application du batch événements');
  }
  return res.json();
};

/**
 * Détermine le prochain ID événement disponible en tenant compte du panier local.
 * - max des IDs existants côté API
 * - max des IDs des créations en attente dans localStorage ayant resource==='event'
 *   (ou, en rétrocompatibilité, payload typé événement: possède `titre` ou `date`).
 * @returns {Promise<number>}
 */
export const getNextEventId = async () => {
  const events = await getAllEvents();
  const maxExistingId = events.length > 0 ? Math.max(...events.map(e => Number(e.id) || 0)) : 0;

  let maxCartCreateId = 0;
  try {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(CART_STORAGE_KEY) : null;
    if (raw) {
      const items = JSON.parse(raw);
      if (Array.isArray(items)) {
        for (const it of items) {
          if (it && it.type === 'create') {
            const isEvent = it.resource === 'event' || (!!it.payload && (typeof it.payload.titre === 'string' || typeof it.payload.date === 'string'));
            if (!isEvent) continue;
            const pid = it.payload?.id;
            const num = Number(pid);
            if (!Number.isNaN(num)) maxCartCreateId = Math.max(maxCartCreateId, num);
          }
        }
      }
    }
  } catch (e) {
    maxCartCreateId = 0;
  }

  return Math.max(maxExistingId, maxCartCreateId) + 1;
};

const eventService = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getNextEventId,
  applyBatch,
};

export default eventService;
