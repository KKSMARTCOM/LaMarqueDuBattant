/**
 * FilterBar.js
 * 
 * Description :
 * Composant de barre de filtres pour la page des produits.
 * Permet aux utilisateurs de filtrer les articles selon différents critères (catégorie, prix, tailles, etc.).
 *
 * Fonctionnalités principales :
 * - Filtrage par catégorie de collection
 * - Filtrage par plage de prix avec curseur
 * - Filtrage par tailles disponibles
 * - Filtrage par promotions
 * - Filtrage par nouveautés
 * - Réinitialisation des filtres
 *
 * Props :
 * - filters (Object) : État actuel des filtres
 *   - categorie (string) : Catégorie sélectionnée
 *   - remises (Array) : Tableau des remises sélectionnées
 *   - tailles (Array) : Tableau des tailles sélectionnées
 *   - sexe (string) : Genre sélectionné
 *   - priceMin (number) : Prix minimum
 *   - priceMax (number) : Prix maximum
 *   - nouveau (boolean) : Filtre des nouveaux produits
 * - onFilterChange (Function) : Callback appelé lorsqu'un filtre est modifié
 * - minPossible (number) : Prix minimum possible (par défaut: 0)
 * - maxPossible (number) : Prix maximum possible (par défaut: 500)
 *
 * État local :
 * - collectionCategories (Array) : Liste des catégories de collection chargées
 *
 * Données dynamiques :
 * - Charge les catégories de collection via le service collectionService
 *
 * Accessibilité :
 * - Libellés associés aux champs de formulaire
 * - Navigation clavier complète
 * - Messages d'état pour les filtres actifs
 *
 * Responsive :
 * - Adapte son affichage pour les mobiles, tablettes et desktop
 * - Menu déroulant pour les petits écrans
 *
 * Exemple d'utilisation :
 * ```jsx
 * const [filters, setFilters] = useState({});
 * 
 * <FilterBar 
 *   filters={filters}
 *   onFilterChange={(newFilters) => setFilters(newFilters)}
 *   minPossible={0}
 *   maxPossible={1000}
 * />
 * ```
 */

import React, { useState, useEffect } from 'react';
//import { loadCollections } from '../services/collectionService';
import { getFilterValues } from '../services/filterService';

