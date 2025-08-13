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
import { FiShoppingBag, FiUsers, FiDollarSign, FiTrendingUp, FiPlusCircle } from 'react-icons/fi';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className={`flex-shrink-0 rounded-md p-3 ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm text-left font-medium text-gray-500 truncate">{title}</dt>
            <dd className="flex items-baseline">
              <div className="text-2xl text-left font-semibold text-gray-900">{value}</div>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
);

const QuickAction = ({ title, description, icon: Icon, to, color }) => (
  <Link 
    to={to}
    className="col-span-1 bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
  >
    <div className="p-5">
      <div className="flex items-center">
        <div className={`flex-shrink-0 rounded-md p-3 ${color} bg-opacity-10 ${color.replace('text-', 'text-')}`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  </Link>
);

const DashboardHome = () => {
  const stats = [
    { title: 'Articles en stock', value: '1,234', icon: FiShoppingBag, color: 'bg-blue-500' },
    { title: 'Commandes du jour', value: '42', icon: FiShoppingBag, color: 'bg-green-500' },
    { title: 'Nouveaux clients', value: '15', icon: FiUsers, color: 'bg-yellow-500' },
    { title: 'Chiffre d\'affaires', value: '8,745€', icon: FiDollarSign, color: 'bg-purple-500' },
  ];

  const quickActions = [
    {
      title: 'Ajouter un article',
      description: 'Créer un nouvel article dans le catalogue',
      icon: FiPlusCircle,
      to: '/admin/articles/nouveau',
      color: 'text-blue-600',
    },
    {
      title: 'Voir les commandes',
      description: 'Gérer les commandes en attente',
      icon: FiShoppingBag,
      to: '/admin/commandes',
      color: 'text-green-600',
    },
    {
      title: 'Statistiques',
      description: 'Voir les performances du site',
      icon: FiTrendingUp,
      to: '/admin/statistiques',
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="pb-5 border-b border-gray-200">
        <h3 className="text-2xl font-bold  text-left leading-6 text-gray-900">Tableau de bord</h3>
        <p className="mt-2 max-w-4xl text-left text-sm text-gray-500">
          Gérez votre boutique en ligne, consultez les statistiques et effectuez des actions rapides.
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      {/* Actions rapides */}
      <div className="mt-8">
        <h3 className="text-lg text-left leading-6 font-medium text-gray-900 mb-4">Actions rapides</h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
      <div className="mt-8">
        <h3 className="text-lg text-left leading-6 font-medium text-gray-900 mb-4">Dernières commandes</h3>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {[1, 2, 3].map((order) => (
              <li key={order}>
                <div className="px-4 py-4 flex items-center sm:px-6">
                  <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                    <div className="truncate">
                      <div className="flex text-sm">
                        <p className="font-medium text-indigo-600 truncate">Commande #{1000 + order}</p>
                        <p className="ml-1 flex-shrink-0 font-normal text-gray-500">
                          de Client {order}
                        </p>
                      </div>
                      <div className="mt-2 flex">
                        <div className="flex items-center text-sm text-gray-500">
                          <p>
                            {order} article{order > 1 ? 's' : ''} • 12{order}€ •
                            <span className="ml-1 text-green-600">Payée</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                      <div className="flex overflow-hidden -space-x-1">
                        {[1, 2, 3].slice(0, order).map((img) => (
                          <img
                            key={img}
                            className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                            src={`https://picsum.photos/200/300?random=${img}`}
                            alt=""
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="ml-5 flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
