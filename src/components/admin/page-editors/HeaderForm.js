import React, { useState, useEffect } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

const HeaderForm = ({ data, onChange }) => {
  // Initialiser avec les données reçues ou des valeurs par défaut
  const [slogans, setSlogans] = useState(data?.phrases || data?.SloganBar?.phrases || []);

  // Mettre à jour l'état local quand les données changent
  useEffect(() => {
    if (data?.phrases) {
      setSlogans(data.phrases);
    } else if (data?.SloganBar?.phrases) {
      setSlogans(data.SloganBar.phrases);
    }
  }, [data]);

  const updateSlogans = (updatedPhrases) => {
    setSlogans(updatedPhrases);
    
    // Préparer les données pour le parent
    const updatedData = {
      SloganBar: {
        phrases: updatedPhrases
      }
    };
    
    // Envoyer les mises à jour au parent
    onChange(updatedData);
  };

  const handleSloganChange = (index, value) => {
    const updatedPhrases = [...slogans];
    updatedPhrases[index] = value;
    updateSlogans(updatedPhrases);
  };

  const addSlogan = () => {
    const updatedPhrases = [...slogans, ''];
    updateSlogans(updatedPhrases);
  };

  const removeSlogan = (index) => {
    const updatedPhrases = slogans.filter((_, i) => i !== index);
    updateSlogans(updatedPhrases);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Bandeau de slogans</h3>
            <p className="text-sm text-gray-500 mb-4">
              Les slogans défilent automatiquement dans la barre supérieure du site
            </p>
            
            <div className="space-y-3">
              {slogans.map((phrase, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={phrase}
                      onChange={(e) => handleSloganChange(index, e.target.value)}
                      className="block w-full py-2 px-2 rounded-md b border border-gray-300 shadow-sm sm:text-sm"
                      placeholder="Entrez un slogan"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSlogan(index)}
                    className="inline-flex items-center p-2 border border-transparent rounded-md text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addSlogan}
                className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiPlus className="h-4 w-4 mr-2" />
                Ajouter un slogan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderForm;
