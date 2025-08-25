import React, { useState } from 'react';
import { FiPlus, FiTrash2, FiUpload, FiImage, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import getImagePath from '../../../components/getImagePath';

// Composant pour les sections repliables
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

// Composant pour les champs de formulaire
const FormField = ({ label, name, value, onChange, placeholder = '', type = 'text', required = false, className = '' }) => (
  <div className={className}>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
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

// Composant pour l'upload d'images
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
      <label className="block text-sm font-medium text-gray-700 mb-1">
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

const EventsForm = ({ data, onChange }) => {
  const [heroSection, setHeroSection] = useState(data?.HeroEvents || {});
  const [galleryImages, setGalleryImages] = useState(data?.ImageGallerySection?.images || []);

  const handleHeroChange = (field, value) => {
    const updatedHero = { ...heroSection, [field]: value };
    setHeroSection(updatedHero);
    onChange('HeroEvents', updatedHero);
  };

  const handleGalleryChange = (index, value) => {
    const updatedImages = [...galleryImages];
    updatedImages[index] = value;
    setGalleryImages(updatedImages);
    onChange('ImageGallerySection', { images: updatedImages });
  };

  const addGalleryImage = () => {
    const updatedImages = [...galleryImages, ''];
    setGalleryImages(updatedImages);
    onChange('ImageGallerySection', { images: updatedImages });
  };

  const removeGalleryImage = (index) => {
    const updatedImages = galleryImages.filter((_, i) => i !== index);
    setGalleryImages(updatedImages);
    onChange('ImageGallerySection', { images: updatedImages });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Configuration des Événements</h2>
      
      {/* Hero Section */}
      <Section title="Bannière Principale">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Titre"
              name="title"
              value={heroSection.title || ''}
              onChange={(e) => handleHeroChange('title', e.target.value)}
              placeholder="Titre de la bannière"
              required
            />
            
            <ImageUpload
              label="Image de fond"
              name="image"
              value={heroSection.image || ''}
              onChange={(e) => handleHeroChange('image', e.target.value)}
              required
            />
          </div>
          
          <FormField
            label="Description"
            name="description"
            type="textarea"
            value={heroSection.description || ''}
            onChange={(e) => handleHeroChange('description', e.target.value)}
            placeholder="Description de la bannière"
          />
        </div>
      </Section>

      {/* Gallery Section */}
      <Section title="Galerie d'images">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-3 space-y-3 bg-gray-50">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700">Image #{index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeGalleryImage(index)}
                  className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                  title="Supprimer cette image"
                >
                  <FiTrash2 className="h-4 w-4" />
                </button>
              </div>
              
              <div className="relative aspect-square bg-gray-100 rounded-md overflow-hidden">
                {image ? (
                  <img 
                    src={getImagePath(image)} 
                    alt={`Galerie ${index + 1}`} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <FiImage className="h-12 w-12" />
                  </div>
                )}
              </div>
              
              <FormField
                label="URL de l'image"
                name={`gallery-${index}`}
                value={image || ''}
                onChange={(e) => handleGalleryChange(index, e.target.value)}
                placeholder="Nom du fichier ou URL"
                className="text-sm"
              />
            </div>
          ))}
          
          <button
            type="button"
            onClick={addGalleryImage}
            className="flex flex-col items-center justify-center h-full min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors duration-200 p-6 text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiPlus className="h-10 w-10 text-gray-400 mb-2 group-hover:text-blue-500" />
            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
              Ajouter une image
            </span>
            <span className="text-xs text-gray-500 mt-1">Glissez-déposez ou cliquez pour téléverser</span>
          </button>
        </div>
      </Section>
    </div>
  );
};

export default EventsForm;
