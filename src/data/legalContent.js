import { getLegalInfo } from '../services/brandService';

const getLegalContent = async (type, onClose) => {
  const legal = await getLegalInfo();
  
  switch(type) {
    case 'mentionsLegales':
      return (
        <div>
          <h3 className="font-semibold uppercase text-white/80 mb-2">MENTIONS LEGALES</h3>
          <p className="mb-4">
            Éditeur du site : {legal.mentionsLegales.editor}<br />
            Siège social : {legal.mentionsLegales.address}<br />
            Téléphone : {legal.mentionsLegales.phone}<br />
            Email : {legal.mentionsLegales.email}<br />
            RCS : {legal.mentionsLegales.rcs}<br />
            TVA intracommunautaire : {legal.mentionsLegales.tvaIntracom}
          </p>
          <h4 className="font-medium uppercase text-white/80 mt-4 mb-2">Hébergement :</h4>
          <p>
            {legal.mentionsLegales.hostingProvider.name}<br />
            {legal.mentionsLegales.hostingProvider.address}<br />
            Tél: {legal.mentionsLegales.hostingProvider.phone}
          </p>
        </div>
      );
      
    case 'confidentialite':
      return (
        <div>
          <h3 className="font-semibold uppercase text-white/80 mb-2">POLITIQUE DE CONFIDENTIALITÉ</h3>
          <p className="mb-4">
            {legal.confidentialite.description}
          </p>
          <p>
            Pour toute question sur la protection de vos données, contactez notre DPO :<br />
            {legal.confidentialite.dpoEmail}
          </p>
        </div>
      );
      
    case 'cgv':
      return (
        <div>
          <h3 className="font-semibold uppercase text-white/80 mb-2">CONDITIONS GÉNÉRALES DE VENTE</h3>
          <p className="mb-4">
            {legal.cgv.description}
          </p>
          <h4 className="font-medium uppercase text-white/80 mt-4 mb-2">Livraison :</h4>
          <p>Les délais de livraison sont indiqués à titre indicatif lors de la commande.</p>
          <p>Délai par défaut : {legal.cgv.deliveryTime}</p>
          <p>Frais de port : {legal.cgv.shippingCosts}</p>
        </div>
      );
      
    case 'cookies':
      if (!legal.cookies || !legal.cookies.types) {
        console.error('Données des cookies manquantes ou mal formatées');
        return (
          <div>
            <h3 className="font-semibold uppercase text-white/80 mb-2">PRÉFÉRENCES DES COOKIES</h3>
            <p>Une erreur est survenue lors du chargement des préférences de cookies.</p>
          </div>
        );
      }
      
      return (
        <div>
          <h3 className="font-semibold uppercase text-white/80 mb-2">PRÉFÉRENCES DES COOKIES</h3>
          <p className="mb-4">
            {legal.cookies.description || 'Gérez vos préférences en matière de cookies ci-dessous.'}
          </p>
          <div className="space-y-4">
            {Object.entries(legal.cookies.types).map(([key, cookie]) => (
              <details key={key} className="border-b border-white/10 pb-4">
                <summary className="flex items-start cursor-pointer">
                  <div className="flex items-center h-5">
                    <input
                      id={key}
                      name={`cookie-${key}`}
                      type="checkbox"
                      className="h-4 w-4 rounded-none cursor-pointer text-black focus:ring-black  accent-black -none border border-black"
                      defaultChecked={cookie.default}
                      disabled={cookie.required}
                    />
                  </div>
                  <div className="ml-3 flex flex-row">
                    <span className="text-sm font-medium text-white/80">{cookie.name}</span>
                    {cookie.required && <span className="text-xs text-white/50 ml-1">(toujours actif)</span>}
                    <svg
                        className="w-5 h-5 ml-2 transition-transform duration-200 group-open:rotate-180 text-white/50"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </summary>
                <p className="text-xs text-white/60 mt-2">{cookie.description}</p>
              </details>
            ))}
          </div>
          <div className="mt-6 flex justify-end space-x-3 md:flex-row md:space-x-4 md:space-y-0 space-y-4 md:space-y-reverse flex-col-reverse">
            <button 
              type="button"
              className="px-4 py-2 border border-white/20 text-sm font-medium text-white/80 hover:bg-white/10 w-full md:w-auto"
              onClick={onClose}
            >
              Annuler
            </button>
            <button 
              type="button"
              className="px-4 py-2 bg-white text-sm font-medium text-black hover:bg-white/90 w-full md:w-auto"
            >
              Enregistrer les préférences
            </button>
          </div>
        </div>
      );
      
    default:
      return null;
  }
};

export default getLegalContent;
