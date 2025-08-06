import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiCalendar, FiMapPin, FiArrowRight, FiClock, FiArrowLeft } from 'react-icons/fi';
import getImagePath from './getImagePath';

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
    

const CountdownItem = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <motion.div 
      className="text-3xl md:text-4xl font-bold bg-transparent text-white w-20 h-20 md:w-24 md:h-24 flex items-center justify-center mb-2"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100 }}
      key={value}
    >
      {String(value).padStart(2, '0')}
    </motion.div>
    <span className="text-sm text-white/80 font-medium">{label}</span>
  </div>
);

const EventCountdownSection = ({ event = {} }) => {
  const [countdown, setCountdown] = useState(calculateCountdown(event.date));
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculateCountdown(event.date));
    }, 1000);

    return () => clearInterval(timer);
  }, [event.date]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    // Simuler une requête API
    setTimeout(() => {
      setIsSuccess(true);
      setEmail('');
      setIsSubmitting(false);
      // Réinitialiser le message de succès après 5 secondes
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  return (
    <section className="w-full py-16 md:py-24 px-0 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className=" mx-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 border border-gray-200">

          {/* Colonne droite - Compte à rebours */}
          <motion.div 
            className="bg-black p-8  shadow-left-xl border border-gray-100 h-fit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
                <FiClock className="text-white text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {countdown.isPast ? "L'événement est terminé" : "L'événement commence dans"}
              </h2>
              <p className="text-white/80">
                {countdown.isPast 
                  ? 'Merci à tous les participants !' 
                  : 'Ne manquez pas cet événement exceptionnel'}
              </p>
            </div>

            {!countdown.isPast && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <CountdownItem value={countdown.days} label="Jours" />
                <CountdownItem value={countdown.hours} label="Heures" />
                <CountdownItem value={countdown.minutes} label="Minutes" />
                <CountdownItem value={countdown.seconds} label="Secondes" />
              </div>
            )}

            {countdown.isPast && (
              <motion.div 
                className="mt-8 p-4 bg-white/10 border border-white/20 text-white  text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className="font-medium">Cet événement est terminé</p>
                <p className="text-sm mt-1 opacity-80">Restez à l'écoute pour nos prochains événements !</p>
              </motion.div>
            )}

            {/* Image de l'événement */}
            {event.image && (
              <motion.div 
                className="mt-8 overflow-hidden shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <img
                  src={getImagePath(event.image, 'events')}
                  alt={event.titre}
                  className="w-full h-64 md:h-80 object-cover"
                />
              </motion.div>
            )}
          </motion.div>

          {/* Colonne gauche - Informations de l'événement */}
          <div className="space-y-8 p-8">
            <Link 
              to="/events" 
              className="inline-flex items-left justify-left text-left text-gray-600 hover:text-black transition-colors text-sm font-medium group"
            >
              <FiArrowLeft className="mr-2 text-left justify-left transition-transform group-hover:-translate-x-1" />
              Retour aux événements
            </Link>

            <motion.div 
              className="space-y-6 text-center "
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className=" justify-center items-center text-center w-full">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                  {event.titre}
                </h1>
                <p className="text-gray-600 mt-3 text-lg">
                  {event.description}
                </p>
              </div>

              <div className="space-y-4 text-center  justify-center items-center">
                <div className="flex items-center space-x-3 justify-center">
                  <div className="mt-1 text-gray-500 text-center flex flex-row">
                    <FiCalendar size={20} />
                    <p className="font-bold mx-1 text-gray-700 text-left">Date et heure :</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-left">{formatDate(event.date)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 justify-center">
                  <div className="mt-1 text-gray-500 flex flex-row">
                    <FiMapPin size={20} />
                    <p className="font-bold mx-1 text-gray-700 text-left">Lieu :</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-left">{event.lieu}</p>
                  </div>
                </div>

                {event.placesLeft > 0 && (
                  <div className="flex items-center space-x-3 justify-center">
                    <div className="mt-1 text-gray-500 flex flex-row">
                      <FiCalendar size={20} />
                      <p className="font-bold mx-1 text-gray-700 text-left">Places disponibles :</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-left">
                        <span className="font-semibold text-indigo-600">{event.placesLeft}</span> {event.placesLeft > 1 ? 'places restantes' : 'place restante'}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-3 justify-center">
                    <div>
                      <p className="text-gray-600 text-center">
                        <span className="font-semibold text-center text-gray-600">{event.schedule}</span> 
                      </p>
                    </div>
                  </div>
              </div>

              {/* Formulaire de réservation */}
              <div className="pt-4">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Réservez votre place</h3>
                
                {isSuccess ? (
                  <motion.div 
                    className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    Votre demande de réservation a bien été enregistrée !
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Votre adresse email"
                        className="w-full px-4 py-3 border border-gray-300  focus:ring-2 focus:ring-black focus:border-transparent transition"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`flex items-center justify-center w-full px-6 py-3 text-white font-medium transition-colors ${
                        isSubmitting 
                          ? 'bg-black cursor-not-allowed' 
                          : 'bg-black hover:bg-black/80'
                      }`}
                    >
                      {isSubmitting ? (
                        'Traitement...'
                      ) : (
                        <>
                          Réserver ma place
                          <FiArrowRight className="ml-2" />
                        </>
                      )}
                    </button>
                  </form>
                )}
                
                <p className="text-xs text-gray-600 mt-4">
                  En cliquant sur Réservez ma place, vous confirmez que vous acceptez nos Conditions Générales.
                </p>
              </div>
            </motion.div>
          </div>

          
        </div>
      </div>
    </section>
  );
};

export default EventCountdownSection;
