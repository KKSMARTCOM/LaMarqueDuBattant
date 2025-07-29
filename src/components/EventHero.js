import React from 'react';
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import getImagePath from "./getImagePath";

const formatDate = (dateStr) => {
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  };
  return new Date(dateStr).toLocaleDateString('fr-FR', options);
};

const EventHero = ({ event }) => {
  if (!event) return null;

  return (
    <div className="relative h-96 overflow-hidden">
      <img 
        src={getImagePath(event.image, "events")} 
        alt={event.titre} 
        className="w-full h-full object-cover"
      /> 
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {event.titre}
          </motion.h1>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <div className="flex items-center bg-black bg-opacity-50 px-4 py-2">
              <FaCalendarAlt className="mr-2" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center bg-black bg-opacity-50 px-4 py-2">
              <FaMapMarkerAlt className="mr-2" />
              <span>{event.lieu}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventHero;
