import Header from "../components/Header";
import Hero from "../components/Hero";
import ProductsSection from "../components/ProductsSection";
import AboutSection2 from "../components/AboutSection2";
import CollectionsSection from "../components/CollectionsSection";
//import AboutSection from "../components/AboutSection";
import EvenementsSection from "../components/EvenementsSection";
import Footer from "../components/Footer";

export default function Accueil() {
  return (
    <div className="Accueil">
      {/* Le Header utilise le contexte pour le panier */}
      <Header showCategoriesBar={false} opacity={0} />
      <Hero />
      <ProductsSection />
      <AboutSection2 />
      <CollectionsSection />
      <EvenementsSection />
      <Footer />
    </div>
  );
}
