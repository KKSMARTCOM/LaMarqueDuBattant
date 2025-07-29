import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import EventHero from "../components/EventHero";
import EventCountdownSection from "../components/EventCountdownSection";
import ImageGallerySection from "../components/ImageGallerySection";

export default function DetailsEvent({ onCartClick }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch("/data/events.json");
        const events = await response.json();
        const foundEvent = events.find(e => e.id === parseInt(id));
        
        if (foundEvent) {
          setEvent(foundEvent);
        } else {
          setError("Événement non trouvé");
        }
      } catch (err) {
        setError("Erreur lors du chargement de l'événement");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <button 
          onClick={() => navigate('/events')}
          className="px-6 py-2 bg-black text-white  hover:bg-white/20 hover:text-white transition-colors"
        >
          Retour aux événements
        </button>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="min-h-screen flex flex-col my-16">
      <Header opacity={100} onCartClick={onCartClick} />
      
      <main className="flex-grow ">

        {!loading && !error && event && (
          <>
            <EventCountdownSection event={event} />
            <ImageGallerySection />
          </>
        )}

      </main>

      <Footer />
    </div>
  );
}
