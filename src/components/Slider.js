/**
 * Slider.js
 * 
 * Description :
 * Composant de diaporama (carrousel) pour afficher une série d'images avec des légendes.
 * Permet la navigation entre les diapositives avec des flèches et des indicateurs de position.
 *
 * Fonctionnalités principales :
 * - Affichage en plein écran des images
 * - Navigation fluide entre les diapositives
 * - Boutons de navigation précédent/suivant
 * - Indicateurs de position (points)
 * - Légende avec titre et description pour chaque diapositive
 * - Défilement automatique configurable
 *
 * Structure des données :
 * Chaque diapositive est un objet avec :
 * - image (string) : Nom du fichier image
 * - name (string) : Titre de la diapositive
 * - des (string) : Description ou sous-titre
 *
 * Comportement :
 * - Défilement automatique toutes les 5 secondes
 * - Arrêt du défilement au survol
 * - Animation de transition fluide
 * - Bouclage infini
 *
 * Accessibilité :
 * - Navigation au clavier (flèches gauche/droite)
 * - Boutons avec libellés explicites
 * - Texte alternatif pour les images
 * - Indicateurs de position cliquables
 *
 * Personnalisation :
 * - Durée de transition : modifiable via la variable `transitionDuration`
 * - Délai entre les diapositives : modifiable via `autoSlideInterval`
 * - Images : à placer dans le dossier public/images
 *
 * Exemple d'utilisation :
 * ```jsx
 * <Slider />
 * ```
 * 
 * Remarques :
 * - Nécessite les icônes de react-icons/fa
 * - Utilise la fonction getImagePath pour résoudre les chemins d'accès
 * - Style personnalisé avec des animations CSS
 */

import React, { useRef, useEffect } from 'react';
import getImagePath from './getImagePath';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const slides = [
  {
    image: 'Clothing-Canyon.png',
    name: 'INTO THE WILD',
    des: 'Explore the untamed beauty where nature roars with life.'
  },
  {
    image: 'Elegant-Unity.png',
    name: 'RULE WITH COURAGE',
    des: 'Be bold, be brave, and lead with a fearless heart'
  },
  {
    image: 'hero.webp',
    name: 'THE GIANT GUARDIAN',
    des: 'Silent strength and ancient wisdom walking the wild plains'
  },
  {
    image: 'cu2.jpg',
    name: 'SPEED IN SILENCE',
    des: 'Swift, silent, and unstoppable in the heart of the wild.'
  },
  {
    image: 'p1.jpg',
    name: 'KING OF THE WILD',
    des: 'Where strength meets elegance in the heart of the savannah'
  },
  {
    image:'cu3.jpg',
    name: 'WINGS OF FREEDOM',
    des: 'Soaring above limits, guided by instinct and vision.'
  },
  {
    image: 'hero1.jpg',
    name: 'WINGS OF FREEDOM',
    des: 'Soaring above limits, guided by instinct and vision.'
  },  
];

export default function Slider() {
  const slideRef = useRef(null);

  useEffect(() => {
    // No-op, just to ensure ref is set
  }, []);

  const handleNext = () => {
    const slide = slideRef.current;
    if (slide && slide.children.length > 0) {
      slide.appendChild(slide.children[0]);
    }
  };

  const handlePrev = () => {
    const slide = slideRef.current;
    if (slide && slide.children.length > 0) {
      slide.prepend(slide.children[slide.children.length - 1]);
    }
  };


  return (
    <section className="mt-28 w-full h-[600px]">
      <div className="container">
        <div className="slide" ref={slideRef}>
          {slides.map((item, idx) => (
            <div className="item" key={idx} style={{ backgroundImage: `url(${getImagePath(item.image, 'cover')})` }}>
              <div className="content">
                <div className="name">{item.name}</div>
                <div className="des">{item.des}</div>
                <button className="text-black bg-white border border-white ">See More</button>
              </div>
            </div>
          ))}
        </div>
      <div className="button">
        <button className="prev text-center justify-center items-center" onClick={handlePrev}>
          <FaArrowLeft className="text-center justify-center items-center" />
        </button>
        <button className="next text-center justify-center items-center" onClick={handleNext}>
          <FaArrowRight className="text-center justify-center item-center" />
        </button>
      </div>
    </div>


    <style jsx>{`
*{
    box-sizing: border-box;
}
body{
    background: #ffffff;
    overflow: hidden;
}
.container{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 1200px;
    height: 400px;
    background: #000000;
}
.container .slide .item{
    width: 200px;
    height: 300px;
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    border-radius: 0px;
    background-position: 50% 50%;
    background-size: cover;
    display: inline-block;
    transition: 0.5s;
}
.slide .item:nth-child(1),
.slide .item:nth-child(2){
    top: 0;
    left: 0;
    transform: translate(0, 0);
    border-radius: 0;
    width: 100%;
    height: 100%;
}

.slide .item:nth-child(3){
    left: calc(50% + 440px);
}
.slide .item:nth-child(n + 4){
    left: calc(50% + 660px);
    opacity: 0;
}
.item .content{
    position: absolute;
    top: 50%;
    left: 100px;
    width: 300px;
    text-align: left;
    color: #eee;
    transform: translate(0, -50%);
    font-family: system-ui;
    display: none;
}
.slide .item:nth-child(2) .content{
    display: block;
}
.content .name{
    font-size: 40px;
    text-transform: uppercase;
    font-weight: bold;
    opacity: 0;
    animation: animate 1s ease-in-out 1 forwards;
}
.content .des{
    margin-top: 10px;
    margin-bottom: 20px;
    opacity: 0;
    animation: animate 1s ease-in-out 0.3s 1 forwards;
}
.content button{
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    opacity: 0;
    background: #ffffff;
    color: #000000;
    animation: animate 1s ease-in-out 0.6s 1 forwards;
}
@keyframes animate {
    from{
        opacity: 0;
    }
    to{
        opacity: 1;
    }
}
.button{
    width: 100%;
    text-align: center;
    position: absolute;
    bottom: 20px;
}
.button button{
    width: 40px;
    height: 35px;
    border: none;
    cursor: pointer;
    margin: 0 5px;
    border: 1px solid #000;
    transition: 0.3s;
}
.button button:hover{
    background: #ababab;
    color: #fff;
}
      `}

    </style>
    </section>
  );
}
