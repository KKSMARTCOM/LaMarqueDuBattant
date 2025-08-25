import React, { useState } from 'react';
import { FiPlus, FiTrash2, FiUpload, FiImage, FiChevronUp, FiChevronDown } from 'react-icons/fi';

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
    const newSlide = { image: '', title: '', desc: '' };
    const updatedSlides = [...aboutSlides, newSlide];
    setAboutSlides(updatedSlides);
    onChange('AboutSection', { ...data?.AboutSection, slides: updatedSlides });
  };

  const removeSlide = (index) => {
    const updatedSlides = aboutSlides.filter((_, i) => i !== index);
    setAboutSlides(updatedSlides);
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
      <div className="bg-white p-6 rounded-lg shadow">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection('aboutSlides')}
        >
          <h3 className="text-lg font-medium text-gray-900">Diapositives</h3>
          {expandedSections.aboutSlides ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        
        {expandedSections.aboutSlides && (
          <div className="mt-4 space-y-4">
            {aboutSlides.map((slide, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Diapositive {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeSlide(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Image</label>
                  <div className="mt-1 flex items-center">
                    <span className="inline-block h-12 w-12 overflow-hidden bg-gray-100 rounded-md">
                      {slide.image ? (
                        <img src={slide.image} alt="Preview" className="h-full w-full object-cover" />
                      ) : (
                        <FiImage className="h-full w-full text-gray-300" />
                      )}
                    </span>
                    <input
                      type="text"
                      value={slide.image || ''}
                      onChange={(e) => handleSlideChange(index, 'image', e.target.value)}
                      className="ml-4 flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Nom du fichier ou URL"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Titre</label>
                  <input
                    type="text"
                    value={slide.title || ''}
                    onChange={(e) => handleSlideChange(index, 'title', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    rows={2}
                    value={slide.desc || ''}
                    onChange={(e) => handleSlideChange(index, 'desc', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addSlide}
              className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiPlus className="h-4 w-4 mr-1" />
              Ajouter une diapositive
            </button>
          </div>
        )}
      </div>

      {/* Section Fonctionnalité */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection('featureSection')}
        >
          <h3 className="text-lg font-medium text-gray-900">Section Principale</h3>
          {expandedSections.featureSection ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        
        {expandedSections.featureSection && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Titre</label>
              <input
                type="text"
                value={featureSection.title || ''}
                onChange={(e) => handleFeatureChange('title', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                rows={4}
                value={featureSection.description || ''}
                onChange={(e) => handleFeatureChange('description', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Image</label>
              <div className="mt-1 flex items-center">
                <span className="inline-block h-12 w-12 overflow-hidden bg-gray-100 rounded-md">
                  {featureSection.image ? (
                    <img src={featureSection.image} alt="Preview" className="h-full w-full object-cover" />
                  ) : (
                    <FiImage className="h-full w-full text-gray-300" />
                  )}
                </span>
                <input
                  type="text"
                  value={featureSection.image || ''}
                  onChange={(e) => handleFeatureChange('image', e.target.value)}
                  className="ml-4 flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Nom du fichier ou URL"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Logo</label>
              <div className="mt-1 flex items-center">
                <span className="inline-block h-12 w-12 overflow-hidden bg-gray-100 rounded-md">
                  {featureSection.Logo ? (
                    <img src={featureSection.Logo} alt="Logo Preview" className="h-full w-full object-contain p-1" />
                  ) : (
                    <FiImage className="h-full w-full text-gray-300" />
                  )}
                </span>
                <input
                  type="text"
                  value={featureSection.Logo || ''}
                  onChange={(e) => handleFeatureChange('Logo', e.target.value)}
                  className="ml-4 flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Nom du fichier ou URL"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section FAQ */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection('faqSection')}
        >
          <h3 className="text-lg font-medium text-gray-900">FAQ</h3>
          {expandedSections.faqSection ? <FiChevronUp /> : <FiChevronDown />}
        </div>
        
        {expandedSections.faqSection && (
          <div className="mt-4 space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Question {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeFaq(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Question</label>
                  <input
                    type="text"
                    value={faq.question || ''}
                    onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Réponse</label>
                  <textarea
                    rows={3}
                    value={faq.answer || ''}
                    onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addFaq}
              className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiPlus className="h-4 w-4 mr-1" />
              Ajouter une question
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AproposForm;
