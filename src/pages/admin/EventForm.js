/**
 * EventForm.js
 *
 * Formulaire de création/édition d'un événement.
 * - En création: calcule un nouvel ID via getNextEventId()
 * - En édition: charge les données existantes (via la liste passée ou un fetch simple si nécessaire)
 * - Soumission: pousse la modification dans le panier de changements avec resource:'event'
 */

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getAllEvents, getNextEventId } from '../../services/eventService';
import useChangesCart from '../../hooks/useChangesCart';
import Loader from '../../components/Loader';
import getImagePath from '../../components/getImagePath';
import { FiPlus } from 'react-icons/fi';

// Modèle de données par défaut d'un événement (utilisé pour l'initialisation et les resets)
const emptyForm = {
  id: '',
  titre: '',
  type: '',
  date: '',
  lieu: '',
  image: '',
  description: '',
  fullDescription: '',
  cta: 'Voir événement',
  placesLeft: '',
  details: '',
  schedule: '',
  price: '',
  registrationLink: '',
  contributors: [],
  gallery: [],
  quote: '',
  quoteAuthor: '',
};

const EventForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = useMemo(() => !!id, [id]);
  const { addChange, openModal } = useChangesCart();

  // État principal du formulaire (toutes les propriétés de l'événement)
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [imagePreview, setImagePreview] = useState('');
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [imageError, setImageError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  // Chargement initial: en édition on hydrate depuis les données, sinon on récupère le prochain ID
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        if (isEditing) {
          const events = await getAllEvents();
          const eid = typeof id === 'string' ? parseInt(id, 10) : id;
          const ev = events.find(e => e.id === eid);
          if (!ev) throw new Error("Événement non trouvé");
          if (mounted) setFormData({ ...emptyForm, ...ev });
        } else {
          const nextId = await getNextEventId();
          if (mounted) setFormData(prev => ({ ...prev, id: nextId }));
        }
      } catch (e) {
        console.error(e);
        if (mounted) setError(e.message || 'Erreur lors du chargement du formulaire');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id, isEditing]);

  // Mise à jour des aperçus d'images
  useEffect(() => {
    // Image principale
    if (formData.image) {
      setImagePreview(getImagePath(formData.image, 'events'));
    } else {
      setImagePreview('');
    }
    
    // Galerie d'images
    if (formData.gallery && formData.gallery.length > 0) {
      setGalleryPreviews(
        formData.gallery.map(item => ({
          ...item,
          preview: item.image ? getImagePath(item.image, 'events') : ''
        }))
      );
    } else {
      setGalleryPreviews([]);
    }
  }, [formData.image, formData.gallery]);

  // Handle image validation
  const validateImageFile = (file) => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return 'Type de fichier non pris en charge. Utilisez JPG, PNG ou WebP.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'La taille du fichier ne doit pas dépasser 10MB.';
    }
    return '';
  };

  // Handle image upload with validation
  const handleImageUpload = (file, callback) => {
    const error = validateImageFile(file);
    if (error) {
      setImageError(error);
      return null;
    }
    
    setImageError('');
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result);
    };
    reader.readAsDataURL(file);
    return file.name;
  };

  // Handle drag and drop events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e, callback) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      const fileName = handleImageUpload(file, (preview) => {
        callback(preview, file);
      });
      if (fileName) {
        setFormData(prev => ({
          ...prev,
          image: fileName
        }));
      }
    }
  };

  // Gestion générique des changements de champs du formulaire (inputs/textarea/file)
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file' && files[0]) {
      if (name === 'image') {
        const file = files[0];
        const fileName = handleImageUpload(file, (preview) => {
          setImagePreview(preview);
        });
        
        if (fileName) {
          setFormData(prev => ({
            ...prev,
            [name]: fileName
          }));
        }
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Gestion du tableau contributors (ajout/mise à jour/suppression d'un intervenant)
  const addContributor = () => {
    setFormData(prev => ({
      ...prev,
      contributors: [...(prev.contributors || []), { name: '', role: '', avatar: '' }]
    }));
  };

  const updateContributor = (index, field, value) => {
    setFormData(prev => {
      const arr = [...(prev.contributors || [])];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, contributors: arr };
    });
  };

  const removeContributor = (index) => {
    setFormData(prev => {
      const arr = [...(prev.contributors || [])];
      arr.splice(index, 1);
      return { ...prev, contributors: arr };
    });
  };

  // Gestion du tableau gallery (ajout/mise à jour/suppression d'une image avec légende)
  const addGalleryItem = () => {
    setFormData(prev => ({
      ...prev,
      gallery: [...(prev.gallery || []), { image: '', caption: '' }]
    }));
    
    setGalleryPreviews(prev => [...prev, { preview: '', error: '' }]);
  };

  const updateGalleryItem = (index, field, value, file) => {
    if (file) {
      const error = validateImageFile(file);
      if (error) {
        setGalleryPreviews(prev => {
          const newPreviews = [...prev];
          newPreviews[index] = { 
            ...newPreviews[index], 
            error 
          };
          return newPreviews;
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setGalleryPreviews(prev => {
          const newPreviews = [...prev];
          newPreviews[index] = { 
            ...newPreviews[index], 
            preview: reader.result,
            error: ''
          };
          return newPreviews;
        });

        setFormData(prev => {
          const arr = [...(prev.gallery || [])];
          arr[index] = { 
            ...arr[index], 
            [field]: file.name 
          };
          return { ...prev, gallery: arr };
        });
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => {
        const arr = [...(prev.gallery || [])];
        arr[index] = { 
          ...arr[index], 
          [field]: value 
        };
        return { ...prev, gallery: arr };
      });
    }
  };

  const removeGalleryItem = (index) => {
    setFormData(prev => {
      const arr = [...(prev.gallery || [])];
      arr.splice(index, 1);
      return { ...prev, gallery: arr };
    });
    
    setGalleryPreviews(prev => {
      const newPreviews = [...prev];
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const handleGalleryDrop = (e, index) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      updateGalleryItem(index, 'image', null, file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validations basiques côté client avant ajout au panier
      const errs = [];
      if (formData.date) {
        const t = Date.parse(formData.date);
        if (Number.isNaN(t)) errs.push('Date invalide (format attendu: AAAA-MM-JJ)');
      }
      if (formData.registrationLink) {
        const u = String(formData.registrationLink).trim();
        if (!/^https?:\/\//i.test(u)) errs.push("Lien d'inscription invalide (doit commencer par http(s)://)");
      }
      if (formData.placesLeft !== '' && (Number.isNaN(Number(formData.placesLeft)) || Number(formData.placesLeft) < 0)) {
        errs.push('Places restantes doit être un nombre positif');
      }
      if (errs.length > 0) {
        setValidationErrors(errs);
        return;
      }
      setValidationErrors([]);

      // Préparation du payload normalisé (dates et coercitions)
      const now = new Date().toISOString();
      const payload = {
        ...formData,
        id: isEditing ? (typeof id === 'string' ? parseInt(id, 10) : id) : formData.id,
        dateAdded: formData.dateAdded || now,
        dateUpdated: now,
        // coercitions légères
        placesLeft: formData.placesLeft === '' ? '' : Number(formData.placesLeft),
      };

      if (isEditing) {
        // Mise à jour: on pousse une entrée 'update' dans le panier de modifications
        addChange({ type: 'update', targetId: payload.id, payload, resource: 'event', source: 'EventForm' });
      } else {
        // Création: on pousse une entrée 'create' dans le panier de modifications
        addChange({ type: 'create', payload, resource: 'event', source: 'EventForm' });
      }

      openModal();
      navigate('/admin/events');
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la soumission");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader />
      </div>
    );
  }
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="space-y-6 h-full">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="pb-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl text-left font-bold text-gray-800">{isEditing ? 'Modifier un événement' : 'Ajouter un nouvel événement'}</h1>
              <p className="mt-1 text-left text-gray-600">
                {isEditing ? 'Modifiez les détails de cet événement.' : 'Remplissez les informations pour ajouter un nouvel événement.'}
              </p>
            </div>
            <div>
              <Link to="/admin/events" className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50">
                Retour à la liste
              </Link>
            </div>
          </div>
        </div>
      </div>
      {validationErrors.length > 0 && (
        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 text-sm text-red-700 rounded">
          <ul className="list-disc list-inside">
            {validationErrors.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      <form 
        onSubmit={handleSubmit} 
        onKeyDown={(e) => { if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') e.preventDefault(); }}
        className="mx-auto px-4 sm:px-6 lg:px-8 mt-2 space-y-8"
      >
        {/* Section: Informations de base */}
        <div className="bg-white shadow-sm px-8 py-8 rounded-xl border border-gray-100">
          <h4 className="text-xl font-semibold text-left text-gray-900 mb-6 pb-2 border-b border-gray-100">Informations de base</h4>
          <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-6">
            <div>
              <label className="block text-left text-sm font-medium text-gray-700 mb-1.5">ID</label>
              <input name="id" value={formData.id} disabled className="shadow-sm block w-full sm:text-sm border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 text-gray-500 cursor-not-allowed" />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-left text-sm font-medium text-gray-700 mb-1.5">Titre <span className="text-red-500">*</span></label>
              <input name="titre" value={formData.titre} onChange={handleChange} className="shadow-sm focus:ring-2 focus:ring-black focus:border-black block w-full sm:text-sm border border-gray-300 rounded-lg px-4 py-3" required />
            </div>
            <div className="sm:col-span-1">
              <label className="block text-left text-sm font-medium text-gray-700 mb-1.5">Type</label>
              <input name="type" value={formData.type} onChange={handleChange} className="shadow-sm block w-full sm:text-sm border border-gray-300 rounded-lg px-4 py-3" />
            </div>
            <div className="sm:col-span-1">
              <label className="block text-left text-sm font-medium text-gray-700 mb-1.5">Date</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} className="shadow-sm block w-full sm:text-sm border border-gray-300 rounded-lg px-4 py-3" />
            </div>
            <div className="sm:col-span-6">
              <label className="block text-left text-sm font-medium text-gray-700 mb-1.5">Lieu</label>
              <input name="lieu" value={formData.lieu} onChange={handleChange} className="shadow-sm block w-full sm:text-sm border border-gray-300 rounded-lg px-4 py-3" />
            </div>
          </div>
        </div>

        {/* Section: Détails & Programme */}
        <div className="bg-white shadow-sm px-8 py-8 rounded-xl border border-gray-100">
          <h4 className="text-xl font-semibold text-left text-gray-900 mb-6 pb-2 border-b border-gray-100">Détails & Programme</h4>
          <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <label className="block text-left text-sm font-medium text-gray-700 mb-1.5">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="shadow-sm focus:ring-2 focus:ring-black focus:border-black block w-full sm:text-sm border border-gray-300 rounded-lg px-4 py-3" rows={3} />
            </div>
            <div className="sm:col-span-6">
              <label className="block text-left text-sm font-medium text-gray-700 mb-1.5">Description complète</label>
              <textarea name="fullDescription" value={formData.fullDescription} onChange={handleChange} className="shadow-sm block w-full sm:text-sm border border-gray-300 rounded-lg px-4 py-3" rows={5} />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-left text-sm font-medium text-gray-700 mb-1.5">Détails (texte court)</label>
              <textarea name="details" value={formData.details} onChange={handleChange} className="shadow-sm block w-full sm:text-sm border border-gray-300 rounded-lg px-4 py-3" rows={3} />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-left text-sm font-medium text-gray-700 mb-1.5">Programme / Horaires</label>
              <textarea name="schedule" value={formData.schedule} onChange={handleChange} className="shadow-sm block w-full sm:text-sm border border-gray-300 rounded-lg px-4 py-3" rows={3} placeholder={"19h00 : Ouverture\n20h30 : Début\n23h00 : Fin"} />
            </div>
          </div>
        </div>

        {/* Section: Tarification & Capacités */}
        <div className="bg-white shadow-sm px-8 py-8 rounded-xl border border-gray-100">
          <h4 className="text-xl text-left font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100">Tarification & Capacités</h4>
          <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <label className="block text-left text-sm font-medium text-gray-700 mb-1.5">CTA</label>
              <input name="cta" value={formData.cta} onChange={handleChange} className="shadow-sm block w-full sm:text-sm border border-gray-300 rounded-lg px-4 py-3" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-left text-sm font-medium text-gray-700 mb-1.5">Prix</label>
              <input name="price" value={formData.price} onChange={handleChange} className="shadow-sm block w-full sm:text-sm border border-gray-300 rounded-lg px-4 py-3" placeholder="Ex: À partir de 45€" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-left text-sm font-medium text-gray-700 mb-1.5">Places restantes</label>
              <input type="number" name="placesLeft" value={formData.placesLeft} onChange={handleChange} className="shadow-sm block w-full sm:text-sm border border-gray-300 rounded-lg px-4 py-3" />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-left text-sm font-medium text-gray-700 mb-1.5">Lien d'inscription</label>
              <input name="registrationLink" value={formData.registrationLink} onChange={handleChange} className="shadow-sm block w-full sm:text-sm border border-gray-300 rounded-lg px-4 py-3" placeholder="https://..." />
            </div>
          </div>
        </div>

        {/* Section: Média & Galerie */}
        {/* UX: Chaque propriété occupe désormais toute la largeur (une ligne par propriété) pour plus de lisibilité. */}
        <div className="bg-white shadow-sm px-8 py-8 rounded-xl border border-gray-100">
          <h4 className="text-xl text-left font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-100">Média & Galerie</h4>
          <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-6">
            {/* Image principale */}
            <div className="sm:col-span-6">
              <div className="flex items-center justify-between">
                <label className="block text-left text-sm font-medium text-gray-700 mb-1.5">
                  Image principale <span className="text-red-500">*</span>
                </label>
                {imagePreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('');
                      setFormData(prev => ({ ...prev, image: '' }));
                      setImageError('');
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
                    <div className="pt-[56%] bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={imagePreview} 
                        alt="Aperçu de l'événement" 
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={() => setImageError("Impossible de charger l'image")}
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                        <p className="text-white text-sm text-center mb-3">Cliquez pour changer l'image</p>
                        <label className="cursor-pointer px-4 py-2 bg-white/90 text-gray-800 rounded-md text-sm font-medium hover:bg-white transition-colors">
                          Changer l'image
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            name="image"
                            onChange={handleChange}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div 
                    className={`mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-dashed rounded-lg transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, (preview) => setImagePreview(preview))}
                  >
                    <div className="text-center">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className={`mx-auto h-10 w-10 mb-3 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <div className="flex flex-col items-center text-sm">
                        <label
                          htmlFor="event-image"
                          className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Télécharger une image</span>
                          <input
                            id="event-image"
                            name="image"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleChange}
                            required={!isEditing}
                          />
                        </label>
                        <p className="mt-1 text-xs text-gray-600">
                          ou glisser-déposer une image
                        </p>
                        <p className="mt-2 text-xs text-gray-500">
                          JPG, PNG, WebP (max 10MB)
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {imageError && (
                  <p className="mt-2 text-sm text-red-600">{imageError}</p>
                )}
              </div>
            </div>

            {/* Contributeurs - la section occupe une ligne, champs côte à côte en desktop */}
            <div className="sm:col-span-6">
              <h5 className="text-lg text-left rounded-md font-semibold text-gray-800 mb-3">Contributeurs</h5>
              <div className="space-y-3 mt-2 rounded-mdx bg-gray-50 border py-4 px-4">
                {(formData.contributors || []).map((c, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end  p-3 rounded-md ">
                    <div>
                      <label className="block text-left text-xs text-gray-600">Nom</label>
                      <input value={c.name || ''} onChange={(e) => updateContributor(idx, 'name', e.target.value)} className="mt-1 block w-full border rounded-md px-3 py-2" />
                    </div>
                    <div>
                      <label className="block text-left text-xs text-gray-600">Rôle</label>
                      <input value={c.role || ''} onChange={(e) => updateContributor(idx, 'role', e.target.value)} className="mt-1 block w-full border rounded-md px-3 py-2" />
                    </div>
                    <div className="flex gap-2 items-end">
                      <div className="flex-1">
                        <label className="block  text-left text-xs text-gray-600">Avatar (fichier)</label>
                        <input value={c.avatar || ''} onChange={(e) => updateContributor(idx, 'avatar', e.target.value)} className="mt-1 block w-full border rounded-md px-3 py-2" />
                      </div>
                      <button type="button" onClick={() => removeContributor(idx)} className="px-3 py-2 text-sm text-red-600 border border-red-200 bg-red-50 rounded-md hover:bg-red-100 transition-colors">
                    Supprimer
                  </button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-end">
                  <button type="button" onClick={addContributor} className="px-4 py-2 text-sm bg-blue-50 text-blue-700 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors">
                    + Ajouter un contributeur
                  </button>
                </div>
              </div>
            </div>

            {/* Galerie d'images */}
            <div className="sm:col-span-6 rounded-md">
              <div className="flex items-center justify-between">
                <h5 className="text-lg text-left font-semibold text-gray-800 mb-3">
                  Galerie d'images
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    (optionnel)
                  </span>
                </h5>
                {(formData.gallery || []).length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, gallery: [] }));
                      setGalleryPreviews([]);
                    }}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Tout supprimer
                  </button>
                )}
              </div>
              <div className="sm:col-span-6 bg-gray-50 rounded-md p-4">
              <div className="space-y-4 mt-2">
                {(formData.gallery || []).map((g, idx) => (
                  <div key={idx} className="border rounded-lg p-4 bg-white shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Aperçu de l'image */}
                      <div>
                        <label className="block text-left text-sm font-medium text-gray-700 mb-2">
                          Image {idx + 1}
                        </label>
                        {galleryPreviews[idx]?.preview ? (
                          <div className="relative group">
                            <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
                              <img 
                                src={galleryPreviews[idx].preview} 
                                alt={`Aperçu ${idx + 1}`}
                                className="w-full h-full object-cover"
                                onError={() => {
                                  setGalleryPreviews(prev => {
                                    const newPreviews = [...prev];
                                    newPreviews[idx] = { 
                                      ...newPreviews[idx], 
                                      error: "Impossible de charger l'image" 
                                    };
                                    return newPreviews;
                                  });
                                }}
                              />
                              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <label className="cursor-pointer px-3 py-1.5 bg-white/90 text-gray-800 rounded-md text-xs font-medium hover:bg-white transition-colors">
                                  Changer
                                  <input
                                    type="file"
                                    className="sr-only"
                                    accept="image/*"
                                    onChange={(e) => {
                                      if (e.target.files && e.target.files[0]) {
                                        updateGalleryItem(idx, 'image', null, e.target.files[0]);
                                      }
                                    }}
                                  />
                                </label>
                              </div>
                            </div>
                            {galleryPreviews[idx]?.error && (
                              <p className="mt-1 text-xs text-red-600">{galleryPreviews[idx].error}</p>
                            )}
                          </div>
                        ) : (
                          <div 
                            className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${galleryPreviews[idx]?.error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-400'}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleGalleryDrop(e, idx)}
                          >
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className={`mx-auto h-8 w-8 mb-2 ${galleryPreviews[idx]?.error ? 'text-red-400' : 'text-gray-400'}`} 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <label className="block text-sm text-gray-600 mb-1">
                              <span className="relative cursor-pointer text-blue-600 hover:text-blue-500">
                                Choisir une image
                                <input
                                  type="file"
                                  className="sr-only"
                                  accept="image/*"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      updateGalleryItem(idx, 'image', null, e.target.files[0]);
                                    }
                                  }}
                                />
                              </span>
                            </label>
                            <p className="text-xs text-gray-500 mt-1">
                              ou glisser-déposer une image
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              JPG, PNG, WebP (max 10MB)
                            </p>
                            {galleryPreviews[idx]?.error && (
                              <p className="mt-1 text-xs text-red-600">{galleryPreviews[idx].error}</p>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Légende */}
                      <div className="md:col-span-2">
                        <label className="block text-left text-sm font-medium text-gray-700 mb-1">
                          Légende
                        </label>
                        <input
                          type="text"
                          value={g.caption || ''}
                          onChange={(e) => updateGalleryItem(idx, 'caption', e.target.value)}
                          className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-black focus:border-black"
                          placeholder="Description de l'image"
                        />
                        
                        <div className="mt-4 flex justify-end">
                          <button
                            type="button"
                            onClick={() => removeGalleryItem(idx)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Supprimer cette image
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={addGalleryItem}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  >
                    <FiPlus className="-ml-1 mr-2 h-4 w-4" />
                    Ajouter une image
                  </button>
                </div>
                </div>
              </div>
            </div>

            {/* Citation - propre section en pleine largeur, avec champs côte à côte en desktop */}
            <div className="sm:col-span-6">
              <h5 className="text-lg text-left font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">Citation</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-left font-medium text-gray-700">Texte de la citation</label>
                  <textarea name="quote" value={formData.quote} onChange={handleChange} className="mt-1 block w-full border rounded-md px-3 py-2" rows={2} />
                </div>
                <div>
                  <label className="block text-sm text-left font-medium text-gray-700">Auteur de la citation</label>
                  <textarea name="quoteAuthor" value={formData.quoteAuthor} onChange={handleChange} className="mt-1 block w-full border rounded-md px-3 py-2 "rows={2} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-4 sm:px-6 lg:px-8 mt-8 bg-gray-50 p-4 rounded-lg">
          <button 
            type="button" 
            onClick={() => navigate('/admin/events')} 
            className="px-6 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            Annuler
          </button>
          <button 
            type="submit" 
            className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            {isEditing ? 'Mettre à jour (au panier)' : 'Créer (au panier)'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
