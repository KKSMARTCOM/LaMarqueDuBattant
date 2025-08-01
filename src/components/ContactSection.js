import React, { useState, useEffect } from "react";
import { getContactInfo } from "../services/brandService";

// Section de contact modernisée avec un design épuré et professionnel
export default function ContactSection() {
  const [contactInfo, setContactInfo] = useState(null);

  // Charger les informations de contact
  useEffect(() => {
    const loadContactInfo = async () => {
      try {
        const data = await getContactInfo();
        setContactInfo(data);
      } catch (error) {
        console.error('Erreur lors du chargement des informations de contact:', error);
      }
    };

    loadContactInfo();
  }, []);
  return (
    <section className="w-full bg-black text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* En-tête de la section */}
        <div className="max-w-3xl mb-16 text-left content-start">
          <h2 className="text-4xl  text-left md:text-5xl font-bold mb-4 text-white">
            Contactez-nous
          </h2>
          <p className="text-lg text-left text-gray-300 max-w-2xl">
            Notre équipe est à votre disposition pour répondre à toutes vos questions.
            Nous vous répondrons dans les plus brefs délais.
          </p>
        </div>
        {/* Grille de contacts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Bloc Email */}
          <div className="group bg-white/5 hover:bg-white/10 p-6 transition-all duration-300 hover:shadow-lg border border-white/10 hover:border-white/15">
            <div className="w-12 h-12 bg-white/0 backdrop-blur-md  flex items-center justify-center mb-5">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 className="text-xl text-left font-semibold mb-2 text-white">Email</h3>
            <p className="text-gray-300 text-sm mb-4 text-left">Pour toute question, n'hésitez pas à nous écrire.</p>
            <a href={`mailto:${contactInfo?.email || 'contact@lamarquedubattant.com'}`} className="inline-flex items-center text-white hover:text-gray-300 transition-colors text-sm font-medium w-full" >
              {contactInfo?.email || 'contact@lamarquedubattant.com'}
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </a>
          </div>

          {/* Bloc WhatsApp */}
          <div className="group bg-white/5  hover:bg-white/10 p-6 transition-all duration-300 hover:shadow-lg border  border-white/10 hover:border-white/15">
            <div className="w-12 h-12 bg-white/0 backdrop-blur-md flex items-center justify-center mb-5">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.498 14.382a1 1 0 01.99 1.136 9.966 9.966 0 01-2.81 6.287 9.916 9.916 0 01-6.293 2.81 1 1 0 01-1.136-.99 1.05 1.05 0 01.058-.3 8.003 8.003 0 01-1.492-1.492 1.05 1.05 0 01-.3.058 1 1 0 01-1.136-.99 9.916 9.916 0 012.81-6.293A9.966 9.966 0 018.48 5.51a1 1 0 01.99 1.136 8.004 8.004 0 004.89 6.274 1 1 0 01.138.448zM12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12c0 1.6.376 3.112 1.043 4.453l-1.09 3.274a1 1 0 001.236 1.236l3.274-1.09A9.958 9.958 0 0012 22z"/>
              </svg>
            </div>
            <h3 className="text-xl text-left font-semibold mb-2 text-white">WhatsApp</h3>
            <p className="text-gray-300 text-sm mb-4 text-left">Contactez-nous directement pour une réponse rapide.</p>
            <a 
              href={contactInfo?.socialMedia?.whatsapp ? `https://wa.me/${contactInfo.socialMedia.whatsapp.replace(/[^0-9+]/g, '')}` : '#'}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-white hover:text-gray-300 transition-colors text-sm font-medium w-full"
              disabled={!contactInfo?.socialMedia?.whatsapp}
            >
              Démarrer la conversation
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </a>
          </div>

          {/* Bloc Téléphone */}
          <div className="group bg-white/5  hover:bg-white/10 p-6 transition-all duration-300 hover:shadow-lg border  border-white/10 hover:border-white/15">
            <div className="w-12 h-12 bg-white/0 flex items-center justify-center mb-5">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
            </div>
            <h3 className="text-xl text-left font-semibold mb-2 text-white">Téléphone</h3>
            <p className="text-gray-300 text-sm mb-4 text-left">Appelez-nous pour toute assistance ou information.</p>
            <a href={`tel:${contactInfo?.phone || '+33123456789'}`} className="inline-flex items-center text-white hover:text-gray-300 transition-colors text-sm font-medium w-full">
              {contactInfo?.phone || '+33 1 23 45 67 89'}
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </a>
          </div>

          {/* Bloc Bureau */}
          <div className="group bg-white/5  hover:bg-white/10 p-6 transition-all duration-300 hover:shadow-lg border  border-white/10 hover:border-white/15">
            <div className="w-12 h-12 bg-white/0 flex items-center justify-center mb-5">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl text-left font-semibold mb-2 text-white">Bureau</h3>
            <p className="text-gray-300 text-sm mb-4 text-left">Venez nous rencontrer à notre adresse à Cotonou.</p>
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                `${contactInfo?.address?.street || '123 Rue du Commerce'}, ${contactInfo?.address?.postalCode || '75001'} ${contactInfo?.address?.city || 'Paris'}`
              )}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-white hover:text-gray-300 transition-colors text-sm font-medium w-full"
            >
              {contactInfo?.address ? 
                `${contactInfo.address.street}, ${contactInfo.address.postalCode} ${contactInfo.address.city}` : 
                '123 Rue du Commerce, 75001 Paris'}
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}