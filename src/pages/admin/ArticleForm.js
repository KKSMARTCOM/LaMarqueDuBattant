/**
 * ArticleForm.js
 * 
 * Description:
 * Ce composant gère le formulaire d'ajout et de modification d'articles dans l'administration.
 * Il permet de créer de nouveaux articles ou de modifier des articles existants avec validation des champs.
 *
 * Fonctionnalités principales :
 * - Gestion des états du formulaire avec React Hooks
 * - Validation des champs obligatoires
 * - Téléchargement et prévisualisation d'images
 * - Gestion des catégories d'articles
 * - Soumission du formulaire avec gestion des erreurs
 *
 * Structure des données :
 * - Utilise un état local pour stocker les données du formulaire
 * - Gère les aperçus d'images téléchargées
 * - Valide les données avant soumission
 *
 * Utilisation :
 * - Pour créer un nouvel article : <ArticleForm />
 * - Pour modifier un article existant : <ArticleForm id="123" />
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiCheck, FiX, FiImage, FiPlus } from 'react-icons/fi';
import { 
  getArticleById, 
  getNextArticleId,
  
} from '../../services/articleService';
import { getFilterValues } from '../../services/filterService';
import getImagePath from '../../components/getImagePath';
import Loader from '../../components/Loader';
import useChangesCart from '../../hooks/useChangesCart';

// Les catégories/tailles/etc seront chargées via filterService

const ArticleForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { addChange } = useChangesCart();

  // Dictionnaire des couleurs (nom -> code hex). Ajoutez ici d'autres couleurs au besoin.
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
    'violet': '#8A2BE2',
    'orange': '#FFA500',
  };

  // Normalise un nom (casse/espaces) pour clé de map
  const norm = (s = '') => s.toString().trim().toLowerCase();

  // Récupère code hex pour un nom; privilégie les codes issus de filters.couleurs
  const nameToCode = (name) => {
    const key = norm(name);
    // D'abord chercher dans filters.couleurs si c'est une liste d'objets
    if (Array.isArray(filters.couleurs)) {
      const found = filters.couleurs.find((c) => {
        if (typeof c === 'string') return norm(c) === key;
        if (c && typeof c === 'object' && c.name) return norm(c.name) === key;
        return false;
      });
      if (found) {
        if (typeof found === 'string') return COLOR_MAP[key] || found;
        if (found.code) return found.code;
      }
    }
    // Sinon fallback local
    return COLOR_MAP[key] || name;
  };

  // Convertit un élément du modèle (string ou objet) en nom humain
  const colorEntryToName = (entry) => {
    if (!entry) return '';
    if (typeof entry === 'string') {
      if (entry.includes(':')) return entry.split(':')[0].trim();
      return entry;
    }
    if (typeof entry === 'object') {
      return entry.name || entry.label || '';
    }
    return '';
  };

  // Convertit un nom en "name:code"
  const nameToNameCode = (name) => {
    const code = nameToCode(name);
    return `${name}:${code}`;
  };
  
  // Met en Title Case pour correspondre aux libellés des boutons (Noir, Blanc, ...)
  const toTitleCase = (s = '') => s
    .toString()
    .trim()
    .toLowerCase()
    .replace(/(^|\s|-|_)[a-zà-ÿ]/g, (m) => m.toUpperCase());
  
  // États du composant
  const [loading, setLoading] = useState(true);
  // Plus de modal de notification ici; le panier de modifications gère l'affichage.
  // Options dynamiques chargées depuis filterService
  const [filters, setFilters] = useState({
    categories: [],
    tailles: [],
    sexe: [],
    collections: [], // [{id,name}]
    couleurs: [],    // [{name,code}]
  });
  
  // État du formulaire
  const [formData, setFormData] = useState({
    id: 0,
    title: '',
    summary: '',
    price: '',
    discount_price: '',
    discount_percent: 0,
    category: '',
    sexe: 'Homme',
    collection: '',
    stockQuantity: 0,
    image: '',
    secondaryImages: [],
    sizes: [],
    availableColors: [],
    status: 'draft',
    dateAdded: new Date().toISOString(),
    dateUpdated: new Date().toISOString(),
    collectionId: null
  });

  const [imagePreview, setImagePreview] = useState('');
  const [secondaryImagePreviews, setSecondaryImagePreviews] = useState([]);
  
  // Initialiser le formulaire avec le prochain ID disponible ou charger l'article existant
  useEffect(() => {
    const initializeForm = async () => {
      try {
        setLoading(true);
        // Charger les filtres en parallèle
        const [categories, tailles, sexe, collections, couleurs] = await Promise.all([
          getFilterValues('categories'),
          getFilterValues('tailles'),
          getFilterValues('sexe'),
          getFilterValues('collections'),
          getFilterValues('couleurs'),
        ]);
        setFilters({ categories, tailles, sexe, collections, couleurs });
        
        if (isEditing) {
          // Mode édition : charger l'article existant
          const article = await getArticleById(id);
          if (article) {
            setFormData({
              id: article.id,
              title: article.title || '',
              summary: article.summary || '',
              price: article.price || '',
              discount_price: article.discount_price || '',
              discount_percent: article.discount_percent || 0,
              category: article.category || '',
              sexe: article.sexe || 'Homme',
              collection: article.collection || '',
              stockQuantity: article.stockQuantity || 0,
              image: article.image || '',
              secondaryImages: article.secondaryImages || [],
              sizes: article.sizes || [],
              availableColors: Array.isArray(article.availableColors)
                ? article.availableColors.map((e) => toTitleCase(colorEntryToName(e)))
                : [],
              status: article.status || 'draft',
              dateAdded: article.dateAdded || new Date().toISOString(),
              dateUpdated: article.dateUpdated || new Date().toISOString(),
              collectionId: article.collectionId || null
            });
            
            // Mettre à jour les aperçus d'images
            if (article.image) {
              setImagePreview(getImagePath(article.image, 'products'));
            }
            if (article.secondaryImages && article.secondaryImages.length > 0) {
              setSecondaryImagePreviews(
                article.secondaryImages.map(img => getImagePath(img, 'products'))
              );
            }
          }
        } else {
          // Mode création : initialiser avec le prochain ID
          const nextId = await getNextArticleId();
          setFormData(prev => ({
            ...prev,
            id: nextId,
            dateAdded: new Date().toISOString(),
            dateUpdated: new Date().toISOString()
          }));
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation du formulaire:', error);
        
      } finally {
        setLoading(false);
      }
    };
    
    initializeForm();
  }, [id, isEditing]);

  // Gestion des changements des champs
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      // Gestion de l'image principale
      if (name === 'image' && files[0]) {
        const file = files[0];
        const fileName = file.name; // Récupère le nom du fichier avec extension
        
        setFormData(prev => ({
          ...prev,
          [name]: fileName // Stocke uniquement le nom du fichier
        }));
        
        // Créer un aperçu de l'image
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else if (name === 'secondaryImages' && files.length > 0) {
        // Récupérer uniquement les noms des fichiers
        const newImageNames = Array.from(files).map(file => file.name);
        
        setFormData(prev => ({
          ...prev,
          secondaryImages: [...prev.secondaryImages, ...newImageNames]
        }));
        
        // Créer des aperçus pour les nouvelles images
        Array.from(files).forEach(file => {
          const reader = new FileReader();
          reader.onload = () => {
            setSecondaryImagePreviews(prev => [...prev, reader.result]);
          };
          reader.readAsDataURL(file);
        });
      }
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      if (name === 'collectionId') {
        const idNum = value === '' ? null : Number(value);
        // Trouver le libellé pour stocker aussi formData.collection (optionnel)
        const col = Array.isArray(filters.collections)
          ? filters.collections.find(c => c && typeof c === 'object' && Number(c.id) === idNum)
          : null;
        setFormData(prev => ({
          ...prev,
          collectionId: idNum,
          collection: col?.name || ''
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    }
  };

  // Gestion de la sélection des tailles
  const handleSizeToggle = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  // Gestion de la sélection des couleurs
  const handleColorToggle = (color) => {
    setFormData(prev => ({
      ...prev,
      availableColors: prev.availableColors.includes(color)
        ? prev.availableColors.filter(c => c !== color)
        : [...prev.availableColors, color]
    }));
  };

  // Supprimer une image secondaire
  const removeSecondaryImage = (index) => {
    // Créer de nouveaux tableaux sans l'élément à supprimer
    const newSecondaryImages = [...formData.secondaryImages];
    const newImagePreviews = [...secondaryImagePreviews];
    
    // Vérifier si l'index est valide
    if (index >= 0 && index < newSecondaryImages.length) {
      // Supprimer l'image à l'index spécifié
      newSecondaryImages.splice(index, 1);
      
      // Supprimer également l'aperçu correspondant s'il existe
      if (index < newImagePreviews.length) {
        newImagePreviews.splice(index, 1);
      }
      
      // Mettre à jour les états
      setFormData(prev => ({
        ...prev,
        secondaryImages: newSecondaryImages
      }));
      
      setSecondaryImagePreviews(newImagePreviews);
      
      // Mettre à jour l'input file pour permettre de réajouter des images
      const input = document.getElementById('secondary-images');
      if (input) {
        input.value = '';
      }
    }
  };

  // Suppression des états/effets liés aux notifications locales.

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Validation des champs obligatoires
    if (!formData.title || !formData.category || !formData.price) {
      // Les attributs required gèrent déjà la validation visuelle côté navigateur.
      return false;
    }
    
    try {
      setLoading(true);

      // Préparer le payload de l'article avec dates cohérentes
      const now = new Date().toISOString();
      const payload = {
        ...formData,
        // Transformer availableColors (noms) en liste de "nom:code"
        availableColors: Array.isArray(formData.availableColors)
          ? formData.availableColors
              .filter(Boolean)
              .map((name) => nameToNameCode(name))
          : [],
        id: isEditing ? (typeof id === 'string' ? parseInt(id, 10) : id) : formData.id,
        dateAdded: formData.dateAdded || now,
        dateUpdated: now,
      };

      if (isEditing) {
        // On pousse une mise à jour dans le panier
        addChange({ type: 'update', targetId: payload.id, payload, resource: 'article', source: 'ArticleForm' });
      } else {
        // On pousse une création dans le panier
        addChange({ type: 'create', payload, resource: 'article', source: 'ArticleForm' });
      }

      return true;

    } catch (submitError) {
      console.error('Erreur lors de la soumission du formulaire:', submitError);
      // Log de l'erreur sans modal locale
      console.error(submitError);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Calcul automatique du prix réduit en fonction du pourcentage de réduction
  useEffect(() => {
    if (formData.price && formData.discount_percent) {
      const discountAmount = (formData.price * formData.discount_percent) / 100;
      const discountedPrice = formData.price - discountAmount;
      
      setFormData(prev => ({
        ...prev,
        discount_price: discountedPrice.toFixed(2)
      }));
    } else if (formData.discount_percent === 0 || !formData.discount_percent) {
      setFormData(prev => ({
        ...prev,
        discount_price: ''
      }));
    }
  }, [formData.price, formData.discount_percent]);

  // Afficher le loader pendant le chargement
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full">
      {/* Pas de NotificationModal ici; le panier de modifications s'en charge. */}
      
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* En-tête */}
        <div className="pb-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl text-left font-bold text-gray-800">
              {isEditing ? 'Modifier un article' : 'Ajouter un nouvel article'}
            </h3>
            <p className="mt-1 text-left text-gray-600">
              {isEditing 
                ? 'Modifiez les détails de cet article.'
                : 'Remplissez les informations pour ajouter un nouvel article à votre catalogue.'}
            </p>
          </div>
          <div>
            <Link
              to="/admin/articles"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black/30"
            >
              <FiArrowLeft className="mr-2" /> Retour à la liste
            </Link>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleSubmit(e);
        }}
        onKeyDown={(e) => {
          // Empêcher la soumission du formulaire avec la touche Entrée
          if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
          }
        }}
        className="mt-8 space-y-8"
      >
        <div className="bg-white shadow-sm px-8 py-8 rounded-xl border border-gray-100">
          {/* Informations de base */}
          <h4 className="text-xl text-left font-semibold text-gray-900 mb-8 pb-2 border-b border-gray-100">Informations de base</h4>
          <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-6">
            {/* Titre */}
            <div className="sm:col-span-6 mb-2">
              <label htmlFor="title" className="block text-left text-sm font-medium text-gray-700 mb-1.5">
                Titre de l'article <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-2 focus:ring-black focus:border-black block w-full sm:text-sm border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900 placeholder-gray-400 transition duration-150 ease-in-out"
                  placeholder="Ex: T-shirt en coton bio"
                  required
                />
              </div>
            </div>

            {/* ID - Champ non modifiable */}
            <div className="sm:col-span-2 mb-2">
              <label htmlFor="article-id" className="block text-left text-sm font-medium text-gray-700 mb-1.5">
                ID de l'article
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="article-id"
                  name="article-id"
                  value={formData.id || ''}
                  readOnly
                  disabled
                  className="shadow-sm block w-full sm:text-sm border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Catégorie */}
            <div className="sm:col-span-4 mb-2 w-full">
              <label htmlFor="category" className="block text-left text-sm font-medium text-gray-700 mb-1.5">
                Catégorie <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-26 py-3 text-sm border border-gray-300 rounded-lg bg-white text-gray-900"
                required
              >
                <option value="">Sélectionnez une catégorie</option>
                {(filters.categories.length ? filters.categories : ['Tshirt','Pantalon','Veste','Accessoire']).map(cat => (
                  <option key={cat} value={cat} className="py-2">{cat}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div className="sm:col-span-6 mb-2">
              <label htmlFor="summary" className="block text-left text-sm font-medium text-gray-700 mb-1.5">
                Description courte <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <textarea
                  id="summary"
                  name="summary"
                  rows={4}
                  value={formData.summary}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-2 focus:ring-black focus:border-black block w-full sm:text-sm border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900 placeholder-gray-400 transition duration-150 ease-in-out"
                  placeholder="Décrivez brièvement l'article..."
                  required
                />
              </div>
              <p className="mt-2 text-left text-sm text-gray-300">
                Une brève description de l'article qui sera affichée dans les listes.
              </p>
            </div>

            {/* Collection */}
            <div className="sm:col-span-4">
              <label htmlFor="collection" className="block text-left text-sm font-medium text-gray-700 mb-1.5">
                Collection
              </label>
              <div className="mt-1">
                <select
                  name="collectionId"
                  id="collection"
                  value={formData.collectionId ?? ''}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-2 focus:ring-black focus:border-black block w-full sm:text-sm border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900 placeholder-gray-400 transition duration-150 ease-in-out"
                >
                  <option value="">Sélectionnez une collection</option>
                  {(Array.isArray(filters.collections) ? filters.collections : []).map((c) => (
                    <option key={c.id} value={c.id}>{c.id} - {c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sexe */}
            <div className="sm:col-span-2">
              <label htmlFor="sexe" className="block text-left text-sm font-medium text-gray-700 mb-1.5">
                Sexe
              </label>
              <select
                id="sexe"
                name="sexe"
                value={formData.sexe}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-black bg-white text-gray-900"
              >
                {(filters.sexe.length ? filters.sexe : ['Homme','Femme','Unisexe']).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Prix et Stock */}
        <div className="bg-white shadow-sm px-8 py-8 rounded-xl border border-gray-100">
          <h4 className="text-xl text-left font-semibold text-gray-900 mb-8 pb-2 border-b border-gray-100">Prix et Stock</h4>
          
          <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-6">
            {/* Prix de base */}
            <div className="sm:col-span-2">
              <label htmlFor="price" className="block text-left text-sm font-medium text-gray-700 mb-1.5">
                Prix de base (€) <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">€</span>
                </div>
                <input
                  type="number"
                  name="price"
                  id="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            {/* Pourcentage de réduction */}
            <div className="sm:col-span-2">
              <label htmlFor="discount_percent" className="block text-left text-sm font-medium text-gray-700 mb-1.5">
                Réduction (%)
              </label>
              <div className="mt-1 relative rounded-lg shadow-sm">
                <select
                  name="discount_percent"
                  id="discount_percent"
                  value={formData.discount_percent || 0}
                  onChange={handleChange}
                  className="focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-12 sm:text-sm border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900"
                >
                  {[0, 10, 20, 30, 40, 50].map(percent => (
                    <option key={percent} value={percent}>
                      {percent}%{percent > 0 ? ` (-${((formData.price * percent) / 100).toFixed(2)}€)` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Prix soldé */}
            <div className="sm:col-span-2">
              <label htmlFor="discount_price" className="block text-left text-sm font-medium text-gray-700 mb-1.5">
                Prix soldé (€) <span className="text-gray-400 text-xs">optionnel</span>
              </label>
              <div className="mt-1 relative rounded-lg shadow-sm">
                
                <input
                  type="text"
                  name="discount_price"
                  id="discount_price"
                  value={(String(formData.discount_price) + "  FCFA") || '----'} 
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="shadow-sm block pl-2 w-full sm:text-sm border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-green-500 cursor-not-allowed"
                  placeholder="0.00"
                  readOnly={true}
                />   
              </div>
            </div>

            

            {/* Stock */}
            <div className="sm:col-span-2">
              <label htmlFor="stockQuantity" className="block text-left text-sm font-medium text-gray-700 mb-1.5">
                Quantité en stock <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  name="stockQuantity"
                  id="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  min="0"
                  className="shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-900"
                  required
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Mettez 0 pour "Rupture de stock"
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Tailles et Couleurs */}
        <div className="bg-white shadow-sm px-8 py-8 rounded-xl border border-gray-100">
          <h4 className="text-xl text-left font-semibold text-gray-900 mb-8 pb-2 border-b border-gray-100">
            Tailles et Couleurs
          </h4>
          
          <div className="grid grid-cols-1 gap-y-8 gap-x-8 sm:grid-cols-6">
            {/* Tailles disponibles */}
            <div className="sm:col-span-6">
              <label className="block text-left text-sm font-medium text-gray-700 mb-3">
                Tailles disponibles <span className="text-red-500">*</span>
                <span className="text-xs font-normal text-gray-500 ml-2">(Sélectionnez au moins une taille)</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {(filters.tailles.length ? filters.tailles : ['XS', 'S', 'M', 'L', 'XL', 'XXL']).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeToggle(size)}
                    className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      formData.sizes.includes(size)
                        ? 'bg-black text-white border border-black shadow-md hover:bg-black/85'
                        : 'bg-white text-gray-700 border-2 border-black/20 hover:border-black/40 hover:bg-black/20'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {formData.sizes.length === 0 && (
                <p className="mt-2 text-left text-sm text-red-500">Veuillez sélectionner au moins une taille</p>
              )}
            </div>

            {/* Couleurs disponibles */}
            <div className="sm:col-span-6">
              <label className="block text-left text-sm font-medium text-gray-700 mb-3">
                Couleurs disponibles
                <span className="text-xs font-normal text-gray-500 ml-2">(Sélectionnez une ou plusieurs couleurs)</span>
              </label>
              <div className="flex flex-wrap gap-4">
                {(
                  Array.isArray(filters.couleurs) && filters.couleurs.length
                    ? filters.couleurs.map(c => (typeof c === 'string' ? { name: c, code: nameToCode(c) } : c))
                    : ['noir','blanc','bleu','rouge','vert','jaune','rose','gris'].map(n => ({ name: n, code: nameToCode(n) }))
                ).map(({ name, code }) => {
                  const label = toTitleCase(name);
                  const isSelected = formData.availableColors.includes(label);
                  const needsDarkCheck = ['#FFFFFF', 'white', 'blanc'].includes(String(code));
                  return (
                    <div key={label} className="flex flex-col items-center group">
                      <button
                        type="button"
                        onClick={() => handleColorToggle(label)}
                        className={`w-12 h-12 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                          isSelected 
                            ? 'border-black ring-2 ring-offset-2 ring-black scale-110' 
                            : 'border-gray-200 hover:border-black/40 hover:scale-105'
                        }`}
                        style={{ 
                          backgroundColor: code,
                          boxShadow: isSelected ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none'
                        }}
                        title={label}
                      >
                        {isSelected && (
                          <FiCheck className={`${needsDarkCheck ? 'text-black' : 'text-white'} text-lg drop-shadow-md`} />
                        )}
                      </button>
                      <span className={`mt-2 text-xs font-medium ${
                        isSelected ? 'text-indigo-700' : 'text-gray-600'
                      }`}>
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Images */}
        <div className="bg-white shadow-sm px-6 py-6 rounded-xl border border-gray-100">
          <h4 className="text-xl text-left font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100">
            Gestion des images
          </h4>
          
          <div className="space-y-8">
            {/* Image principale */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Image principale <span className="text-red-500">*</span>
                </label>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('');
                      setFormData(prev => ({ ...prev, image: '' }));
                    }}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Supprimer
                  </button>
                )}
              </div>
              
              <div className="mt-1">
                {imagePreview ? (
                  <div className="relative group w-full max-w-md mx-auto">
                    <div className=" pt-[70%] bg-gray-100 rounded-lg ">
                      <img 
                        src={imagePreview} 
                        alt="Aperçu de l'image principale" 
                        className="absolute inset-0 w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label className="cursor-pointer px-4 py-2 bg-white/90 text-gray-800 rounded-md text-sm font-medium hover:bg-white transition-colors">
                          Changer
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files[0]) {
                                const file = e.target.files[0];
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setImagePreview(reader.result);
                                };
                                reader.readAsDataURL(file);
                                setFormData(prev => ({ ...prev, image: file.name }));
                              }
                            }}
                          />
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview('');
                          setFormData(prev => ({ ...prev, image: '' }));
                        }}
                        className="absolute -top-2 -right-2 bg-red-700 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        aria-label="Supprimer l'image"
                      >
                        <FiX className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-black/30 transition-colors">
                    <div className="text-center">
                      <FiImage className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                      <div className="flex flex-col items-center text-sm text-gray-600">
                        <label
                          htmlFor="main-image"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                        >
                          <span>Choisir une image</span>
                          <input
                            id="main-image"
                            name="image"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleChange}
                            required={!isEditing}
                          />
                        </label>
                        <p className="mt-1 text-xs text-gray-500">
                          ou glisser-déposer une image
                        </p>
                        <p className="mt-2 text-xs text-gray-400">
                          Format recommandé : JPG, PNG (max 10MB)
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Galerie d'images secondaires */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Galerie d'images
                  <span className="ml-1 text-xs font-normal text-gray-500">
                    (optionnel, max 5 images)
                  </span>
                </label>
                {secondaryImagePreviews.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setSecondaryImagePreviews([]);
                      setFormData(prev => ({ ...prev, secondaryImages: [] }));
                    }}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Tout supprimer
                  </button>
                )}
              </div>
              
              <div className="mt-1">
                {secondaryImagePreviews.length > 0 ? (
                  <div className="w-full">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {secondaryImagePreviews.map((preview, index) => (
                        <div key={index} className="relative group aspect-square">
                          <div className="relative w-full h-full bg-gray-50 rounded-lg ">
                            <img
                              src={preview}
                              alt={`Aperçu ${index + 1}`}
                              className="w-full h-full object-contain "
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeSecondaryImage(index);
                              }}
                              className="absolute -top-2 -right-2 bg-red-700 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                              aria-label="Supprimer l'image"
                            >
                              <FiX className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      {secondaryImagePreviews.length < 5 && (
                        <label
                          htmlFor="secondary-images"
                          className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-lg hover:border-black/30 cursor-pointer transition-colors bg-gray-50"
                        >
                          <FiPlus className="h-6 w-6 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600">Ajouter une image</span>
                          <span className="text-xs text-gray-400 mt-1">
                            {5 - secondaryImagePreviews.length} restantes
                          </span>
                          <input
                            id="secondary-images"
                            name="secondaryImages"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            multiple
                            onChange={handleChange}
                            max={5 - secondaryImagePreviews.length}
                          />
                        </label>
                      )}
                    </div>
                    {secondaryImagePreviews.length < 5 && (
                      <p className="mt-3 text-xs text-center text-gray-500">
                        Vous pouvez ajouter jusqu'à {5 - secondaryImagePreviews.length} images supplémentaires
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-center px-6 pt-8 pb-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-black/30 transition-colors">
                    <div className="text-center">
                      <FiImage className="mx-auto h-10 w-10 text-gray-400 mb-3" />
                      <div className="flex flex-col items-center text-sm text-gray-600">
                        <label
                          htmlFor="secondary-images"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                        >
                          <span>Choisir des images</span>
                          <input
                            id="secondary-images"
                            name="secondaryImages"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            multiple
                            onChange={handleChange}
                            max={5}
                          />
                        </label>
                        <p className="mt-1 text-xs text-gray-500">
                          ou glisser-déposer jusqu'à 5 images
                        </p>
                        <p className="mt-2 text-xs text-gray-400">
                          Formats acceptés : JPG, PNG (max 10MB par image)
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Date de dernière mise à jour */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-right">
            {isEditing ? (
              <span>Dernière mise à jour: {new Date(formData.dateAdded || new Date()).toLocaleString('fr-FR')}</span>
            ) : (
              <span>Date de création: {new Date().toLocaleString('fr-FR')}</span>
            )}
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/admin/articles')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none "
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-black/80 "
          >
            {isEditing ? 'Mettre à jour' : 'Publier l\'article'}
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default ArticleForm;
