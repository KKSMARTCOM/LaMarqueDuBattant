import React, { useState, useEffect, useRef } from 'react';
import { FiChevronDown, FiChevronUp, FiX, FiUpload, FiImage } from 'react-icons/fi';
import getImagePath from '../../getImagePath';

/**
 * Composant Section - Crée une section repliable
 */
const Section = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow overflow-hidden mb-6">
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
 */
const FormField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder = '', 
  type = 'text', 
  required = false, 
  className = '',
  rows = 3
}) => (
  <div className={`mb-4 ${className}`}>
    <label htmlFor={name} className="block text-sm text-left font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {type === 'textarea' ? (
      <textarea
        id={name}
        name={name}
        rows={rows}
        className="mt-1 block w-full px-2 py-2  rounded-md border  border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    ) : (
      <input
        type={type}
        id={name}
        name={name}
        className="mt-1 block w-full px-2 py-2  rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    )}
  </div>
);

const ImageUpload = ({ value, onChange, label, name, className = '' }) => {
  const [preview, setPreview] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Si on a une valeur mais pas de preview, c'est qu'on vient de charger l'image
    if (value && !preview) {
      setPreview(value);
    }
  }, [value, preview]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Créer une URL pour la prévisualisation
    const fileUrl = URL.createObjectURL(file);
    setPreview(fileUrl);
    
    // Retourner uniquement le nom du fichier avec son extension
    onChange(file.name);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setPreview('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`${className} space-y-2`}>
      <label className="block text-sm text-left font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div 
        className="relative group w-full h-48 bg-gray-100 rounded-md overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
        onClick={handleClick}
      >
        {preview ? (
          <div className="relative w-full h-full">
            <img 
              src={preview} 
              alt="Preview" 
              className="w-full h-full object-contain"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="bg-white p-2 rounded-full shadow-md">
                <FiUpload className="h-5 w-5 text-gray-700" />
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
              title="Supprimer l'image"
            >
              <FiX className="h-4 w-4 text-gray-700" />
            </button>
          </div>
        ) : (
          <div className="text-center p-4">
            <FiImage className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-1 text-sm text-gray-600">Cliquez pour téléverser une image</p>
            <p className="text-xs text-gray-500">Format: JPG, PNG, SVG (max. 5MB)</p>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>
    </div>
  );
};

const FooterForm = ({ data, onChange }) => {
  // Initialiser l'état avec les données ou des valeurs par défaut
  const [footerData, setFooterData] = useState({
    Card: {
      title: data?.Card?.title || data?.title || '',
      description: data?.Card?.description || data?.description || '',
      image: data?.Card?.image || data?.image || ''
    }
  });

  // Mettre à jour l'état quand les données changent
  useEffect(() => {
    if (data) {
      setFooterData(prev => ({
        Card: {
          ...prev.Card,
          title: data.Card?.title || data.title || '',
          description: data.Card?.description || data.description || '',
          image: data.Card?.image || data.image || ''
        }
      }));
    }
  }, [data]);

  // Gérer les changements des champs
  const handleCardChange = (field, value) => {
    const updatedCard = { 
      ...footerData.Card, 
      [field]: value 
    };
    
    const updatedData = {
      Card: updatedCard
    };
    
    setFooterData(updatedData);
    // Envoyer les données mises à jour avec la structure complète
    onChange(updatedData);
  };

  // Fonction pour obtenir l'URL complète de l'image
  const getImageUrl = (filename) => {
    if (!filename) return '';
    // Si c'est déjà une URL complète, on la retourne telle quelle
    if (filename.startsWith('http') || filename.startsWith('/')) {
      return filename;
    }
    // Utiliser getImagePath pour obtenir le chemin correct avec le type 'cover'
    return getImagePath(filename, 'cover');
  };

  return (
    <div className="space-y-6">
      <Section title="Carte Newsletter" defaultOpen={true}>
        <FormField
          label="Titre"
          name="newsletter-title"
          value={footerData.Card.title}
          onChange={(e) => handleCardChange('title', e.target.value)}
          placeholder="Ex: Nouvelle collection"
        />
        
        <FormField
          label="Description"
          name="newsletter-description"
          value={footerData.Card.description}
          onChange={(e) => handleCardChange('description', e.target.value)}
          placeholder="Description de la newsletter"
          type="textarea"
          rows={3}
        />
        
        <ImageUpload
          label="Image de fond"
          name="newsletter-image"
          value={getImageUrl(footerData.Card.image)}
          onChange={(value) => handleCardChange('image', value)}
          className="mt-4"
        />
      </Section>
    </div>
  );
};

export default FooterForm;
