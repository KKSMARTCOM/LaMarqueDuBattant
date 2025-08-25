/**
 * App.js
 * 
 * Description :
 * Ce fichier est le composant racine de l'application React.
 * Il configure le routeur principal et définit toutes les routes de l'application.
 *
 * Fonctionnalités principales :
 * - Configuration du routeur React Router
 * - Définition de toutes les routes de l'application
 * - Intégration du panier d'achat
 * - Gestion des états globaux via les Contextes
 *
 * Routes principales :
 * - / : Page d'accueil
 * - /produits : Liste des produits
 * - /produit/:id : Détail d'un produit
 * - /apropos : Page À propos
 * - /events : Liste des événements
 * - /events/:id : Détail d'un événement
 * - /admin/* : Tableau de bord d'administration
 *
 * Composants clés :
 * - Router : Fournit le contexte de routage à toute l'application
 * - Routes/Route : Définit les chemins et les composants associés
 * - CartDrawer : Panier d'achat glissant
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import React from "react";
// Import des composants
import Accueil from "../pages/Accueil";
import Produit from "../pages/Produit";
import DetailsProduits from "../pages/DetailsProduits";
import CartDrawer from "./CartDrawer";
import "./App.css";
import Apropos from "../pages/Apropos";
import Events from "../pages/Events";
import DetailsEvent from "../pages/DetailsEvent";
import { useCart } from "./CartContext";
// Import du tableau de bord d'administration
import { Dashboard as AdminDashboard } from "../pages/admin";
import { ChangesCartProvider } from "../context/ChangesCartContext";
import ChangesCartModal from "./admin/ChangesCartModal";

function App() {
  // On utilise le contexte global du panier
  const { cartOpen, closeCart } = useCart();
  return (
    <ChangesCartProvider>
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
          <Route path="/events/:id" element={<DetailsEvent />} />
          
          {/* Routes du tableau de bord d'administration */}
          {/* <Route path="/admin/*" element={<AdminDashboard />} /> */}
          
          {/* Redirection pour les routes inconnues */}
          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          {/* Le CartDrawer utilise le contexte pour s'ouvrir/se fermer */}
          <CartDrawer
            open={cartOpen}
            onClose={closeCart}
          />
          {/* Modale globale du panier de modifications */}
          <ChangesCartModal />
        </div>
      </Router>
    </ChangesCartProvider>
  );
}

export default App;
