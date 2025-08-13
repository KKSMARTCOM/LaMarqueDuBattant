import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import getImagePath from "./getImagePath";
import { getStats } from "../services/brandService";

export default function AproposFeatureStatsSection() {
  const [statsInfo, setStatsInfo] = useState(null);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const controls = useAnimation();

  // Charger les données de la marque
  useEffect(() => {
    const loadStatsInfo = async () => {
      try {
        const data = await getStats();
        setStatsInfo(data);
      } catch (error) {
        console.error('Erreur lors du chargement des informations de la marque:', error);
      }
    };

    loadStatsInfo();
  }, []);

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const imageItem = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: [0.17, 0.67, 0.12, 0.99]
      }
    }
  };

  return (
    <section ref={ref} className="w-full bg-black py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <motion.div 
          className="max-w-4xl mx-auto text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Découvrez les chiffres clés de notre marque
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            {statsInfo?.seo?.defaultDescription || "La Marque des Battants est bien plus qu'une simple boutique en ligne : c'est une ode à la persévérance, à l'audace et à la passion de se dépasser chaque jour."}
          </p>
        </motion.div>

        {/* Grille de statistiques - Desktop */}
        <motion.div 
          className="hidden md:grid grid-cols-12 gap-6 mb-16"
          variants={container}
          initial="hidden"
          animate={controls}
        >
          {/* Statistique 1 */}
          <motion.div 
            className="col-span-4 bg-white/5 backdrop-blur-sm p-8 border rounded-md border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col h-full"
            variants={item}
          >
            <div className="mt-auto">
              <div className="text-5xl font-bold text-white mb-2">{statsInfo?.yearsOfExperience || '5'}+</div>
              <h3 className="text-xl font-semibold text-white mb-1">Années d'expérience</h3>
              <p className="text-gray-300 text-sm">Dans l'industrie de la mode et du sport</p>
            </div>
          </motion.div>
          
          {/* Image 1 */}
          <motion.div 
            className="col-span-4 row-span-3 overflow-hidden rounded-md"
            variants={imageItem}
          >
            <img
              src={getImagePath("ca2.jpg", "cover")}
              alt="Notre équipe"
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          {/* Statistique 2 */}
          <motion.div 
            className="col-span-4 bg-white/5 backdrop-blur-sm p-8 border rounded-md border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col h-full"
            variants={item}
          >
            <div className="mt-auto">
              <div className="text-5xl font-bold text-white mb-2">{statsInfo?.satisfactionRate || '98'}%</div>
              <h3 className="text-xl font-semibold text-white mb-1">Clients satisfaits</h3>
              <p className="text-gray-300 text-sm">Qui portent fièrement nos créations</p>
            </div>
          </motion.div>
          
          {/* Statistique 3 */}
          <motion.div 
            className="col-span-4 bg-white/5 backdrop-blur-sm p-8 border rounded-md border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col h-full"
            variants={item}
          >
            <div className="mt-auto">
              <div className="text-5xl font-bold text-white mb-2">50K+</div>
              <h3 className="text-xl font-semibold text-white mb-1">Produits vendus</h3>
              <p className="text-gray-300 text-sm">À travers le monde entier</p>
            </div>
          </motion.div>
          
          {/* Image 2 */}
          <motion.div 
            className="col-span-4 row-span-2 overflow-hidden rounded-md"
            variants={imageItem}
          >
            <img
              src={getImagePath("cu1.jpg", "cover")}
              alt="Nos produits"
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          {/* Statistique 4 */}
          <motion.div 
            className="col-span-4 bg-white/5 backdrop-blur-sm p-8 border rounded-md border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col h-full"
            variants={item}
          >
            <div className="mt-auto">
              <div className="text-5xl font-bold text-white mb-2">100%</div>
              <h3 className="text-xl font-semibold text-white mb-1">Éthique & Qualité</h3>
              <p className="text-gray-300 text-sm">Des matériaux soigneusement sélectionnés</p>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Version mobile */}
        <motion.div 
          className="md:hidden space-y-6"
          variants={container}
          initial="hidden"
          animate={controls}
        >
          {/* Version mobile - Statistique 1 */}
          <motion.div 
            className="bg-white/5 backdrop-blur-sm p-6 border rounded-md border-white/10 flex flex-col h-full"
            variants={item}
          >
            <div className="mt-auto">
              <div className="text-4xl font-bold text-white mb-2">{statsInfo?.yearsOfExperience || '5'}+</div>
              <h3 className="text-lg font-semibold text-white mb-1">Années d'expérience</h3>
              <p className="text-gray-300 text-sm">Dans l'industrie de la mode et du sport</p>
            </div>
          </motion.div>
          
          {/* Image 1 mobile */}
          <motion.div 
            className="w-full h-48 overflow-hidden rounded-md"
            variants={imageItem}
          >
            <img
              src={getImagePath("ca2.jpg", "cover")}
              alt="Notre équipe"
              className="w-full h-full object-cover rounded-md"
            />
          </motion.div>
          
          {/* Version mobile - Statistique 2 */}
          <motion.div 
            className="bg-white/5 backdrop-blur-sm p-6 border rounded-md border-white/10 flex flex-col h-full"
            variants={item}
          >
            <div className="mt-auto">
              <div className="text-4xl font-bold text-white mb-2">{statsInfo?.satisfactionRate || '98'}%</div>
              <h3 className="text-lg font-semibold text-white mb-1">Clients satisfaits</h3>
              <p className="text-gray-300 text-sm">Qui portent fièrement nos créations</p>
            </div>
          </motion.div>
          
          {/* Image 2 mobile */}
          <motion.div 
            className="w-full h-48 overflow-hidden rounded-md"
            variants={imageItem}
          >
            <img
              src={getImagePath("cu1.jpg", "cover")}
              alt="Nos produits"
              className="w-full h-full object-cover rounded-md"
            />
          </motion.div>
          
          {/* Version mobile - Statistique 3 */}
          <motion.div 
            className="bg-white/5 backdrop-blur-sm p-6 border rounded-md border-white/10 flex flex-col h-full"
            variants={item}
          >
            <div className="mt-auto">
              <div className="text-4xl font-bold text-white mb-2">{statsInfo?.productsSold || '50'}K+</div>
              <h3 className="text-lg font-semibold text-white mb-1">Produits vendus</h3>
              <p className="text-gray-300 text-sm">À travers le monde entier</p>
            </div>
          </motion.div>
          
          {/* Version mobile - Statistique 4 */}
          <motion.div 
            className="bg-white/5 backdrop-blur-sm p-6 border rounded-md border-white/10 flex flex-col h-full"
            variants={item}
          >
            <div className="mt-auto">
              <div className="text-4xl font-bold text-white mb-2">{statsInfo?.ethicAndQuality || '100'}%</div>
              <h3 className="text-lg font-semibold text-white mb-1">Éthique & Qualité</h3>
              <p className="text-gray-300 text-sm">Des matériaux soigneusement sélectionnés</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}