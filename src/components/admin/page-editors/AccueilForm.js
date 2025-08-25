import React, { useState, useRef } from 'react';
import { FiPlus, FiTrash2, FiUpload, FiImage, FiChevronDown, FiChevronUp, FiX, FiRefreshCw } from 'react-icons/fi';
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
        <div className="p-6 space-y-6">
          {children}
        </div>
      )}
    </div>
  );
};

// Composant pour les champs de formulaire
const FormField = ({ label, name, value, onChange, type = 'text', placeholder = '', required = false, textarea = false }) => (
  <div className="space-y-2">
    <label htmlFor={name} className="block text-sm text-left font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {textarea ? (
      <textarea
        id={name}
        name={name}
        value={value || ''}
        onChange={onChange}
        rows={4}
        className="mt-1 block w-full py-3 px-2  rounded-md border  border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        placeholder={placeholder}
        required={required}
      />
    ) : (
      <input
        type={type}
        id={name}
        name={name}
        value={value || ''}
        onChange={onChange}
        className="mt-1 py-3 px-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        placeholder={placeholder}
        required={required}
      />
    )}
  </div>
);

// Composant pour l'upload d'image
const ImageUpload = ({ value, imagetype, onChange, name, label, required = false }) => {
  const fileInputRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  
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
    onChange({ target: { name, value: '' } });
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm text-left font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div 
        className="relative rounded-md overflow-hidden bg-gray-100 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => fileInputRef.current?.click()}
      >
        {value ? (
          <>
            {/* Bouton de suppression */}
            <button
              type="button"
              onClick={handleDelete}
              className="absolute top-2 right-2 z-10 p-1.5 bg-white/80 rounded-full shadow-sm hover:bg-white"
              title="Supprimer l'image"
            >
              <FiX className="h-4 w-4 text-red-600" />
            </button>
            
            {/* Bouton Changer qui apparaît au survol */}
            {isHovered && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-0">
                <span className="bg-white/90 text-gray-800 text-sm font-medium px-3 py-1.5 rounded-md shadow-sm flex items-center">
                  <FiRefreshCw className="h-3.5 w-3.5 mr-1" />
                  Changer
                </span>
              </div>
            )}
            
            {/* Prévisualisation de l'image */}
            <div className="relative w-full max-h-64 overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
              <img 
                src={previewImage || (value ? getImagePath(value, imagetype) : '')} 
                alt="Preview" 
                className="h-auto w-full max-h-64 object-contain" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2YjcyODAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryai1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTE5IDNINWEyIDIgMCAwMC0yIDJ2MTRhMiAyIDAgMDAyIDJoMTRhMiAyIDAgMDAyLTJWNWEyIDIgMCAwMC0yLTJ6Ij48L3BhdGg+PHBvbHlsaW5lIHBvaW50cz0iOC41IDE0LjUgOS41IDE0LjUgMTAuNSAxMy41IDEzLjUgMTYuNSAxNS41IDE0LjUgMTUuNSAxNC41IDE4LjUgMTQuNSI+PC9wb2x5bGluZT48Y2lyY2xlIGN4PSI4LjUiIGN5PSI4LjUiIHI9IjEuNSI+PC9jaXJjbGU+PC9zdmc+';
                }}
              />
            </div>
            {/* Nom du fichier */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1.5 truncate text-center">
              {value}
            </div>
          </>
        ) : (
          <div className="w-full aspect-[4/3] flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-400 transition-colors">
            <FiUpload className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-600">Cliquez pour téléverser</span>
            <span className="text-xs text-gray-400">PNG, JPG, JPEG (max. 5MB)</span>
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
    </div>
  );
};

