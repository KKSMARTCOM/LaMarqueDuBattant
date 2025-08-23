const fs = require('fs').promises;
const path = require('path');

const BACKUP_DIR = path.join(__dirname, '../../public/data/Sauvegarde');

/**
 * Crée le dossier de sauvegarde s'il n'existe pas
 */
const ensureBackupDir = async () => {
  try {
    await fs.mkdir(BACKUP_DIR, { recursive: true });
  } catch (error) {
    console.error('Erreur lors de la création du dossier de sauvegarde:', error);
    throw error;
  }
};

/**
 * Crée une sauvegarde d'un fichier
 * @param {string} filePath - Chemin du fichier à sauvegarder
 * @returns {Promise<boolean>} true si la sauvegarde a réussi
 */
const backupFile = async (filePath) => {
  try {
    await ensureBackupDir();
    const fileName = path.basename(filePath);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(BACKUP_DIR, `${timestamp}_${fileName}`);
    
    // Lire le contenu actuel
    const content = await fs.readFile(filePath, 'utf8');
    
    // Créer la sauvegarde
    await fs.writeFile(backupPath, content, 'utf8');
    
    console.log(`Sauvegarde créée: ${backupPath}`);
    
    // Nettoyer les anciennes sauvegardes
    await cleanOldBackups(fileName);
    
    return true;
  } catch (error) {
    console.error('Erreur lors de la création de la sauvegarde:', error);
    throw error;
  }
};

/**
 * Nettoie les anciennes sauvegardes (garde les 5 plus récentes)
 * @param {string} fileNamePattern - Motif du nom de fichier à nettoyer
 */
const cleanOldBackups = async (fileNamePattern) => {
  try {
    const files = await fs.readdir(BACKUP_DIR);
    const matchingFiles = files
      .filter(file => file.includes(fileNamePattern))
      .sort()
      .reverse();
    
    // Garder les 5 plus récentes sauvegardes
    const filesToDelete = matchingFiles.slice(5);
    
    for (const file of filesToDelete) {
      try {
        await fs.unlink(path.join(BACKUP_DIR, file));
        console.log(`Ancienne sauvegarde supprimée: ${file}`);
      } catch (err) {
        console.error(`Erreur lors de la suppression de ${file}:`, err);
      }
    }
  } catch (error) {
    console.error('Erreur lors du nettoyage des anciennes sauvegardes:', error);
  }
};

module.exports = {
  backupFile,
  cleanOldBackups
};
