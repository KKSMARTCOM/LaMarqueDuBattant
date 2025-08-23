#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');
const { backupFile } = require('../server/utils/backupManager');

const BACKUP_DIR = path.join(__dirname, '..', 'public', 'data', 'Sauvegarde');
const ORIGINAL_FILES = {
  articles: path.join(__dirname, '..', 'public', 'data', 'articles.json'),
  articlestypes: path.join(__dirname, '..', 'public', 'data', 'articlestypes.json')
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise(resolve => rl.question(query, resolve));

const getFileType = (filename) => {
  if (filename.includes('articles.json')) return 'articles';
  if (filename.includes('articlestypes.json')) return 'articlestypes';
  return null;
};

(async () => {
  try {
    console.log('\n🔍 Recherche des sauvegardes disponibles...\n');
    
    const files = await fs.readdir(BACKUP_DIR);
    
    if (files.length === 0) {
      console.log('Aucune sauvegarde trouvée.');
      rl.close();
      return;
    }
    
    // Afficher les sauvegardes disponibles
    console.log('Sauvegardes disponibles :\n');
    console.log(''.padEnd(90, '-'));
    console.log('N°  | Date de création        | Type         | Taille    | Fichier');
    console.log(''.padEnd(90, '-'));
    
    const validBackups = [];
    
    files.forEach((file, index) => {
      const fileType = getFileType(file);
      if (!fileType) return;
      
      try {
        const filePath = path.join(BACKUP_DIR, file);
        const stats = fs.statSync(filePath);
        const dateStr = file.split('_')[0];
        const date = new Date(dateStr.replace(/-/g, ':'));
        
        console.log(
          `${(index + 1).toString().padStart(2)}. | ` +
          `${date.toLocaleString().padEnd(22)} | ` +
          `${fileType.padEnd(11)} | ` +
          `${(stats.size / 1024).toFixed(2).padStart(7)} Ko | ` +
          file
        );
        
        validBackups.push({ index, file, fileType, date });
      } catch (error) {
        console.error(`Erreur avec le fichier ${file}:`, error.message);
      }
    });
    
    if (validBackups.length === 0) {
      console.log('Aucune sauvegarde valide trouvée.');
      rl.close();
      return;
    }
    
    console.log(''.padEnd(90, '-') + '\n');
    
    // Demander à l'utilisateur de choisir une sauvegarde
    const answer = await question(
      `Entrez le numéro de la sauvegarde à restaurer (1-${validBackups.length}) ou 'q' pour quitter : `
    );
    
    if (answer.toLowerCase() === 'q') {
      console.log('\nOpération annulée.');
      rl.close();
      return;
    }
    
    const backupIndex = parseInt(answer, 10) - 1;
    
    if (isNaN(backupIndex) || backupIndex < 0 || backupIndex >= validBackups.length) {
      console.log('\n❌ Numéro de sauvegarde invalide.');
      rl.close();
      return;
    }
    
    const { file, fileType } = validBackups[backupIndex];
    const sourceFile = path.join(BACKUP_DIR, file);
    const targetFile = ORIGINAL_FILES[fileType];
    
    if (!targetFile) {
      console.log('\n❌ Type de fichier non pris en charge.');
      rl.close();
      return;
    }
    
    // Demander confirmation
    const confirm = await question(
      `\nÊtes-vous sûr de vouloir restaurer ${file} vers ${path.basename(targetFile)} ? (o/N) `
    );
    
    if (confirm.toLowerCase() !== 'o') {
      console.log('\nOpération annulée.');
      rl.close();
      return;
    }
    
    console.log('\n⏳ Création d\'une sauvegarde avant restauration...');
    
    try {
      // Créer une sauvegarde du fichier actuel
      await backupFile(targetFile, 'pre_restore_');
      
      // Lire le contenu de la sauvegarde
      const content = await fs.readFile(sourceFile, 'utf8');
      
      // Écrire dans le fichier de destination
      await fs.writeFile(targetFile, content, 'utf8');
      
      console.log('✅ Fichier restauré avec succès !');
      console.log(`   ${sourceFile}`);
      console.log('   →', targetFile);
      
    } catch (error) {
      console.error('\n❌ Erreur lors de la restauration :', error.message);
      console.log('\nLa sauvegarde n\'a pas été restaurée. Le fichier original est inchangé.');
    }
    
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('\n❌ Aucune sauvegarde trouvée. Le dossier de sauvegarde n\'existe pas encore.');
    } else {
      console.error('\n❌ Erreur :', error.message);
    }
  } finally {
    rl.close();
  }
})();
