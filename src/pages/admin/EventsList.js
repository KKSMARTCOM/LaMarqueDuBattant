/**
 * EventsList.js
 *
 * Liste d'administration des événements avec actions: voir (site), modifier, supprimer (mise au panier),
 * ajout d'un nouvel événement et accès au gestionnaire de sauvegardes.
 */

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiRefreshCw, FiExternalLink } from 'react-icons/fi';
import { getAllEvents } from '../../services/eventService';
import getImagePath from '../../components/getImagePath';
import Loader from '../../components/Loader';
import useChangesCart from '../../hooks/useChangesCart';

const EventsList = () => {
  const navigate = useNavigate();
  const { count, openModal, addChange } = useChangesCart();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Erreur lors du chargement des événements");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [refreshKey]);

  const handleQueueDelete = (id) => {
    if (!id) return;
    if (window.confirm("Ajouter la suppression de cet événement au panier de modifications ?")) {
      addChange({ type: 'delete', targetId: id, resource: 'event', source: 'EventsList' });
    }
  };

  const filtered = events.filter(ev => {
    const hay = `${ev.titre || ''} ${ev.type || ''} ${ev.lieu || ''}`.toLowerCase();
    return hay.includes(searchTerm.toLowerCase());
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="text-sm text-red-700">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-6 z-10 top-0 right-0">
        <div className="pb-5 mb-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Gestion des événements</h2>
            <div className="flex space-x-3">
              <button
                onClick={() => setRefreshKey(prev => prev + 1)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-md text-sm leading-4 font-medium rounded-md  text-white/80 bg-black/95 hover:bg-black/80"
                title="Actualiser la liste"
              >
                <FiRefreshCw className="-ml-0.5 mr-2 h-4 w-4" />
                Actualiser
              </button>
              <button
                onClick={openModal}
                className="relative inline-flex items-center px-3 py-2 border border-gray-300 shadow-md text-sm leading-4 font-medium rounded-md text-black bg-white hover:bg-white/80"
                title="Ouvrir le panier de modifications"
              >
                <span className="mr-2">Panier</span>
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-red-600 rounded-full">
                    {count}
                  </span>
                )}
              </button>
              <Link
                to="/admin/events/nouveau"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-md text-black/80 bg-white hover:bg-white/80"
              >
                <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                Nouvel événement
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-between">
            <div className="w-full md:w-1/2">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="focus:border-black/80 block w-full pl-10 pr-4 py-2 text-sm border-gray-300 rounded-md border"
                  placeholder="Titre, type, lieu..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto">
          <div className="py-2 align-middle inline-block min-w-full">
            <div className="shadow-sm rounded-lg border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-8 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Événement</th>
                    <th className="px-8 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                    <th className="px-8 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                    <th className="px-8 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Lieu</th>
                    <th className="px-8 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Prix</th>
                    <th className="px-8 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Places</th>
                    <th className="px-8 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-8 py-4 text-center text-sm text-gray-500">Aucun événement trouvé</td>
                    </tr>
                  ) : (
                    filtered.map(ev => (
                      <tr key={ev.id} className={`hover:bg-gray-50  ${selectedEvent?.id === ev.id ? 'bg-gray-100' : ''}`} onClick={() => setSelectedEvent(selectedEvent?.id === ev.id ? null : ev)}>
                        <td className="px-8 py-3.5 text-left text-sm text-gray-800 whitespace-nowrap">
                          <div className="flex items-center">
                            <img src={getImagePath(ev.image, 'events')} alt={ev.titre} className="h-10 w-10 rounded object-cover mr-2" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                            <div>
                              <div className="text-sm font-medium text-left text-gray-900">{ev.titre || '-'}</div>
                              <div className="text-xs text-left text-gray-500">ID: {ev.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-3.5 text-sm text-left text-gray-800 whitespace-nowrap">{ev.type || '-'}</td>
                        <td className="px-8 py-3.5 text-sm text-left text-gray-800 whitespace-nowrap">{formatDate(ev.date)}</td>
                        <td className="px-8 py-3.5 text-sm text-left text-gray-800 whitespace-nowrap">{ev.lieu || '-'}</td>
                        <td className="px-8 py-3.5 text-sm text-left text-gray-800 whitespace-nowrap">{ev.price || '-'}</td>
                        <td className="px-8 py-3.5 text-sm text-left text-gray-800 whitespace-nowrap">{typeof ev.placesLeft === 'number' ? ev.placesLeft : (ev.placesLeft || '-')}</td>
                        <td className="px-8 py-3.5 text-sm text-left text-gray-800 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              className={`p-2 rounded-md transition-colors ${ev.id ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'}`}
                              title={ev.id ? 'Voir sur le site' : 'Non disponible'}
                              disabled={!ev.id}
                              onClick={(e) => { e.stopPropagation(); ev.id && navigate(`/events/${ev.id}`); }}
                            >
                              <FiExternalLink className="h-5 w-5" />
                            </button>
                            <button
                              className="p-2 rounded-md text-indigo-600 hover:bg-indigo-50"
                              title="Modifier"
                              onClick={(e) => { e.stopPropagation(); navigate(`/admin/events/${ev.id}/modifier`); }}
                            >
                              <FiEdit2 className="h-5 w-5" />
                            </button>
                            <button
                              className="p-2 rounded-md text-red-600 hover:bg-red-50"
                              title="Mettre la suppression au panier"
                              onClick={(e) => { e.stopPropagation(); handleQueueDelete(ev.id); }}
                            >
                              <FiTrash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default EventsList;
