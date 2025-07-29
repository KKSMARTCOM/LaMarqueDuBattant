// Fonction utilitaire pour obtenir le chemin d'une image du dossier public/assets/images
// Utilisation : getImagePath("hero.webp", "cover")
// Gère automatiquement les espaces et caractères spéciaux dans les noms de fichiers

function getImagePath(imageName, type = "") {
  let basePath = "/assets/images/";
  
  // Déterminer le sous-dossier en fonction du type
  switch (type.toLowerCase()) {
    case "cover":
      basePath += "CoverImage/";
      break;
    case "products":
      basePath += "ProductsImages/";
      break;
    case "events":
      basePath += "EventsImages/";
      break;
    case "logo":
      basePath += "Logo/";
      break;
    default:
      // rien, reste dans images
      break;
  }
  
  // Encoder le nom du fichier pour gérer les espaces et caractères spéciaux
  // On encode chaque segment du chemin séparément pour éviter de casser les slashes
  const encodedImageName = imageName
    .split('/')
    .map(segment => encodeURIComponent(segment))
    .join('/');
    
  // Retourner le chemin complet encodé
  return `${basePath}${encodedImageName}`;
}

export default getImagePath;