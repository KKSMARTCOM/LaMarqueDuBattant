import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiXCircle, FiX } from 'react-icons/fi';

const NotificationModal = ({ 
  isOpen, 
  onClose, 
  type = 'success', 
  message = '', 
  articleId = null,
  redirectPath = null,
}) => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    onClose();
    if (redirectPath) {
      navigate(redirectPath, { replace: true });
    }
  };

  if (!isOpen) return null;

  const isSuccess = type === 'success';
  const icon = isSuccess ? (
    <FiCheckCircle className="h-6 w-6 text-green-500" />
  ) : (
    <FiXCircle className="h-6 w-6 text-red-500" />
  );

  const bgColor = isSuccess ? 'bg-green-50' : 'bg-red-50';
  const textColor = isSuccess ? 'text-green-800' : 'text-red-800';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="sm:flex sm:items-start">
            <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${bgColor} sm:mx-0 sm:h-10 sm:w-10`}>
              {icon}
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className={`text-lg leading-6 font-medium ${textColor}`}>
                {isSuccess ? 'Succès' : 'Erreur'}
              </h3>
              <div className="mt-2">
                <p className={`text-sm ${textColor}`}>
                  {message}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="ml-auto flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <span className="sr-only">Fermer</span>
              <FiX className="h-6 w-6" />
            </button>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${isSuccess ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${isSuccess ? 'focus:ring-green-500' : 'focus:ring-red-500'} sm:ml-3 sm:w-auto sm:text-sm`}
            >
              {isSuccess ? 'OK' : 'Compris'}
            </button>
            {redirectPath ? (
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={handleRedirect}
              >
                {isSuccess ? 'Voir l\'article' : 'Fermer'}
              </button>
            ) : (
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={onClose}
              >
                Fermer
              </button>
            )}
            {isSuccess && articleId && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate(`/admin/articles/${articleId}`, { replace: true });
                }}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Voir la fiche produit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
