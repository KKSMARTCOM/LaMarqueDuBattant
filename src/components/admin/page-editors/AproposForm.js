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
        className="mt-1 block w-full py-3 px-2 rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
    setPreviewImage(null);
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

const AproposForm = ({ data, onChange }) => {
  const [aboutSlides, setAboutSlides] = useState(data?.AboutSection?.slides || []);
  const [featureSection, setFeatureSection] = useState(data?.AproposFeatureSection || {});
  const [faqs, setFaqs] = useState(data?.FAQ?.faqs || []);
  const [expandedSections, setExpandedSections] = useState({
    aboutSlides: true,
    featureSection: true,
    faqSection: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Gestion des slides
  const handleSlideChange = (index, field, value) => {
    const updatedSlides = [...aboutSlides];
    updatedSlides[index] = { ...updatedSlides[index], [field]: value };
    setAboutSlides(updatedSlides);
    onChange('AboutSection', { ...data?.AboutSection, slides: updatedSlides });
  };

  const addSlide = () => {
    const newSlide = { image: '', title: '', description: '' };
    const updatedSlides = [...aboutSlides, newSlide];
    setAboutSlides(updatedSlides);
    onChange('AboutSection', { ...data?.AboutSection, slides: updatedSlides });
  };

  const removeSlide = (index) => {
    const updatedSlides = aboutSlides.filter((_, i) => i !== index);
    setAboutSlides(updatedSlides);
    onChange('AboutSection', { ...data?.AboutSection, slides: updatedSlides });
    onChange('AboutSection', { ...data?.AboutSection, slides: updatedSlides });
  };

  // Gestion de la section de fonctionnalité
  const handleFeatureChange = (field, value) => {
    const updatedFeature = { ...featureSection, [field]: value };
    setFeatureSection(updatedFeature);
    onChange('AproposFeatureSection', updatedFeature);
  };

  // Gestion de la FAQ
  const handleFaqChange = (index, field, value) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[index] = { ...updatedFaqs[index], [field]: value };
    setFaqs(updatedFaqs);
    onChange('FAQ', { faqs: updatedFaqs });
  };

  const addFaq = () => {
    const newFaq = { question: '', answer: '' };
    const updatedFaqs = [...faqs, newFaq];
    setFaqs(updatedFaqs);
    onChange('FAQ', { faqs: updatedFaqs });
  };

  const removeFaq = (index) => {
    const updatedFaqs = faqs.filter((_, i) => i !== index);
    setFaqs(updatedFaqs);
    onChange('FAQ', { faqs: updatedFaqs });
  };

  return (
    <div className="space-y-6">
      {/* Section Slides */}
      <Section title="Diapositives" defaultOpen={false}>
        <div className="space-y-6">
          {aboutSlides.map((slide, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6 space-y-4 bg-gray-50">
              <div className="flex justify-between items-center">
                <h4 className="text-base font-medium text-gray-900">Diapositive {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeSlide(index)}
                  className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <FiTrash2 className="h-3.5 w-3.5 mr-1" />
                  Supprimer
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ImageUpload
                    label="Image de la diapositive"
                    name={`slide-${index}-image`}
                    value={slide.image}
                    imagetype="cover"
                    onChange={(e) => handleSlideChange(index, 'image', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-4">
                  <FormField
                    label="Titre"
                    name={`slide-${index}-title`}
                    value={slide.title || ''}
                    onChange={(e) => handleSlideChange(index, 'title', e.target.value)}
                    placeholder="Titre de la diapositive"
                    required
                  />
                  
                  <FormField
                    label="Description"
                    name={`slide-${index}-description`}
                    value={slide.description || ''}
                    onChange={(e) => handleSlideChange(index, 'description', e.target.value)}
                    placeholder="Description de la diapositive"
                    textarea
                  />
                </div>
              </div>
            </div>
          ))}
          
          <div className="flex justify-center">
            <button
              type="button"
              onClick={addSlide}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiPlus className="h-4 w-4 mr-2" />
              Ajouter une diapositive
            </button>
          </div>
        </div>
      </Section>

      {/* Section Fonctionnalité */}
      <Section title="Section Principale" defaultOpen={false}>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <FormField
                label="Titre"
                name="feature-title"
                value={featureSection.title || ''}
                onChange={(e) => handleFeatureChange('title', e.target.value)}
                placeholder="Titre de la section"
                required
              />
              
              <FormField
                label="Description"
                name="feature-description"
                value={featureSection.description || ''}
                onChange={(e) => handleFeatureChange('description', e.target.value)}
                placeholder="Description de la section"
                textarea
              />
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Images</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ImageUpload
                    label="Image principale"
                    name="feature-image"
                    value={featureSection.image}
                    imagetype="cover"
                    onChange={(e) => handleFeatureChange('image', e.target.value)}
                  />
                </div>
                <div>
                  <ImageUpload
                    label="Logo"
                    name="feature-logo"
                    value={featureSection.Logo}
                    imagetype="logos"
                    onChange={(e) => handleFeatureChange('Logo', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Section FAQ */}
      <Section title="FAQ" defaultOpen={false}>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6 space-y-4 bg-gray-50">
              <div className="flex justify-between items-center">
                <h4 className="text-base font-medium text-gray-900">Question {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeFaq(index)}
                  className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <FiTrash2 className="h-3.5 w-3.5 mr-1" />
                  Supprimer
                </button>
              </div>
              
              <div className="space-y-4">
                <FormField
                  label="Question"
                  name={`faq-${index}-question`}
                  value={faq.question || ''}
                  onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                  placeholder="Entrez la question"
                  required
                />
                
                <FormField
                  label="Réponse"
                  name={`faq-${index}-answer`}
                  value={faq.answer || ''}
                  onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                  placeholder="Entrez la réponse"
                  textarea
                />
              </div>
            </div>
          ))}
          
          <div className="flex justify-center">
            <button
              type="button"
              onClick={addFaq}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiPlus className="h-4 w-4 mr-2" />
              Ajouter une question
            </button>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default AproposForm;
