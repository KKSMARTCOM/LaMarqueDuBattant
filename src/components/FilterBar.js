import React, { useState, useEffect } from "react";
import { loadCollections } from "../services/collectionService";

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
  
  // État pour stocker les catégories de collection
  const [collectionCategories, setCollectionCategories] = useState([]);
  
  // Charger les catégories de collection au montage du composant
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const { categories } = await loadCollections();
        setCollectionCategories(categories || []);
      } catch (error) {
        console.error('Erreur lors du chargement des collections:', error);
      }
    };
    
    fetchCollections();
  }, []);
  
  // Gestionnaires de changement de filtre
  const handleCategorieChange = (e) => {
    onFilterChange('categorie', e.target.value);
  };
  
  const handleRemiseToggle = (remise) => {
    const newRemises = remises.includes(remise)
      ? remises.filter(r => r !== remise)
      : [...remises, remise];
    onFilterChange('remises', newRemises);
  };
  
  const handleTailleToggle = (taille) => {
    const newTailles = tailles.includes(taille)
      ? tailles.filter(t => t !== taille)
      : [...tailles, taille];
    onFilterChange('tailles', newTailles);
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
  
  // Gestionnaire pour le filtre "Collection"
  const handleCollectionToggle = (collectionCategorie) => {
    const newCollections = filters.collections?.includes(collectionCategorie)
      ? filters.collections.filter(c => c !== collectionCategorie)
      : [...(filters.collections || []), collectionCategorie];
    onFilterChange('collections', newCollections);
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
          <label className="rounded-none flex items-center text-left gap-1 text-sm text-gray-600 cursor-pointer">
            <input 
              type="checkbox" 
              className="w-5 h-5 rounded-none  accent-black" 
              checked={nouveau || false}
              onChange={handleShowNewOnlyChange}
            />
            Nouveautés (moins d'une semaine)
          </label>
        </div>
      </div>
      
      {/* Catégories */}
      <div className="mb-4 border-b border-black/10 py-2">
        <details>
        <summary className=" cursor-pointer text-left text-sm mb-2 font-semibold uppercase tracking-wider">CATÉGORIES</summary>
        <select
          className="w-full rounded-none border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-black text-gray-600"
          value={categorie}
          onChange={handleCategorieChange}
        >
          <option value="" className="text-gray-500">Toutes les catégories</option>
          <option value="tshirt" className="text-gray-500">T-shirt</option>
          <option value="sweat" className="text-gray-500">Sweat</option>
          <option value="veste" className="text-gray-500">Veste</option>
          <option value="pantalon" className="text-gray-500">Pantalon</option>
          <option value="accessoire" className="text-gray-500">Accessoire</option>
        </select>
        </details>
      </div>


      {/* Prix */}
      <div className="mb-4 border-b border-black/10 py-2">
        <details>
        <summary className="cursor-pointer text-left text-sm mb-2 font-semibold uppercase tracking-wider">PRIX</summary>
        <div className="grid grid-cols-2 border border-gray-300 divide-x divide-gray200 mb-2">
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
              className="w-20 text-center border-none outline-none bg-transparent text-lg"
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


      {/* Remise */}
      <div className="mb-4 border-b border-black/10 py-2">
        <details>
        <summary className="cursor-pointer text-left text-sm mb-2 font-semibold uppercase tracking-wider">REMISE</summary>
        <div className="flex flex-wrap gap-5">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              className="w-5 h-5 rounded-none accent-black"
              checked={remises.includes('Sans remise')}
              onChange={() => handleRemiseToggle('Sans remise')}
            /> Sans remise
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              className="w-5 h-5 rounded-none accent-black"
              checked={remises.includes('-10%')}
              onChange={() => handleRemiseToggle('-10%')}
            /> -10%
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              className="w-5 h-5 rounded-none accent-black"
              checked={remises.includes('-20%')}
              onChange={() => handleRemiseToggle('-20%')}
            /> -20%
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              className="w-5 h-5 rounded-none accent-black"
              checked={remises.includes('-30% et plus')}
              onChange={() => handleRemiseToggle('-30% et plus')}
            /> -30% et plus
          </label>
        </div>
        </details>
      </div>


      {/* Taille */}
      <div className="mb-4 border-b border-black/10 py-2">
        <details>
        <summary className="cursor-pointer text-left text-sm mb-2 font-semibold uppercase tracking-wider">TAILLE</summary>
        <div className="flex flex-wrap gap-5">
          {['XS','S','M','L','XL'].map(size => (
            <label key={size} className="rounded-none flex items-center gap-1 text-sm text-gray-600">
              <input type="checkbox" className="w-5 h-5 rounded-none accent-black" checked={tailles.includes(size)} onChange={() => handleTailleToggle(size)} /> {size}
            </label>
          ))}
        </div>
        </details>
      </div>


      {/* Sexe */}
      <div className="mb-4 border-b border-black/10 py-2">
        <details>
        <summary className="cursor-pointer text-left text-sm mb-2 font-semibold uppercase tracking-wider">SEXE</summary>
        <select
          className="flex-1 w-full rounded-none border justify-start justify-items-start border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-black text-gray-600"
          value={sexe}
          onChange={e => handleSexeChange(e.target.value)}
        >
          <option value="">Tous</option>
          <option value="Homme">Homme</option>
          <option value="Femme">Femme</option>
          <option value="Unisexe">Unisexe</option>
        </select>
        </details>
      </div>

      {/* Collection  */}
      <div className="mb-4 border-b border-black/10 py-2">
        <details>
          <summary className="cursor-pointer text-left text-sm mb-2 font-semibold uppercase tracking-wider">COLLECTION</summary>
          <div className="flex flex-col gap-5">
            {collectionCategories.length > 0 ? (
              collectionCategories.map(category => (
                <label key={category} className="rounded-none flex items-center gap-1 text-sm text-gray-600 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded-none accent-black"
                    checked={filters.collections?.includes(category) || false}
                    onChange={() => handleCollectionToggle(category)}
                  />
                  {category}
                </label>
              ))
            ) : (
              <p className="text-sm text-gray-500">Chargement des collections...</p>
            )}
          </div>
        </details>
      </div>
    </div>
  );
}