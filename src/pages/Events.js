import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroEvents from "../components/HeroEvents";
import EventSection from "../components/EventSection";
import ImageGallerySection from "../components/ImageGallerySection";
import CTACollection from "../components/CTACollection";

export default function Events({onCartClick}) {
  return (
    <div className="Events">
      <Header opacity={100} onCartClick={onCartClick}/>
      <HeroEvents />
      <EventSection/>
      <ImageGallerySection/>
      <CTACollection/>
      <Footer />
    </div>
  );
} 