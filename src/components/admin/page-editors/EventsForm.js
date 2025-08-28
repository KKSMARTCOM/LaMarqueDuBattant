import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiUpload, FiImage, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import getImagePath from '../../../components/getImagePath';

/**
 * Composant Section - Crée une section repliable
 * @param {string} title - Titre de la section
 * @param {ReactNode} children - Contenu de la section
 * @param {boolean} defaultOpen - Si vrai, la section est ouverte par défaut
 */
const Section = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="bg-white border border-b-gray-300 rounded-lg shadow overflow-hidden mb-6">
      <button
        type="button"
        className="w-full px-6 py-4 flex justify-between items-center text-left font-medium text-gray-900 bg-gray-50 hover:bg-gray-100 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg">{title}</span>
        {isOpen ? <FiChevronUp className="h-5 w-5" /> : <FiChevronDown className="h-5 w-5" />}
      </button>
      {isOpen && (
        <div className="p-6 border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
};

/**
 * Composant FormField - Champ de formulaire personnalisé
 * @param {string} label - Libellé du champ
 * @param {string} name - Nom du champ
 * @param {string} value - Valeur du champ
 * @param {function} onChange - Fonction de mise à jour
 * @param {string} [placeholder=''] - Texte d'aide
 * @param {string} [type='text'] - Type de champ (text, textarea, etc.)
 * @param {boolean} [required=false] - Si le champ est obligatoire
 * @param {string} [className=''] - Classes CSS supplémentaires
 */
const FormField = ({ label, name, value, onChange, placeholder = '', type = 'text', required = false, className = '' }) => (
  <div className={className}>
    <label htmlFor={name} className="block text-sm text-left font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {type === 'textarea' ? (
      <textarea
        id={name}
        name={name}
        rows={3}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
      />
    ) : (
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
      />
    )}
  </div>
);

/**
 * Composant ImageUpload - Gestion du téléversement d'images
 * @param {string} label - Libellé du champ
 * @param {string} name - Nom du champ
 * @param {string} value - URL de l'image actuelle
 * @param {function} onChange - Gestionnaire de changement
 * @param {boolean} [required=false] - Si le champ est obligatoire
 * @param {string} [className=''] - Classes CSS supplémentaires
 */
const ImageUpload = ({ label, name, value, onChange, required = false, className = '' }) => {
  const fileInputRef = React.useRef(null);
  const [isHovered, setIsHovered] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState(null);
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Créer une URL de prévisualisation pour l'affichage
      const previewUrl = URL.createObjectURL(file);
      
      // Mettre à jour l'état local pour afficher la prévisualisation
      setPreviewImage(previewUrl);
      
      // Envoyer uniquement le nom du fichier et l'extension
      onChange({ target: { name, value: file.name } });
    }
  };
  
  const handleDelete = (e) => {
    e.stopPropagation();
    setPreviewImage(null);
    onChange({ target: { name, value: '' } });
  };
  
  const displayImage = previewImage || (value ? getImagePath(value) : null);

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-left text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div 
        className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => fileInputRef.current?.click()}
      >
        {displayImage ? (
          <div className="relative w-full">
            <img 
              src={displayImage} 
              alt="Aperçu" 
              className="mx-auto max-h-48 object-contain rounded-md"
            />
            {isHovered && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  title="Supprimer l'image"
                >
                  <FiTrash2 className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-1 text-center">
            <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <span className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                Téléverser un fichier
              </span>
              <p className="pl-1">ou glisser-déposer</p>
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF jusqu'à 10MB
            </p>
          </div>
        )}
        
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
      
      {value && !displayImage && (
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <span>Image sélectionnée : {value}</span>
        </div>
      )}
    </div>
  );
};

/**
 * Composant principal du formulaire d'événements
 * @param {Object} data - Données du formulaire
 * @param {function} onChange - Fonction de mise à jour des données
 */
