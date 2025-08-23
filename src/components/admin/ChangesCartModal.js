/**
 * ChangesCartModal.js
 *
 * Description:
 *  Modale d'aperçu et d'application d'un panier de modifications (create/update/delete)
 *  accumulées via le contexte `ChangesCartContext`. Permet de visualiser, supprimer,
 *  vider et appliquer en lot les opérations.
 */
  import React, { useState } from 'react';
import { FiX, FiTrash2, FiCheckCircle, FiChevronDown, FiChevronUp, FiAlertCircle, FiCheck } from 'react-icons/fi';
import * as articleService from '../../services/articleService';
import * as eventService from '../../services/eventService';
import useChangesCart from '../../hooks/useChangesCart';

/**
 * Composant modale pour gérer et appliquer les changements en attente.
 */
const ChangesCartModal = () => {
  const { items, isOpen, closeModal, removeChange, clear } = useChangesCart();
  const [applying, setApplying] = useState(false);
  const [applyReport, setApplyReport] = useState(null);
  const [expanded, setExpanded] = useState({});

  /**
   * Développe/réduit l'affichage détaillé d'un item donné.
   * @param {string} id
   */
  const toggleExpanded = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const stats = {
    create: items.filter(i => i.type === 'create').length,
    update: items.filter(i => i.type === 'update').length,
    delete: items.filter(i => i.type === 'delete').length,
  };

  /**
   * Retourne les classes Tailwind pour un badge de type d'opération.
   * @param {'create'|'update'|'delete'} type
   * @returns {string}
   */
  const typeBadge = (type) => {
    const base = 'px-2 py-0.5 rounded text-xs font-semibold uppercase';
    if (type === 'create') return `${base} bg-green-100 text-green-700 border border-green-200`;
    if (type === 'update') return `${base} bg-blue-100 text-blue-700 border border-blue-200`;
    return `${base} bg-red-100 text-red-700 border border-red-200`;
  };

  const resourceBadge = (resource) => {
    const base = 'px-2 py-0.5 rounded text-xs font-medium';
    const isEvent = resource === 'event';
    return `${base} ${isEvent ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-amber-100 text-amber-700 border border-amber-200'}`;
  };

  if (!isOpen) return null;

  /**
   * Applique toutes les opérations du panier dans l'ordre chronologique.
   * - Construit un tableau d'actions au format attendu par `applyBatch`.
   * - Affiche un rapport de résultat, et vide/ferme en cas de succès global.
   */
  const applyAll = async () => {
    if (items.length === 0) return;
    setApplying(true);
    try {
      // Grouper les changements par ressource (par défaut 'article' pour rétrocompatibilité)
      const changesByResource = items.reduce((acc, item) => {
        const resource = item.resource || 'article';
        if (!acc[resource]) acc[resource] = [];
        acc[resource].push(item);
        return acc;
      }, {});

      const allResults = [];
      
      // Traiter chaque type de ressource séparément
      for (const [resource, resourceItems] of Object.entries(changesByResource)) {
        // Sélectionner le service approprié en fonction du type de ressource
        const service = resource === 'event' ? eventService : articleService;
        
        // Préparer les changements pour ce service
        const toApply = resourceItems.slice().reverse().map(it => ({
          type: it.type,
          payload: it.payload,
          targetId: it.targetId ?? it.payload?.id,
        }));

        // Appliquer les changements pour cette ressource
        const resp = await service.applyBatch(toApply);
        const batchResults = resp?.results || [];

        // Ajouter les résultats au rapport global
        batchResults.forEach((r, idx) => {
          const originalItem = resourceItems.slice().reverse()[idx];
          allResults.push({
            id: originalItem?.id ?? `${resource}-${idx}`,
            ok: !!r.success,
            msg: r.message || (r.success ? 'OK' : 'Erreur'),
            resource
          });
        });
      }

      setApplyReport(allResults);

      const allOk = allResults.every(r => r.ok);
      if (allOk) {
        clear();
        closeModal();
      }
    } catch (err) {
      console.error('Erreur lors de l\'application des modifications:', err);
      setApplyReport([{ 
        id: 'batch', 
        ok: false, 
        msg: err?.message || 'Erreur lors de l\'application des modifications',
        resource: 'global'
      }]);
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
      <div className="relative bg-white w-full max-w-3xl rounded-lg shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold">Panier de modifications</h3>
            <span className="inline-flex items-center justify-center text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
              {items.length} en attente
            </span>
            {items.length > 0 && (
              <div className="hidden sm:flex items-center gap-2 text-xs">
                <span className="px-2 py-0.5 rounded bg-green-50 text-green-700 border border-green-200">+{stats.create}</span>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">~{stats.update}</span>
                <span className="px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">-{stats.delete}</span>
              </div>
            )}
          </div>
          <button onClick={closeModal} aria-label="Fermer" className="p-2 text-gray-500 hover:text-gray-800">
            <FiX />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-auto p-5 space-y-3">
          {items.length === 0 ? (
            <div className="text-center text-gray-500">
              Aucune modification en attente.
            </div>
          ) : (
            items.map((it) => {
              const label = it.type === 'create'
                ? `Créer: ${it.payload?.title || 'Sans titre'}${it.payload?.id ? ` (#${it.payload.id})` : ''}`
                : it.type === 'update'
                  ? `Mettre à jour: #${it.targetId ?? it.payload?.id}`
                  : `Supprimer: #${it.targetId}`;
              const isOpen = !!expanded[it.id];
              return (
                <div key={it.id} className="border rounded-md">
                  <div className="p-3 flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        <span className={typeBadge(it.type)}>{it.type}</span>
                        <span className={resourceBadge(it.resource || 'article')}>
                          {it.resource === 'event' ? 'Événement' : 'Article'}
                        </span>
                        <span className="font-medium truncate flex-1 min-w-0">{label}</span>
                      </div>
                      <div className="text-xs text-left mt-4 text-gray-500 ">{new Date(it.createdAt).toLocaleString('fr-FR')}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleExpanded(it.id)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded"
                        aria-label={isOpen ? 'Réduire' : 'Développer'}
                        title={isOpen ? 'Réduire' : 'Développer'}
                      >
                        {isOpen ? <FiChevronUp /> : <FiChevronDown />}
                      </button>
                      <button
                        onClick={() => removeChange(it.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                        title="Supprimer cette modification"
                        aria-label="Supprimer"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                  {isOpen && (
                    <div className="px-3 pb-3">
                      <pre className="text-xs bg-gray-50 rounded p-2 overflow-auto max-h-40">
                        {JSON.stringify({ targetId: it.targetId, payload: it.payload }, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {applyReport && (
          <div className="px-5 pb-2">
            <div className="text-sm font-medium mb-1">Résultat de l'application:</div>
            <ul className="text-sm space-y-1 max-h-40 overflow-auto">
              {applyReport.map((r, idx) => (
                <li key={idx} className={`flex items-start gap-2 ${r.ok ? 'text-green-700' : 'text-red-700'}`}>
                  {r.ok ? <FiCheck className="mt-0.5" /> : <FiAlertCircle className="mt-0.5" />}
                  <span>{r.msg}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center justify-between px-5 py-4 border-t bg-white sticky bottom-0">
          <div className="text-sm text-gray-600">{items.length} modification(s) en attente</div>
          <div className="space-x-2">
            <button
              onClick={clear}
              disabled={items.length === 0 || applying}
              className="px-4 py-2 text-sm rounded border text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Vider
            </button>
            <button
              onClick={applyAll}
              disabled={items.length === 0 || applying}
              className="inline-flex items-center px-4 py-2 text-sm rounded bg-black text-white hover:bg-black/90 disabled:opacity-50"
            >
              <FiCheckCircle className="mr-2" />
              {applying ? 'Application...' : 'Appliquer les changements'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangesCartModal;
