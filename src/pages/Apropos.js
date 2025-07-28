// Importation du composant Header
import Header from '../components/Header';
// Importation du composant Footer
import Footer from '../components/Footer';
import AboutSection from "../components/AboutSection";
// Importation de la nouvelle section feature
import AproposFeatureSection from "../components/AproposFeatureSection";
import AproposFeatureStatsSection from "../components/AproposFeatureStatsSection";
import ContactSection from "../components/ContactSection";
import FAQSection from "../components/FAQSection";

// Composant de la page À propos
export default function Apropos() {
  return (
    <>
      {/* En-tête du site (utilise le contexte pour le panier) */}
      <Header showCategoriesBar={false} opacity={100} />
      <AboutSection />
      <AproposFeatureSection />
      <AproposFeatureStatsSection />
      <ContactSection />
      <FAQSection />
      {/* Pied de page du site */}
      <Footer />
    </>
  );
}
