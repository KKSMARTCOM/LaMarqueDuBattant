import React, { useState, useEffect } from "react";

export default function FAQSection() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await fetch('/data/brandInfo.json');
        if (!response.ok) {
          throw new Error('Erreur lors du chargement des FAQ');
        }
        const data = await response.json();
        const faqsData = data.PageData?.Apropos?.FAQ?.faqs || [];
        setFaqs(faqsData);
      } catch (err) {
        console.error('Erreur:', err);
        setError('Impossible de charger les questions fréquentes');
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  if (loading) {
    return (
      <section className="w-full py-16 px-4 sm:px-4 lg:px-6 bg-black">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-white">Chargement des questions fréquentes...</p>
        </div>
      </section>
    );
  }

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