const EventsForm = ({ data, onChange }) => {
  const [heroSection, setHeroSection] = useState(data?.HeroEvents || {});
  const [galleryImages, setGalleryImages] = useState(data?.ImageGallerySection?.images || []);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Effet pour charger les aperçus d'images au chargement du composant
  // Met à jour les aperçus quand la galerie d'images change
  useEffect(() => {
    if (galleryImages && galleryImages.length > 0) {
      // Pour les images existantes, on utilise getImagePath avec le type 'events'
      const previews = galleryImages.map((img, index) => 
        imagePreviews[index] || (img.startsWith('http') ? img : getImagePath(img, 'events'))
      );
      setImagePreviews(previews);
    } else {
      setImagePreviews([]);
    }
  }, [galleryImages]);

  /**
   * Met à jour un champ de la section héro
   * @param {string} field - Nom du champ à mettre à jour
   * @param {string} value - Nouvelle valeur du champ
   */
  const handleHeroChange = (field, value) => {
    const updatedHero = { ...heroSection, [field]: value };
    setHeroSection(updatedHero);
    onChange('HeroEvents', updatedHero);
  };

  /**
   * Gère le téléversement de nouvelles images
   * @param {Event} e - Événement de changement de fichier
   */
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    // Créer des URLs d'aperçu pour les nouvelles images
    const newPreviews = [];
    const newImageNames = [];
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        newPreviews.push(event.target.result);
        newImageNames.push(file.name);
        
        // Quand toutes les images sont chargées
        if (newPreviews.length === files.length) {
          // Mettre à jour l'état avec les nouveaux noms de fichiers
          const updatedImages = [...galleryImages, ...newImageNames];
          setGalleryImages(updatedImages);
          setImagePreviews(prev => [...prev, ...newPreviews]);
          onChange('ImageGallerySection', { images: updatedImages });
        }
      };
      reader.readAsDataURL(file);
    });
    
    // Réinitialiser l'input file
    e.target.value = '';
  };

  /**
   * Supprime une image de la galerie
   * @param {number} index - Index de l'image à supprimer
   */
  const removeImage = (index) => {
    const newImages = [...galleryImages];
    const newPreviews = [...imagePreviews];
    
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setGalleryImages(newImages);
    setImagePreviews(newPreviews);
    onChange('ImageGallerySection', { images: newImages });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Configuration des Événements</h2>
      
      {/* Hero Section */}
      <Section title="Bannière Principale">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <FormField
                label="Titre"
                name="title"
                value={heroSection.title || ''}
                onChange={(e) => handleHeroChange('title', e.target.value)}
                placeholder="Titre de la bannière"
                required
              />
              
              <FormField
                label="Description"
                name="description"
                type="textarea"
                value={heroSection.description || ''}
                onChange={(e) => handleHeroChange('description', e.target.value)}
                placeholder="Description de la bannière"
              />
            </div>
          </div>
          
          <div className="pt-2">
            <ImageUpload
              label="Image de fond"
              name="image"
              value={heroSection.image || ''}
              onChange={(e) => handleHeroChange('image', e.target.value)}
              required
            />
          </div>
        </div>
      </Section>

      {/* Gallery Section */}
      <Section title="Galerie d'images">
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {galleryImages.map((image, index) => (
              <div key={index} className="relative group aspect-square bg-gray-100 rounded-md overflow-hidden">
                {imagePreviews[index] ? (
                  <img 
                    src={imagePreviews[index]} 
                    alt={`Galerie ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <FiImage className="h-8 w-8" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  title="Supprimer cette image"
                >
                  <FiTrash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            
            <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200">
              <input 
                type="file" 
                className="hidden" 
                multiple
                accept="image/*"
                onChange={handleImageUpload}
              />
              <FiPlus className="h-8 w-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">Ajouter</span>
            </label>
          </div>
          
          <div className="text-sm text-gray-500">
            {galleryImages.length} image(s) sélectionnée(s)
          </div>
        </div>
      </Section>
    </div>
  );
};

export default EventsForm;
