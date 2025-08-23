# Guide d'Utilisation - Gestion des Informations du Site

## Table des matières
1. [Démarrage du projet en local](#démarrage-du-projet-en-local)
1. [Introduction](#introduction)
2. [Accès à l'interface d'administration](#accès-à-linterface-dadministration)
3. [Modification des informations](#modification-des-informations)
4. [Sauvegarde et restauration](#sauvegarde-et-restauration)
5. [Structure des données](#structure-des-données)
6. [Dépannage](#dépannage)

## Démarrage du projet en local

### Prérequis
- Node.js (version 18 ou supérieure)
- npm (version 9 ou supérieure) ou yarn
- Git

### Installation

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/KKSMARTCOM/LaMarqueDuBattant.git
   cd LaMarqueDuBattant
   ```

2. **Installer les dépendances**
   ```bash
   # Avec npm
   npm install
   
   # Ou avec yarn
   yarn
   ```

3. **Démarrer le serveur de développement**
   ```bash
   # Démarrer le frontend (port 3000 par défaut)
   npm run dev
   
   # Dans un autre terminal, démarrer le serveur backend (port 5000)
   cd server
   npm install
   npm start
   ```

4. **Accéder à l'application**
   - Frontend : http://localhost:3000
   - Interface d'administration : http://localhost:3000/admin
   - API : http://localhost:5000/api

### Variables d'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# Frontend
VITE_API_URL=http://localhost:5000/api

# Backend
PORT=5000
NODE_ENV=development
```

## Introduction

Ce guide explique comment gérer les informations du site via l'interface d'administration de La Marque Du Battant.

## Accès à l'interface d'administration

1. Connectez-vous à l'interface d'administration
2. Accédez à la section "Informations du site" dans le menu de navigation

## Gestion des images

### Dépôt des fichiers
Les images doivent être placées manuellement dans les dossiers appropriés :

- **Logo de la marque** : `public/assets/images/Logo/`
- **Images des produits** : `public/assets/images/ProductsImages/`
- **Événements** : `public/assets/images/EventsImages/`
- **Collections** : `public/assets/images/CoverImage/Collection/`
- **Images de couverture et autres** : `public/assets/images/CoverImage/`

### Bonnes pratiques
- Utilisez des noms de fichiers descriptifs et en minuscules (ex: `chemise-blanche.jpg`)
- Évitez les espaces et caractères spéciaux dans les noms de fichiers
- Formats recommandés : JPG, PNG, WebP
- Taille maximale : 2 Mo par image

## Modification des informations

### Édition des champs
1. Naviguez entre les différentes sections à l'aide du menu latéral
2. Modifiez les champs souhaités
3. Pour les images, entrez uniquement le nom du fichier avec son extension (ex: `logo.png`)
4. Les modifications sont automatiquement enregistrées en temps réel

### Téléchargement d'images
1. Cliquez sur "Parcourir" ou glissez-déposez une image
2. Redimensionnez et recadrez si nécessaire
3. Validez pour enregistrer l'image

## Sauvegarde et restauration

### Sauvegardes automatiques
- Une sauvegarde est créée avant chaque modification
- Les sauvegardes sont stockées dans `/public/data/Sauvegarde/`
- Format des fichiers : `brandInfo_AAAA-MM-JJ-HH-MM-SS.json`

### Restauration manuelle
1. Arrêtez le serveur si nécessaire
2. Copiez le fichier de sauvegarde vers `/public/data/brandInfo.json`
3. Redémarrez le serveur

## Structure des données

Les informations sont organisées en sections :

- `brand` : Informations générales de la marque
- `contact` : Coordonnées et informations de contact
- `social` : Liens vers les réseaux sociaux
- `legal` : Mentions légales et CGV
- `about` : À propos et valeurs
- `shipping` : Options de livraison
- `returns` : Politique de retour
- `seo` : Référencement

## Dépannage

### Problème : Les modifications ne sont pas enregistrées
- Vérifiez votre connexion internet
- Vérifiez que le serveur est en cours d'exécution
- Consultez les logs du navigateur (F12 > Console)

### Problème : Impossible de télécharger des images
- Vérifiez les permissions du dossier de téléchargement
- Vérifiez la taille du fichier (max 5MB recommandé)
- Assurez-vous que le format est supporté (JPG, PNG, WebP)

### Problème : Message d'erreur lors de la sauvegarde
- Vérifiez l'espace disque disponible
- Vérifiez les permissions du dossier de sauvegarde
- Consultez les logs du serveur pour plus de détails

## Support

Pour toute question ou problème, contactez l'équipe technique à :
- Email : support@lamarquedubattant.com
- Téléphone : +33 1 23 45 67 89

---
*Dernière mise à jour : 2025-08-23*
