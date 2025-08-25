/**
 * ProtectedRoute.js
 * 
 * Description :
 * Ce composant protège les routes qui nécessitent une authentification.
 * Il vérifie si l'utilisateur est connecté avant de permettre l'accès aux routes protégées.
 *
 * Fonctionnalités principales :
 * - Vérifie l'état d'authentification via le AuthContext
 * - Affiche un indicateur de chargement pendant la vérification
 * - Redirige vers la page de connexion si l'utilisateur n'est pas authentifié
 * - Mémorise l'URL demandée pour une redirection après connexion
 *
 * Utilisation :
 * <Route 
 *   path="/route-protegee" 
 *   element={
 *     <ProtectedRoute>
 *       <ComposantProtege />
 *     </ProtectedRoute>
 *   } 
 * />
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Chargement...</div>;
  }

  if (!user) {
    // Rediriger vers la page de connexion mais sauvegarder l'emplacement actuel
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
