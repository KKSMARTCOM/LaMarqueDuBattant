import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
// Import des composants
import Accueil from "../pages/Accueil";
import Produit from "../pages/Produit";
import DetailsProduits from "../pages/DetailsProduits";
import CartDrawer from "./CartDrawer";
import "./App.css";
import Apropos from "../pages/Apropos";
import Events from "../pages/Events";
import { useCart } from "./CartContext";

function App() {
  // On utilise le contexte global du panier
  const { cartOpen, closeCart } = useCart();
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Route pour les pages - plus besoin de passer onCartClick */}
          <Route path="/" element={<Accueil />} />
          <Route path="/produits" element={<Produit />} />
          <Route path="/produit/:id" element={<DetailsProduits />} />
          <Route path="/details-produit" element={<DetailsProduits />} />
          <Route path="/apropos" element={<Apropos />} />
          <Route path="/events" element={<Events />} />
        </Routes>
        {/* Le CartDrawer utilise le contexte pour s'ouvrir/se fermer */}
        <CartDrawer
          open={cartOpen}
          onClose={closeCart}
        />
      </div>
    </Router>
  );
}

export default App;
