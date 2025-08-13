/**
 * ProductSheet.js
 * 
 * Description :
 * Composant d'administration pour afficher une fiche produit complète.
 * Affiche toutes les informations d'un produit de manière détaillée et organisée.
 */

import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiEdit, FiTrash2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useParams, useNavigate } from 'react-router-dom';
import { getArticleById, deleteArticle } from '../../services/articleService';
import getImagePath from '../../components/getImagePath';
import Loader from '../../components/Loader';

const ProductSheet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Charger les données du produit
  useEffect(() => {
    const loadProduct = async () => {
      try {
        console.log('Chargement du produit avec ID:', id);
        const data = await getArticleById(id);
        console.log('Données du produit chargées:', data);
        setProduct(data);
      } catch (err) {
        console.error('Erreur lors du chargement du produit:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  useEffect(() => {
    console.log('État actuel du produit:', { product, loading, currentImageIndex });
  }, [product, loading, currentImageIndex]);

  // Gestion de la navigation entre les images
  const nextImage = () => setCurrentImageIndex(prev => 
    prev < (product.secondaryImages?.length || 0) ? prev + 1 : prev
  );
  
  const prevImage = () => setCurrentImageIndex(prev => Math.max(0, prev - 1));

  // Récupérer l'image actuelle
  const getCurrentImage = () => {
    if (!product) return '';
    const images = [product.image, ...(product.secondaryImages || [])];
    return images[currentImageIndex] || '';
  };

  // Formater le prix
  const formatPrice = (price) => 
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })
      .format(price || 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  if (!product) {
    return <div className="p-4 text-red-600">Produit non trouvé</div>;
  }

  const hasDiscount = product.discount_price && product.discount_price < product.price;
  const stockStatus = product.stockQuantity === 0 
    ? 'bg-red-100 text-red-800' 
    : product.stockQuantity < 10 
      ? 'bg-yellow-100 text-yellow-800' 
      : 'bg-green-100 text-green-800';

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* En-tête */}
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/admin/articles')}
              className="mr-4 p-2 rounded-full hover:bg-gray-200"
              title="Retour à la liste"
            >
              <FiArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h2 className="text-xl font-semibold text-gray-900">
              {product.title || 'Sans titre'}
            </h2>
            <span className={`ml-4 px-3 py-1 text-xs font-medium rounded-full ${stockStatus}`}>
              {product.stockQuantity === 0 ? 'Rupture' : `${product.stockQuantity} en stock`}
            </span>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="px-4 py-5 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Galerie d'images */}
          <div className="relative h-full">
            <img
              src={getImagePath(getCurrentImage(), 'products')}
              alt={product.title || 'Produit'}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => e.target.src = '/assets/images/placeholder-product.png'}
            />
            <button
              onClick={prevImage}
              disabled={currentImageIndex === 0}
              className={`absolute left-2 bottom-2 p-2 rounded-full bg-white/80 text-gray-800 shadow-md ${currentImageIndex === 0 ? 'opacity-50' : 'hover:bg-white'}`}
            >
              <FiChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextImage}
              disabled={currentImageIndex === (product.secondaryImages?.length || 0)}
              className={`absolute right-2 bottom-2 p-2 rounded-full bg-white/80 text-gray-800 shadow-md ${currentImageIndex === (product.secondaryImages?.length || 0) ? 'opacity-50' : 'hover:bg-white'}`}
            >
              <FiChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Détails du produit */}
          <div>
            <h1 className="text-2xl font-bold text-left text-gray-900 mb-4">{product.title}</h1>

            {/* Métadonnées */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-left text-gray-900">Référence</h3>
                  <p className="mt-1 text-sm text-left text-gray-500">{product.id}</p>
                </div>

                {product.category && (
                  <div>
                    <h3 className="text-sm font-medium text-left text-gray-900">Catégorie</h3>
                    <p className="mt-1 text-sm text-left text-gray-600">{product.category}</p>
                  </div>
                )}

                {product.sexe && (
                  <div>
                    <h3 className="text-sm font-medium text-left text-gray-900">Genre</h3>
                    <p className="mt-1 text-sm text-left text-gray-600 capitalize">{product.sexe}</p>
                  </div>
                )}

                {product.collectionId && (
                  <div>
                    <h3 className="text-sm font-medium text-left text-gray-900">Collection</h3>
                    <p className="mt-1 text-sm text-left text-gray-600">{product.collectionId}</p>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-left text-gray-900">Prix</h3>
                  <div className="flex items-baseline mt-1">
                    <span className={`text-lg font-semibold ${hasDiscount ? 'text-red-600' : 'text-gray-900'}`}>
                      {hasDiscount ? formatPrice(product.discount_price) : formatPrice(product.price)}
                    </span>
                    {hasDiscount && (
                      <span className="ml-2 text-sm text-gray-500 line-through">
                        {formatPrice(product.price)}
                      </span>
                    )}
                    {hasDiscount && product.discount_percent && (
                      <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-800 rounded-full">
                        -{product.discount_percent}%
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-left text-gray-900">Stock</h3>
                  <div className="mt-1 flex items-center">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${stockStatus}`}>
                      {product.stockQuantity === 0 ? 'Rupture de stock' : `${product.stockQuantity} en stock`}
                    </span>
                  </div>
                </div>

                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-left text-gray-900">Tailles disponibles</h3>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {product.sizes.map((size, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {product.availableColors && product.availableColors.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-left text-gray-900">Couleurs disponibles</h3>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {product.availableColors.map((color, index) => (
                        <div key={index} className="flex flex-col items-center">
                          <div 
                            className="w-8 h-8 rounded-full border border-gray-200"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                          <span className="text-xs text-gray-500 mt-1">{color}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Date d'ajout */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Ajouté le {new Date(product.dateAdded).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>

            {/* Description */}
            {product.summary && (
              <div className="mt-6">
                <h3 className="text-sm text-left font-medium text-gray-900">Description</h3>
                <p className="mt-2 text-sm text-left text-gray-700">{product.summary}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pied de page */}
      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 border-t border-gray-200">
        <div className="flex justify-between">
          <button
            onClick={() => navigate('/admin/articles')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <FiArrowLeft className="-ml-1 mr-2 h-5 w-5" />
            Retour à la liste
          </button>
          <div className="space-x-3">
            <button
              onClick={() => navigate(`/admin/articles/${product.id}/modifier`)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-indigo-800 bg-black/10 hover:bg-black/20"
            >
              <FiEdit className="-ml-1 mr-2 h-5 w-5" />
              Modifier
            </button>
            <button
              onClick={() => deleteArticle(product.id )}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
            >
              <FiTrash2 className="-ml-1 mr-2 h-5 w-5" />
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSheet;
