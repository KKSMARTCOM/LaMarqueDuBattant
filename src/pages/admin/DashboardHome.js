/**
 * DashboardHome.js
 * 
 * Description:
 * Ce composant représente la page d'accueil du tableau de bord d'administration.
 * Il affiche les statistiques clés, les actions rapides et un aperçu des dernières activités.
 *
 * Fonctionnalités principales :
 * - Affichage des statistiques clés (KPI)
 * - Actions rapides pour les tâches courantes
 * - Aperçu des dernières commandes
 * - Navigation rapide vers les sections importantes
 *
 * Structure des données :
 * - Utilise des données statiques pour les statistiques et les actions rapides
 * - Affiche des exemples de commandes récentes
 *
 * Composants enfants :
 * - StatCard : Affiche une carte de statistique avec icône
 * - QuickAction : Affiche un bouton d'action rapide
 *
 * Utilisation :
 * - <DashboardHome />
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiShoppingBag, 
  FiUsers, 
  FiDollarSign, 
  FiTrendingUp, 
  FiPlusCircle, 
  FiPackage,
  FiShoppingCart,
  FiUserPlus,
  FiBarChart2,
  FiArrowRight
} from 'react-icons/fi';

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <div className="bg-white/5 overflow-hidden rounded-xl border border-black/10 shadow-lg transition-all duration-300 hover:shadow-xl hover:border-black/20">
    <div className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-black/60">{title}</p>
          <p className="mt-2 text-3xl font-bold text-black/90">{value}</p>
          {trend && (
            <span className={`mt-2 inline-flex items-center text-sm ${trend.value > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trend.value > 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
            </span>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color} bg-opacity-10`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
    </div>
  </div>
);

const QuickAction = ({ title, description, icon: Icon, to, color }) => (
  <Link 
    to={to}
    className="group relative overflow-hidden rounded-xl bg-white/5 p-6 shadow-lg transition-all duration-300 hover:shadow-xl hover:bg-white/10 border border-black/10 hover:border-black/20"
  >
    <div className="relative z-10">
      <div className="flex items-start">
        <div className={`p-3 rounded-lg ${color} bg-opacity-10 mb-4`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-black/90 group-hover:text-black transition-colors">
        {title}
      </h3>
      <p className="mt-1 text-sm text-black/60">
        {description}
      </p>
      <div className="mt-4 flex items-center text-sm font-medium text-black/80 group-hover:text-black transition-colors">
        Accéder
        <FiArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </div>
    <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
      <Icon className="h-24 w-24 text-black" />
    </div>
  </Link>
);

const DashboardHome = () => {
  const stats = [
    { 
      title: 'Articles en stock', 
      value: '1,234', 
      icon: FiPackage, 
      color: 'text-blue-400',
      trend: { value: 12, label: 'ce mois-ci' }
    },
    { 
      title: 'Commandes du jour', 
      value: '42', 
      icon: FiShoppingCart, 
      color: 'text-green-400',
      trend: { value: 5, label: 'vs hier' }
    },
    { 
      title: 'Nouveaux clients', 
      value: '15', 
      icon: FiUserPlus, 
      color: 'text-yellow-400',
      trend: { value: -2, label: 'vs hier' }
    },
    { 
      title: 'Chiffre d\'affaires', 
      value: '8,745€', 
      icon: FiDollarSign, 
      color: 'text-purple-400',
      trend: { value: 8, label: 'vs mois dernier' }
    },
  ];

  const quickActions = [
    {
      title: 'Ajouter un article',
      description: 'Créer un nouvel article dans le catalogue',
      icon: FiPlusCircle,
      to: '/admin/articles/nouveau',
      color: 'text-blue-400',
    },
    {
      title: 'Ajouter un événement',
      description: 'Créer un nouvel événement',
      icon: FiPlusCircle,
      to: '/admin/events/nouveau',
      color: 'text-blue-400',
    },
    {
      title: 'Voir les commandes',
      description: 'Gérer les commandes en attente',
      icon: FiShoppingBag,
      to: '/admin/commandes',
      color: 'text-green-400',
    },
    {
      title: 'Statistiques',
      description: 'Voir les performances du site',
      icon: FiBarChart2,
      to: '/admin/statistiques',
      color: 'text-purple-400',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="pb-6">
        <h3 className="text-3xl text-left font-bold text-black">Tableau de bord</h3>
        <p className="mt-2 text-left text-gray-400">
          Gérez votre boutique en ligne, consultez les statistiques et effectuez des actions rapides.
        </p>
      </div>
      
      {/* Statistiques */}
      <div>
        <h3 className="text-xl font-semibold text-black/75 text-left mb-4">Aperçu des performances</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              trend={stat.trend}
            />
          ))}
        </div>
      </div>

      {/* Actions rapides */}
      <div className="mt-8">
        <h3 className="text-2xl font-semibold text-black/75 text-left mb-6">Actions rapides</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action, index) => (
            <QuickAction
              key={index}
              title={action.title}
              description={action.description}
              icon={action.icon}
              to={action.to}
              color={action.color}
            />
          ))}
        </div>
      </div>

      {/* Dernières commandes */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-6 text-left">
          <h3 className="text-2xl font-semibold text-black/75">Dernières commandes</h3>
          <Link 
            to="/admin/commandes" 
            className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors flex items-center"
          >
            Voir tout <FiArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        <div className="bg-black/5 rounded-xl border border-black/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-black/10">
              <thead className="bg-black/5">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black/60 uppercase tracking-wider">
                    Commande
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black/50 uppercase tracking-wider">
                    Client
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black/50 uppercase tracking-wider">
                    Produits
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black/50 uppercase tracking-wider">
                    Montant
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-black/50 uppercase tracking-wider">
                    Statut
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10">
                {[1, 2, 3,4,5].map((order) => (
                  <tr key={order} className="hover:bg-black/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-black/90 text-left">#{1000 + order}</div>
                      <div className="text-xs text-black/50 text-left">Aujourd'hui, 12:{30 + order}0</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-black/90 text-left">Client {order}</div>
                      <div className="text-xs text-black/50 text-left">client{order}@example.com</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].slice(0, order).map((img) => (
                          <img
                            key={img}
                            className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                            src={`https://picsum.photos/200/300?random=${img + order}`}
                            alt=""
                          />
                        ))}
                        {order > 3 && (
                          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-black/10 text-xs text-black/50 ring-2 ring-white">
                            +{order - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-left text-black/80 font-medium">
                      {120 + (order * 25)},00 €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order % 3 === 0 ? 'bg-green-100 text-green-800' : 
                        order % 2 === 0 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order % 3 === 0 ? 'Livré' : order % 2 === 0 ? 'En cours' : 'Payé'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                      <Link to={`/admin/commandes/${1000 + order}`} className="text-black/70 hover:text-black transition-colors">
                        Voir
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="bg-black/5 px-6 py-3 flex items-center justify-between border-t border-black/10">
            <div className="text-sm text-black/60">
              Affichage de <span className="font-medium">1</span> à <span className="font-medium">3</span> sur <span className="font-medium">42</span> commandes
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 rounded-md bg-white text-black/60 hover:bg-black/5 hover:text-black/80 transition-colors border border-black/10">
                Précédent
              </button>
              <button className="px-3 py-1 rounded-md bg-black/80 text-white hover:bg-black transition-colors">
                Suivant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
