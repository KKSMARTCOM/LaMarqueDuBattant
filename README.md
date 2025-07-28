# La Marque Du Battant - Site E-commerce Premium

Une plateforme e-commerce haut de gamme développée avec les dernières technologies React pour la marque La Marque Du Battant, spécialisée dans les vêtements et accessoires de qualité supérieure.

## 🚀 Fonctionnalités Avancées

### Navigation et Interface Premium
- **Header intelligent** avec méga-menu dynamique et animations fluides
- **Système de catégories avancé** avec aperçu des produits
- **Filtrage avancé** avec état persistant et URL partageable
- **Design responsive** optimisé pour tous les appareils
- **Thème sombre/clair** avec préférence utilisateur mémorisée

### Gestion des Produits
- **Fiches produits enrichies** avec galerie d'images interactive
- **Système de recommandations** intelligent
- **Affichage des tailles disponibles** avec sélection intuitive
- **Prévisualisation rapide** sans quitter la page

### Panier & Paiement
- **Panier persistant** avec sauvegarde en temps réel
- **Processus de paiement** simplifié en 3 étapes
- **Paiements sécurisés** avec multiples options
- **Suivi de commande** intégré

### Expérience Utilisateur Premium
- **Animations 3D** avec Three.js et React Three Fiber
- **Chargement progressif** des images et du contenu
- **Recherche intelligente** avec suggestions en temps réel
- **Mode hors-ligne** avec Service Workers

## 🛠️ Stack Technologique Moderne

### Frontend
- **React 19** - Dernière version stable avec Concurrent Mode
- **React Router DOM v7** - Navigation avancée avec chargement paresseux
- **Tailwind CSS 3** - Utilitaires CSS avec configuration personnalisée
- **GSAP** - Animations fluides et performantes

### 3D & Graphismes
- **Three.js** - Moteur 3D WebGL
- **@react-three/fiber** - Rendu 3D déclaratif pour React
- **OGL** - Bibliothèque de rendu WebGL légère

### Gestion d'État & Données
- **Contexte React** - Gestion d'état global
- **Hooks personnalisés** - Logique réutilisable
- **API Fetch** - Appels réseau modernes

### Outils de Développement
- **Vite** - Bundler ultra-rapide
- **ESLint & Prettier** - Qualité et formatage du code
- **PostCSS** - Traitement CSS avancé

## 📁 Structure du Projet

```
src/
├── components/                  # Composants UI réutilisables
│   ├── Header/                 # Navigation principale
│   │   ├── MegaMenu/           # Système de méga-menu
│   │   └── CartDrawer.js       # Panier latéral
│   ├── ProductCard.js          # Carte produit interactive
│   ├── ProductQuickView.js     # Aperçu rapide produit
│   └── ...
│
├── pages/                     # Vues de l'application
│   ├── Accueil.js            # Page d'accueil avec sections
│   ├── Produit.js            # Liste des produits
│   ├── DetailsProduits.js    # Détail d'un produit
│   ├── Apropos.js            # Page À propos
│   └── Events.js             # Événements et actualités
│
├── hooks/                    # Hooks personnalisés
│   ├── useArticles.js        # Gestion des articles
│   ├── useCart.js           # Gestion du panier
│   └── useWindowSize.js     # Détection de la taille d'écran
│
├── data/                     # Données structurées
│   ├── articles.json        # Catalogue complet
│   ├── categories.json      # Arborescence catégories
│   └── ...
│
└── assets/                  # Ressources statiques
    ├── images/             # Images optimisées
    └── animations/         # Animations et composants 3D
```

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+ et npm 9+
- Git pour le contrôle de version
- Un éditeur de code moderne (VS Code recommandé)

### Installation
```bash
# Cloner le dépôt
git clone https://github.com/votre-utilisateur/marquedubattant.git

# Se déplacer dans le dossier du projet
cd marquedubattan

# Installer les dépendances
npm install
```

