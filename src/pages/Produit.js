import React from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductPageSection from "../components/ProductPageSection";
import CTACollection from "../components/CTACollection";

export default function Produit() {
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('categorie') || '';
  
  const handleCategorySelect = (category) => {
    // La gestion de la catégorie est maintenant gérée directement dans ProductPageSection via l'URL
  };
  
  return (
    <div className="Produit">
      <Header 
        showCategoriesBar={true} 
        opacity={100} 
        selectedCategory={categoryFromUrl} 
        onCategorySelect={handleCategorySelect} 
      />
      <CTACollection />
      <ProductPageSection />
      <Footer />
    </div>
  );
}