const AccueilForm = ({ data, onChange }) => {
  const [heroSlides, setHeroSlides] = useState(data?.Hero?.slides || []);
  const [aboutSection, setAboutSection] = useState(data?.AboutSection2 || {});
  const [collectionsSection, setCollectionsSection] = useState(data?.CollectionsSection || {});

  // Gestion des diapositives du héros
  const handleHeroSlideChange = (index, field, value) => {
    const updatedSlides = [...heroSlides];
    updatedSlides[index] = { ...updatedSlides[index], [field]: value };
    setHeroSlides(updatedSlides);
    onChange('Hero', { slides: updatedSlides });
  };

  const addHeroSlide = () => {
    const newSlide = { title: '', description: '', image: '' };
    const updatedSlides = [...heroSlides, newSlide];
    setHeroSlides(updatedSlides);
    onChange('Hero', { slides: updatedSlides });
  };

  const removeHeroSlide = (index) => {
    const updatedSlides = heroSlides.filter((_, i) => i !== index);
    setHeroSlides(updatedSlides);
    onChange('Hero', { slides: updatedSlides });
  };

  // Gestion de la section À propos
  const handleAboutChange = (e) => {
    const { name, value } = e.target;
    const updatedAbout = { ...aboutSection, [name]: value };
    setAboutSection(updatedAbout);
    onChange('AboutSection2', updatedAbout);
  };

  // Gestion de la section Collections
  const handleCollectionsChange = (e) => {
    const { name, value } = e.target;
    const updatedCollections = { ...collectionsSection, [name]: value };
    setCollectionsSection(updatedCollections);
    onChange('CollectionsSection', updatedCollections);
  };

  const handleCollectionItemChange = (key, value) => {
    const updatedCollections = {
      ...collectionsSection,
      collections: {
        ...(collectionsSection.collections || {}),
        [key]: value
      }
    };
    setCollectionsSection(updatedCollections);
    onChange('CollectionsSection', updatedCollections);
  };

  // Convertir les collections en tableau pour l'affichage
  const collectionEntries = collectionsSection.collections 
    ? Object.entries(collectionsSection.collections).map(([name, image]) => ({
        key: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        image
      }))
    : [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Configuration de la page d'accueil</h2>
      
      {/* Section Héro */}
      <Section title="Section Héro" defaultOpen={false}>
        <div className="space-y-4">
          {heroSlides.map((slide, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50">
              <div className="flex justify-between items-center">
                <h3 className="text-md font-medium text-gray-900">Diapositive {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeHeroSlide(index)}
                  className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50"
                  title="Supprimer cette diapositive"
                >
                  <FiTrash2 className="h-4 w-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-1">
                  <FormField
                    label="Titre"
                    name="title"
                    value={slide.title || ''}
                    onChange={(e) => handleHeroSlideChange(index, 'title', e.target.value)}
                    placeholder="Titre de l'accroche"
                    required
                  />
                </div>
                
                <div className="md:col-span-1">
                  <FormField
                    label="Description"
                    name="description"
                    value={slide.description || ''}
                    onChange={(e) => handleHeroSlideChange(index, 'description', e.target.value)}
                    placeholder="Courte description"
                  />
                </div>
              </div>
              
              <div className="pt-2">
                <ImageUpload
                  label="Image de fond"
                  name="image"
                  imagetype="cover"
                  value={slide.image || ''}
                  onChange={(e) => handleHeroSlideChange(index, 'image', e.target.value)}
                  required
                />
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addHeroSlide}
            className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-500"
          >
            <FiPlus className="h-3 w-3 mr-1" />
            Ajouter une diapositive
          </button>
        </div>
      </Section>

      {/* Section À Propos */}
      <Section title="Section À Propos">
        <div className="space-y-6">
          <div className="space-y-6">
            <FormField
              label="Titre de la section"
              name="title"
              value={aboutSection.title || ''}
              onChange={handleAboutChange}
              placeholder="Notre histoire"
              required
            />
            
            <FormField
              label="Description"
              name="description"
              value={aboutSection.description || ''}
              onChange={handleAboutChange}
              placeholder="Décrivez votre entreprise ou votre histoire"
              textarea
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUpload
              label="Image pour la section femme"
              name="womenImage"
              imagetype="cover"
              value={aboutSection.womenImage || ''}
              onChange={handleAboutChange}
              required
            />
            
            <ImageUpload
              label="Image pour la section homme"
              name="menImage"
              imagetype="cover"
              value={aboutSection.menImage || ''}
              onChange={handleAboutChange}
              required
            />
          </div>
        </div>
      </Section>

      {/* Section Collections */}
      <Section title="Section Collections">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Titre de la section"
              name="title"
              value={collectionsSection.title || ''}
              onChange={handleCollectionsChange}
              placeholder="Découvrez nos collections"
              required
            />
            
            <FormField
              label="Acroche d'appel à l'action"
              name="CTA"
              value={collectionsSection.CTA || ''}
              onChange={handleCollectionsChange}
              placeholder="Voir toutes les collections"
              required
            />
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-medium text-left text-gray-700">Images des collections</h4>
              
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {collectionEntries.map(({ key, name, image }) => (
                <div key={key} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <h5 className="text-sm font-medium text-gray-700 mb-3">{name}</h5>
                  <ImageUpload
                    label=""
                    name={key}
                    imagetype="cover"
                    value={image || ''}
                    onChange={(e) => handleCollectionItemChange(name, e.target.value)}
                    required
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default AccueilForm;
