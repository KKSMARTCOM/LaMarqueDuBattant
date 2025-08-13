/**
 * Loader.js
 * 
 * Description :
 * Composant d'indicateur de chargement animé.
 * Affiche une animation visuelle pendant le chargement des données ou des pages.
 *
 * Fonctionnalités principales :
 * - Animation de carrés qui se déplacent de manière séquentielle
 * - Texte "Chargement..." affiché à côté de l'animation
 * - Animation CSS pure sans dépendances externes
 * - Pleine hauteur d'écran pour un chargement de page complet
 *
 * Utilisation :
 * - Pour les chargements de page complets
 * - Pendant les appels API asynchrones
 * - Lors du chargement de contenu lourd
 *
 * Accessibilité :
 * - Texte lisible par les lecteurs d'écran
 * - Animation non intrusive pour les utilisateurs sensibles aux mouvements
 *
 * Personnalisation :
 * - Couleur : modifiable via les classes Tailwind
 * - Taille : s'adapte au conteneur parent
 * - Texte : personnalisable en modifiant le contenu textuel
 *
 * Exemple d'utilisation :
 * ```jsx
 * const MyComponent = () => {
 *   const [isLoading, setIsLoading] = useState(true);
 * 
 *   if (isLoading) {
 *     return <Loader />;
 *   }
 * 
 *   return <div>Contenu chargé</div>;
 * };
 * ```
 * 
 * Remarque :
 * - Utilise des animations CSS personnalisées pour un meilleur contrôle des performances
 * - Ne nécessite pas de bibliothèque d'icônes externe
 * - Compatible avec le mode sombre/clair du navigateur
 */

import React from 'react';

const Loader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div class="loader">
        {[...Array(10)].map((_, index) => (
          <div class="loader-square" key={index}></div>
        ))}
      </div>
      <h1 className="text-2xl mx-8 text-black/20 font-bold">Chargement...</h1>
      <style jsx>{`
        @keyframes square-animation {
          0% {
            left: 0;
            top: 0;
          }

          10.5% {
            left: 0;
            top: 0;
          }

          12.5% {
            left: 32px;
            top: 0;
          }

          23% {
            left: 32px;
            top: 0;
          }

          25% {
            left: 64px;
            top: 0;
          }

          35.5% {
            left: 64px;
            top: 0;
          }

          37.5% {
            left: 64px;
            top: 32px;
          }

          48% {
            left: 64px;
            top: 32px;
          }

          50% {
            left: 32px;
            top: 32px;
          }

          60.5% {
            left: 32px;
            top: 32px;
          }

          62.5% {
            left: 32px;
            top: 64px;
          }

          73% {
            left: 32px;
            top: 64px;
          }

          75% {
            left: 0;
            top: 64px;
          }

          85.5% {
            left: 0;
            top: 64px;
          }

          87.5% {
            left: 0;
            top: 32px;
          }

          98% {
            left: 0;
            top: 32px;
          }

          100% {
            left: 0;
            top: 0;
          }
          }

          .loader {
          position: relative;
          width: 80px;
          height: 80px;
          transform: rotate(0deg);
          }

          .loader-square {
          position: absolute;
          top: 0;
          left: 0;
          width: 15px;
          height: 15px;
          margin: 0px;
          border-radius: -20px;
           background: rgb(211, 211, 211);
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          animation: square-animation 10s ease-in-out infinite both;
          }

          .loader-square:nth-of-type(0) {
          animation-delay: 0s;
          }

          .loader-square:nth-of-type(1) {
          animation-delay: -1.4285714286s;
          }

          .loader-square:nth-of-type(2) {
          animation-delay: -2.8571428571s;
          }

          .loader-square:nth-of-type(3) {
          animation-delay: -4.2857142857s;
          }

          .loader-square:nth-of-type(4) {
          animation-delay: -5.7142857143s;
          }

          .loader-square:nth-of-type(5) {
          animation-delay: -7.1428571429s;
          }

          .loader-square:nth-of-type(6) {
          animation-delay: -8.5714285714s;
          }

          .loader-square:nth-of-type(7) {
          animation-delay: -10s;
          }
      `}</style>
    </div>
  );
};

export default Loader;
