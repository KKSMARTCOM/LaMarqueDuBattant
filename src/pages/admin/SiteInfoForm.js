import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiSave, 
  FiArrowLeft,
  FiTag,
  FiHome,
  FiInfo,
  FiFileText,
  FiSearch,
  FiTruck,
  FiRotateCw,
  FiShield,
  FiMail,
} from 'react-icons/fi';
import { Tab } from '@headlessui/react';
import AccueilForm from '../../components/admin/page-editors/AccueilForm';
import EventsForm from '../../components/admin/page-editors/EventsForm';
import AproposForm from '../../components/admin/page-editors/AproposForm';
import HeaderForm from '../../components/admin/page-editors/HeaderForm';
import FooterForm from '../../components/admin/page-editors/FooterForm';
import { saveSiteInfo } from '../../services/siteInfoService';

const SiteInfoForm = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('brand');
  const [activePageTab, setActivePageTab] = useState('Accueil');
  const [additionalSocials, setAdditionalSocials] = useState({});
  const [newSocialName, setNewSocialName] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ type: '', message: '' });

  const [formData, setFormData] = useState({
    brand: {},
    contact: {},
    businessInfo: {},
    stats: {},
    about: {},
    shipping: {},
    returns: {},
    seo: {},
    legal: {},
    PageData: {},
    version: '',
    lastUpdated: ''
  });

  // Charger les données depuis brandInfo.json
  useEffect(() => {
    const fetchBrandInfo = async () => {
      try {
        const response = await fetch('/data/brandInfo.json');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des données');
        }
        const data = await response.json();
        
        // Construire les URLs complètes pour les images
        const processedData = {
          ...data,
          brand: {
            ...data.brand,
            // Si c'est juste un nom de fichier, construire l'URL complète pour l'affichage
            logo: data.brand.logo && !data.brand.logo.startsWith('http') && !data.brand.logo.startsWith('blob:') 
              ? `/images/${data.brand.logo}` 
              : data.brand.logo,
            favicon: data.brand.favicon && !data.brand.favicon.startsWith('http') && !data.brand.favicon.startsWith('blob:') 
              ? `/images/${data.brand.favicon}` 
              : data.brand.favicon
          },
          lastUpdated: new Date().toISOString().split('T')[0],
          version: '1.0.0'
        };
        
        setFormData(prev => ({
          ...prev,
          ...processedData
        }));
      } catch (error) {
        console.error('Erreur:', error);
        setSaveStatus({ 
          type: 'error', 
          message: 'Erreur lors du chargement des données. Veuillez rafraîchir la page.' 
        });
      }
    };

    fetchBrandInfo();
  }, []);

  const handleChange = (e, section, subSection = null) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [section]: subSection 
        ? { ...prev[section], [subSection]: { ...prev[section][subSection], [name]: value } }
        : { ...prev[section], [name]: value }
    }));
  };

  const handleFileUpload = (e, field, section) => {
    const file = e.target.files[0];
    if (!file) return;

    // Créer une URL de prévisualisation pour l'affichage
    const fileUrl = URL.createObjectURL(file);
    // Stocker uniquement le nom du fichier
    const fileName = file.name;
    
    // Mettre à jour l'état avec l'URL pour la prévisualisation
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: fileUrl, // Pour l'affichage
        [`${field}File`]: fileName // Pour la sauvegarde (ex: 'logo' devient 'logoFile')
      }
    }));
  };

  const saveData = useCallback(async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    setSaveStatus({ type: '', message: '' });
    
    try {
      // Préparer les données pour l'envoi
      const dataToSave = {
        ...formData,
        brand: {
          ...formData.brand,
          // Remplacer les URLs par les noms de fichiers
          logo: formData.brand.logoFile || formData.brand.logo?.split('/').pop() || '',
          favicon: formData.brand.faviconFile || formData.brand.favicon?.split('/').pop() || ''
        },
        // S'assurer que PageData est inclus tel quel
        PageData: formData.PageData || {}
      };
      
      // Supprimer les champs temporaires
      delete dataToSave.brand.logoFile;
      delete dataToSave.brand.faviconFile;
      
      console.log('Données à sauvegarder:', JSON.stringify(dataToSave, null, 2));
      
      const result = await saveSiteInfo(dataToSave);
      
      // Mettre à jour l'état avec les données renvoyées par le serveur
      if (result.data) {
        setFormData(prev => ({
          ...prev,
          ...result.data,
          // Conserver les URLs de prévisualisation
          brand: {
            ...result.data.brand,
            logo: formData.brand.logo,
            favicon: formData.brand.favicon
          }
        }));
      }
      
      setSaveStatus({ 
        type: result.success ? 'success' : 'error',
        message: result.message
      });
      
      // Réinitialiser le statut après 5 secondes
      if (result.success) {
        setTimeout(() => {
          setSaveStatus({ type: '', message: '' });
        }, 5000);
      }
      
      return result.success;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde :', error);
      setSaveStatus({ 
        type: 'error',
        message: error.message || 'Une erreur est survenue lors de la sauvegarde. Veuillez réessayer.'
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [formData, isSaving]);
  
  // Effet pour nettoyer les URLs d'objets créés
  React.useEffect(() => {
    return () => {
      // Nettoyer les URLs d'objets créés pour éviter les fuites de mémoire
      Object.values(formData).forEach(section => {
        if (section.logo && section.logo.startsWith('blob:')) {
          URL.revokeObjectURL(section.logo);
        }
        if (section.favicon && section.favicon.startsWith('blob:')) {
          URL.revokeObjectURL(section.favicon);
        }
      });
    };
  }, []);

  const renderBrandSection = () => (
    <div className="space-y-8">
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-2xl font-semibold text-gray-900 text-left">Informations de la marque</h2>
        <p className="mt-1 text-sm text-gray-500 text-left">
          Gérer les informations générales de votre marque qui seront affichées sur le site.
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label htmlFor="brand-name" className="block text-sm font-medium text-gray-700 text-left">
                Nom de la marque
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="brand-name"
                  name="name"
                  value={formData.brand.name}
                  onChange={(e) => handleChange(e, 'brand')}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 text-left">
                Le nom de votre marque tel qu'il apparaîtra sur le site.
              </p>
            </div>
            
            <div className="space-y-1">
              <label htmlFor="brand-slogan" className="block text-sm font-medium text-gray-700 text-left">
                Slogan
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="brand-slogan"
                  name="slogan"
                  value={formData.brand.slogan}
                  onChange={(e) => handleChange(e, 'brand')}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Votre slogan ici"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 text-left">
                Une phrase accrocheuse qui représente votre marque.
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 text-left mb-4">Identité visuelle</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 text-left">
                  Logo
                </label>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 h-20 w-20 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                    {formData.brand.logo ? (
                      <img 
                        src={formData.brand.logo} 
                        alt="Logo actuel" 
                        className="h-full w-full object-contain p-2" 
                      />
                    ) : (
                      <span className="text-gray-400 text-xs text-center px-2">Aperçu du logo</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      id="logo-upload"
                      accept="image/png, image/jpeg, image/svg+xml"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'logo', 'brand')}
                    />
                    <div className="space-y-2">
                      <label
                        htmlFor="logo-upload"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                      >
                        <svg className="-ml-1 mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        {formData.brand.logo ? 'Remplacer le logo' : 'Téléverser un logo'}
                      </label>
                      <p className="text-xs text-gray-500 text-left">
                        Format recommandé : PNG, JPG ou SVG. Taille maximale : 2MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 text-left">
                  Favicon
                </label>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 h-16 w-16 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                    {formData.brand.favicon ? (
                      <img 
                        src={formData.brand.favicon} 
                        alt="Favicon actuel" 
                        className="h-10 w-10 object-contain" 
                      />
                    ) : (
                      <span className="text-gray-400 text-xs text-center px-2">Aperçu du favicon</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      id="favicon-upload"
                      accept=".ico,image/x-icon,image/png"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, 'favicon', 'brand')}
                    />
                    <div className="space-y-2">
                      <label
                        htmlFor="favicon-upload"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                      >
                        <svg className="-ml-1 mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        {formData.brand.favicon ? 'Remplacer le favicon' : 'Téléverser un favicon'}
                      </label>
                      <p className="text-xs text-gray-500 text-left">
                        Format recommandé : ICO ou PNG (32x32px). Taille maximale : 1MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContactSection = () => (
    <div className="space-y-8">
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-2xl font-semibold text-gray-900 text-left">Coordonnées de contact</h2>
        <p className="mt-1 text-sm text-gray-500 text-left">
          Gérer les informations de contact qui seront affichées sur votre site.
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="space-y-6">
          {/* Email et Téléphone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 text-left">
                Email
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  id="contact-email"
                  name="email"
                  value={formData.contact.email}
                  onChange={(e) => handleChange(e, 'contact')}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 text-left">
                L'adresse email de contact principale.
              </p>
            </div>
            
            <div className="space-y-1">
              <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 text-left">
                Téléphone
              </label>
              <div className="mt-1">
                <input
                  type="tel"
                  id="contact-phone"
                  name="phone"
                  value={formData.contact.phone}
                  onChange={(e) => handleChange(e, 'contact')}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="+229 01 23 45 67 89"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 text-left">
                Numéro de téléphone au format international.
              </p>
            </div>
          </div>

          {/* Adresse */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 text-left mb-4">Adresse</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label htmlFor="address-street" className="block text-sm font-medium text-gray-700 text-left">
                  Rue
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="address-street"
                    name="street"
                    value={formData.contact.address.street}
                    onChange={(e) => handleChange(e, 'contact', 'address')}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label htmlFor="address-city" className="block text-sm font-medium text-gray-700 text-left">
                  Ville
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="address-city"
                    name="city"
                    value={formData.contact.address.city}
                    onChange={(e) => handleChange(e, 'contact', 'address')}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label htmlFor="address-postalCode" className="block text-sm font-medium text-gray-700 text-left">
                  Code postal
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="address-postalCode"
                    name="postalCode"
                    value={formData.contact.address.postalCode}
                    onChange={(e) => handleChange(e, 'contact', 'address')}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label htmlFor="address-country" className="block text-sm font-medium text-gray-700 text-left">
                  Pays
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="address-country"
                    name="country"
                    value={formData.contact.address.country}
                    onChange={(e) => handleChange(e, 'contact', 'address')}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Réseaux sociaux */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Réseaux sociaux</h3>
              <button
                type="button"
                onClick={() => document.getElementById('add-social-modal').showModal()}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-black hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black/50"
              >
                + Ajouter un réseau
              </button>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {/* Réseaux sociaux par défaut */}
              {['instagram', 'facebook', 'linkedin', 'whatsapp'].map((platform) => (
                <div key={platform} className="space-y-1">
                  <label htmlFor={`social-${platform}`} className="block text-sm font-medium text-gray-700 text-left">
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      https://
                    </span>
                    <input
                      type="url"
                      id={`social-${platform}`}
                      name={platform}
                      value={formData.contact.socialMedia[platform].replace('https://', '')}
                      onChange={(e) => {
                        const newValue = `https://${e.target.value}`;
                        setFormData(prev => ({
                          ...prev,
                          contact: {
                            ...prev.contact,
                            socialMedia: {
                              ...prev.contact.socialMedia,
                              [platform]: newValue
                            }
                          }
                        }));
                      }}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder={`${platform}.com/votrenom`}
                    />
                  </div>
                </div>
              ))}
              
              {/* Réseaux sociaux supplémentaires */}
              {Object.entries(additionalSocials).map(([platform, url]) => (
                <div key={platform} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label htmlFor={`social-${platform}`} className="block text-sm font-medium text-gray-700 text-left">
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const newSocials = {...additionalSocials};
                        delete newSocials[platform];
                        setAdditionalSocials(newSocials);
                      }}
                      className="text-red-500 hover:text-red-700 text-sm"
                      title="Supprimer ce réseau"
                    >
                      Supprimer
                    </button>
                  </div>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                      https://
                    </span>
                    <input
                      type="url"
                      id={`social-${platform}`}
                      value={url.replace('https://', '')}
                      onChange={(e) => {
                        const newValue = `https://${e.target.value}`;
                        setAdditionalSocials(prev => ({
                          ...prev,
                          [platform]: newValue
                        }));
                      }}
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder={`${platform}.com/votrenom`}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Modal d'ajout de réseau social */}
            <dialog id="add-social-modal" className="fixed inset-0 z-50  bg-transparent overflow-y-hidden">
              <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                  <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                  <div>
                    <div className="mt-3 text-center sm:mt-0 sm:text-left">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        Ajouter un réseau social
                      </h3>
                      <div className="mt-2 space-y-4">
                        <div>
                          <label htmlFor="social-name" className="block text-sm font-medium text-gray-700 text-left mb-1">
                            Nom du réseau
                          </label>
                          <input
                            type="text"
                            id="social-name"
                            placeholder="Ex: Twitter, TikTok, etc."
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={newSocialName}
                            onChange={(e) => setNewSocialName(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                          />
                        </div>
                        <div>
                          <label htmlFor="social-url" className="block text-sm font-medium text-gray-700 text-left mb-1">
                            URL du profil
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                              https://
                            </span>
                            <input
                              type="text"
                              id="social-url"
                              placeholder="exemple.com/votrenom"
                              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              value={newSocialUrl}
                              onChange={(e) => setNewSocialUrl(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                      onClick={() => {
                        if (newSocialName && newSocialUrl) {
                          setAdditionalSocials(prev => ({
                            ...prev,
                            [newSocialName]: `https://${newSocialUrl.replace(/^https?:\/\//, '')}`
                          }));
                          setNewSocialName('');
                          setNewSocialUrl('');
                          document.getElementById('add-social-modal').close();
                        }
                      }}
                      disabled={!newSocialName || !newSocialUrl}
                    >
                      Ajouter
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                      onClick={() => {
                        document.getElementById('add-social-modal').close();
                        setNewSocialName('');
                        setNewSocialUrl('');
                      }}
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            </dialog>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBusinessInfoSection = () => (
    <div className="space-y-8">
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-2xl font-semibold text-gray-900 text-left">Informations légales</h2>
        <p className="mt-1 text-sm text-gray-500 text-left">
          Gérer les informations légales de votre entreprise qui seront affichées sur le site.
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label htmlFor="siret" className="block text-sm font-medium text-gray-700 text-left">
                Numéro SIRET
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="siret"
                  name="siret"
                  value={formData.businessInfo.siret}
                  onChange={(e) => handleChange(e, 'businessInfo')}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="123 456 789 00012"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 text-left">
                Format : 14 chiffres (peut inclure des espaces)
              </p>
            </div>
            
            <div className="space-y-1">
              <label htmlFor="tvaIntracom" className="block text-sm font-medium text-gray-700 text-left">
                TVA intracommunautaire
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="tvaIntracom"
                  name="tvaIntracom"
                  value={formData.businessInfo.tvaIntracom}
                  onChange={(e) => handleChange(e, 'businessInfo')}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="FR 12 123456789"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 text-left">
                Format : FR + 2 chiffres + numéro SIRET (ou SIREN sans contrôle)
              </p>
            </div>
            
            <div className="space-y-1">
              <label htmlFor="rcs" className="block text-sm font-medium text-gray-700 text-left">
                RCS (Registre du Commerce)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="rcs"
                  name="rcs"
                  value={formData.businessInfo.rcs}
                  onChange={(e) => handleChange(e, 'businessInfo')}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Ville + numéro RCS"
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label htmlFor="apeCode" className="block text-sm font-medium text-gray-700 text-left">
                Code APE/NAF
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="apeCode"
                  name="apeCode"
                  value={formData.businessInfo.apeCode}
                  onChange={(e) => handleChange(e, 'businessInfo')}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Ex: 1411Z"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 text-left">
                Code à 4 chiffres + 1 lettre (ex: 1411Z pour la fabrication de vêtements)
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 text-left mb-4">Informations complémentaires</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="legalRepresentative" className="block text-sm font-medium text-gray-700 text-left mb-1">
                  Représentant légal
                </label>
                <input
                  type="text"
                  id="legalRepresentative"
                  name="legalRepresentative"
                  value={formData.businessInfo.legalRepresentative || ''}
                  onChange={(e) => handleChange(e, 'businessInfo')}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Nom et prénom du représentant légal"
                />
              </div>
              
              <div>
                <label htmlFor="publicationDirector" className="block text-sm font-medium text-gray-700 text-left mb-1">
                  Directeur de la publication
                </label>
                <input
                  type="text"
                  id="publicationDirector"
                  name="publicationDirector"
                  value={formData.businessInfo.publicationDirector || ''}
                  onChange={(e) => handleChange(e, 'businessInfo')}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Nom et prénom du directeur de publication"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAboutSection = () => (
    <div className="space-y-8">
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-2xl font-semibold text-gray-900 text-left">À propos</h2>
        <p className="mt-1 text-sm text-gray-500 text-left">
          Personnalisez la section qui présente votre marque et ses valeurs.
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
        {/* Description */}
        <div className="space-y-2">
          <label htmlFor="about-description" className="block text-sm font-medium text-gray-700 text-left">
            Description de la marque
          </label>
          <div className="mt-1">
            <textarea
              id="about-description"
              name="description"
              rows={4}
              value={formData.about.description}
              onChange={(e) => handleChange(e, 'about')}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Présentez votre marque en quelques lignes..."
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 text-left">
            Cette description apparaîtra sur votre page "À propos".
          </p>
        </div>

        {/* Mission */}
        <div className="space-y-2">
          <label htmlFor="about-mission" className="block text-sm font-medium text-gray-700 text-left">
            Notre mission
          </label>
          <div className="mt-1">
            <textarea
              id="about-mission"
              name="mission"
              rows={3}
              value={formData.about.mission}
              onChange={(e) => handleChange(e, 'about')}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Quelle est la mission de votre marque ?"
            />
          </div>
        </div>

        {/* Valeurs */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900 text-left">Nos valeurs</h3>
            <p className="text-sm text-gray-500 text-left">
              Ajoutez jusqu'à 4 valeurs qui définissent votre marque.
            </p>
          </div>
          
          <div className="space-y-3">
            {formData.about.values.map((value, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => {
                      const newValues = [...formData.about.values];
                      newValues[index] = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        about: {
                          ...prev.about,
                          values: newValues
                        }
                      }));
                    }}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder={`Valeur ${index + 1}`}
                  />
                </div>
                {formData.about.values.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newValues = formData.about.values.filter((_, i) => i !== index);
                      setFormData(prev => ({
                        ...prev,
                        about: {
                          ...prev.about,
                          values: newValues
                        }
                      }));
                    }}
                    className="text-red-500 hover:text-red-700"
                    title="Supprimer cette valeur"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            
            {formData.about.values.length < 4 && (
              <button
                type="button"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    about: {
                      ...prev.about,
                      values: [...prev.about.values, '']
                    }
                  }));
                }}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-black hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black/50 mt-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Ajouter une valeur
              </button>
            )}
          </div>
        </div>

        {/* Statistiques */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 text-left mb-4">Nos réalisations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(formData.stats).map(([key, value]) => (
              <div key={key} className="border rounded-lg p-4">
                <label htmlFor={`stat-${key}`} className="block text-sm font-medium text-gray-700 text-left mb-1">
                  {key === 'customersSatisfied' && 'Clients satisfaits'}
                  {key === 'productsSold' && 'Produits vendus'}
                  {key === 'yearsOfExperience' && "Années d'expérience"}
                  {key === 'satisfactionRate' && 'Taux de satisfaction'}
                  {key === 'ethicQuality' && 'Qualité éthique'}
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="number"
                    id={`stat-${key}`}
                    value={value}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        stats: {
                          ...prev.stats,
                          [key]: parseInt(e.target.value) || 0
                        }
                      }));
                    }}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    min="0"
                  />
                  {(key === 'satisfactionRate' || key === 'ethicQuality') && (
                    <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                      %
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderShippingSection = () => (
    <div className="space-y-8">
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-2xl font-semibold text-gray-900 text-left">Livraison</h2>
        <p className="mt-1 text-sm text-gray-500 text-left">
          Configurez les options de livraison pour votre boutique en ligne.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
        {/* Livraison standard */}
        <div className="space-y-4 border-b border-gray-200 pb-6">
          <h3 className="text-lg font-medium text-gray-900 text-left">
            {formData.shipping.domestic.name}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 text-left mb-1">
                Nom de l'option
              </label>
              <input
                type="text"
                value={formData.shipping.domestic.name}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  shipping: {
                    ...prev.shipping,
                    domestic: {
                      ...prev.shipping.domestic,
                      name: e.target.value
                    }
                  }
                }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 text-left mb-1">
                Prix (€)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">€</span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.shipping.domestic.price}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    shipping: {
                      ...prev.shipping,
                      domestic: {
                        ...prev.shipping.domestic,
                        price: parseFloat(e.target.value) || 0
                      }
                    }
                  }))}
                  className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 text-left mb-1">
                Livraison gratuite pour(€)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">€</span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.shipping.domestic.freeThreshold}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    shipping: {
                      ...prev.shipping,
                      domestic: {
                        ...prev.shipping.domestic,
                        freeThreshold: parseFloat(e.target.value) || 0
                      }
                    }
                  }))}
                  className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 text-left mb-1">
                Délai de livraison
              </label>
              <input
                type="text"
                value={formData.shipping.domestic.deliveryTime}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  shipping: {
                    ...prev.shipping,
                    domestic: {
                      ...prev.shipping.domestic,
                      deliveryTime: e.target.value
                    }
                  }
                }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Ex: 2-3 jours ouvrés"
              />
            </div>
          </div>
        </div>

        {/* Livraison express */}
        <div className="space-y-4 border-b border-gray-200 pb-6">
          <h3 className="text-lg font-medium text-gray-900 text-left">
            {formData.shipping.express.name}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 text-left mb-1">
                Nom de l'option
              </label>
              <input
                type="text"
                value={formData.shipping.express.name}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  shipping: {
                    ...prev.shipping,
                    express: {
                      ...prev.shipping.express,
                      name: e.target.value
                    }
                  }
                }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 text-left mb-1">
                Prix (€)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">€</span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.shipping.express.price}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    shipping: {
                      ...prev.shipping,
                      express: {
                        ...prev.shipping.express,
                        price: parseFloat(e.target.value) || 0
                      }
                    }
                  }))}
                  className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 text-left mb-1">
                Délai de livraison
              </label>
              <input
                type="text"
                value={formData.shipping.express.deliveryTime}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  shipping: {
                    ...prev.shipping,
                    express: {
                      ...prev.shipping.express,
                      deliveryTime: e.target.value
                    }
                  }
                }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Ex: 24h"
              />
            </div>
          </div>
        </div>

        {/* Livraison internationale */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 text-left">
            {formData.shipping.international.name}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 text-left mb-1">
                Nom de l'option
              </label>
              <input
                type="text"
                value={formData.shipping.international.name}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  shipping: {
                    ...prev.shipping,
                    international: {
                      ...prev.shipping.international,
                      name: e.target.value
                    }
                  }
                }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 text-left mb-1">
                Prix (€)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">€</span>
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.shipping.international.price}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    shipping: {
                      ...prev.shipping,
                      international: {
                        ...prev.shipping.international,
                        price: parseFloat(e.target.value) || 0
                      }
                    }
                  }))}
                  className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 text-left mb-1">
                Délai de livraison
              </label>
              <input
                type="text"
                value={formData.shipping.international.deliveryTime}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  shipping: {
                    ...prev.shipping,
                    international: {
                      ...prev.shipping.international,
                      deliveryTime: e.target.value
                    }
                  }
                }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Ex: 3-7 jours ouvrés"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReturnsSection = () => (
    <div className="space-y-8">
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-2xl font-semibold text-gray-900 text-left">Retours & Remboursements</h2>
        <p className="mt-1 text-sm text-gray-500 text-left">
          Configurez les conditions de retour et de remboursement pour vos clients.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 text-left mb-1">
                Délai de rétractation (jours)
              </label>
              <input
                type="number"
                min="0"
                value={formData.returns.period}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  returns: {
                    ...prev.returns,
                    period: parseInt(e.target.value) || 0
                  }
                }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 text-left mb-1">
                Conditions de retour
              </label>
              <textarea
                rows="3"
                value={formData.returns.conditions}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  returns: {
                    ...prev.returns,
                    conditions: e.target.value
                  }
                }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 text-left mb-1">
                Processus de retour
              </label>
              <textarea
                rows="3"
                value={formData.returns.process}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  returns: {
                    ...prev.returns,
                    process: e.target.value
                  }
                }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 text-left mb-1">
                Délai de remboursement
              </label>
              <input
                type="text"
                value={formData.returns.refundTime}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  returns: {
                    ...prev.returns,
                    refundTime: e.target.value
                  }
                }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Ex: Sous 14 jours après réception du colis"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSeoSection = () => (
    <div className="space-y-8">
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-2xl font-semibold text-gray-900 text-left">SEO et Référencement</h2>
        <p className="mt-1 text-sm text-gray-500 text-left">
          Optimisez le référencement de votre site web pour les moteurs de recherche.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 text-left mb-1">
              Titre par défaut
            </label>
            <input
              type="text"
              value={formData.seo.defaultTitle}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                seo: {
                  ...prev.seo,
                  defaultTitle: e.target.value
                }
              }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Titre qui s'affiche dans les résultats de recherche"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 text-left mb-1">
              Description par défaut
            </label>
            <textarea
              rows="3"
              value={formData.seo.defaultDescription}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                seo: {
                  ...prev.seo,
                  defaultDescription: e.target.value
                }
              }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Description qui s'affiche dans les résultats de recherche"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 text-left mb-1">
              Mots-clés (séparés par des virgules)
            </label>
            <div className="mt-1">
              <input
                type="text"
                value={formData.seo.keywords.join(', ')}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  seo: {
                    ...prev.seo,
                    keywords: e.target.value.split(',').map(k => k.trim()).filter(k => k)
                  }
                }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="mode, vêtements, prêt-à-porter, éco-responsable"
              />
              <p className="mt-1 text-xs text-gray-500">
                Séparez chaque mot-clé par une virgule
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const handlePageDataChange = (page, section, value) => {
    console.log('handlePageDataChange:', { page, section, value });
    
    setFormData(prev => {
      const updated = {
        ...prev,
        PageData: {
          ...prev.PageData,
          [page]: {
            ...prev.PageData?.[page],
            [section]: value
          }
        }
      };
      
      console.log('Updated PageData:', updated.PageData);
      return updated;
    });
  };
  
  // Effet pour déboguer les changements de PageData
  useEffect(() => {
    console.log('PageData updated:', formData.PageData);
  }, [formData.PageData]);

  const renderPageDataSection = () => {
    const pageData = formData.PageData || {};
    const pageTabs = Object.keys(pageData);
    
    if (pageTabs.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          Aucune donnée de page disponible
        </div>
      );
    }
    
    const renderPageContent = (page) => {
      const pageContent = pageData[page] || {};
      
      switch(page) {
        case 'Accueil':
          return (
            <AccueilForm 
              data={pageContent} 
              onChange={(section, value) => handlePageDataChange(page, section, value)}
            />
          );
        case 'Events':
          return (
            <EventsForm 
              data={pageContent} 
              onChange={(section, value) => handlePageDataChange(page, section, value)}
            />
          );
        case 'Apropos':
          return (
            <AproposForm 
              data={pageContent} 
              onChange={(section, value) => handlePageDataChange(page, section, value)}
            />
          );
        case 'Header':
          return (
            <HeaderForm 
              data={pageContent} 
              onChange={(value) => handlePageDataChange(page, 'Header', value)}
            />
          );
        case 'Footer':
          return (
            <FooterForm 
              data={pageContent} 
              onChange={(value) => handlePageDataChange(page, 'Footer', value)}
            />
          );
        default:
          return (
            <div className="space-y-4">
              {Object.keys(pageContent).map((section) => (
                <div key={section} className="border rounded-lg p-4">
                  <h4 className="font-medium text-left text-gray-900 mb-2">{section}</h4>
                  <p className="text-sm text-gray-500">
                    {typeof pageContent[section] === 'object' 
                      ? JSON.stringify(pageContent[section], null, 2)
                      : pageContent[section]}
                  </p>
                </div>
              ))}
            </div>
          );
      }
    };
    
    return (
      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-5">
          <h2 className="text-2xl font-semibold text-gray-900 text-left">Contenu des pages</h2>
          <p className="mt-1 text-sm text-left text-gray-500">Gérez le contenu des différentes pages du site</p>
        </div>
        
        <Tab.Group selectedIndex={pageTabs.indexOf(activePageTab)} 
                 onChange={(index) => setActivePageTab(pageTabs[index])}>
          <Tab.List className="flex space-x-1 justify-between  rounded-xl bg-gray-100 px-2 py-2 overflow-x-auto">
            {pageTabs.map((page) => (
              <Tab
                key={page}
                className={({ selected }) =>
                  `flex-shrink-0 rounded-lg py-2.5 px-4 text-sm font-medium leading-5
                  ring-white ring-opacity-60 focus:outline-none focus:ring-2
                  ${
                    selected
                      ? 'bg-white shadow text-black'
                      : 'text-gray-600 hover:bg-white/[0.4] hover:text-gray-900'
                  }`
                }
              >
                {page}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-6">
            {pageTabs.map((page) => (
              <Tab.Panel
                key={page}
                className={`rounded-xl bg-white p-6 shadow-sm border border-gray-200`}
              >
                {renderPageContent(page)}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    );
  };

  const renderLegalSection = () => (
    <div className="space-y-8">
      <div className="border-b border-gray-200 pb-5">
        <h2 className="text-2xl font-semibold text-gray-900 text-left">Mentions Légales</h2>
        <p className="mt-1 text-sm text-gray-500 text-left">
          Configurez les mentions légales et les conditions d'utilisation de votre site.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-8">
        {/* Mentions Légales */}
        <div className="space-y-4 border-b border-gray-200 pb-6">
          <h3 className="text-lg font-medium text-gray-900 text-left">Mentions Légales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 text-left mb-1">
                Éditeur
              </label>
              <input
                type="text"
                value={formData.legal.mentionsLegales.editor}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  legal: {
                    ...prev.legal,
                    mentionsLegales: {
                      ...prev.legal.mentionsLegales,
                      editor: e.target.value
                    }
                  }
                }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 text-left mb-1">
                Directeur de la publication
              </label>
              <input
                type="text"
                value={formData.legal.mentionsLegales.publicationDirector}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  legal: {
                    ...prev.legal,
                    mentionsLegales: {
                      ...prev.legal.mentionsLegales,
                      publicationDirector: e.target.value
                    }
                  }
                }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 text-left mb-1">
              Contenu des mentions légales
            </label>
            <textarea
              rows="4"
              value={formData.legal.mentionsLegales.content}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                legal: {
                  ...prev.legal,
                  mentionsLegales: {
                    ...prev.legal.mentionsLegales,
                    content: e.target.value
                  }
                }
              }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Politique de confidentialité */}
        <div className="space-y-4 border-b border-gray-200 pb-6">
          <h3 className="text-lg font-medium text-gray-900 text-left">Politique de confidentialité</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 text-left mb-1">
                Responsable du traitement
              </label>
              <input
                type="text"
                value={formData.legal.confidentialite.dataController}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  legal: {
                    ...prev.legal,
                    confidentialite: {
                      ...prev.legal.confidentialite,
                      dataController: e.target.value
                    }
                  }
                }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 text-left mb-1">
                Délégué à la protection des données
              </label>
              <input
                type="email"
                value={formData.legal.confidentialite.dataProtectionOfficer}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  legal: {
                    ...prev.legal,
                    confidentialite: {
                      ...prev.legal.confidentialite,
                      dataProtectionOfficer: e.target.value
                    }
                  }
                }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 text-left mb-1">
              Description de la politique de confidentialité
            </label>
            <textarea
              rows="4"
              value={formData.legal.confidentialite.description}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                legal: {
                  ...prev.legal,
                  confidentialite: {
                    ...prev.legal.confidentialite,
                    description: e.target.value
                  }
                }
              }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Conditions Générales de Vente */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 text-left">Conditions Générales de Vente</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 text-left mb-1">
                Délai de livraison
              </label>
              <input
                type="text"
                value={formData.legal.cgv.deliveryTime}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  legal: {
                    ...prev.legal,
                    cgv: {
                      ...prev.legal.cgv,
                      deliveryTime: e.target.value
                    }
                  }
                }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 text-left mb-1">
                Frais de port
              </label>
              <input
                type="text"
                value={formData.legal.cgv.shippingCosts}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  legal: {
                    ...prev.legal,
                    cgv: {
                      ...prev.legal.cgv,
                      shippingCosts: e.target.value
                    }
                  }
                }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 text-left mb-1">
              Description des CGV
            </label>
            <textarea
              rows="4"
              value={formData.legal.cgv.description}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                legal: {
                  ...prev.legal,
                  cgv: {
                    ...prev.legal.cgv,
                    description: e.target.value
                  }
                }
              }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'pageData':
        return renderPageDataSection();
      case 'brand':
        return renderBrandSection();
      case 'contact':
        return renderContactSection();
      case 'businessInfo':
        return renderBusinessInfoSection();
      case 'about':
        return renderAboutSection();
      case 'shipping':
        return renderShippingSection();
      case 'returns':
        return renderReturnsSection();
      case 'seo':
        return renderSeoSection();
      case 'legal':
        return renderLegalSection();
      default:
        return (
          <div className="text-center py-12 text-gray-500">
            Section en cours de développement
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl text-left font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Paramètres du site
            </h1>
          </div>
          <div className="flex flex-col space-y-4 mt-8">
            {/* Message de statut */}
            {saveStatus.message && (
              <div className={`p-4 rounded-md ${saveStatus.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                <div className="flex">
                  <div className="flex-shrink-0">
                    {saveStatus.type === 'error' ? (
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{saveStatus.message}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={isSaving}
                className={`inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md ${isSaving ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                <FiArrowLeft className="-ml-1 mr-2 h-5 w-5" />
                Retour
              </button>
              <button
                type="button"
                onClick={saveData}
                disabled={isSaving}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${isSaving ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <FiSave className="-ml-1 mr-2 h-5 w-5" />
                    Enregistrer les modifications
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg text-left leading-6 font-medium text-gray-900">
              Informations générales
            </h3>
            <p className="mt-1 max-w-2xl text-left text-sm text-gray-500">
              Gérer les informations de base de votre site web.
            </p>
          </div>
          <div className="border-t border-gray-200 bg-gray-50">
            <div className="flex flex-col md:flex-row min-h-[calc(100vh-200px)]">
              <div className="w-full md:w-52 border-r border-gray-200 bg-white shadow-sm">
                <nav className="space-y-1 p-2">
                  {[
                    { id: 'brand', name: 'Marque', icon: <FiTag className="w-5 h-5" /> },
                    { id: 'contact', name: 'Contact', icon: <FiMail className="w-5 h-5" /> },
                    { id: 'businessInfo', name: 'Entreprise', icon: <FiHome className="w-5 h-5" /> },
                    { id: 'about', name: 'À propos', icon: <FiInfo className="w-5 h-5" /> },
                    { id: 'pageData', name: 'Contenu', icon: <FiFileText className="w-5 h-5" /> },
                    { id: 'seo', name: 'Référencement', icon: <FiSearch className="w-5 h-5" /> },
                    { id: 'legal', name: 'Légal', icon: <FiShield className="w-5 h-5" /> },
                    { id: 'shipping', name: 'Livraison', icon: <FiTruck className="w-5 h-5" /> },
                    { id: 'returns', name: 'Retours', icon: <FiRotateCw className="w-5 h-5" /> },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`group w-full text-left flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        activeSection === item.id
                          ? 'bg-blue-50 text-gray-700 border-l-4 border-blue-500 font-semibold'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 border-l-4 border-transparent hover:border-gray-200'
                      }`}
                    >
                      <span className="mr-3 text-gray-600">{item.icon}</span>
                      {item.name}
                    </button>
                  ))}
                </nav>
              </div>
              
              {/* Main content */}
              <div className="flex-1 overflow-y-auto bg-gray-50">
                <div className="p-2 md:p-4 max-w-5xl mx-auto w-full">
                  <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 space-y-8">
                    {renderSection()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteInfoForm;
