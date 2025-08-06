import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from "framer-motion";
import getImagePath from "./getImagePath";
import { FiCalendar, FiMapPin, FiArrowDown } from 'react-icons/fi';

const formatDate = (dateStr) => {
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateStr).toLocaleDateString('fr-FR', options);
};

const EventHero = ({ event }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  if (!event) return null;

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden" ref={ref}>
      <motion.div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url(${getImagePath(event.image, "events")})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
      </motion.div>
      
      <div className="relative z-10 container mx-auto px-6 text-center md:text-left">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm font-semibold tracking-wider text-white/80 mb-4"
          >
            Événement à venir
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {event.titre}
          </motion.h1>
          
          <motion.div 
            className="flex flex-col md:flex-row gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {event.date && (
              <div className="flex items-center justify-center md:justify-start">
                <FiCalendar className="text-white/80 mr-2" size={20} />
                <span className="text-white/80">{formatDate(event.date)}</span>
              </div>
            )}
            {event.lieu && (
              <div className="flex items-center justify-center md:justify-start">
                <FiMapPin className="text-white/80 mr-2" size={20} />
                <span className="text-white/80">{event.lieu}</span>
              </div>
            )}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
          >
            <button className="px-8 py-3 bg-white text-black font-semibold  hover:bg-gray-100 transition-colors">
              Réserver maintenant
            </button>
            <button className="px-8 py-3 border-2 border-white text-white font-semibold  hover:bg-white/10 transition-colors">
              En savoir plus
            </button>
          </motion.div>
        </div>
      </div>
      
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: [0.6, 1, 0.6],
          y: [0, 10, 0]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <FiArrowDown className="text-white text-2xl" />
      </motion.div>
    </section>
  );
};

export default EventHero;
