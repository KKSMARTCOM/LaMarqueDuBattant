import getImagePath from "./getImagePath";
import { useState } from 'react';

export default function CTACollection() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici, vous pourriez ajouter la logique d'abonnement
    console.log('Email soumis :', email);
    setIsSubscribed(true);
    setEmail('');
    // Réinitialiser le message après 5 secondes
    setTimeout(() => setIsSubscribed(false), 5000);
  };

  return (
    <section 
    id="cta-collection"
    className="relative  mb-16 px-6 md:px-20 lg:px-40 overflow-hidden w-full">
      <div 
        className="w-full min-h-[350px] rounded-md flex items-center  justify-center relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${getImagePath('Clothing-Canyon.png', 'cover')})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          transition: 'all 0.5s ease',
          transform: isHovered ? 'scale(1.02)' : 'scale(1)'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-2 text-center rounded-md">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6">
            Restez Informé des Dernières Tendances
          </h2>
          <p className="text-sm sm:text-base text-gray-200 mb-8 max-w-2xl mx-auto hidden lg:block">
            Inscrivez-vous à notre newsletter pour recevoir en avant-première nos nouvelles collections, offres exclusives et conseils de style.
          </p>
          
          {!isSubscribed ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Votre adresse email"
                className="flex-grow bg-black/40 w-full sm:w-auto px-6 py-2 border border-gray-300 text-white font-medium hover:border-black transition"
                required
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2  bg-black text-white font-medium hover:bg-white hover:text-black transition"
              >
                S'abonner
              </button>
            </form>
          ) : (
            <div className="bg-white/10 border border-white text-white/60 px-6 py-3  inline-block">
              Merci pour votre inscription ! À bientôt dans votre boîte mail.
            </div>
          )}
          
          <p className="text-xs md:text-sm text-gray-300 mt-6">
          En vous inscrivant, vous acceptez notre politique de confidentialité.
          </p>
        </div>
        <div className="absolute rounded-md inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div >
    </section>
  );
}