import React, { useState } from 'react';
import { FiPlus, FiTrash2, FiImage } from 'react-icons/fi';

const HeaderForm = ({ data, onChange }) => {
  const [headerData, setHeaderData] = useState(data || {
    Logo: '',
    SloganBar: {
      phrases: []
    }
  });

  const handleLogoChange = (value) => {
    const updatedData = { ...headerData, Logo: value };
    setHeaderData(updatedData);
    onChange(updatedData);
  };

  const handleSloganChange = (index, value) => {
    const updatedPhrases = [...headerData.SloganBar.phrases];
    updatedPhrases[index] = value;
    const updatedData = {
      ...headerData,
      SloganBar: {
        ...headerData.SloganBar,
        phrases: updatedPhrases
      }
    };
    setHeaderData(updatedData);
    onChange(updatedData);
  };

  const addSlogan = () => {
    const updatedPhrases = [...headerData.SloganBar.phrases, ''];
    const updatedData = {
      ...headerData,
      SloganBar: {
        ...headerData.SloganBar,
        phrases: updatedPhrases
      }
    };
    setHeaderData(updatedData);
    onChange(updatedData);
  };

  const removeSlogan = (index) => {
    const updatedPhrases = headerData.SloganBar.phrases.filter((_, i) => i !== index);
    const updatedData = {
      ...headerData,
      SloganBar: {
        ...headerData.SloganBar,
        phrases: updatedPhrases
      }
    };
    setHeaderData(updatedData);
    onChange(updatedData);
  };

  return (
    <div className="space-y-8">
      {/* Logo Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Logo du site</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Fichier du logo</label>
            <div className="mt-1 flex items-center">
              <span className="inline-block h-16 w-16 overflow-hidden bg-gray-100 rounded-md border border-gray-300">
                {headerData.Logo ? (
                  <img 
                    src={headerData.Logo} 
                    alt="Logo" 
                    className="h-full w-full object-contain p-1"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '';
                    }}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-400">
                    <FiImage className="h-8 w-8" />
                  </div>
                )}
              </span>
              <div className="ml-4 flex-1">
                <input
                  type="text"
                  value={headerData.Logo || ''}
                  onChange={(e) => handleLogoChange(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Chemin du fichier (ex: /images/logo.png)"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Format recommandé : SVG ou PNG avec fond transparent
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slogan Bar Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Bandeau de slogans</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Slogans défilants</label>
            <div className="space-y-2">
              {headerData.SloganBar.phrases.map((phrase, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={phrase}
                    onChange={(e) => handleSloganChange(index, e.target.value)}
                    className="flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Entrez un slogan"
                  />
                  <button
                    type="button"
                    onClick={() => removeSlogan(index)}
                    className="inline-flex items-center p-1.5 border border-transparent rounded-full text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addSlogan}
                className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiPlus className="h-4 w-4 mr-1" />
                Ajouter un slogan
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Les slogans défilent automatiquement dans la barre supérieure du site
            </p>
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Aperçu de l'en-tête</h3>
        <div className="border rounded-md overflow-hidden">
          {/* Logo */}
          <div className="bg-white p-4 border-b flex items-center justify-between">
            <div className="h-12 w-48 bg-gray-100 flex items-center justify-center">
              {headerData.Logo ? (
                <img 
                  src={headerData.Logo} 
                  alt="Logo" 
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '';
                  }}
                />
              ) : (
                <span className="text-xs text-gray-400">Logo</span>
              )}
            </div>
            <div className="flex space-x-4">
              <div className="w-6 h-6 rounded-full bg-gray-200"></div>
              <div className="w-6 h-6 rounded-full bg-gray-200"></div>
              <div className="w-6 h-6 rounded-full bg-gray-200"></div>
            </div>
          </div>
          
          {/* Slogan Bar */}
          {headerData.SloganBar.phrases.length > 0 && (
            <div className="bg-black text-white text-sm p-2 text-center overflow-hidden">
              <div className="whitespace-nowrap animate-marquee">
                {headerData.SloganBar.phrases.map((phrase, index) => (
                  <span key={index} className="mx-4 inline-block">
                    {phrase || "Votre slogan ici..."}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Navigation */}
          <div className="bg-gray-50 p-4 flex justify-between items-center">
            <div className="flex space-x-1">
              <div className="h-8 w-16 bg-gray-200 rounded"></div>
              <div className="h-8 w-16 bg-gray-200 rounded"></div>
              <div className="h-8 w-16 bg-gray-200 rounded"></div>
            </div>
            <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderForm;