### Variables d'Environnement
Créez un fichier `.env` à la racine du projet :
```
VITE_API_URL=https://api.votreserveur.com
VITE_STRIPE_PUBLIC_KEY=votre_cle_stripe
```

### Démarrage en Développement
```bash
# Démarrer le serveur de développement
npm run dev

# L'application sera disponible sur http://localhost:5173
```

### Construction pour la Production
```bash
# Créer une version optimisée
npm run build

# Prévisualiser la version de production localement
npm run preview
```

### Scripts Principaux
- `dev` - Lance le serveur de développement Vite
- `build` - Construit l'application pour la production
- `preview` - Prévient la version de production localement
- `lint` - Vérifie le code avec ESLint
- `format` - Formate le code avec Prettier

## 🌟 Points Forts Techniques

### Architecture Moderne
- **Composants Modulaires** : Structure claire et maintenable
- **Chargement Paresseux** : Optimisation des performances
- **Code Splitting** : Chargement intelligent des ressources
- **Hooks Personnalisés** : Logique métier réutilisable

### Performance Optimisée
- **Images Responsives** : Chargement adaptatif
- **Mise en Cache Intelligente** : Meilleure expérience utilisateur
- **Optimisation SEO** : Balisage sémantique et métadonnées
- **Temps de Chargement Rapide** : Grâce à Vite et au code splitting

### Sécurité
- **Validation des Données** : Côté client et serveur
- **Protection XSS** : Échappement automatique du contenu
- **Gestion des Erreurs** : Messages clairs et journalisation

## 📚 Documentation Technique

### Structure des Données
Les produits suivent le schéma suivant :
```typescript
interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discount_percent?: number;
  sizes: string[];
  colors: string[];
  images: string[];
  category: string;
  tags: string[];
  stock: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Contribution
1. Forkez le dépôt
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/ma-nouvelle-fonctionnalite`)
3. Committez vos modifications (`git commit -am 'Ajout d\'une nouvelle fonctionnalité'`)
4. Poussez vers la branche (`git push origin feature/ma-nouvelle-fonctionnalite`)
5. Créez une Pull Request
- **Layout responsive** : Deux colonnes sur desktop, empilé sur mobile
- **Image de fond** : Couvre toute la hauteur de la colonne gauche
- **Colonne droite scrollable** : Avec scrollbar masquée
- **Animations** : Fade-in et slide-up pour l'information produit
- **Navigation par onglets** : Détails, expédition, retours

### Composants Réutilisables
- **ProductCard** : Composant unifié pour l'affichage des articles
- **CategoriesBar** : Barre de catégories interactive
- **ProductDetailsSection** : Layout détaillé pour les pages produit

### Pagination et Navigation
- **Pagination synchronisée** : Points et flèches synchronisés avec le scroll
- **Calcul dynamique** : Nombre de pages basé sur les éléments visibles
- **Scroll fluide** : Navigation smooth avec snap

## 🔧 Configuration

### Tailwind CSS
Le projet utilise Tailwind CSS pour le styling. La configuration se trouve dans `tailwind.config.js`.

### Données
Les données sont stockées dans des fichiers JSON dans `src/data/` :
- `articles.json` : Catalogue des produits
- `events.json` : Événements et actualités
- `articlestypes.json` : Types d'articles

## 📱 Responsive Design

Le site est entièrement responsive avec :
- **Mobile-first** : Design optimisé pour mobile
- **Breakpoints** : Adaptation automatique selon la taille d'écran
- **Navigation adaptative** : Menu et filtres adaptés au mobile
- **Layout flexible** : Colonnes qui s'empilent sur mobile

## 🎯 Améliorations Récentes

- ✅ **Composant ProductCard unifié** pour éviter la duplication de code
## 🏆 Fonctionnalités Clés

