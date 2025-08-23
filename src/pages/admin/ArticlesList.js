/**
 * ArticlesList.js
 * 
 * Description:
 * Ce composant affiche la liste des articles disponibles dans l'administration.
 * Il permet de visualiser, filtrer, rechercher et gérer les articles du catalogue.
 *
 * Fonctionnalités principales :
 * - Affichage paginé de la liste des articles
 * - Recherche et filtrage par catégorie
 * - Actions rapides (modifier, supprimer)
 * - Lien vers le formulaire d'ajout d'article
 * - Gestion des erreurs de chargement
 *
 * Structure des données :
 * - Utilise le service articleService pour récupérer les données
 * - Gère l'état de chargement et les erreurs
 * - Affiche les informations complètes des articles
 *
 * Dépendances :
 * - articleService : Service pour les opérations CRUD sur les articles
 * - react-icons : Pour les icônes
 * - react-router-dom : Pour la navigation
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiRefreshCw, FiExternalLink, FiEye } from 'react-icons/fi';
import { 
  getAllArticles, 
  deleteArticle 
} from '../../services/articleService';
import getImagePath from '../../components/getImagePath';
import Loader from '../../components/Loader';
import useChangesCart from '../../hooks/useChangesCart';
import { getCollectionsMap } from '../../services/filterService';

const ArticlesList = () => {
  const navigate = useNavigate();
  // Panier de modifications: permet de mettre en file d'attente des opérations (create/update/delete)
  // pour une application ultérieure en batch depuis la modale dédiée.
  const { count, openModal, addChange } = useChangesCart();
  // Map des couleurs pour gérer les noms non CSS -> codes hex
  const COLOR_MAP = {
    'noir': '#000000',
    'blanc': '#FFFFFF',
    'gris': '#808080',
    'gris foncé': '#555555',
    'gris anthracite': '#333333',
    'bleu': '#0000FF',
    'bleu marine': '#001F3F',
    'rouge': '#FF0000',
    'rouge bordeaux': '#800020',
    'rose': '#FFC0CB',
    'rose poudré': '#EEC9D2',
    'jaune': '#FFFF00',
    'marron': '#8B4513',
    'camel': '#C19A6B',
    'taupe': '#483C32',
    'beige': '#F5F5DC',
    'kaki': '#78866B',
    'vert': '#008000',
    'vert militaire': '#4B5320',
    'mauve': '#E0B0FF',
    'blanc cassé': '#F8F8F0',
  };
  const norm = (s = '') => s.toString().trim().toLowerCase();
  // Retourne { name, code } à partir d'une entrée ("name:code" ou nom legacy)
  const parseColorEntry = (entry) => {
    if (!entry) return { name: '', code: '' };
    if (typeof entry === 'string' && entry.includes(':')) {
      const [name, code] = entry.split(':');
      return { name: name.trim(), code: code.trim() };
    }
    const name = typeof entry === 'string' ? entry : (entry.name || entry.label || '');
    const code = COLOR_MAP[norm(name)] || name; // si name est déjà un code CSS
    return { name, code };
  };
  // Styles pour le tableau
  const tableCellStyle = "px-4 py-3.5 text-sm text-gray-800 whitespace-nowrap text-left border-r border-gray-100 last:border-r-0";
  const tableHeaderStyle = "px-4 py-3.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-50 border-b border-gray-200 last:border-r-0";
  const tableRowStyle = (isSelected) => 
    `border-b border-gray-100 transition-colors duration-150 ${isSelected ? 'bg-gray-200 ring-1 ring-blue-200' : 'hover:bg-gray-100'}`;
  const tableContainerStyle = "shadow-sm rounded-lg border border-gray-200 overflow-hidden";
  
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory] = useState('Toutes');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [collectionsMap, setCollectionsMap] = useState({});
  const [selectedArticle, setSelectedArticle] = useState(null);


  // Récupérer les catégories uniques depuis les articles
  //const categories = ['Toutes', ...new Set(articles.map(article => article.category))];

  // Fonction pour charger les articles
  const loadArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllArticles();
      setArticles(data);
    } catch (err) {
      setError('Erreur lors du chargement des articles');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  // La fonction refreshArticleList a été supprimée car non utilisée
  // La fonction loadArticles est utilisée à la place

  // Charger les articles au montage et à chaque rafraîchissement
  useEffect(() => {
    loadArticles();
  }, [refreshKey]);

  // Charger la map des collections (id -> name)
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const map = await getCollectionsMap();
        if (isMounted) setCollectionsMap(map || {});
      } catch (e) {
        if (isMounted) setCollectionsMap({});
      }
    })();
    return () => { isMounted = false; };
  }, []);

  // Ancienne suppression immédiate (appel serveur direct). Conservée pour référence.
  // Préférer désormais la mise au panier (voir handleQueueDelete).
  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article immédiatement ?')) {
      try {
        await deleteArticle(id);
        setRefreshKey(prev => prev + 1);
      } catch (err) {
        setError('Erreur lors de la suppression de l\'article');
        console.error('Erreur:', err);
      }
    }
  };

  // Nouvelle approche: on ajoute une opération de suppression dans le panier de modifications.
  // L'utilisateur pourra ensuite appliquer toutes ses modifications en une seule fois (batch).
  const handleQueueDelete = (id) => {
    if (!id) return;
    if (window.confirm('Ajouter la suppression de cet article au panier de modifications ?')) {
      addChange({ type: 'delete', targetId: id, source: 'ArticlesList' });
      // La modale s'ouvre automatiquement via le contexte pour donner un feedback immédiat.
    }
  };

  // Filtrer les articles en fonction de la recherche et de la catégorie
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Toutes' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Fonction pour obtenir le statut du stock
  const getStockStatus = (stock) => {
    if (stock === 0) return 'Rupture';
    if (stock < 10) return 'Stock limité';
    return 'En stock';
  };

  // Fonction pour formater le prix
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(price);
  };

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Afficher l'état de chargement
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  // Afficher les erreurs
  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
    <div className="space-y-6 z-10 top-0 right-0">
        <div className="pb-5 mb-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Gestion des articles</h2>
            <div className="flex space-x-3">
              <button
                onClick={() => setRefreshKey(prev => prev + 1)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-md text-sm leading-4 font-medium rounded-md  text-white/80 bg-black/95 hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                title="Actualiser la liste"
              >
                <FiRefreshCw className="-ml-0.5 mr-2 h-4 w-4" />
                Actualiser
              </button>
              <button
                onClick={openModal}
                className="relative inline-flex items-center px-3 py-2 border border-gray-300 shadow-md text-sm leading-4 font-medium rounded-md text-black bg-white hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black/20"
                title="Ouvrir le panier de modifications"
                aria-label="Ouvrir le panier de modifications"
              >
                <span className="mr-2">Panier</span>
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-red-600 rounded-full">
                    {count}
                  </span>
                )}
              </button>
              <Link
                to="/admin/articles/nouveau"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-md text-black/80 bg-white hover:bg-white/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black/20"
              >
                <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                Nouvel article
              </Link>
            </div>
            </div>
        </div>

      {/* Filtres et actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-between">
          {/* Barre de recherche */}
          <div className="w-full md:w-1/2">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="focus:border-black/80 block w-full pl-10 pr-4 py-2 text-sm border-gray-300 rounded-md border"
                placeholder="Nom, référence, description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Rechercher un article"
              />
            </div>
          </div>
          
          {/* Boutons d'action */}
          <div className="flex items-center space-x-2 w-full md:w-auto justify-end mt-2 md:mt-0">
            <div className="flex items-center space-x-1 bg-gray-50 p-1 rounded-lg border border-gray-200">
            <button
                className={`p-2 rounded-md transition-colors ${selectedArticle ? 'text-blue-600 hover:bg-blue-50' : 'text-gray-300 cursor-not-allowed'}`}
              title={selectedArticle ? "Voir la fiche produit" : "Sélectionnez un article"}
              disabled={!selectedArticle}
              onClick={() => selectedArticle && navigate(`/admin/articles/${selectedArticle.id}`)}
                aria-label="Voir la fiche produit"
            >
              <FiEye className="h-5 w-5" />
            </button>
            <button
                className={`p-2 rounded-md transition-colors ${selectedArticle ? 'text-indigo-600 hover:bg-indigo-50' : 'text-gray-300 cursor-not-allowed'}`}
              title={selectedArticle ? "Modifier" : "Sélectionnez un article"}
              disabled={!selectedArticle}
              onClick={() => selectedArticle && navigate(`/admin/articles/${selectedArticle.id}/modifier`)}
                aria-label="Modifier l'article"
            >
              <FiEdit2 className="h-5 w-5" />
            </button>
            <button
                className={`p-2 rounded-md transition-colors ${selectedArticle ? 'text-red-600 hover:bg-red-50' : 'text-gray-300 cursor-not-allowed'}`}
              title={selectedArticle ? "Mettre la suppression au panier" : "Sélectionnez un article"}
              disabled={!selectedArticle}
              onClick={() => selectedArticle && handleQueueDelete(selectedArticle.id)}
                aria-label="Mettre la suppression au panier"
            >
              <FiTrash2 className="h-5 w-5" />
            </button>
            <button
                className={`p-2 rounded-md transition-colors ${selectedArticle && selectedArticle.id ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'}`}
              title={selectedArticle && selectedArticle.id ? "Voir sur le site" : "Article non lié ou non sélectionné"}
              disabled={!selectedArticle || !selectedArticle.id}
              onClick={() => selectedArticle?.id && navigate(`/produit/${selectedArticle.id}`, {target: '_blank'})}
                aria-label="Voir sur le site"
            >
              <FiExternalLink className="h-5 w-5" />
            </button>
            </div>
            
        </div>
      </div>
    </div>
    </div>


      {/* Tableau des articles */}
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto">
          <div className="py-2 align-middle inline-block min-w-full">
            <div className={tableContainerStyle}>
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className={tableHeaderStyle} style={{ minWidth: '220px' }}>
                      Article
                    </th>
                    <th className={tableHeaderStyle} style={{ minWidth: '140px' }}>
                      Catégorie
                    </th>
                    <th className={tableHeaderStyle} style={{ minWidth: '100px' }}>
                      Genre
                    </th>
                    <th className={tableHeaderStyle} style={{ minWidth: '120px' }}>
                      Collection
                    </th>
                    <th className={tableHeaderStyle} style={{ minWidth: '140px' }}>
                      Tailles
                    </th>
                    <th className={tableHeaderStyle} style={{ minWidth: '140px' }}>
                      Couleurs
                    </th>
                    <th className={tableHeaderStyle} style={{ minWidth: '100px' }}>
                      Stock
                    </th>
                    <th className={tableHeaderStyle} style={{ minWidth: '120px' }}>
                      Statut
                    </th>
                    <th className={tableHeaderStyle} style={{ minWidth: '100px' }}>
                      Prix
                    </th>
                    <th className={tableHeaderStyle} style={{ minWidth: '100px' }}>
                      Promo
                    </th>
                    <th className={tableHeaderStyle} style={{ minWidth: '140px' }}>
                      Date d'ajout
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredArticles.length === 0 ? (
                    <tr>
                      <td colSpan="12" className="px-6 py-4 text-center text-sm text-gray-500">
                        Aucun article trouvé
                      </td>
                    </tr>
                  ) : (
                    filteredArticles.map((article) => (
                      <tr 
                        key={article.id} 
                        className={tableRowStyle(selectedArticle?.id === article.id)}
                        onClick={() => setSelectedArticle(selectedArticle?.id === article.id ? null : article)}
                        style={{ cursor: 'pointer' }}
                      >
                        {/* Colonne Article */}
                        <td className={tableCellStyle} style={{ verticalAlign: 'top' }}>
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded object-cover"
                                src={getImagePath(article.image, 'products')}
                                alt={article.title}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = getImagePath('placeholder.jpg', 'products');
                                }}
                              />
                            </div>
                            <div className="ml-2">
                              <div className="text-sm font-medium text-gray-900" title={article.title}>
                                {article.title}
                              </div>
                              <div className="text-xs text-gray-500">
                                ID: {article.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        {/* Colonne Catégorie */}
                        <td className={tableCellStyle} style={{ verticalAlign: 'top' }}>
                          <div className="text-sm" title={article.category || 'Non spécifiée'}>
                            {article.category || '-'}
                          </div>
                        </td>
                        
                        {/* Colonne Genre */}
                        <td className={tableCellStyle} style={{ verticalAlign: 'top' }}>
                          <span className="text-sm">{article.sexe || 'Unisexe'}</span>
                        </td>
                        
                        {/* Colonne Collection */}
                        <td className={tableCellStyle} style={{ verticalAlign: 'top' }}>
                          {article.collectionId ? (
                            <span className="text-sm">
                              {article.collectionId} - {collectionsMap[Number(article.collectionId)] || '-'}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-sm">-</span>
                          )}
                        </td>
                        
                        {/* Colonne Tailles */}
                        <td className={tableCellStyle} style={{ verticalAlign: 'top' }}>
                          <div className="flex flex-wrap gap-1">
                            {article.sizes && article.sizes.length > 0 ? (
                              article.sizes.map(size => (
                                <span key={size} className="px-1.5 py-0.5 bg-gray-100 text-gray-800 text-xs rounded">
                                  {size}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-400 text-sm">-</span>
                            )}
                          </div>
                        </td>
                        
                        {/* Colonne Couleurs (swatches uniquement) */}
                        <td className={tableCellStyle} style={{ verticalAlign: 'top' }}>
                          <div className="flex flex-wrap gap-1">
                            {article.availableColors && article.availableColors.length > 0 ? (
                              article.availableColors.map((entry, index) => {
                                const { name, code } = parseColorEntry(entry);
                                return (
                                  <div
                                    key={index}
                                    className="w-4 h-4 rounded-full border border-gray-200"
                                    style={{ backgroundColor: code }}
                                    title={name || code}
                                  />
                                );
                              })
                            ) : (
                              <span className="text-gray-400 text-sm">-</span>
                            )}
                          </div>
                        </td>
                        
                        {/* Colonne Stock */}
                        <td className={tableCellStyle} style={{ verticalAlign: 'top' }}>
                          <span className="font-medium">{article.stockQuantity || 0}</span>
                        </td>
                        
                        {/* Colonne Statut */}
                        <td className={tableCellStyle} style={{ verticalAlign: 'top' }}>
                          <span 
                            className={
                              `px-3 py-1 text-xs font-medium rounded-full inline-flex items-center ${
                                article.stockQuantity === 0
                                  ? 'bg-red-100 text-red-800'
                                  : article.stockQuantity < 10
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                              }`
                            }>
                            {getStockStatus(article.stockQuantity)}
                          </span>
                        </td>
                        
                        {/* Colonne Prix */}
                        <td className={tableCellStyle} style={{ verticalAlign: 'top' }}>
                          <div className="font-medium">
                            {formatPrice(article.price)}
                          </div>
                        </td>
                        
                        {/* Colonne Promo */}
                        <td className={tableCellStyle} style={{ verticalAlign: 'top' }}>
                          {article.discount_percent ? (
                            <div>
                              <div className="text-red-600 font-medium">
                                {formatPrice(article.price - (article.price * article.discount_percent / 100))}
                              </div>
                              <div className="text-xs text-gray-500">
                                -{article.discount_percent}%
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400">--------</span>
                          )}
                        </td>
                        
                        {/* Colonne Date d'ajout */}
                        <td className={tableCellStyle} style={{ verticalAlign: 'top' }}>
                          <div className="text-sm">
                            {formatDate(article.dateAdded).split(' ')[0]}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatDate(article.dateAdded).split(' ').slice(1).join(' ')}
                          </div>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlesList;
