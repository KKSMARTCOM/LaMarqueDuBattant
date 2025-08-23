// scripts/convert-colors.js
// Convert availableColors entries to "name:code" format with a safe backup

const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'public', 'data', 'articles.json');

const COLOR_MAP = {
  'noir': '#000000',
  'blanc': '#FFFFFF',
  'gris': '#808080',
  'gris foncé': '#555555',
  'gris anthracite': '#333333',
  'bleu': '#0000FF',
  'bleu marine': '#001F3F',
  'rouge': '#FF0000',
  'rouge bordeaux': '#800020',
  'rose': '#FFC0CB',
  'rose poudré': '#EEC9D2',
  'jaune': '#FFFF00',
  'marron': '#8B4513',
  'camel': '#C19A6B',
  'taupe': '#483C32',
  'beige': '#F5F5DC',
  'kaki': '#78866B',
  'vert': '#008000',
  'vert militaire': '#4B5320',
  'mauve': '#E0B0FF',
  'blanc cassé': '#F8F8F0'
};

const norm = (s = '') => s.toString().trim().toLowerCase();
const nameToCode = (name) => COLOR_MAP[norm(name)] || name;
const toNameCode = (entry) => {
  if (!entry) return null;
  if (typeof entry === 'string') {
    if (entry.includes(':')) return entry; // already name:code
    const name = entry.trim();
    const code = nameToCode(name);
    return `${name}:${code}`;
  }
  if (typeof entry === 'object') {
    const name = (entry.name || entry.label || '').trim();
    if (!name) return null;
    const code = entry.code || nameToCode(name);
    return `${name}:${code}`;
  }
  return null;
};

function main() {
  if (!fs.existsSync(DATA_PATH)) {
    console.error('articles.json not found at', DATA_PATH);
    process.exit(1);
  }
  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    console.error('Invalid JSON in articles.json');
    process.exit(1);
  }

  if (!Array.isArray(data)) {
    console.error('articles.json root must be an array');
    process.exit(1);
  }

  const backupName = `articles_backup_${new Date().toISOString().replace(/[:.]/g,'-')}.json`;
  const backupPath = path.join(__dirname, '..', 'public', 'data', 'Sauvegarde', backupName);
  try {
    fs.mkdirSync(path.dirname(backupPath), { recursive: true });
    fs.writeFileSync(backupPath, JSON.stringify(data, null, 2), 'utf-8');
    console.log('Backup created at', backupPath);
  } catch (e) {
    console.error('Failed to create backup:', e.message);
    process.exit(1);
  }

  let changedCount = 0;
  const output = data.map((article) => {
    if (!article || !Array.isArray(article.availableColors)) return article;
    const converted = article.availableColors
      .map(toNameCode)
      .filter(Boolean);
    const isDifferent = JSON.stringify(converted) !== JSON.stringify(article.availableColors);
    if (isDifferent) changedCount++;
    return {
      ...article,
      availableColors: converted
    };
  });

  fs.writeFileSync(DATA_PATH, JSON.stringify(output, null, 2), 'utf-8');
  console.log(`Conversion done. Articles updated: ${changedCount}.`);
}

main();
