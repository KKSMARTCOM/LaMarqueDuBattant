import React from "react";

const faqs = [
  {
    question: "Quels types de vêtements?",
    answer:
      "Nous proposons une large gamme de vêtements allant des tenues décontractées aux vêtements de soirée. Chaque pièce est conçue avec soin pour allier confort et style. Explorez notre collection pour trouver votre look idéal.",
  },
  {
    question: "Comment passer une commande?",
    answer:
      "Pour passer une commande, parcourez notre site, sélectionnez les articles souhaités et ajoutez-les à votre panier. Ensuite, suivez les instructions pour finaliser votre achat. C'est simple et rapide!",
  },
  {
    question: "Quels sont les délais de livraison?",
    answer:
      "Nos délais de livraison varient en fonction de votre emplacement. En général, vous pouvez vous attendre à recevoir votre commande dans un délai de 3 à 7 jours ouvrables. Nous vous tiendrons informé de l'état de votre livraison.",
  },
  {
    question: "Comment retourner un article?",
    answer:
      "Si vous n'êtes pas satisfait de votre achat, vous pouvez retourner l'article dans un délai de 30 jours. Assurez-vous que l'article est dans son état d'origine. Consultez notre politique de retour pour plus de détails.",
  },
  {
    question: "Offrez-vous des réductions?",
    answer:
      "Oui, nous proposons régulièrement des promotions et des réductions sur une sélection d'articles. Inscrivez-vous à notre newsletter pour être informé des offres spéciales et des ventes exclusives.",
  },
];

export default function FAQSection() {
  return (
    <section className="w-full py-16 px-4 sm:px-4 lg:px-6 bg-black">
      <div className="max-w-6xl mx-auto">
        <h2 className=" text-3xl md:text-4xl font-bold text-left mb-4 text-white">
          Questions fréquentes
        </h2>
        <p className="text-left text-gray-300 mb-12 max-w-4xl">
          Retrouvez les réponses aux questions les plus courantes sur nos produits et services.
        </p>
        {/* Ligne de séparation */}
        <div className="border-t border-black" />
        {/* Liste FAQ avec accordéon natif */}
        <div className="w-full text-left">
          {faqs.map((faq, idx) => (
            <details 
              key={idx} 
              className={`group p-6 rounded-md text-left ${idx % 2 === 0 ? 'bg-black' : 'bg-white/10'}`}
            >
              <summary className="flex justify-between items-center cursor-pointer font-normal text-base sm:text-lg text-left list-none focus:outline-none text-white hover:text-gray-300 transition-colors">
                <span>{faq.question}</span>
                {/* Chevron animé */}
                <svg
                  className="w-5 h-5 ml-2 transition-transform duration-200 group-open:rotate-180 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="text-gray-300 text-sm sm:text-base mt-2 pr-6 text-left">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
        {/* Encart final */}
        <div className="mt-16 text-left">
          <h3 className="font-semibold text-xl mb-2 text-white/90">Des questions restantes?</h3>
          <p className="mb-4 text-gray-300">N'hésitez pas à nous contacter!</p>
          <a
            href="#ContactSection"
            className="inline-block rounded-md border border-white px-4 py-2 bg-transparent text-white hover:bg-white/10 transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </section>
  );
}