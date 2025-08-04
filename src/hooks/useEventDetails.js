import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import fetchData from '../components/fetchData';

/**
 * Hook personnalisé pour gérer la logique de la page de détail d'un événement
 * @returns {Object} Les états et fonctions nécessaires pour la page de détail d'événement
 */
export function useEventDetails() {
  const { id } = useParams(); // Changé de eventId à id pour correspondre à la route
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // On utilise async/await pour gérer l'appel à fetchData
    const fetchEvent = async () => {
      try {
        // On charge les événements
        setLoading(true);
        const data = await fetchData('/data/events.json');
        // On cherche l'événement demandé
        const foundEvent = data.find(e => e.id === parseInt(id));

        if (!foundEvent) {
          // Si on ne le trouve pas, on affiche un message d'erreur
          setError('Événement non trouvé');
          return;
        }
        
        // Sinon on met à jour les états
        setEvent(foundEvent);
      } catch (err) {
        // En cas d'erreur, on affiche un message d'erreur
        console.error('Erreur lors du chargement de l\'événement:', err);
        setError('Une erreur est survenue lors du chargement de l\'événement');
      } finally {
        // On met à jour l'état de chargement
        setLoading(false);
      }
    };

    if (id) {
      // Si on a un identifiant d'événement, on lance la fonction pour charger l'événement
      fetchEvent();
    } else {
      // Sinon on affiche un message d'erreur
      setError('Aucun identifiant d\'événement fourni');
      setLoading(false);
    }
  }, [id]);

  // Fonction pour retourner à la page des événements
  const handleBackToEvents = () => {
    navigate('/events');
  };

  // On renvoie les états et fonctions
  return {
    event,
    loading,
    error,
    handleBackToEvents
  };
}

export default useEventDetails;
