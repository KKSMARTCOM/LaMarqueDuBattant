const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const SITE_INFO_PATH = path.join(__dirname, '../../public/data/brandInfo.json');
const BACKUP_DIR = path.join(__dirname, '../../public/data/Sauvegarde');

// Créer le dossier de sauvegarde s'il n'existe pas
async function ensureBackupDir() {
  try {
    await fs.mkdir(BACKUP_DIR, { recursive: true });
  } catch (error) {
    console.error('Erreur lors de la création du dossier de sauvegarde:', error);
  }
}

// Créer une sauvegarde du fichier avant modification
async function createBackup() {
  try {
    await ensureBackupDir();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(BACKUP_DIR, `brandInfo_${timestamp}.json`);
    
    // Copier le fichier actuel vers le dossier de sauvegarde
    await fs.copyFile(SITE_INFO_PATH, backupPath);
    console.log(`Sauvegarde créée: ${backupPath}`);
    return backupPath;
  } catch (error) {
    console.error('Erreur lors de la création de la sauvegarde:', error);
    throw error;
  }
}

// Mettre à jour les informations du site
router.put('/', async (req, res) => {
  try {
    const newData = req.body;
    
    // Validation basique des données
    if (!newData || typeof newData !== 'object') {
      return res.status(400).json({ 
        success: false, 
        message: 'Données invalides' 
      });
    }

    // Créer une sauvegarde avant modification
    try {
      await createBackup();
    } catch (backupError) {
      console.error('Attention: Impossible de créer une sauvegarde:', backupError);
      // On continue malgré l'erreur de sauvegarde
    }

    // Écrire les nouvelles données
    await fs.writeFile(
      SITE_INFO_PATH, 
      JSON.stringify(newData, null, 2), 
      'utf8'
    );
    
    res.json({ 
      success: true, 
      message: 'Informations mises à jour avec succès',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des informations:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la mise à jour des informations',
      error: error.message 
    });
  }
});

module.exports = router;
