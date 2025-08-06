import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import EventsDetailsSection from "../components/EventsDetailsSection";
import EventHero from "../components/EventHero";
import EventCountdownSection from "../components/EventCountdownSection";
import Loader from "../components/Loader";
import { useEventDetails } from "../hooks/useEventDetails";

export default function DetailsEvent({ onCartClick }) {
  const { event, loading, error, handleBackToEvents } = useEventDetails();

  // Affichage du chargement
  if (loading) {
    return <Loader />;
  }

  // Affichage des erreurs
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <button 
          onClick={handleBackToEvents}
          className="px-6 py-2 bg-black text-white hover:bg-white/40 hover:text-black transition-colors"
        >
          Retour aux événements
        </button>
      </div>
    );
  }

  // Affichage principal
  return (
    <div className="min-h-screen flex flex-col mt-16">
      <Header opacity={100} onCartClick={onCartClick} />
      <main className="flex-grow">
        {event && (
          <>
            <EventHero event={event} />
            <EventCountdownSection event={event} />
            <EventsDetailsSection event={event} />
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}