// Fonction utilitaire pour obtenir le chemin d'une image du dossier public/assets/images
// Utilisation : getImagePath("hero.webp", "cover")

function getImagePath(imageName, type = "") {
  let basePath = "/assets/images/";
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
  return `${basePath}${imageName}`;
}

export default getImagePath; 