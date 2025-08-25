import React, { useState } from 'react';
import { FiImage, FiLink, FiTrash2, FiPlus } from 'react-icons/fi';

const FooterForm = ({ data, onChange }) => {
  const [footerData, setFooterData] = useState(data || {
    Logo: '',
    Nom: '',
    Slogan: '',
    Card: {
      title: '',
      description: '',
      image: ''
    },
    socialLinks: []
  });

  const handleChange = (field, value) => {
    const updatedData = { ...footerData, [field]: value };
    setFooterData(updatedData);
    onChange(updatedData);
  };

  const handleCardChange = (field, value) => {
    const updatedCard = { ...footerData.Card, [field]: value };
    const updatedData = { ...footerData, Card: updatedCard };
    setFooterData(updatedData);
    onChange(updatedData);
  };

  const handleSocialLinkChange = (index, field, value) => {
    const updatedLinks = [...footerData.socialLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    const updatedData = { ...footerData, socialLinks: updatedLinks };
    setFooterData(updatedData);
    onChange(updatedData);
  };

  const addSocialLink = () => {
    const newLink = { platform: '', url: '', icon: '' };
    const updatedLinks = [...footerData.socialLinks, newLink];
    const updatedData = { ...footerData, socialLinks: updatedLinks };
    setFooterData(updatedData);
    onChange(updatedData);
  };

  const removeSocialLink = (index) => {
    const updatedLinks = footerData.socialLinks.filter((_, i) => i !== index);
    const updatedData = { ...footerData, socialLinks: updatedLinks };
    setFooterData(updatedData);
    onChange(updatedData);
  };

  return (
    <div className="space-y-8">
      {/* Logo et Informations */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Logo et Informations</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Logo</label>
            <div className="mt-1 flex items-center">
              <span className="inline-block h-12 w-12 overflow-hidden bg-gray-100 rounded-md border border-gray-300">
                {footerData.Logo ? (
                  <img 
                    src={footerData.Logo} 
                    alt="Logo" 
                    className="h-full w-full object-contain p-1"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '';
                    }}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-400">
                    <FiImage className="h-6 w-6" />
                  </div>
                )}
              </span>
              <input
                type="text"
                value={footerData.Logo || ''}
                onChange={(e) => handleChange('Logo', e.target.value)}
                className="ml-4 flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Chemin du fichier (ex: /images/logo-white.png)"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom de la marque</label>
            <input
              type="text"
              value={footerData.Nom || ''}
              onChange={(e) => handleChange('Nom', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Ex: La Marque Du Battant"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Slogan</label>
            <input
              type="text"
              value={footerData.Slogan || ''}
              onChange={(e) => handleChange('Slogan', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Ex: L'excellence à portée de main"
            />
          </div>
        </div>
      </div>

      {/* Carte de la Newsletter */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Carte Newsletter</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Titre</label>
            <input
              type="text"
              value={footerData.Card?.title || ''}
              onChange={(e) => handleCardChange('title', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Ex: Nouvelle collection"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={2}
              value={footerData.Card?.description || ''}
              onChange={(e) => handleCardChange('description', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Ex: Découvrez notre dernière collection printemps-été 2025"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Image d'arrière-plan</label>
            <div className="mt-1 flex items-center">
              <span className="inline-block h-12 w-12 overflow-hidden bg-gray-100 rounded-md border border-gray-300">
                {footerData.Card?.image ? (
                  <img 
                    src={footerData.Card.image} 
                    alt="Preview" 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '';
                    }}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-400">
                    <FiImage className="h-6 w-6" />
                  </div>
                )}
              </span>
              <input
                type="text"
                value={footerData.Card?.image || ''}
                onChange={(e) => handleCardChange('image', e.target.value)}
                className="ml-4 flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Chemin du fichier (ex: /images/newsletter-bg.jpg)"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Liens sociaux */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Réseaux sociaux</h3>
        <div className="space-y-4">
          {footerData.socialLinks?.map((link, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Réseau social {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeSocialLink(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FiTrash2 className="h-5 w-5" />
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Plateforme</label>
                <select
                  value={link.platform || ''}
                  onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="">Sélectionnez une plateforme</option>
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="twitter">Twitter</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="youtube">YouTube</option>
                  <option value="pinterest">Pinterest</option>
                  <option value="tiktok">TikTok</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">URL</label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    <FiLink className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    value={link.url || ''}
                    onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="https://"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Icône (optionnel)</label>
                <div className="mt-1 flex items-center">
                  <span className="inline-block h-8 w-8 overflow-hidden bg-gray-100 rounded-md border border-gray-300 flex items-center justify-center">
                    {link.icon ? (
                      <img 
                        src={link.icon} 
                        alt="Icon" 
                        className="h-5 w-5 object-contain"
                      />
                    ) : (
                      <FiImage className="h-4 w-4 text-gray-400" />
                    )}
                  </span>
                  <input
                    type="text"
                    value={link.icon || ''}
                    onChange={(e) => handleSocialLinkChange(index, 'icon', e.target.value)}
                    className="ml-2 flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Chemin de l'icône (ex: /icons/facebook.svg)"
                  />
                </div>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addSocialLink}
            className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiPlus className="h-4 w-4 mr-1" />
            Ajouter un réseau social
          </button>
        </div>
      </div>

      {/* Aperçu du pied de page */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Aperçu du pied de page</h3>
        <div className="border rounded-md overflow-hidden bg-gray-50">
          {/* Newsletter Card */}
          {footerData.Card?.title && (
            <div 
              className="p-6 text-white relative overflow-hidden"
              style={{
                backgroundImage: footerData.Card?.image ? `url(${footerData.Card.image})` : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="relative z-10 max-w-2xl mx-auto text-center">
                <h3 className="text-xl font-bold mb-2">{footerData.Card.title || 'Nouvelle collection'}</h3>
                <p className="mb-4">{footerData.Card.description || 'Découvrez nos dernières créations'}</p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Votre adresse email"
                    className="flex-1 px-4 py-2 rounded-l-md text-gray-900 focus:outline-none"
                  />
                  <button className="bg-black text-white px-4 py-2 rounded-r-md hover:bg-gray-800">
                    S'abonner
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Main Footer */}
          <div className="bg-gray-900 text-white p-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Logo et informations */}
              <div className="space-y-4">
                {footerData.Logo && (
                  <div className="h-12 w-32">
                    <img 
                      src={footerData.Logo} 
                      alt={footerData.Nom || 'Logo'}
                      className="h-full w-auto object-contain"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '';
                      }}
                    />
                  </div>
                )}
                {footerData.Nom && <p className="font-bold">{footerData.Nom}</p>}
                {footerData.Slogan && <p className="text-sm text-gray-400">{footerData.Slogan}</p>}
                
                {footerData.socialLinks?.length > 0 && (
                  <div className="flex space-x-4 pt-2">
                    {footerData.socialLinks.map((link, index) => (
                      <a 
                        key={index} 
                        href={link.url || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white"
                      >
                        {link.icon ? (
                          <img 
                            src={link.icon} 
                            alt={link.platform || 'Réseau social'} 
                            className="h-5 w-5"
                          />
                        ) : (
                          <span className="h-5 w-5 rounded-full bg-gray-700 flex items-center justify-center">
                            <FiLink className="h-3 w-3" />
                          </span>
                        )}
                      </a>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Liens rapides */}
              <div>
                <h4 className="text-white font-medium mb-4">Liens rapides</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white text-sm">Accueil</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white text-sm">Boutique</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white text-sm">À propos</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white text-sm">Contact</a></li>
                </ul>
              </div>
              
              {/* Informations */}
              <div>
                <h4 className="text-white font-medium mb-4">Informations</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white text-sm">Livraison</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white text-sm">Retours & Échanges</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white text-sm">Mentions légales</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white text-sm">Politique de confidentialité</a></li>
                </ul>
              </div>
              
              {/* Contact */}
              <div>
                <h4 className="text-white font-medium mb-4">Contact</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li>123 Rue Exemple, 75000 Paris</li>
                  <li>contact@example.com</li>
                  <li>+33 1 23 45 67 89</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="bg-black text-center py-4 text-sm text-gray-400">
            © {new Date().getFullYear()} {footerData.Nom || 'Votre Marque'}. Tous droits réservés.
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterForm;
