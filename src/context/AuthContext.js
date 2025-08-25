/**
 * AuthContext.js
 * 
 * Description :
 * Ce fichier définit le contexte d'authentification de l'application.
 * Il fournit un moyen de partager l'état d'authentification entre les composants
 * sans avoir à passer explicitement les props à travers chaque niveau de l'arborescence.
 *
 * Fonctionnalités principales :
 * - Gère l'état d'authentification de l'utilisateur
 * - Persiste la session via localStorage
 * - Fournit des méthodes pour se connecter et se déconnecter
 *
 * Utilisation :
 * - Envelopper l'application avec <AuthProvider>
 * - Utiliser le hook useAuth() dans n'importe quel composant enfant pour accéder à l'état d'authentification
 */

import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté au chargement
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Vérification des identifiants
    // Pour le moment, on utilise des identifiants codés en dur
    // À terme, il faudrait faire une requête à une API sécurisée
    const validCredentials = [
      { email: 'directeur@lamarquedubattant.com', password: 'Directeur123', role: 'admin' },
      { email: 'admin@example.com', password: 'admin123', role: 'admin' }
    ];

    const user = validCredentials.find(
      cred => cred.email === email && cred.password === password
    );

    if (user) {
      const userData = { email: user.email, role: user.role };
      localStorage.setItem('adminUser', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    }
    
    return { 
      success: false, 
      error: 'Identifiants incorrects. Veuillez réessayer.' 
    };
  };

  const logout = () => {
    localStorage.removeItem('adminUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
