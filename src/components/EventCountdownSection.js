import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import getImagePath from './getImagePath';
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

const calculateCountdown = (targetDate) => {
    const now = new Date().getTime();
    const distance = new Date(targetDate).getTime() - now;
  
    if (distance <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }
  
    return {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000),
      isPast: false
    };
  };
    

const EventCountdownSection = ({ event = {} }) => {
    const [countdown, setCountdown] = useState(calculateCountdown(event.date));
  
    useEffect(() => {
      const timer = setInterval(() => {
        setCountdown(calculateCountdown(event.date));
      }, 1000);
  
      return () => clearInterval(timer);
    }, [event.date]);

    return (
    <section className="w-full min-h-screen flex items-center justify-center bg-white px-6 py-16 font-sans">
      <div className="max-w-6xl w-full flex flex-col md:flex-row gap-10">
        {/* Colonne gauche */}
        <div className="flex-1 space-y-6 text-left">
          <Link to="/events" className="text-sm text-gray-600 block text-left">&lt; Tous les événements</Link>
          <h1 className="text-4xl font-bold text-left">{event.titre}</h1>
          <p className="text-gray-700 text-left">{event.description}</p>

          <div className="flex items-center gap-4 justify-start">
            <p className="font-semibold flex items-center gap-2">
              <FaCalendarAlt className="mr-2" />
              {new Date(event.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              {event.placesLeft > 0 && (
                <span className="bg-gray-200 text-sm font-bold px-2 py-1 rounded ml-2">
                  {event.placesLeft} {event.placesLeft > 1 ? 'places restantes' : 'place restante'} !
                </span>
              )}
            </p>
          </div>
          <p className="font-semibold flex items-center gap-1 mt-2">
            <FaMapMarkerAlt className="mr-2" />
            {event.lieu}
          </p>

          {/* Compte à rebours */}
          {/* Badge si événement passé */}
          {countdown.isPast && (
            <div className="inline-block px-3 py-1 text-sm bg-red-100 text-red-700 font-bold rounded">
              Événement passé
            </div>
          )}

          {/* Compte à rebours */}
          <div className="flex items-center justify-between border border-gray-300 p-4 w-full max-w-md">
            <div className="text-center px-2">
              <p className="text-2xl font-bold">{String(countdown.days).padStart(2, '0')}</p>
              <p className="text-sm text-gray-700">Jours</p>
            </div>
            <span className="text-gray-400">|</span>
            <div className="text-center px-2">
              <p className="text-2xl font-bold">{String(countdown.hours).padStart(2, '0')}</p>
              <p className="text-sm text-gray-700">Heures</p>
            </div>
            <span className="text-gray-400">|</span>
            <div className="text-center px-2">
              <p className="text-2xl font-bold">{String(countdown.minutes).padStart(2, '0')}</p>
              <p className="text-sm text-gray-700">Minutes</p>
            </div>
            <span className="text-gray-400">|</span>
            <div className="text-center px-2">
              <p className="text-2xl font-bold">{String(countdown.seconds).padStart(2, '0')}</p>
              <p className="text-sm text-gray-700">Secondes</p>
            </div>
          </div>

          {/* Formulaire */}
          <div className="flex flex-col sm:flex-row gap-2 max-w-md">
            <input
              type="email"
              placeholder="Entrez votre email"
              className="border border-gray-300 px-4 py-2 w-full"
            />
            <button className="bg-black border border-black text-white px-6 py-2 whitespace-nowrap hover:bg-white hover:text-black  transition-colors duration-200">
              Réservez ma place
            </button>
          </div>

          <p className="text-xs text-gray-600 max-w-md">
            En cliquant sur Réservez ma place, vous confirmez que vous acceptez nos Conditions Générales.
          </p>
        </div>

        {/* Colonne droite */}
        {event.image && (
          <div className="flex-1">
            <img
              src={getImagePath(event.image, 'events')}
              alt={event.titre || 'Événement'}
              className="w-full h-full object-cover "
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default EventCountdownSection;
