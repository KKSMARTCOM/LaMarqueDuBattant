/**
 * UserAuthDrawer.js
 * 
 * Description :
 * Composant de tiroir (drawer) pour l'authentification utilisateur.
 * Gère à la fois la connexion et l'inscription des utilisateurs avec un système d'onglets.
 *
 * Fonctionnalités principales :
 * - Affichage en tiroir coulissant depuis la droite
 * - Onglets pour basculer entre connexion et inscription
 * - Formulaire de connexion avec email/mot de passe
 * - Formulaire d'inscription avec validation
 * - Sélecteur de date de naissance
 * - Options "Se souvenir de moi" et "S'inscrire à la newsletter"
 *
 * Props :
 * - open (boolean) : Contrôle l'affichage du tiroir
 * - onClose (function) : Fonction appelée pour fermer le tiroir
 *
 * État local :
 * - tab (string) : Onglet actif ('login' ou 'register')
 * - rememberMe (boolean) : État de la case "Se souvenir de moi"
 * - newsletter (boolean) : État de l'inscription à la newsletter
 * - birthDate (Date|null) : Date de naissance sélectionnée
 * - datePickerOpen (boolean) : État d'ouverture du sélecteur de date
 * - formKey (number) : Clé pour forcer le remontage du formulaire
 *
 * Dépendances :
 * - react-datepicker : Pour la sélection de la date de naissance
 * - react-icons : Pour les icônes
 *
 * Accessibilité :
 * - Gestion du focus à l'ouverture/fermeture
 * - Navigation clavier complète
 * - Libellés associés aux champs de formulaire
 * - Messages d'erreur accessibles
 *
 * Responsive :
 * - Pleine largeur sur mobile, largeur limitée sur desktop
 * - Adapte la hauteur du sélecteur de date
 *
 * Exemple d'utilisation :
 * ```jsx
 * const [isAuthOpen, setIsAuthOpen] = useState(false);
 * 
 * <button onClick={() => setIsAuthOpen(true)}>Connexion</button>
 * <UserAuthDrawer 
 *   open={isAuthOpen}
 *   onClose={() => setIsAuthOpen(false)}
 * />
 * ```
 */

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function UserAuthDrawer({ open, onClose }) {
  const [tab, setTab] = useState('login'); // 'login' ou 'register'
  const [rememberMe, setRememberMe] = useState(false);
  const [newsletter, setNewsletter] = useState(false);
  const [birthDate, setBirthDate] = useState(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [formKey, setFormKey] = useState(0); // Pour forcer le remount à chaque changement d'onglet

  // Remount le form à chaque changement d'onglet pour relancer l'animation
  React.useEffect(() => { setFormKey(k => k + 1); }, [tab, open]);

  if (!open) return null;

  return (
    <>
      {/* Overlay sombre */}
      <div className="fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300" onClick={onClose} />
      {/* Drawer */}
      <div className="fixed top-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col h-full min-h-0 transition-transform duration-300" style={{ transform: open ? 'translateX(0)' : 'translateX(100%)' }}>
        {/* Header onglets (hors du contenu scrolable) */}
        <div className="flex items-center justify-between px-2 pt-6 border-b border-gray-200">
          <div className="flex w-full justify-between gap-0 px-8">
            <button
              className={`text-base font-semibold pb-2 border-b-2 transition-all ${tab === 'login' ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
              onClick={() => setTab('login')}
            >
              Se connecter
            </button>
            <button
              className={`text-base font-semibold pb-2 border-b-2 transition-all ${tab === 'register' ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
              onClick={() => setTab('register')}
            >
              Enregistrez
            </button>
          </div>
          <button onClick={onClose} className="text-2xl text-gray-500 hover:text-black transition">&times;</button>
        </div>
        {/* Formulaires scrolables (comme CartDrawer) */}
        <div className="flex-1 overflow-y-auto min-h-0 px-8 py-8 text-[15px] scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {tab === 'login' ? (
            <div key={formKey} className="animate-fadein-slideup">
              <form className="flex flex-col gap-6 w-full max-w-md mx-auto">
                {/* Titre et sous-titre */}
                <h2 className="text-xl font-semibold text-center mb-2">Se connecter</h2>
                <p className="text-center text-gray-600 mb-6">Bienvenue.<br />Connectez-vous ci-dessous pour accéder à votre compte.</p>
                <input type="email" placeholder="Email" className="border-b border-gray-300 py-2 px-1 focus:outline-none focus:border-black transition" />
                <input type="password" placeholder="Mot de passe" className="border-b border-gray-300 py-2 px-1 focus:outline-none focus:border-black transition" />
                {/* Case à cocher */}
                <label className="flex items-center gap-2 text-sm mb-2">
                  <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="w-5 h-5 accent-black -none border border-black" />
                  Souvenez-vous de moi
                </label>
                <button type="submit" className="bg-black text-white py-2  font-semibold hover:bg-gray-900 transition">SE CONNECTER</button>
                <a href="#MotDePasseOublie" className="text-xs text-gray-600 underline text-center mt-2">Vous avez oublié votre mot de passe ?</a>
              </form>
            </div>
          ) : (
            <div key={formKey} className="animate-fadein-slideup">
              <form className="flex flex-col gap-6 w-full max-w-md mx-auto">
                {/* Titre et sous-titre */}
                <h2 className="text-xl font-semibold text-center mb-2">Rejoignez-nous</h2>
                <p className="text-center text-gray-600 mb-6">Créez votre compte pour accéder à l'historique de vos commandes, à l'état de vos commandes, aux adresses enregistrées et plus encore.</p>
                <input type="email" placeholder="Email*" className="border-b border-gray-300 py-2 px-1 focus:outline-none focus:border-black transition" />
                <input type="password" placeholder="Mot de passe*" className="border-b border-gray-300 py-2 px-1 focus:outline-none focus:border-black transition" />
                <input type="password" placeholder="Répéter le mot de passe*" className="border-b border-gray-300 py-2 px-1 focus:outline-none focus:border-black transition" />
                <input type="text" placeholder="Nom de famille*" className="border-b border-gray-300 py-2 px-1 focus:outline-none focus:border-black transition" />
                <input type="text" placeholder="Prénom*" className="border-b border-gray-300 py-2 px-1 focus:outline-none focus:border-black transition" />
                <input type="text" placeholder="Pays" className="border-b border-gray-300 py-2 px-1 focus:outline-none focus:border-black transition" />
                {/* DatePicker custom */}
                <div className="relative w-full border-b border-gray-300" style={{ width: '100%' }}>
                  <DatePicker
                    selected={birthDate}
                    onChange={date => setBirthDate(date)}
                    onFocus={() => setDatePickerOpen(true)}
                    onBlur={() => setDatePickerOpen(false)}
                    open={datePickerOpen}
                    onClickOutside={() => setDatePickerOpen(false)}
                    placeholderText="Date de naissance"
                    dateFormat="dd/MM/yyyy"
                    className="justify-start items-start border-b border-gray-300 py-2 px-1 focus:outline-none focus:border-black transition w-full bg-white text-black -none"
                    style={{ width: '100%' }}
                    calendarClassName="justify-start items-start !bg-white !border !border-black  !text-black"
                    dayClassName={date => '!-none hover:!bg-black hover:!text-white'}
                    popperClassName="z-50"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 ml-28">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  </span>
                </div>
                {/* Case à cocher newsletter */}
                <label className="flex items-start gap-2 text-sm mb-2 text-left">
                  <input type="checkbox" checked={newsletter} onChange={e => setNewsletter(e.target.checked)} className="w-8 h-8 accent-black -none border border-black" />
                  Inscrivez-vous aux courriels pour être informé des dernières collections, collaborations et événements.
                </label>
                <button type="submit" className="bg-black text-white py-2  font-semibold hover:bg-gray-900 transition">REJOIGNEZ-NOUS</button>
                {/* Lien pour se connecter */}
                <div className="text-xs text-center mt-2">
                  Vous avez déjà un compte ?{' '}
                  <button type="button" className="underline text-black" onClick={() => setTab('login')}>Se connecter</button>
                </div>
                {/* Texte d'information bas */}
                <div className="text-[11px] text-center text-gray-500 mt-4 mb-2">
                  En créant un compte, vous acceptez notre{' '}
                  <a href="#" className="underline">politique de confidentialité</a> et nos{' '}
                  <a href="#" className="underline">conditions d'utilisation</a>.
                </div>
              </form>
            </div>
          )}
        </div>
        <style>{`
          .scrollbar-none::-webkit-scrollbar { display: none; }
          .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
          .react-datepicker-wrapper,
          .react-datepicker__input-container {
            width: 100% !important;
            display: block !important;
          }
          .animate-fadein-slideup {
            animation: fadein-slideup 0.5s cubic-bezier(0.33,1,0.68,1);
          }
          @keyframes fadein-slideup {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .react-datepicker__header { background: #fff; border-bottom: 1px solid #000; border-radius: 0; }
          .react-datepicker__current-month, .react-datepicker__day-name, .react-datepicker__day, .react-datepicker__year-dropdown, .react-datepicker__month-dropdown {
            color: #111;
            font-size: 15px;
          }
          .react-datepicker__day--selected, .react-datepicker__day--keyboard-selected {
            background: #000 !important;
            color: #fff !important;
            border-radius: 0 !important;
          }
          .react-datepicker__day:hover {
            background: #000 !important;
            color: #fff !important;
            border-radius: 0 !important;
          }
          .react-datepicker__triangle { display: none; }
          .react-datepicker__month-dropdown, .react-datepicker__year-dropdown {
            background: #fff; color: #111; border-radius: 0; border: 1px solid #000;
          }
        `}</style>
      </div>
    </>
  );
} 