const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

const SITE_INFO_PATH = path.join(__dirname, '../../public/data/brandInfo.json');
const BACKUP_DIR = path.join(__dirname, '../../public/data/Sauvegarde');

// Fonction utilitaire pour le logging
const logger = {
  info: (message, data = null) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [INFO] ${message}`, data || '');
  },
  error: (message, error = null) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] [ERROR] ${message}`, error || '');
  }
};

// Créer le dossier de sauvegarde s'il n'existe pas
async function ensureBackupDir() {
  try {
    await fs.mkdir(BACKUP_DIR, { recursive: true, mode: 0o755 }); // 755 pour les permissions
    logger.info(`Dossier de sauvegarde vérifié/créé: ${BACKUP_DIR}`);
  } catch (error) {
    logger.error('Erreur lors de la création du dossier de sauvegarde:', error);
    throw error;
  }
}

// Créer une sauvegarde du fichier avant modification
async function createBackup() {
  try {
    await ensureBackupDir();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(BACKUP_DIR, `brandInfo_${timestamp}.json`);
    
    // Vérifier si le fichier source existe
    try {
      await fs.access(SITE_INFO_PATH, fs.constants.F_OK);
    } catch (err) {
      // Créer un fichier vide s'il n'existe pas
      await fs.writeFile(SITE_INFO_PATH, JSON.stringify({}), 'utf8');
      logger.info(`Fichier créé: ${SITE_INFO_PATH}`);
    }
    
    // Lire le contenu actuel
    const content = await fs.readFile(SITE_INFO_PATH, 'utf8');
    
    // Écrire la sauvegarde
    await fs.writeFile(backupPath, content, 'utf8');
    
    // Définir les permissions (rw-r--r--)
    await fs.chmod(backupPath, 0o644);
    
    logger.info(`Sauvegarde créée: ${backupPath}`);
    return backupPath;
  } catch (error) {
    logger.error('Erreur lors de la création de la sauvegarde:', error);
    throw error;
  }
}

// Mettre à jour les informations du site
router.put('/', async (req, res) => {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substr(2, 9);
  
  logger.info(`[${requestId}] Début de la mise à jour des informations du site`);
  
  try {
    const newData = req.body;
    
    // Journalisation des données reçues (version allégée pour éviter la pollution des logs)
    logger.info(`[${requestId}] Données reçues`, { 
      dataSize: JSON.stringify(newData).length,
      hasPageData: !!newData.PageData
    });
    
    // Validation des données
    if (!newData || typeof newData !== 'object') {
      const errorMsg = 'Données invalides: le corps de la requête doit être un objet JSON';
      logger.error(`[${requestId}] ${errorMsg}`);
      return res.status(400).json({ 
        success: false, 
        message: errorMsg
      });
    }

    // Créer une sauvegarde avant modification
    let backupPath;
    try {
      backupPath = await createBackup();
      logger.info(`[${requestId}] Sauvegarde créée avec succès: ${backupPath}`);
    } catch (backupError) {
      const errorMsg = 'Attention: Impossible de créer une sauvegarde avant modification';
      logger.error(`[${requestId}] ${errorMsg}`, backupError);
      // On continue malgré l'erreur de sauvegarde
    }

    try {
      // Écrire les nouvelles données avec une gestion d'erreur détaillée
      const jsonData = JSON.stringify(newData, null, 2);
      await fs.writeFile(SITE_INFO_PATH, jsonData, 'utf8');
      
      // Vérifier que le fichier a bien été écrit
      await fs.access(SITE_INFO_PATH, fs.constants.F_OK);
      
      // Définir les permissions (rw-r--r--)
      await fs.chmod(SITE_INFO_PATH, 0o644);
      
      const response = { 
        success: true, 
        message: 'Informations mises à jour avec succès',
        timestamp: new Date().toISOString(),
        backupPath: backupPath || null,
        requestId
      };
      
      logger.info(`[${requestId}] Mise à jour réussie`, { 
        duration: `${Date.now() - startTime}ms`,
        backupPath: backupPath || 'none'
      });
      
      res.json(response);
      
    } catch (writeError) {
      const errorMsg = `Erreur lors de l'écriture du fichier ${SITE_INFO_PATH}`;
      logger.error(`[${requestId}] ${errorMsg}`, writeError);
      
      // Essayer de restaurer la sauvegarde en cas d'échec
      if (backupPath) {
        try {
          const backupContent = await fs.readFile(backupPath, 'utf8');
          await fs.writeFile(SITE_INFO_PATH, backupContent, 'utf8');
          logger.info(`[${requestId}] Fichier restauré depuis la sauvegarde: ${backupPath}`);
        } catch (restoreError) {
          logger.error(`[${requestId}] Échec de la restauration depuis la sauvegarde`, restoreError);
        }
      }
      
      throw writeError;
    }
    
  } catch (error) {
    const errorMsg = 'Erreur lors de la mise à jour des informations';
    logger.error(`[${requestId}] ${errorMsg}`, error);
    
    res.status(500).json({ 
      success: false, 
      message: errorMsg,
      error: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne du serveur',
      requestId,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
