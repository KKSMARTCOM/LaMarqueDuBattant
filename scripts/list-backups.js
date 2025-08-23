#!/usr/bin/env node
const fs = require('fs').promises;
const path = require('path');

const BACKUP_DIR = path.join(__dirname, '..', 'public', 'data', 'Sauvegarde');

(async () => {
  try {
    console.log('Recherche des sauvegardes...\n');
    
    const files = await fs.readdir(BACKUP_DIR);
    
    if (files.length === 0) {
      console.log('Aucune sauvegarde trouvée.');
      return;
    }
    
    // Grouper par type de fichier
    const backups = {
      articles: [],
      articlestypes: [],
      others: []
    };
    
    // Trier les fichiers par type
    files.forEach(file => {
      if (file.includes('articles.json')) {
        backups.articles.push(file);
      } else if (file.includes('articlestypes.json')) {
        backups.articlestypes.push(file);
      } else {
        backups.others.push(file);
      }
    });
    
    // Afficher les sauvegardes par catégorie
    const displayBackups = (title, files) => {
      if (files.length === 0) return;
      
      console.log(`\n${title} (${files.length}):`);
      console.log(''.padEnd(50, '-'));
      
      files
        .sort((a, b) => b.localeCompare(a)) // Plus récent en premier
        .forEach((file, index) => {
          const filePath = path.join(BACKUP_DIR, file);
          const fileSize = fs.statSync(filePath).size / 1024; // Taille en Ko
          const dateStr = file.split('_')[0];
          const date = new Date(dateStr.replace(/-/g, ':'));
          
          console.log(
            `${(index + 1).toString().padEnd(3)} | ${date.toLocaleString().padEnd(20)} | ` +
            `${fileSize.toFixed(2).padStart(8)} Ko | ${file}`
          );
        });
    };
    
    displayBackups('Sauvegardes des articles', backups.articles);
    displayBackups('Sauvegardes des types d\'articles', backups.articlestypes);
    
    if (backups.others.length > 0) {
      console.log('\nAutres sauvegardes:');
      console.log(backups.others.join('\n'));
    }
    
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('Aucune sauvegarde trouvée. Le dossier de sauvegarde n\'existe pas encore.');
    } else {
      console.error('Erreur lors de la lecture des sauvegardes:', error.message);
    }
  }
})();
