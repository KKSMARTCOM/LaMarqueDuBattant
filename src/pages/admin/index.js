/**
 * index.js - Point d'entrée des composants d'administration
 * 
 * Description :
 * Ce fichier sert de point d'exportation centralisé pour tous les composants
 * du tableau de bord d'administration. Il permet d'importer facilement
 * n'importe quel composant d'administration depuis un seul endroit.
 *
 * Composants exportés :
 * - Dashboard : Conteneur principal du tableau de bord
 * - DashboardHome : Page d'accueil du tableau de bord
 * - ArticlesList : Liste des articles avec fonctionnalités de gestion
 * - ArticleForm : Formulaire de création/édition d'article
 *
 * Avantages :
 * - Évite les chemins d'importation compliqués
 * - Facilite la maintenance en centralisant les exports
 * - Permet de renommer facilement les composants à l'import
 *
 * Exemple d'utilisation :
 * import { Dashboard, ArticlesList } from '../pages/admin';
 */

// Export de tous les composants du tableau d'administration
export { default as Dashboard } from './Dashboard';
export { default as DashboardHome } from './DashboardHome';
export { default as ArticlesList } from './ArticlesList';
export { default as ArticleForm } from './ArticleForm';
