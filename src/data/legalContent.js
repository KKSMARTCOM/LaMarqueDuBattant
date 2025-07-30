export const legalContent = {
  mentionsLegales: (
    <div>
      <h3 className="font-semibold uppercase text-white/80 mb-2">MENTIONS LEGALES</h3>
      <p className="mb-4">
        Éditeur du site : La Marque Du Battant<br />
        Siège social : [Adresse complète]<br />
        Téléphone : [Numéro de téléphone]<br />
        Email : contact@lamarquedubattant.com<br />
        RCS : [Numéro RCS]<br />
        TVA intracommunautaire : [Numéro de TVA]
      </p>
      <h4 className="font-medium uppercase text-white/80 mt-4 mb-2">Hébergement :</h4>
      <p>
        [Nom de l'hébergeur]<br />
        [Adresse de l'hébergeur]<br />
        [Téléphone de l'hébergeur]
      </p>
    </div>
  ),
  confidentialite: (
    <div>
      <h3 className="font-semibold uppercase text-white/80 mb-2">POLITIQUE DE CONFIDENTIALITE</h3>
      <p className="mb-4">
        La Marque Du Battant s'engage à protéger vos données personnelles.
        Nous utilisons vos informations uniquement pour traiter vos commandes et vous fournir le meilleur service possible.
      </p>
      <p>
        Pour en savoir plus sur la façon dont nous protégeons vos données, veuillez nous contacter à l'adresse email suivante :
        contact@lamarquedubattant.com
      </p>
    </div>
  ),
  cgv: (
    <div>
      <h3 className="font-semibold uppercase text-white/80 mb-2">Conditions Générales de Vente</h3>
      <p className="mb-4">
        Les présentes conditions générales de vente s'appliquent à toutes les commandes passées sur notre site.
        Le fait de passer commande implique l'acceptation sans réserve de ces conditions.
      </p>
      <h4 className="font-medium uppercase text-white/80 mt-4 mb-2">Livraison :</h4>
      <p>Les délais de livraison sont indiqués à titre indicatif lors de la commande.</p>
    </div>
  ),
  cookies: (
    <div>
      <h3 className="font-semibold uppercase text-white/80 mb-2">PRÉFÉRENCES DES COOKIES</h3>
      <p className="mb-4">
        Ce site utilise des cookies pour améliorer votre expérience utilisateur.
        Vous pouvez accepter ou refuser les cookies non essentiels.
      </p>
      <div className="space-y-2">
        <div className="flex items-center">
          <input type="checkbox" id="necessary" className="rounded-none mr-2 w-5 h-5 accent-black -none border border-black" defaultChecked disabled />
          <label htmlFor="necessary">Cookies nécessaires (toujours actifs)</label>
        </div>
        <div className="flex items-center">
          <input type="checkbox" id="analytics" className="rounded-none mr-2 w-5 h-5 accent-black -none border border-black" />
          <label htmlFor="analytics">Cookies d'analyse</label>
        </div>
        <div className="flex items-center">
          <input type="checkbox" id="marketing" className="rounded-none mr-2 w-5 h-5 accent-black -none border border-black" />
          <label htmlFor="marketing">Cookies marketing</label>
        </div>
      </div>
      <button className="mt-4 px-4 py-2 w-full bg-white text-black text-sm  hover:bg-white/20 hover:text-white transition-colors">
        Enregistrer les préférences
      </button>
    </div>
  )
};
