import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import LegalModal from './LegalModal';
import { legalContent } from '../data/legalContent';
import Silk from './ReactbitsAnimations/Silk';
import getImagePath from "./getImagePath";

export default function Footer() {
  // État pour gérer l'affichage des modales
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    content: ''
  });

  // Fonction pour ouvrir une modale
  const openModal = (title, content) => {
    setModalState({
      isOpen: true,
      title,
      content
    });
  };

  // Fonction pour fermer la modale
  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  // Import du contenu légal depuis le fichier externe

  const footerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    const node = footerRef.current;
    if (node) {
      observer.observe(node);
    }
    return () => {
      if (node) {
        observer.unobserve(node);
      }
    };
  }, []);

  return (
    // Footer principal avec un design moderne
    <footer ref={footerRef} className="w-full bg-black border-t border-white/50 relative overflow-hidden" style={{ fontFamily: 'Commissioner, sans-serif' }}>
      {/* Animation Silk en arrière-plan plus subtile */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">  
        <Silk
          speed={3}
          scale={1.2}
          color="#1a1a1a"
          noiseIntensity={0.5}
          rotation={15}
        />
      </div>
      
      {/* Contenu du footer avec padding et espacement */}
      <div className="relative z-10 w-full max-w-full  mx-auto px-3 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* En-tête du footer avec le nom de la marque */}
        <div className={`w-full mb-12 transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white text-center tracking-widest font-thin ">
            LA MARQUE DU BATTANT
          </h2>
          <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent w-3/4 mx-auto mt-6"></div>
        </div>
        <div className="w-full space-y-8">
          {/* Conteneur pour la newsletter et la carte d'image */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
            {/* Section newsletter - prend 2/3 de l'espace */}
            <div className={`lg:col-span-2 transition-all duration-700 ease-out delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}>
            <div className="bg-gradient-to-br from-black/80 to-white/35 p-6 md:p-8 lg:p-10  border border-white/20 shadow-lg w-full">
              <div className="text-left mb-4">
                <img src={getImagePath("LOGO_LMDB.svg", "logo")} alt="Logo" className="h-12 w-auto mx-2" />
              </div>
              <h3 className="text-white text-xl md:text-2xl font-medium mb-3 text-left">Restez connecté</h3>
              <p className="text-gray-300 text-sm md:text-base mb-6 text-left w-full  mx-auto">Inscrivez-vous à notre newsletter pour recevoir les dernières actualités et offres exclusives.</p>
              
              <div className="w-full mx-auto">
                <form className="space-y-3">
                  <div>
                    <input 
                      type="email" 
                      placeholder="Votre adresse email" 
                      className="w-full px-4 py-3 bg-white/10 border border-white/20  text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent placeholder-gray-500"
                      required
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-white/90 text-black text-sm font-medium py-3 px-4    hover:bg-gray-100 transition duration-200 flex items-center justify-center gap-2"
                  >
                    <span>S'abonner à la newsletter</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </form>
                
                <p className="mt-3 text-xs text-gray-400 text-center">En vous abonnant, vous acceptez notre <button onClick={() => window.location.href='/politique-confidentialite'} className="text-white hover:underline bg-transparent border-none p-0 cursor-pointer">Politique de confidentialité</button>.</p>
                
                {/* Réseaux sociaux */}
                <div className="mt-6 pt-4 border-t border-white/20">
                  <h4 className="text-white text-sm font-medium mb-3 text-center">Suivez-nous</h4>
                  <div className="flex justify-center space-x-4">
                    {[
                      { name: 'Instagram', icon: 'M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.9.2 2.3.4.5.2.8.4 1.2.8.4.4.6.7.8 1.2.2.4.3 1.1.4 2.3.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.9-.4 2.3-.2.5-.4.8-.8 1.2s-.7.6-1.2.8c-.4.2-1.1.3-2.3.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.9-.2-2.3-.4-.5-.2-.8-.4-1.2-.8s-.6-.7-.8-1.2c-.2-.4-.3-1.1-.4-2.3C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.9.4-2.3.2-.5.4-.8.8-1.2.4-.4.7-.6 1.2-.8.4-.2 1.1-.3 2.3-.4C8.4 2.2 8.8 2.2 12 2.2zm0-2.2C8.7 0 8.3 0 7.1.1 5.9.2 5.1.3 4.5.5c-.7.2-1.3.5-1.8 1C2.2 2.2 1.9 2.8 1.7 3.5c-.2.6-.3 1.4-.4 2.6C1.2 8.3 1.2 8.7 1.2 12c0 3.3 0 3.7.1 4.9.1 1.2.2 2 .4 2.6.2.7.5 1.3 1 1.8s1.1.8 1.8 1c.6.2 1.4.3 2.6.4 1.2.1 1.6.1 4.9.1s3.7 0 4.9-.1c1.2-.1 2-.2 2.6-.4.7-.2 1.3-.5 1.8-1 .5-.5.8-1.1 1-1.8.2-.6.3-1.4.4-2.6.1-1.2.1-1.6.1-4.9s0-3.7-.1-4.9c-.1-1.2-.2-2-.4-2.6-.2-.7-.5-1.3-1-1.8-.5-.5-1.1-.8-1.8-1-.6-.2-1.4-.3-2.6-.4C15.7.2 15.3.2 12 .2z', path: 'M12 15.2c1.8 0 3.2-1.4 3.2-3.2S13.8 8 12 8s-3.2 1.4-3.2 3.2 1.4 3.2 3.2 3.2z' },
                      { name: 'Facebook', icon: 'M17 2.1v3.2h2.3v3.1H17V24h-4.1V8.4h-2.1V5.3h2.1V3.7C12.9 1.2 14.1 0 16.2 0c.8 0 1.5.1 1.5.1v2z', path: '' },
                      { name: 'Twitter', icon: 'M22.2 2.2c-.8.3-1.6.6-2.4.7.9-.5 1.6-1.3 1.9-2.3-.9.5-1.8.9-2.8 1.1-.8-.9-2-1.4-3.3-1.4-2.5 0-4.5 2-4.5 4.5 0 .3 0 .7.1 1-3.7-.2-7-2-9.2-4.7-.4.6-.6 1.3-.6 2.1 0 1.6.8 3 2 3.8-.7 0-1.4-.2-2-.5v.1c0 2.2 1.6 4 3.6 4.4-.4.1-.8.2-1.2.2-.3 0-.6 0-.9-.1.6 2 2.4 3.4 4.5 3.4-1.6 1.3-3.7 2-6 2-.4 0-.8 0-1.2-.1 2 1.3 4.4 2.1 7 2.1 8.4 0 13-7 13-13v-.6c.9-.6 1.7-1.4 2.4-2.3z', path: '' },
                      { name: 'YouTube', icon: 'M23.5 6.2c-.3-1.2-1.2-2.1-2.4-2.4C19.1 3.2 12 3.2 12 3.2s-7.1 0-9.1.6c-1.2.3-2.1 1.2-2.4 2.4C0 8.2 0 12 0 12s0 3.8.5 5.8c.3 1.2 1.2 2.1 2.4 2.4 2 0 9.1.6 9.1.6s7.1 0 9.1-.6c1.2-.3 2.1-1.2 2.4-2.4.5-2 .5-5.8.5-5.8s0-3.8-.5-5.8zM9.5 15.5V8.5l6 3.5-6 3.5z', path: '' }
                    ].map((social) => (
                      <a
                        key={social.name}
                        href={`https://${social.name.toLowerCase()}.com`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors duration-200"
                        aria-label={social.name}
                      >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d={social.icon} clipRule="evenodd" />
                          {social.path && <path d={social.path} />}
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Carte d'image - prend 1/3 de l'espace */}
          <div className={`relative h-full min-h-[400px] overflow-hidden transition-all duration-700 ease-out delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            {/* Image d'arrière-plan */}
            <div 
              className="absolute inset-0 z-0 transform transition-transform duration-1000 hover:scale-105"
            >
              <img 
                src="/assets/images/CoverImage/Serious Man Portrait.png"
                alt="Nouvelle collection"
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('Erreur de chargement de l\'image:', e.target.src);
                  e.target.src = getImagePath('hero1.jpg', ''); // Fallback image
                }}
              />
              <div className="absolute inset-0 bg-white/10"></div>
            </div>
            
            {/* Contenu superposé */}
            <div className="relative z-10 h-full flex flex-col items-center justify-end p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-3">NOUVELLE COLLECTION</h3>
              <p className="text-white/90 mb-6 max-w-md">Découvrez notre dernière collection printemps-été 2025</p>
              <Link 
                to="/collection" 
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 border border-white/20 transition-all duration-300 hover:scale-105"
              >
                <span>Découvrir</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
          </div>

          {/* Contenu principal du footer */}
          <div className={`w-full transition-all duration-700 ease-out delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>

            {/* Colonnes de liens */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-12 flex-1">
              {/* Navigation Principale */}
              <div className={`transition-all duration-700 ease-out delay-400 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4 relative inline-block">
                  Navigation
                  <span className="absolute -bottom-1.5 left-0 w-8 h-0.5 bg-gradient-to-r from-white to-transparent"></span>
                </h3>
                <ul className="mt-4 space-y-3">
                  {[
                    { name: 'Accueil', to: '/' },
                    { name: 'Boutique', to: '/produits' },
                    { name: 'Collection', to: '/produits' },
                    { name: 'Événements', to: '/events' },
                    { name: 'Soldes', to: '/produits?en_solde=true', className: 'text-red-400 hover:text-red-300 font-medium' }
                  ].map((item) => (
                    <li key={item.name}>
                      <Link 
                        to={item.to} 
                        className={`text-sm text-gray-300 hover:text-white transition-colors duration-200 ${item.className || ''}`}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Catégories */}
              <div className={`transition-all duration-700 ease-out delay-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4 relative inline-block">
                  Catégories
                  <span className="absolute -bottom-1.5 left-0 w-8 h-0.5 bg-gradient-to-r from-white to-transparent"></span>
                </h3>
                <ul className="mt-4 space-y-3">
                  {[
                    { name: 'Homme', to: '/produits?remises=&tailles=&sexe=Homme' },
                    { name: 'Femme', to: '/produits?remises=&tailles=&sexe=Femme' },
                    { name: 'Vêtements', to: '/produits?remises=&tailles=' },
                    { name: 'Chaussures', to: '/produits?remises=&tailles=' },
                    { name: 'Accessoires', to: '/produits?categorie=accessoire&remises=&tailles=' }
                  ].map((item) => (
                    <li key={item.name}>
                      <Link 
                        to={item.to} 
                        className="text-sm text-gray-300 hover:text-white transition-colors duration-200"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Informations */}
              <div className={`transition-all duration-700 ease-out delay-600 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-4 relative inline-block">
                  Informations
                  <span className="absolute -bottom-1.5 left-0 w-8 h-0.5 bg-gradient-to-r from-white to-transparent"></span>
                </h3>
                <ul className="mt-4 space-y-3">
                  {[
                    { name: 'À propos', to: '/a-propos' },
                    { name: 'Contact', to: '/contact' },
                    { name: 'Livraison', to: '/livraison' },
                    { name: 'Retours & Échanges', to: '/retours' },
                    { name: 'CGV', to: '/cgv' }
                  ].map((item) => (
                    <li key={item.name}>
                      <Link 
                        to={item.to} 
                        className="text-sm text-gray-300 hover:text-white transition-colors duration-200"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bas du footer avec copyright et mentions légales */}
          <div className={`w-full pt-8 mt-12 border-t border-gray-800 text-center transition-all duration-1000 ease-out delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="text-sm text-gray-400">
              <div className="mb-2">
                &copy; {new Date().getFullYear()} La Marque Du Battant. Tous droits réservés.
              </div>
              <div className="flex flex-wrap justify-center gap-4 text-xs">
                <button 
                  onClick={() => openModal('Mentions Légales', legalContent.mentionsLegales)}
                  className="hover:text-white transition-colors duration-200"
                >
                  Mentions légales
                </button>
                <span className="text-gray-600">•</span>
                <button 
                  onClick={() => openModal('Politique de Confidentialité', legalContent.confidentialite)}
                  className="hover:text-white transition-colors duration-200"
                >
                  Politique de confidentialité
                </button>
                <span className="text-gray-600">•</span>
                <button 
                  onClick={() => openModal('Conditions Générales de Vente', legalContent.cgv)}
                  className="hover:text-white transition-colors duration-200"
                >
                  CGV
                </button>
                <span className="text-gray-600">•</span>
                <button 
                  onClick={() => openModal('Préférences des Cookies', legalContent.cookies)}
                  className="hover:text-white transition-colors duration-200"
                >
                  Préférences des cookies
                </button>
              </div>
              
              <div className="mt-6 text-xs text-gray-500">
                <p>La Marque Du Battant - 123 Rue du Commerce, 75001 Paris, France</p>
                <p className="mt-1">SIRET: 123 456 789 00012 • TVA: FR12345678901</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modale pour les mentions légales et politiques */}
      <LegalModal 
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        content={modalState.content}
      />
    </footer>
  );
}