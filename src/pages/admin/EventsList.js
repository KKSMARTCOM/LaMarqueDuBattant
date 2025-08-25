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

  // Styles pour la table
  const tableCellStyle = "px-4 py-3.5 text-sm text-gray-800 whitespace-nowrap text-left border-r border-gray-100 last:border-r-0";
  const tableHeaderStyle = "px-4 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50 border-b border-gray-200 last:border-r-0";
  const tableRowStyle = (isSelected) => 
    `border-b border-gray-100 transition-colors duration-150 ${isSelected ? 'bg-gray-200 ring-1 ring-blue-200' : 'hover:bg-gray-100'}`;
  const tableContainerStyle = "shadow-sm rounded-lg border border-gray-200 overflow-hidden";
  const scrollableTableStyle = "block max-h-[calc(100vh-275px)] overflow-y-auto";
  const tableHeaderContainerStyle = "sticky top-0 bg-gray-50 z-10";

  return (
    <div className="space-y-6">
      <div className="space-y-6 z-10 top-0 right-0">
        <div className="pb-5 mb-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Gestion des événements</h2>
            <div className="flex space-x-3">
              <button
                onClick={() => setRefreshKey(prev => prev + 1)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-md text-sm leading-4 font-medium rounded-md text-white/80 bg-black/95 hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black/20"
                title="Actualiser la liste"
                aria-label="Actualiser la liste"
              >
                <FiRefreshCw className="-ml-0.5 mr-2 h-4 w-4" />
                Actualiser
              </button>
              <button
                onClick={openModal}
                className="relative inline-flex items-center px-3 py-2 border border-gray-300 shadow-md text-sm leading-4 font-medium rounded-md text-black bg-white hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black/20"
                title="Ouvrir le panier de modifications"
                aria-label="Ouvrir le panier de modifications"
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
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-md text-black/80 bg-white hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black/20"
                aria-label="Créer un nouvel événement"
              >
                <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                Nouvel événement
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-between">
            {/* Barre de recherche */}
            <div className="w-full md:w-1/2">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="focus:border-black/80 block w-full pl-10 pr-4 py-2 text-sm border-gray-300 rounded-md border"
                  placeholder="Rechercher un événement..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Rechercher un événement"
                />
              </div>
            </div>
            
            {/* Boutons d'action */}
            <div className="flex items-center space-x-2 w-full md:w-auto justify-end mt-2 md:mt-0">
              <div className="flex items-center space-x-1 bg-gray-50 p-1 rounded-lg border border-gray-200">
                <button
                  className={`p-2 rounded-md transition-colors ${selectedEvent ? 'text-blue-600 hover:bg-blue-50' : 'text-gray-300 cursor-not-allowed'}`}
                  title={selectedEvent ? "Voir sur le site" : "Sélectionnez un événement"}
                  disabled={!selectedEvent}
                  onClick={() => selectedEvent && selectedEvent.id && navigate(`/events/${selectedEvent.id}`)}
                  aria-label="Voir sur le site"
                >
                  <FiExternalLink className="h-5 w-5" />
                </button>
                <button
                  className={`p-2 rounded-md transition-colors ${selectedEvent ? 'text-indigo-600 hover:bg-indigo-50' : 'text-gray-300 cursor-not-allowed'}`}
                  title={selectedEvent ? "Modifier" : "Sélectionnez un événement"}
                  disabled={!selectedEvent}
                  onClick={() => selectedEvent && selectedEvent.id && navigate(`/admin/events/${selectedEvent.id}/modifier`)}
                  aria-label="Modifier"
                >
                  <FiEdit2 className="h-5 w-5" />
                </button>
                <button
                  className={`p-2 rounded-md transition-colors ${selectedEvent ? 'text-red-600 hover:bg-red-50' : 'text-gray-300 cursor-not-allowed'}`}
                  title={selectedEvent ? "Mettre la suppression au panier" : "Sélectionnez un événement"}
                  disabled={!selectedEvent}
                  onClick={() => selectedEvent && handleQueueDelete(selectedEvent.id)}
                  aria-label="Supprimer"
                >
                  <FiTrash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tableau des événements */}
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto">
            <div className="py-2 align-middle inline-block min-w-full">
              <div className={tableContainerStyle}>
                <div className={scrollableTableStyle}>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className={tableHeaderContainerStyle}>
              <tr>
                <th scope="col" className={tableHeaderStyle}>
                  Titre
                </th>
                <th scope="col" className={tableHeaderStyle}>
                  Date
                </th>
                <th scope="col" className={tableHeaderStyle}>
                  Lieu
                </th>
                <th scope="col" className={tableHeaderStyle}>
                  Prix
                </th>
                <th scope="col" className={tableHeaderStyle}>
                  Places restantes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-4 text-center text-sm text-gray-500">Aucun événement trouvé</td>
                </tr>
              ) : (
                filtered.map((ev) => (
                  <tr 
                    key={ev.id || ev._id || Math.random()} 
                    className={tableRowStyle(selectedEvent?.id === ev.id)}
                    onClick={() => setSelectedEvent(ev)}
                  >
                    <td className={tableCellStyle}>
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {ev.image && (
                            <img 
                              className="h-10 w-10 rounded-full object-cover" 
                              src={getImagePath(ev.image, "events")} 
                              alt={ev.titre} 
                              onError={(e) => { e.target.src = '/placeholder-event.jpg'; }}
                            />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{ev.titre}</div>
                          <div className="text-sm text-gray-500">{ev.type}</div>
                        </div>
                      </div>
                    </td>
                    <td className={tableCellStyle}>
                      <div className="text-sm text-gray-900">{formatDate(ev.date)}</div>
                      <div className="text-sm text-gray-500">{ev.heureDebut}</div>
                    </td>
                    <td className={tableCellStyle}>
                      {ev.lieu || '-'}
                    </td>
                    <td className={tableCellStyle}>
                      {ev.price ? `${ev.price} €` : 'Gratuit'}
                    </td>
                    <td className={tableCellStyle}>
                      {typeof ev.placesLeft === 'number' ? (
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          ev.placesLeft > 10 ? 'bg-green-100 text-green-800' : 
                          ev.placesLeft > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {ev.placesLeft} place{ev.placesLeft > 1 ? 's' : ''}
                        </span>
                      ) : (
                        ev.placesLeft || '-'
                      )}
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
      </div>

    </div>
  );
};

export default EventsList;