- 🚀 **Performance** : Chargement ultra-rapide avec Vite et code splitting
- 🎨 **Design** : Interface utilisateur moderne et élégante
- 🔍 **Navigation** : Recherche intuitive et filtrage avancé
- 🛒 **Panier** : Gestion fluide des achats
- 📱 **Responsive** : Parfait sur tous les appareils
- 🔄 **Mise à jour en temps réel** : Sans rechargement de page
- 🛡️ **Sécurité** : Protection des données utilisateurs
- 🌍 **Internationalisation** : Prêt pour plusieurs langues

## 📞 Support
Pour toute question ou problème, veuillez ouvrir une [issue](https://github.com/votre-utilisateur/marquedubattant/issues) sur GitHub.

## 📜 Licence
Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence [MIT](LICENSE).

---

**La Marque Du Battant** - Artisanat de qualité depuis [année]

---

## 🛠️ Suivi des améliorations techniques (Roadmap interne)

### Axes d'amélioration identifiés

1. **Mettre en place un contexte React pour le panier et les données globales**
2. Factoriser les hooks et composants réutilisables
3. Améliorer l’accessibilité (ARIA, focus, navigation clavier)
4. Centraliser la gestion des erreurs et la validation des données
5. Optimiser les performances (éviter le polling, mutualiser les fetchs)
6. Renforcer les tests unitaires et l’usage d’un linter

---

### 1. Mise en place d’un contexte React pour le panier

**Problème actuel :**
- La gestion de l’ouverture/fermeture du panier se fait via des props (`onCartClick`) passées manuellement à chaque page et au Header (prop drilling).
- Cela complique l’ajout du panier sur de nouvelles pages et rend le code moins maintenable.

**Solution proposée :**
- Créer un contexte React (`CartContext` ou `UIContext`) qui expose l’état d’ouverture du panier et une fonction pour l’ouvrir/fermer.
- Tous les composants (Header, pages, etc.) pourront accéder à ce contexte sans passer de props.

**Étapes à suivre :**
1. Créer un fichier `CartContext.js` dans `src/components/` ou `src/context/`.
2. Définir le provider avec l’état `cartOpen` et les fonctions `openCart`, `closeCart`.
3. Remplacer l’état local du panier dans `App.js` par le contexte.
4. Utiliser le hook `useContext(CartContext)` dans le Header et le CartDrawer.
5. Supprimer la prop `onCartClick` partout où elle n’est plus nécessaire.
6. Tester sur toutes les pages que l’ouverture/fermeture du panier fonctionne.

**Bénéfices :**
- Plus besoin de propager manuellement les callbacks.
- Ajout du panier sur de nouvelles pages instantané.
- Code plus lisible, évolutif et maintenable.

**Exemple de structure du contexte :**
```js
import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartOpen, setCartOpen] = useState(false);
  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);
  return (
    <CartContext.Provider value={{ cartOpen, openCart, closeCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
```

---

*Mettre en œuvre ce contexte facilitera toutes les évolutions futures liées au panier et à l’UI globale.*

---

### 2. Factorisation des hooks et composants réutilisables

**Statut :** ✅ Effectué (hooks principaux factorisés et utilisés partout)

**Hooks créés et utilisés :**
- `useArticles` : centralise le chargement de la liste des articles (articles.json) avec gestion du cache, du loading et des erreurs. Utilisé dans ProductsSection, ProductPageSection, ProduitSimilaireCtaSection, CategoriesBar, etc.
- `useArticle` : charge un article unique par id, avec gestion du loading et de l’erreur. Utilisé dans ProductQuickView.
- `useCartItems` : centralise la gestion du panier (lecture, écriture, synchronisation, ajout, suppression, incrément, décrément) via localStorage. Utilisé dans CartDrawer.

**Bénéfices :**
- Plus aucune duplication de logique de chargement ou de gestion du panier.
- Code plus lisible, maintenable, et facile à tester.
- Aucune modification d’apparence ou de comportement utilisateur.

---
