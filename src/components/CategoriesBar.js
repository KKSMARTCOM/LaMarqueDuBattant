import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useArticles from '../hooks/useArticles';

// Fonction utilitaire pour générer dynamiquement les catégories et leur stock
function generateCategoriesFromArticles(articles) {
  const map = {};
  articles.forEach(article => {
    if (!map[article.category]) {
      map[article.category] = 1;
    } else {
      map[article.category]++;
    }
  });
  // Retourne un tableau d'objets { type, stock }
  const categories = Object.entries(map).map(([type, stock]) => ({ type, stock }));
  // Ajoute la catégorie ALL en premier
  return [{ type: 'ALL', stock: articles.length }, ...categories];
}

export default function CategoriesBar({ show }) {
  // Utilisation du hook useArticles pour charger les articles
  const [searchParams, setSearchParams] = useSearchParams();
  const { articles } = useArticles();
  const [categories, setCategories] = useState([]);
  const currentCategory = searchParams.get('categorie') || '';

  useEffect(() => {
    setCategories(generateCategoriesFromArticles(articles));
  }, [articles]);

  const handleCategoryClick = (categoryType) => {
    const newSearchParams = new URLSearchParams();
    
    // Copier tous les paramètres existants sauf 'categorie' et 'page'
    for (const [key, value] of searchParams.entries()) {
      if (key !== 'categorie' && key !== 'page') {
        newSearchParams.set(key, value);
      }
    }
    
    // Si ce n'est pas 'ALL', ajouter le paramètre categorie
    if (categoryType && categoryType !== 'ALL') {
      newSearchParams.set('categorie', categoryType.toLowerCase());
    }
    
    // Ajouter un timestamp pour forcer le rechargement
    newSearchParams.set('_t', Date.now());
    
    // Mettre à jour l'URL avec les nouveaux paramètres
    setSearchParams(newSearchParams, { replace: true });
  };

  if (!show) return null;

  return (
    <nav className="w-full bg-black border-t border-b border-gray-500 sticky top-0 z-30">
      <div className="px-4 sm:px-4">
        <ul className="flex flex-row items-center justify-start gap-6 overflow-x-auto whitespace-nowrap py-2 min-h-[36px] hide-scrollbar">
          {categories.map((cat) => (
            <li
              key={cat.type}
              className={
                "relative cursor-pointer text-xs sm:text-sm font-extralight transition-colors duration-200 " +
                (currentCategory === cat.type.toLowerCase() || (!currentCategory && cat.type === 'ALL') 
                  ? "text-white" 
                  : "text-gray-300 hover:text-white")
              }
              onClick={() => handleCategoryClick(cat.type)}
            >
              {cat.type}
              <span className="ml-1 text-[10px] text-gray-400 font-thin">{cat.stock}</span>
              {(currentCategory === cat.type.toLowerCase() || (!currentCategory && cat.type === 'ALL')) && (
                <span className="absolute left-0 -bottom-2 w-full h-0.5 bg-white rounded transition-all duration-200" />
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
} 