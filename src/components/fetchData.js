// Fonction utilitaire pour fetcher des données JSON depuis le dossier public
// Utilisation : fetchData('/data/articles.json').then(...)

export default async function fetchData(path, { method = "GET", body, headers } = {}) {
  const response = await fetch(process.env.PUBLIC_URL + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });
  if (!response.ok) throw new Error("Erreur lors du chargement des données");
  return await response.json();
} 