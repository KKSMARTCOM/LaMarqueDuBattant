#!/usr/bin/env node
const { backupFile } = require('../server/utils/backupManager');
const fs = require('fs').promises;
const path = require('path');

const FILES_TO_BACKUP = [
  path.join(__dirname, '..', 'public', 'data', 'articles.json'),
  path.join(__dirname, '..', 'public', 'data', 'articlestypes.json')
];

(async () => {
  console.log('Début de la sauvegarde manuelle...');
  console.log('Répertoire de travail:', process.cwd());
  
  try {
    // Vérifier l'existence des fichiers source
    for (const file of FILES_TO_BACKUP) {
      try {
        await fs.access(file, fs.constants.F_OK);
        console.log(`✓ Fichier source trouvé: ${file}`);
      } catch (err) {
        console.error(`❌ Fichier source introuvable: ${file}`);
        throw new Error(`Le fichier source n'existe pas: ${file}`);
      }
    }
    
    // Vérifier le dossier de sauvegarde
    const backupDir = path.join(__dirname, '..', 'public', 'data', 'Sauvegarde');
    try {
      await fs.mkdir(backupDir, { recursive: true });
      console.log(`✓ Dossier de sauvegarde: ${backupDir}`);
    } catch (err) {
      console.error(`❌ Impossible de créer le dossier de sauvegarde: ${backupDir}`);
      throw err;
    }
    
    // Effectuer les sauvegardes
    for (const file of FILES_TO_BACKUP) {
      try {
        console.log(`\nSauvegarde de ${file}...`);
        await backupFile(file);
        console.log(`✓ Fichier sauvegardé avec succès`);
      } catch (err) {
        console.error(`❌ Erreur lors de la sauvegarde de ${file}:`, err.message);
        throw err;
      }
    }
    
    console.log('\n✅ Toutes les sauvegardes ont été effectuées avec succès');
  } catch (error) {
    console.error('\n❌ Erreur lors de la sauvegarde:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    process.exit(0);
  }
})();
