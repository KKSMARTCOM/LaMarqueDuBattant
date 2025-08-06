import React, { useState, useEffect, } from 'react';
import getImagePath from './getImagePath';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa';

const EventsDetailsSection = ({ event }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === event.gallery.length - 1 ? prevIndex : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? 0 : prevIndex - 1
    );
  };

  // Gestion du clavier pour la navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentImageIndex]);
  if (!event) return null;
  const contributors = event.contributors || [];
  
  return (
    <section className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <article className="lg:col-span-2 space-y-10">
            {/* Description Section */}
            <div className="bg-white p-8 shadow-sm border border-gray-100">
              <h2 className="text-3xl font-bold text-left text-gray-900 mb-6 pb-4 border-b border-gray-100">
                À propos de l'événement
              </h2>
              {event.fullDescription ? (
                <div className="prose prose-lg text-gray-600 max-w-none">
                  {event.fullDescription.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-6 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">Aucune description détaillée disponible pour cet événement.</p>
              )}
            </div>

            {/* Gallery Section */}
            {event.gallery && event.gallery.length > 0 && (
              <div className="bg-white p-8 shadow-sm border border-gray-100">
                <h3 className="text-3xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100 text-left">Galerie</h3>
                <div className="relative">
                  {/* Image courante */}
                  <div className="relative overflow-hidden  mb-4">
                    <img
                      src={getImagePath(event.gallery[currentImageIndex].image, 'events')}
                      alt={event.gallery[currentImageIndex].caption || `Image ${currentImageIndex + 1} de la galerie`}
                      className="w-full h-96 object-cover"
                    />
                    {event.gallery[currentImageIndex].caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4">
                        <p className="text-sm">{event.gallery[currentImageIndex].caption}</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-4">
                    <button
                      onClick={prevImage}
                      disabled={currentImageIndex === 0}
                      className={`p-2 rounded-full ${currentImageIndex === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                      aria-label="Image précédente"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    {/* Pagination */}
                    <div className="flex space-x-2">
                      {event.gallery.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`h-2 w-2 rounded-full ${currentImageIndex === index ? 'bg-black' : 'bg-gray-300'}`}
                          aria-label={`Aller à l'image ${index + 1}`}
                        />
                      ))}
                    </div>
                    
                    <button
                      onClick={nextImage}
                      disabled={currentImageIndex === event.gallery.length - 1}
                      className={`p-2 rounded-full ${currentImageIndex === event.gallery.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                      aria-label="Image suivante"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quote Section */}
            {event.quote && (
              <div className="bg-gradient-to-r from-black/10 to-black/5 p-8 border border-blue-100">
                <blockquote className="text-xl italic text-gray-700 relative pl-8">
                  <span className="absolute left-0 top-0 text-5xl text-black font-serif">"</span>
                  <p className="relative z-10">{event.quote}</p>
                  <span className="absolute ml-6 right-0 bottom-0 text-5xl text-black font-serif">"</span>
                </blockquote>
              </div>
            )}
          </article>
          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Contributeurs Card */}
            <div className="bg-white p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                Équipe d'organisation
              </h3>
              {contributors.length > 0 ? (
                <div className="space-y-4">
                  {contributors.map((person, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full overflow-hidden">
                        <img 
                          src={person.avatar ? getImagePath(person.avatar, 'events') : getImagePath('user.png', 'events')} 
                          alt={person.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = getImagePath('user.png', 'events');
                          }}
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-left">{person.name}</p>
                        <p className="text-sm text-gray-500 text-left">{person.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm italic">Aucun contributeur renseigné.</p>
              )}
            </div>

          

            {/* Partager Card */}
            <div className="bg-white  p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                Partager l'événement
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Partagez cet événement avec vos amis et vos proches !
              </p>
              <div className="flex gap-3 items-center justify-center">
                <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors" aria-label="Partager sur Facebook">
                  <FaFacebookF className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-sky-500 text-white hover:bg-sky-600 transition-colors" aria-label="Partager sur Twitter">
                  <FaTwitter className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-700 text-white hover:bg-blue-800 transition-colors" aria-label="Partager sur LinkedIn">
                  <FaLinkedinIn className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors" aria-label="Partager sur WhatsApp">
                  <FaWhatsapp className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* CTA Card */}
            <div className="bg-gradient-to-br from-black/50 to-black  p-6 text-white">
              <h3 className="text-xl font-bold mb-3">Intéressé(e) ?</h3>
              <p className="text-blue-100 text-sm mb-4">
                Réservez votre place dès maintenant pour ne pas manquer cet événement exceptionnel.
              </p>
              <button className="w-full bg-white text-black font-semibold py-2 px-4  hover:bg-blue-50 transition-colors">
                S'inscrire
              </button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default EventsDetailsSection;