export default function FilterBar({ 
  filters, 
  onFilterChange,
  minPossible = 0, 
  maxPossible = 500 
}) {
  // Extraire les valeurs des filtres
  const { 
    categorie = '', 
    remises = [], 
    tailles = [], 
    sexe = '', 
    priceMin, 
    priceMax,
    nouveau = false
  } = filters || {};
  
  // État pour les collections complètes {id,name}
  const [collections, setCollections] = useState([]);
  // Charger les valeurs de filtre
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    remises: [],
    tailles: [],
    sexe: []
  });

  // Charger les catégories de collection et les valeurs de filtre au montage du composant
  useEffect(() => {
    let isMounted = true;
    
    const loadAllFilters = async () => {
      try {
        // Charger les collections
        //const { collections } = await loadCollections();
        
        // Charger les valeurs de filtre avec des valeurs par défaut en cas d'erreur
        const [categories = [], remises = [], tailles = [], sexe = [], loadedCollections = []] = await Promise.all([
          getFilterValues('categories').catch(() => []),
          getFilterValues('remises').catch(() => ['Sans remise']),
          getFilterValues('tailles').catch(() => []),
          getFilterValues('sexe').catch(() => []),
          getFilterValues('collections').catch(() => [])
        ]);
        
        // Ne mettre à jour l'état que si le composant est toujours monté
        if (isMounted) {
          setCollections(Array.isArray(loadedCollections) ? loadedCollections : []);
          setFilterOptions({
            categories: Array.isArray(categories) ? categories : [],
            remises: ['Sans remise', ...(Array.isArray(remises) ? remises.filter(r => r && r !== 'Sans remise') : [])],
            tailles: Array.isArray(tailles) ? tailles : [],
            sexe: Array.isArray(sexe) ? sexe : [],
            collections: Array.isArray(loadedCollections) ? loadedCollections : []
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement des filtres:', error);
        // En cas d'erreur, utiliser des tableaux vides pour éviter les erreurs
        if (isMounted) {
          setFilterOptions({
            categories: [],
            remises: ['Sans remise'],
            tailles: [],
            sexe: []
          });
        }
      }
    };
    
    loadAllFilters();
    
    // Nettoyage en cas de démontage du composant
    return () => {
      isMounted = false;
    };
  }, []);
  
  // Gestionnaires de changement de filtre
  const handleCategorieChange = (e) => {
    onFilterChange('categorie', e.target.value);
  };
  
  const handleRemiseChange = (e) => {
    onFilterChange('remises', e.target.value ? [e.target.value] : []);
  };
  
  const handleTailleToggle = (taille) => {
    if (!taille) return;
    
    const currentTailles = Array.isArray(tailles) ? tailles : [];
    const newTailles = currentTailles.includes(taille)
      ? currentTailles.filter(t => t !== taille)
      : [...currentTailles, taille];
      
    onFilterChange('tailles', newTailles);
  };
  
  const handleCollectionChange = (e) => {
    const val = e.target.value;
    onFilterChange('collections', val ? [Number(val)] : []);
  };
  
  const handleSexeChange = (newSexe) => {
    onFilterChange('sexe', newSexe === sexe ? '' : newSexe);
  };
  
  // Gestionnaire pour le prix minimum
  const handlePriceMinChange = (e) => {
    const newMin = e.target.value === '' ? undefined : Number(e.target.value);
    
    // Si le nouveau min est supérieur au max actuel, on ignore la modification
    if (newMin !== undefined && priceMax !== undefined && newMin > priceMax) {
      return;
    }
    
    onFilterChange('priceMin', newMin);
  };

  // Gestionnaire pour le prix maximum
  const handlePriceMaxChange = (e) => {
    const newMax = e.target.value === '' ? undefined : Number(e.target.value);
    
    // Si le nouveau max est inférieur au min actuel, on ignore la modification
    if (newMax !== undefined && priceMin !== undefined && newMax < priceMin) {
      return;
    }
    
    onFilterChange('priceMax', newMax);
  };
  
  // Gestionnaire pour le filtre "Nouveau"
  const handleShowNewOnlyChange = (e) => {
    onFilterChange('nouveau', e.target.checked);
  };

  // Réinitialiser tous les filtres
  const resetFilters = () => {
    onFilterChange('categorie', '');
    onFilterChange('remises', []);
    onFilterChange('tailles', []);
    onFilterChange('sexe', '');
    onFilterChange('priceMin', undefined);
    onFilterChange('priceMax', undefined);
    onFilterChange('nouveau', false);
    onFilterChange('collections', []);
  };

  // Les états sont gérés par le composant parent via les props

  return (
    <div className="w-full bg-white/90 backdrop-blur-sm shadow-sm border border-gray-100 p-1 sm:p-3 mb-6 transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between mb-2 pb-4 border-b border-gray-100">
        <h3 className="text-2xl font-medium tracking-tight text-gray-900">Filtres</h3>
        <button 
          onClick={resetFilters}
          className="group flex items-center gap-1.5 text-gray-500 hover:text-black transition-all duration-200 relative px-3 py-1.5 rounded-lg hover:bg-gray-50"
          title="Réinitialiser les filtres"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 transition-transform group-hover:rotate-180 duration-500" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" 
              clipRule="evenodd" 
            />
          </svg>
          <span className="text-xs font-medium text-gray-600 group-hover:text-black transition-colors duration-200">
            Réinitialiser
          </span>
        </button>
      </div>

      {/* Nouveaux  */}
      <div className="mb-4 border-b border-black/10 py-2">
        <div className="flex flex-col gap-5">
          <label className="rounded-2xl flex items-center text-left gap-1 text-sm text-gray-600 cursor-pointer">
            <input 
              type="checkbox" 
              className="w-5 h-5 rounded-md  accent-black" 
              checked={nouveau || false}
              onChange={handleShowNewOnlyChange}
            />
            Nouveautés (moins d'une semaine)
          </label>
        </div>
      </div>
      
      {/* Catégories */}
      <div className="mb-4 border-b border-black/10 py-2">
        <details open>
          <summary className="cursor-pointer text-left text-sm mb-2 font-semibold uppercase tracking-wider">CATÉGORIES</summary>
          <select
            className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-black text-gray-600 mt-2"
            value={categorie || ''}
            onChange={handleCategorieChange}
          >
            <option value="">Toutes les catégories</option>
            {filterOptions.categories?.map((category) => (
              <option key={category} value={category.toLowerCase()} className="text-gray-900">
                {category}
              </option>
            ))}
          </select>
        </details>
      </div>


      {/* Prix */}
      <div className="mb-4 border-b border-black/10 py-2">
        <details>
        <summary className="cursor-pointer text-left text-sm mb-2 font-semibold uppercase tracking-wider">PRIX</summary>
        <div className="grid grid-cols-2 border rounded-md border-gray-300 divide-x divide-gray200 mb-2">
          <div className="flex items-center justify-center gap-1 py-2">
            <span className="text-lg">¥</span>
            <input
              type="number"
              min={minPossible}
              max={priceMax !== undefined ? priceMax : maxPossible}
              onKeyDown={(e) => {
                // Empêcher la saisie de valeurs négatives
                if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                  e.preventDefault();
                }
              }}
              value={priceMin !== undefined ? priceMin : ""}
              placeholder={minPossible}
              onChange={handlePriceMinChange}
              className="w-20 text-center  border-none outline-none bg-transparent text-lg"
            />
          </div>
          <div className="flex items-center justify-center gap-1 py-2">
            <span className="text-lg">¥</span>
            <input
              type="number"
              min={priceMin !== undefined ? priceMin : minPossible}
              max={maxPossible}
              onKeyDown={(e) => {
                // Empêcher la saisie de valeurs négatives
                if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                  e.preventDefault();
                }
              }}
              value={priceMax !== undefined ? priceMax : ""}
              placeholder={maxPossible}
              onChange={handlePriceMaxChange}
              className="w-20 text-center border-none outline-none bg-transparent text-lg"
            />
          </div>
        </div>
        
        {/* Slider double, chaque moitié gère sa poignée */}
        <div className="relative flex items-center h-8">
          {/* Barre de fond */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-gray-400 z-0" />
          {/* Slider min, zone gauche */}
          <div className="absolute left-0 top-0 h-full w-1/2" style={{zIndex: 2, pointerEvents: 'auto'}}>
            <input
              type="range"
              min={minPossible}
              max={maxPossible}
              value={priceMin !== undefined ? priceMin : minPossible}
              onChange={e => {
                const newMin = Number(e.target.value);
                // Si le nouveau min dépasse le max actuel, on bloque
                if (priceMax !== undefined && newMin > priceMax) {
                  return; // On ne fait rien, le slider reste bloqué
                }
                onFilterChange('priceMin', newMin === minPossible ? undefined : newMin);
              }}
              className="w-full h-7 bg-transparent appearance-none pointer-events-auto"
            />
          </div>
          {/* Slider max, zone droite */}
          <div className="absolute right-0 top-0 h-full w-1/2" style={{zIndex: 3, pointerEvents: 'auto'}}>
            <input
              type="range"
              min={minPossible}
              max={maxPossible}
              value={priceMax !== undefined ? priceMax : maxPossible}
              onChange={e => {
                const newMax = Number(e.target.value);
                // Si le nouveau max est inférieur au min actuel, on bloque
                if (priceMin !== undefined && newMax < priceMin) {
                  return; // On ne fait rien, le slider reste bloqué
                }
                onFilterChange('priceMax', newMax === maxPossible ? undefined : newMax);
              }}
              className="w-full h-7 bg-transparent appearance-none pointer-events-auto"
            />
          </div>
          {/* Poignées custom */}
          <style>{`
            input[type=range]::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 18px;
              height: 18px;
              background: #000;
              border-radius: 15%;
              cursor: pointer;
              border: none;
              margin-top: -7.5px;
            }
            input[type=range]::-moz-range-thumb {
              width: 18px;
              height: 18px;
              background: #000;
              cursor: pointer;
              border: none;
            }
            input[type=range]::-ms-thumb {
              width: 18px;
              height: 18px;
              background: #000;
              cursor: pointer;
              border: none;
            }
            input[type=range] {
              outline: none;
            }
            input[type=range]::-webkit-slider-runnable-track {
              height: 1px;
              background: transparent;
            }
            input[type=range]::-ms-fill-lower, input[type=range]::-ms-fill-upper {
              background: transparent;
            }
          `}</style>
        </div>
      </details>
      </div>


      {/* Remises */}
      <div className="mb-4 border-b border-black/10 py-2">
        <details>
          <summary className="cursor-pointer text-left text-sm mb-2 font-semibold uppercase tracking-wider">REMISES</summary>
          <select
            className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-black text-gray-600 mt-2"
            value={Array.isArray(remises) && remises.length > 0 ? remises[0] : ''}
            onChange={handleRemiseChange}
          >
            <option value="">Toutes les remises</option>
            {filterOptions.remises?.map((remise) => (
              <option key={remise} value={remise} className="text-gray-900">
                {remise === 'Sans remise' ? 'Sans remise' : `Jusqu'à ${remise}`}
              </option>
            ))}
          </select>
        </details>
      </div>


      {/* Tailles */}
      <div className="mb-4 border-b border-black/10 py-2">
        <details open>
          <summary className="cursor-pointer text-left text-sm mb-2 font-semibold uppercase tracking-wider">TAILLE</summary>
          <div className="flex flex-wrap gap-5 mt-2">
            {filterOptions.tailles?.map((taille) => (
              <label key={taille} className="rounded-md flex items-center gap-2 text-sm text-gray-600">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded-md accent-black" 
                  checked={tailles.includes(taille)}
                  onChange={() => handleTailleToggle(taille)} 
                />
                {taille}
              </label>
            ))}
          </div>
        </details>
      </div>


      {/* Sexe */}
      <div className="mb-4 border-b border-black/10 py-2">
        <details>
        <summary className="cursor-pointer text-left text-sm mb-2 font-semibold uppercase tracking-wider">SEXE</summary>
        <div className="flex flex-wrap gap-5 mt-2">
          {['Homme', 'Femme', 'Unisexe'].map((sexeOption) => (
            <label key={sexeOption} className="rounded-md flex items-center gap-2 text-sm text-gray-600">
              <input 
                type="checkbox" 
                className="w-5 h-5 rounded-md accent-black" 
                checked={sexe?.includes(sexeOption)}
                onChange={() => handleSexeChange(sexeOption)} 
              />
              {sexeOption}
            </label>
          ))}
        </div>
        </details>
      </div>

      {/* Collection */}
      <div className="mb-4 border-b border-black/10 py-2">
        <details>
          <summary className="cursor-pointer text-left text-sm mb-2 font-semibold uppercase tracking-wider">COLLECTION</summary>
          <select
            className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-black text-gray-600 mt-2"
            value={(filters.collections && filters.collections.length > 0) ? String(filters.collections[0]) : ''}
            onChange={handleCollectionChange}
          >
            <option value="">Toutes les collections</option>
            {(Array.isArray(collections) ? collections : []).map((col) => (
              <option key={col.id} value={col.id} className="text-gray-900">
                {col.id} - {col.name}
              </option>
            ))}
          </select>
        </details>
      </div>
    </div>
  );
}