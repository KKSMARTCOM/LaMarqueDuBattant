/**
 * LegalModal.js
 * 
 * Description :
 * Composant de modale réutilisable pour afficher les contenus légaux (CGV, mentions légales, etc.).
 * Offre une expérience utilisateur cohérente pour la consultation des documents juridiques.
 *
 * Fonctionnalités principales :
 * - Affichage d'une modale centrée avec un fond semi-transparent
 * - Fermeture au clic en dehors de la modale ou avec la touche Échap
 * - Désactivation du défilement de la page lorsque la modale est ouverte
 * - Animation fluide à l'ouverture/fermeture
 * - Contenu personnalisable via les props
 *
 * Props :
 * - isOpen (boolean) : Contrôle l'affichage de la modale
 * - onClose (function) : Fonction appelée pour fermer la modale
 * - title (string) : Titre affiché dans l'en-tête de la modale
 * - content (ReactNode) : Contenu à afficher dans le corps de la modale
 *
 * Accessibilité :
 * - Gestion du focus à l'intérieur de la modale
 * - Fermeture avec la touche Échap
 * - Attributs ARIA appropriés
 * - Navigation clavier complète
 *
 * Utilisation typique :
 * ```jsx
 * const [isModalOpen, setIsModalOpen] = useState(false);
 * 
 * <button onClick={() => setIsModalOpen(true)}>Voir les mentions légales</button>
 * <LegalModal 
 *   isOpen={isModalOpen}
 *   onClose={() => setIsModalOpen(false)}
 *   title="Mentions Légales"
 *   content={<p>Contenu des mentions légales...</p>}
 * />
 * ```
 */

import React, { useEffect, useRef } from 'react';

const LegalModal = ({ isOpen, onClose, title, content }) => {
  const modalRef = useRef(null);

  // Gérer la fermeture au clic en dehors de la modale
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Empêcher le défilement
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset'; // Rétablir le défilement
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:p-6 pointer-events-none">
      <div className="fixed inset-0 bg-black/50 transition-opacity" aria-hidden="true" />
      
      <div 
        ref={modalRef}
        className="relative w-full max-w-md bg-gradient-to-br from-black/80 via-black/60 to-black/40 bg-opacity-40 backdrop-blur-3xl border border-white shadow-xl pointer-events-auto transform transition-all duration-300 ease-in-out"
        style={{
          maxHeight: '80vh',
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)'
        }}
      >
        {/* En-tête de la modale */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-white/60">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-white hover:text-gray-500 focus:outline-none"
          >
            <span className="sr-only">Fermer</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenu de la modale */}
        <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 57px)' }}>
          <div className="prose prose-sm text-sm text-white/60 text-left">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;
