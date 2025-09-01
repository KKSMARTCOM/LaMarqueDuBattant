# 🛍️ La Marque Du Battant - Plateforme E-commerce

Plateforme e-commerce moderne pour La Marque Du Battant, développée avec React 19 et une architecture full-stack JavaScript. Cette solution complète intègre une gestion avancée des produits, des événements et une interface d'administration intuitive.

## 📁 Structure des dossiers d'images

Le projet utilise une structure de dossiers spécifique pour organiser les médias :

```
public/
├── assets/
│   └── images/
│       ├── ProductsImages/    # Images des produits
│       ├── EventsImages/      # Images des événements
│       ├── Logo/              # Logos de la marque
│       └── CoverImage/        # Images de couverture
│           └── Collection/    # Images des collections
```

Consultez le [Guide d'Utilisation](./GUIDE_UTILISATION.md) pour des instructions détaillées sur l'installation et l'utilisation.

## 🚀 Fonctionnalités Principales

### Frontend
- **Interface Utilisateur Moderne** avec design réactif
- **Navigation Avancée** avec méga-menu dynamique
- **Filtrage et Recherche** par catégories, tailles et couleurs
- **Panier d'Achat** persistant
- **Pages Produit** détaillées avec galerie d'images
- **Gestion des Événements** avec compte à rebours

### Administration
- **Gestion des Articles** (CRUD complet)
- **Gestion des Événements** (CRUD complet)
- **Panneau de Tableau de Bord** avec statistiques
- **Système de Sauvegarde/Restauration**
- **Gestion des Commandes**

### Fonctionnalités Techniques
- **Gestion d'État** avec Context API
- **Routage** avec React Router v7
- **Animations** avec Framer Motion et GSAP
- **Formulaires** avec validation
- **Gestion des Téléchargements** d'images
- **Gestion des Informations du Site** avec sauvegarde automatique

### Gestion des Modifications

Le système de gestion des modifications permet de suivre, valider et appliquer les changements de manière sécurisée et organisée.

#### Fonctionnalités Principales
- **Traitement par Lots**
  - Regroupement automatique par type de ressource (articles/événements)
  - Exécution séquentielle des opérations par type
  - Rapport détaillé pour chaque opération

- **Séparation des Ressources**
  - Gestion distincte des articles et événements
  - Services dédiés pour chaque type de ressource
  - Évite les conflits entre différents types de données

- **Interface Utilisateur**
  - Panneau latéral de suivi des modifications
  - Badges colorés pour une identification rapide :
    - 🔵 Articles
    - 🟢 Événements
    - 🟡 Création
    - 🔄 Mise à jour
    - ❌ Suppression
  - Indicateurs d'état en temps réel

- **Gestion des Erreurs**
  - Messages d'erreur détaillés
  - Possibilité de réessayer les opérations échouées
  - Journalisation complète des opérations

#### Exemple d'Utilisation
```javascript
// Ajouter une modification au panier
addChange({
  type: 'update',
  resource: 'event', // 'article' ou 'event'
  payload: { /* données */ },
  targetId: '123' // requis pour update/delete
});

// Appliquer toutes les modifications
const results = await applyAllChanges();
```

### Navigation et Interface Premium
- **Header intelligent** avec méga-menu dynamique et animations fluides
- **Système de catégories avancé** avec aperçu des produits
- **Filtrage avancé** avec état persistant et URL partageable
- **Design responsive** optimisé pour tous les appareils
- **Thème sombre/clair** avec préférence utilisateur mémorisée

### Gestion des Données
- **Séparation claire** entre les articles et les événements
- **Sauvegarde automatique** des modifications avec gestion des conflits
- **Historique des modifications** avec possibilité d'annulation
- **Validation des données** avant enregistrement

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

## 🛠️ Stack Technique

### Frontend
- **React 19** - Bibliothèque UI
- **React Router v7** - Navigation
- **Context API** - Gestion d'état
- **Framer Motion** - Animations
- **Tailwind CSS** - Styles
- **GSAP** - Animations avancées
- **React Icons** - Icônes

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **JSON Server** - API REST
- **Multer** - Gestion des uploads
- **CORS** - Sécurité

### Outils
- **Vite** - Bundler
- **ESLint** - Linting
- **Prettier** - Formatage
- **Concurrently** - Exécution parallèle

### Dépendances Principales
- **react**: ^19.1.0
- **react-dom**: ^19.1.0
- **react-router-dom**: ^7.6.3
- **framer-motion**: ^12.23.9
- **gsap**: ^3.13.0
- **express**: ^4.21.2
- **json-server**: ^1.0.0-beta.3

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
- **Gestion des modifications** - Suivi des changements en attente
- **Sérialisation/Désérialisation** pour la persistance des données

### Outils de Développement
- **Vite** - Bundler ultra-rapide
- **ESLint & Prettier** - Qualité et formatage du code
- **PostCSS** - Traitement CSS avancé

## 🏗️ Structure du Projet

```
src/
├── components/              # Composants réutilisables
│   ├── admin/              # Composants d'administration
│   │   ├── ChangesCart/    # Gestion des modifications en attente
│   │   └── ...
│   ├── Header/             # En-tête avec navigation
│   │   ├── MegaMenu/       # Menu déroulant avancé
│   │   └── ...
│   ├── ReactbitsAnimations/ # Animations personnalisées
│   ├── Cart/               # Composants du panier
│   ├── Product/            # Composants des produits
│   ├── Event/              # Composants des événements
│   └── ...
│
├── pages/                  # Pages de l'application
│   ├── admin/              # Pages d'administration
│   │   ├── Dashboard.js    # Tableau de bord
│   │   ├── ArticleForm.js  # Formulaire d'article
│   │   ├── EventForm.js    # Formulaire d'événement
│   │   └── ...
│   ├── Accueil.js          # Page d'accueil
│   ├── Produits.js         # Liste des produits
│   ├── Produit.js          # Détail d'un produit
│   ├── Evenements.js       # Liste des événements
│   └── ...
│
├── context/                # Contextes React
│   ├── CartContext.js      # Gestion du panier
│   ├── ChangesCartContext.js # Gestion des modifications
│   └── ...
│
├── hooks/                  # Hooks personnalisés
│   ├── useArticles.js      # Gestion des articles
│   ├── useEvents.js        # Gestion des événements
│   ├── useCart.js          # Logique du panier
│   ├── useChangesCart.js   # Gestion des modifications
│   └── ...
│
├── services/               # Services API
│   ├── articleService.js   # Appels API articles
│   ├── eventService.js     # Appels API événements
│   └── ...
│
├── data/                   # Données statiques
│   ├── legalContent.js     # Contenus légaux
│   └── ...
│
└── utils/                  # Utilitaires
    ├── formatters.js       # Fonctions de formatage
    └── ...

server/                     # Backend Node.js/Express
├── config/                 # Configuration
│   ├── db.js              # Configuration de la base de données
│   └── multer.js          # Configuration des uploads de fichiers
│
├── controllers/            # Contrôleurs
│   ├── articleController.js # Logique métier des articles
│   ├── authController.js   # Gestion de l'authentification
│   ├── backupController.js # Gestion des sauvegardes
│   ├── eventController.js  # Logique métier des événements
│   └── ...
│
├── middlewares/            # Middlewares personnalisés
│   ├── auth.js            # Authentification
│   ├── errorHandler.js    # Gestion des erreurs
│   └── ...
│
├── models/                 # Modèles de données
│   ├── Article.js         # Modèle Article
│   ├── Event.js           # Modèle Événement
│   └── ...
│
├── public/                 # Fichiers statiques
│   └── uploads/           # Fichiers uploadés
│
├── routes/                 # Routes API
│   ├── articles.js        # Routes des articles
│   ├── auth.js            # Routes d'authentification
│   ├── backups.js         # Gestion des sauvegardes
│   ├── events.js          # Routes des événements
│   └── index.js           # Point d'entrée des routes
│
├── services/              # Services métier
│   ├── backupService.js   # Service de sauvegarde
│   └── ...
│
├── utils/                 # Utilitaires
│   ├── backupManager.js   # Gestion des sauvegardes
│   ├── logger.js          # Journalisation
│   └── ...
│
├── .env                  # Variables d'environnement
├── .gitignore           # Fichiers à ignorer par Git
└── server.js            # Point d'entrée du serveur

public/                     # Fichiers statiques
├── data/                   # Fichiers de données
│   ├── articles.json       # Catalogue des articles
│   ├── events.json         # Liste des événements
│   └── Sauvegarde/         # Dossier des sauvegardes
└── assets/                 # Ressources média
    ├── images/             # Images du site
    └── videos/             # Vidéos

scripts/                    # Scripts utilitaires
├── backup.js              # Création de sauvegardes
├── restore-backup.js      # Restauration de sauvegardes
└── list-backups.js        # Liste des sauvegardes disponibles
```

```
src/
├── components/                # Composants UI réutilisables
│   ├── Header/               # En-tête du site
│   ├── Footer/               # Pied de page
│   ├── Cart/                 # Composants du panier
│   ├── Product/              # Composants liés aux produits
│   ├── Event/                # Composants liés aux événements
│   ├── UI/                   # Composants d'interface utilisateur
│   ├── admin/                # Interface d'administration
│   │   ├── ChangesCart/      # Gestion des modifications
│   │   ├── Forms/            # Formulaires d'administration
│   │   └── ...
│   └── ...
│
├── pages/                    # Pages de l'application
│   ├── Home.js              # Page d'accueil
│   ├── Products.js          # Liste des produits
│   ├── ProductDetail.js     # Détail d'un produit
│   ├── Events.js            # Liste des événements
│   ├── EventDetail.js       # Détail d'un événement
│   ├── Cart.js              # Panier d'achat
│   ├── Checkout.js          # Processus de paiement
│   ├── admin/               # Pages d'administration
│   │   ├── Dashboard.js     # Tableau de bord
│   │   ├── Articles/        # Gestion des articles
│   │   ├── Events/          # Gestion des événements
│   │   └── ...
│   └── ...
│   ├── Produit.js            # Liste des produits
│   ├── DetailsProduits.js    # Détail d'un produit
│   ├── Apropos.js            # Page À propos
│   └── Events.js             # Événements et actualités
│
├── hooks/                    # Hooks personnalisés
│   ├── useArticle.js        # Gestion d'un article individuel
│   ├── useArticles.js       # Liste et filtrage des articles
│   ├── useCart.js           # Gestion du panier d'achat
│   ├── useChangesCart.js    # Gestion des modifications en attente
│   ├── useEvent.js          # Gestion d'un événement individuel
│   ├── useEvents.js         # Liste et filtrage des événements
│   └── useWindowSize.js     # Détection de la taille d'écran
│
├── services/                # Services API
│   ├── api.js              # Configuration de base des appels API
│   ├── articleService.js   # Service des articles
│   ├── authService.js      # Service d'authentification
│   ├── cartService.js      # Service du panier
│   ├── eventService.js     # Service des événements
│   └── ...
│
├── context/                # Contextes React
│   ├── AuthContext.js      # Contexte d'authentification
│   └── ChangesCartContext.js # Contexte du panier de modifications
│
├── data/                   # Données statiques
│   └── legalContent.js     # Textes légaux
│
├── assets/                 # Ressources statiques
│   ├── images/             # Images du site
│   └── styles/             # Fichiers de style globaux
│
├── utils/                  # Utilitaires
│   ├── formatters.js       # Fonctions de formatage
│   ├── validators.js       # Fonctions de validation
│   └── ...
│
├── App.js                 # Composant racine
├── App.css                # Styles globaux
├── index.js               # Point d'entrée de l'application
└── reportWebVitals.js     # Mesures de performance
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
- Node.js 18+
- npm 9+ ou yarn 1.22+
- Git pour le contrôle de version
- Un éditeur de code moderne (VS Code recommandé)

### Installation
1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/KKSMARTCOM/LaMarqueDuBattant.git
   cd LaMarqueDuBattant
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   # ou
   yarn
   ```

3. **Configurer l'environnement**
   Créer un fichier `.env` à la racine du projet :
   ```env
   VITE_API_URL=http://localhost:3001
   VITE_STRIPE_PUBLIC_KEY=votre_cle_stripe
   ```

4. **Démarrer les serveurs**
   ```bash
   # Démarre à la fois le frontend et le backend
   npm run dev
   # ou
   yarn dev
   ```

5. **Accéder à l'application**
   - Frontend : http://localhost:5173
   - Backend API : http://localhost:3001
   - Interface d'admin : http://localhost:5173/admin

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

### 🛠️ Scripts Disponibles

#### Développement
- `npm start` - Lance l'application React en mode développement
- `npm run dev` - Lance à la fois le frontend et le backend (concurrently)
- `npm run server` - Démarre uniquement le serveur backend
- `npm test` - Lance les tests unitaires

#### Production
- `npm run build` - Construit l'application pour la production
- `npm run preview` - Prévient la version de production localement

#### Gestion des Données
- `npm run backup` - Crée une sauvegarde des données actuelles
- `npm run list-backups` - Liste toutes les sauvegardes disponibles
- `npm run restore-backup` - Restaure une sauvegarde (utiliser avec l'argument du nom de la sauvegarde)

#### Utilitaires
- `npm run eject` - Éjecte l'application de create-react-app (irréversible)

> **Note** : Pour restaurer une sauvegarde spécifique, utilisez :
> ```bash
> npm run restore-backup -- backup-2023-11-20
> ```

## 🔄 Gestion des Modifications

Le système de gestion des modifications permet de suivre, valider et appliquer les changements de manière sécurisée et organisée pour les articles et événements.

### Fonctionnalités Principales

#### Traitement par Lots
- Regroupement automatique par type de ressource (articles/événements)
- Exécution séquentielle des opérations par type
- Rapport détaillé pour chaque opération

#### Séparation des Ressources
- Gestion distincte des articles et événements
- Services dédiés pour chaque type de ressource
- Évite les conflits entre différents types de données

#### Interface Utilisateur
- Panneau latéral de suivi des modifications
- Badges colorés pour une identification rapide :
  - 🔵 Articles
  - 🟢 Événements
  - 🟡 Création
  - 🔄 Mise à jour
  - ❌ Suppression
- Indicateurs d'état en temps réel

#### Gestion des Erreurs
- Messages d'erreur détaillés
- Possibilité de réessayer les opérations échouées
- Journalisation complète des opérations

### Comment ça marche
1. **Ajout des modifications** au panier via le contexte
2. **Vérification** des modifications en attente
3. **Application par lots** avec séparation automatique par type de ressource
4. **Rapport d'exécution** avec statut pour chaque opération
5. **Nettoyage** automatique des modifications appliquées

### Structure d'une Modification
```typescript
interface ChangeItem {
  id: string;               // Identifiant unique de la modification
  type: 'create' | 'update' | 'delete';
  resource: 'article' | 'event';
  payload?: any;            // Données à créer/mettre à jour
  targetId?: string;        // ID pour les mises à jour/suppressions
  status?: 'pending' | 'applied' | 'failed';
  error?: string;           // Message d'erreur en cas d'échec
  timestamp: number;        // Horodatage de la modification
}
```

### Exemple d'Utilisation
```javascript
// Ajouter une modification au panier
addChange({
  type: 'update',
  resource: 'event',
  payload: { id: '123', title: 'Nouveau titre' },
  targetId: '123'
});

// Appliquer toutes les modifications
const results = await applyAllChanges();
```

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+ et npm 9+

### Installation
```bash
git clone [URL_DU_REPO]
cd LaMarqueDuBattant
npm install
npm run dev  # Démarre frontend + backend
```

### Commandes Utiles
```bash
# Développement
npm start      # Frontend uniquement
npm run server # Backend uniquement

# Production
npm run build  # Construire
npm run preview  # Prévisualiser

# Sauvegardes
npm run backup           # Créer
npm run list-backups     # Lister
npm run restore-backup   # Restaurer
```

## 📦 Structure des Données

### Articles
```typescript
interface Article {
  id: number;
  title: string;
  description: string;
  price: number | string;
  discount_price?: number | string;
  discount_percent?: number;
  category: string;
  sizes: string[];
  sexe: string;
  dateAdded: string;
  dateUpdated: string;
  availableColors: string[];
  stockQuantity: number;
  secondaryImages: string[];
  collection: string;
  status: 'draft' | 'published';
}
```

### Événements
```typescript
interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  price: number | string;
  status: 'upcoming' | 'ongoing' | 'past';
  createdAt: string;
  updatedAt: string;
}
```

## 🤝 Contribution

1. Créer une branche pour votre fonctionnalité
2. Faire vos modifications
3. Soumettre une Pull Request

## 📝 Licence

Ce projet est sous licence MIT.

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

## 🔄 Gestion des Modifications

Le système de gestion des modifications permet de suivre et d'appliquer des changements en attente pour les articles et les événements.

### Fonctionnalités clés
- **Ajout de modifications** au panier depuis n'importe quel composant
- **Prévisualisation** des modifications avant application
- **Application par lots** des modifications
- **Séparation** des types de ressources (articles/événements)
- **Retour d'information** sur les opérations effectuées

### Utilisation
```javascript
// Ajouter une modification au panier
const { addChange } = useChangesCart();

addChange({
  type: 'update', // 'create', 'update', ou 'delete'
  resource: 'article', // ou 'event'
  payload: { /* données de l'article/événement */ },
  targetId: '123' // requis pour update/delete
});
```

### Structure d'une modification
```typescript
interface ChangeItem {
  id: string;
  type: 'create' | 'update' | 'delete';
  resource: 'article' | 'event';
  payload?: any;
  targetId?: string | number;
  createdAt: string;
}
```

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

- ✅ **Système de gestion des informations du site** avec sauvegarde automatique
- ✅ **Interface d'administration** pour la modification des informations de la marque
- ✅ **Sauvegardes incrémentielles** avec historique des modifications
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
