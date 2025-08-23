const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Chemin vers le dossier de sauvegarde
const BACKUP_DIR = path.join(__dirname, '..', 'public', 'data', 'Sauvegarde');

// Lire la liste des sauvegardes
router.get('/api/backups', async (req, res) => {
  console.log('Accès à la route /api/backups');
  
  try {
    console.log(`Vérification du dossier de sauvegarde: ${BACKUP_DIR}`);
    
    // Créer le dossier s'il n'existe pas
    await fs.mkdir(BACKUP_DIR, { recursive: true });
    console.log('Dossier de sauvegarde vérifié/créé');
    
    // Lire le contenu du dossier de sauvegarde
    console.log('Lecture du contenu du dossier de sauvegarde...');
    const files = await fs.readdir(BACKUP_DIR);
    console.log(`Fichiers trouvés: ${files.length}`, files);
    
    // Filtrer pour ne garder que les fichiers JSON
    const backupFiles = files.filter(file => file.endsWith('.json'));
    console.log(`Fichiers de sauvegarde JSON trouvés: ${backupFiles.length}`);
    
    // Récupérer les informations sur chaque fichier
    const backups = await Promise.all(
      backupFiles.map(async (file) => {
        const filePath = path.join(BACKUP_DIR, file);
        const stats = await fs.stat(filePath);
        
        // Extraire la date du nom de fichier
        const dateMatch = file.match(/^(\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}-\d+Z)/);
        const date = dateMatch ? new Date(dateMatch[1].replace(/-/g, ':')) : new Date();
        
        return {
          filename: file,
          path: filePath,
          size: stats.size,
          date: date.toISOString(),
          displayDate: date.toLocaleString()
        };
      })
    );
    
    // Trier par date (du plus récent au plus ancien)
    backups.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    res.json(backups);
  } catch (error) {
    console.error('Erreur lors de la lecture des sauvegardes:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la lecture des sauvegardes',
      details: error.message 
    });
  }
});

// Restaurer une sauvegarde
router.post('/api/backups/restore/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const backupPath = path.join(BACKUP_DIR, filename);
    
    // Vérifier que le fichier de sauvegarde existe
    await fs.access(backupPath);
    
    // Déterminer le type de fichier (articles ou articlestypes)
    let targetPath;
    if (filename.includes('articles.json')) {
      targetPath = path.join(__dirname, '..', 'public', 'data', 'articles.json');
    } else if (filename.includes('articlestypes.json')) {
      targetPath = path.join(__dirname, '..', 'public', 'data', 'articlestypes.json');
    } else {
      return res.status(400).json({ error: 'Type de fichier non pris en charge' });
    }
    
    // Créer une sauvegarde avant la restauration
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupCopyPath = path.join(
      BACKUP_DIR,
      `${timestamp}_pre-restore_${path.basename(targetPath)}`
    );
    
    // Copier le fichier actuel comme sauvegarde
    await fs.copyFile(targetPath, backupCopyPath);
    
    // Copier la sauvegarde vers le fichier cible
    await fs.copyFile(backupPath, targetPath);
    
    res.json({ 
      success: true,
      message: 'Sauvegarde restaurée avec succès',
      backupCreated: path.basename(backupCopyPath)
    });
  } catch (error) {
    console.error('Erreur lors de la restauration de la sauvegarde:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la restauration de la sauvegarde',
      details: error.message 
    });
  }
});

// Supprimer une sauvegarde
router.delete('/api/backups/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(BACKUP_DIR, filename);
    
    // Vérifier que le fichier existe
    await fs.access(filePath);
    
    // Supprimer le fichier
    await fs.unlink(filePath);
    
    res.json({ 
      success: true,
      message: 'Sauvegarde supprimée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la sauvegarde:', error);
    res.status(500).json({ 
      error: 'Erreur lors de la suppression de la sauvegarde',
      details: error.message 
    });
  }
});

module.exports = router;
