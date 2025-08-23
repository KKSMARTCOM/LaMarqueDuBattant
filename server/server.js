const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const { backupFile } = require('./utils/backupManager');
const backupRoutes = require('./routes/backupRoutes');
const siteInfoRoutes = require('./routes/siteInfoRoutes');

const app = express();
const PORT = 5000;
const DATA_PATH = path.join(__dirname, '../public/data');
const ARTICLES_FILE = path.join(DATA_PATH, 'articles.json');
const EVENTS_FILE = path.join(DATA_PATH, 'events.json');

// Configuration CORS
const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable preflight for all routes
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../build')));

// Middleware de logging des requêtes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Routes API
app.use(backupRoutes);
app.use('/api/site-info', siteInfoRoutes);

// Route de test
app.get('/api/test', (req, res) => {
  console.log('Test endpoint hit');
  res.json({ message: 'API is working!' });
});

// Assure que le dossier data existe
const ensureDataDirectoryExists = async () => {
  try {
    await fs.mkdir(DATA_PATH, { recursive: true });
    // Crée le fichier articles.json s'il n'existe pas
    try {
      await fs.access(ARTICLES_FILE);
    } catch {
      await fs.writeFile(ARTICLES_FILE, JSON.stringify([], null, 2));
    }
    // Crée le fichier events.json s'il n'existe pas
    try {
      await fs.access(EVENTS_FILE);
    } catch {
      await fs.writeFile(EVENTS_FILE, JSON.stringify([], null, 2));
    }
  } catch (error) {
    console.error('Erreur lors de la création du dossier data:', error);
  }
};

// Lecture des articles
app.get('/api/articles', async (req, res) => {
  try {
    const data = await fs.readFile(ARTICLES_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Erreur lors de la lecture des articles:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ============================
// ÉVÉNEMENTS
// ============================

// Lecture des événements
app.get('/api/events', async (req, res) => {
  try {
    const data = await fs.readFile(EVENTS_FILE, 'utf8');
    res.json(JSON.parse(data));
  } catch (error) {
    console.error('Erreur lors de la lecture des événements:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Création d'un événement
app.post('/api/events', async (req, res) => {
  try {
    await backupFile(EVENTS_FILE);

    const events = JSON.parse(await fs.readFile(EVENTS_FILE, 'utf8'));
    const newId = Math.max(0, ...events.map(e => e.id)) + 1;
    const now = new Date().toISOString();

    const newEvent = {
      ...req.body,
      id: newId,
      dateAdded: req.body.dateAdded || now,
      dateUpdated: now,
    };

    events.push(newEvent);
    await fs.writeFile(EVENTS_FILE, JSON.stringify(events, null, 2));
    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Erreur lors de la création de l'événement:", error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Mise à jour d'un événement
app.put('/api/events/:id', async (req, res) => {
  try {
    await backupFile(EVENTS_FILE);

    const events = JSON.parse(await fs.readFile(EVENTS_FILE, 'utf8'));
    const eventId = parseInt(req.params.id, 10);
    const eventIndex = events.findIndex(e => e.id === eventId);

    if (eventIndex === -1) {
      return res.status(404).json({ error: 'Événement non trouvé' });
    }

    const updatedEvent = {
      ...events[eventIndex],
      ...req.body,
      id: eventId,
      dateAdded: events[eventIndex].dateAdded,
      dateUpdated: new Date().toISOString(),
    };

    events[eventIndex] = updatedEvent;
    await fs.writeFile(EVENTS_FILE, JSON.stringify(events, null, 2));
    res.json(updatedEvent);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'événement:", error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Suppression d'un événement
app.delete('/api/events/:id', async (req, res) => {
  try {
    await backupFile(EVENTS_FILE);

    const events = JSON.parse(await fs.readFile(EVENTS_FILE, 'utf8'));
    const eventId = parseInt(req.params.id, 10);
    const filtered = events.filter(e => e.id !== eventId);

    if (filtered.length === events.length) {
      return res.status(404).json({ error: 'Événement non trouvé' });
    }

    await fs.writeFile(EVENTS_FILE, JSON.stringify(filtered, null, 2));
    res.status(204).end();
  } catch (error) {
    console.error("Erreur lors de la suppression de l'événement:", error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Batch événements
app.post('/api/events/batch', async (req, res) => {
  try {
    const { changes } = req.body || {};
    if (!Array.isArray(changes)) {
      return res.status(400).json({ error: 'Requête invalide: "changes" doit être un tableau' });
    }

    console.log(`[EVENTS BATCH] Reçu ${changes.length} changements`);

    await backupFile(EVENTS_FILE);

    let events = JSON.parse(await fs.readFile(EVENTS_FILE, 'utf8'));
    let nextId = Math.max(0, ...events.map(e => e.id)) + 1;

    const results = [];
    const nowIso = () => new Date().toISOString();

    for (let i = 0; i < changes.length; i++) {
      const change = changes[i] || {};
      const type = change.type;
      const payload = change.payload || {};
      const targetIdRaw = change.targetId ?? payload.id;
      const targetId = targetIdRaw != null ? parseInt(targetIdRaw, 10) : undefined;

      try {
        console.log(`[EVENTS BATCH] #${i} type=${type} targetId=${targetId}`);
        if (type === 'create') {
          let newId = typeof payload.id === 'number' ? payload.id : parseInt(payload.id, 10);
          if (!Number.isInteger(newId)) newId = nextId;

          if (events.some(e => e.id === newId)) {
            results.push({ index: i, success: false, type, message: `ID ${newId} déjà existant` });
            continue;
          }

          const now = nowIso();
          const newEvent = {
            ...payload,
            id: newId,
            dateAdded: payload.dateAdded || now,
            dateUpdated: now,
          };
          events.push(newEvent);
          if (newId === nextId) nextId += 1;
          results.push({ index: i, success: true, type, id: newId, message: 'Créé' });

        } else if (type === 'update') {
          if (!Number.isInteger(targetId)) {
            results.push({ index: i, success: false, type, message: 'targetId manquant pour update' });
            continue;
          }
          const idx = events.findIndex(e => e.id === targetId);
          if (idx === -1) {
            results.push({ index: i, success: false, type, message: `Événement ${targetId} introuvable` });
            continue;
          }
          const now = nowIso();
          const existing = events[idx];
          const updated = {
            ...existing,
            ...payload,
            id: existing.id,
            dateAdded: existing.dateAdded,
            dateUpdated: now,
          };
          events[idx] = updated;
          results.push({ index: i, success: true, type, id: targetId, message: 'Mis à jour' });

        } else if (type === 'delete') {
          if (!Number.isInteger(targetId)) {
            results.push({ index: i, success: false, type, message: 'targetId manquant pour delete' });
            continue;
          }
          const before = events.length;
          events = events.filter(e => e.id !== targetId);
          if (events.length === before) {
            results.push({ index: i, success: false, type, message: `Événement ${targetId} introuvable` });
            continue;
          }
          results.push({ index: i, success: true, type, id: targetId, message: 'Supprimé' });

        } else {
          results.push({ index: i, success: false, type, message: `Type inconnu: ${type}` });
        }
      } catch (errChange) {
        console.error(`[EVENTS BATCH] Erreur changement #${i}:`, errChange);
        results.push({ index: i, success: false, type, message: errChange?.message || 'Erreur interne' });
      }
    }

    await fs.writeFile(EVENTS_FILE, JSON.stringify(events, null, 2));

    const success = results.every(r => r.success);
    res.status(success ? 200 : 207).json({ success, results, total: events.length });
  } catch (error) {
    console.error("Erreur lors de l'application du batch événements:", error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Création d'un article
app.post('/api/articles', async (req, res) => {
  try {
    // Créer une sauvegarde avant modification
    await backupFile(ARTICLES_FILE);
    
    const articles = JSON.parse(await fs.readFile(ARTICLES_FILE, 'utf8'));
    const newId = Math.max(0, ...articles.map(a => a.id)) + 1;
    const now = new Date().toISOString();
    
    const newArticle = {
      ...req.body,
      id: newId,
      dateAdded: now,
      dateUpdated: now
    };
    
    articles.push(newArticle);
    await fs.writeFile(ARTICLES_FILE, JSON.stringify(articles, null, 2));
    res.status(201).json(newArticle);
  } catch (error) {
    console.error('Erreur lors de la création de l\'article:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Mise à jour d'un article
app.put('/api/articles/:id', async (req, res) => {
  try {
    // Créer une sauvegarde avant modification
    await backupFile(ARTICLES_FILE);
    
    const articles = JSON.parse(await fs.readFile(ARTICLES_FILE, 'utf8'));
    const articleId = parseInt(req.params.id, 10);
    const articleIndex = articles.findIndex(a => a.id === articleId);
    
    if (articleIndex === -1) {
      return res.status(404).json({ error: 'Article non trouvé' });
    }
    
    const updatedArticle = {
      ...articles[articleIndex],
      ...req.body,
      id: articleId,
      dateUpdated: new Date().toISOString()
    };
    
    articles[articleIndex] = updatedArticle;
    await fs.writeFile(ARTICLES_FILE, JSON.stringify(articles, null, 2));
    res.json(updatedArticle);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'article:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Suppression d'un article
app.delete('/api/articles/:id', async (req, res) => {
  try {
    // Créer une sauvegarde avant suppression
    await backupFile(ARTICLES_FILE);
    
    const articles = JSON.parse(await fs.readFile(ARTICLES_FILE, 'utf8'));
    const articleId = parseInt(req.params.id, 10);
    const filteredArticles = articles.filter(a => a.id !== articleId);
    
    if (filteredArticles.length === articles.length) {
      return res.status(404).json({ error: 'Article non trouvé' });
    }
    
    await fs.writeFile(ARTICLES_FILE, JSON.stringify(filteredArticles, null, 2));
    res.status(204).end();
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'article:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Application d'un lot de changements (create/update/delete) en une seule fois
app.post('/api/articles/batch', async (req, res) => {
  try {
    const { changes } = req.body || {};
    if (!Array.isArray(changes)) {
      return res.status(400).json({ error: 'Requête invalide: "changes" doit être un tableau' });
    }

    console.log(`[BATCH] Reçu ${changes.length} changements`);

    // Créer une sauvegarde avant modification
    await backupFile(ARTICLES_FILE);

    // Charger l'état courant
    let articles = JSON.parse(await fs.readFile(ARTICLES_FILE, 'utf8'));
    let nextId = Math.max(0, ...articles.map(a => a.id)) + 1;

    const results = [];
    const nowIso = () => new Date().toISOString();

    for (let i = 0; i < changes.length; i++) {
      const change = changes[i] || {};
      const type = change.type;
      const payload = change.payload || {};
      const targetIdRaw = change.targetId ?? payload.id;
      const targetId = targetIdRaw != null ? parseInt(targetIdRaw, 10) : undefined;

      try {
        console.log(`[BATCH] #${i} type=${type} targetId=${targetId}`);
        if (type === 'create') {
          // Utiliser l'id fourni si disponible et non utilisé, sinon nextId
          let newId = typeof payload.id === 'number' ? payload.id : parseInt(payload.id, 10);
          if (!Number.isInteger(newId)) newId = nextId;

          if (articles.some(a => a.id === newId)) {
            results.push({ index: i, success: false, type, message: `ID ${newId} déjà existant` });
            continue;
          }

          const now = nowIso();
          const newArticle = {
            ...payload,
            id: newId,
            dateAdded: payload.dateAdded || now,
            dateUpdated: now,
          };
          articles.push(newArticle);
          if (newId === nextId) nextId += 1;
          results.push({ index: i, success: true, type, id: newId, message: 'Créé' });

        } else if (type === 'update') {
          if (!Number.isInteger(targetId)) {
            results.push({ index: i, success: false, type, message: 'targetId manquant pour update' });
            continue;
          }
          const idx = articles.findIndex(a => a.id === targetId);
          if (idx === -1) {
            results.push({ index: i, success: false, type, message: `Article ${targetId} introuvable` });
            continue;
          }
          const now = nowIso();
          const existing = articles[idx];
          const updated = {
            ...existing,
            ...payload,
            id: existing.id,
            dateAdded: existing.dateAdded,
            dateUpdated: now,
          };
          articles[idx] = updated;
          results.push({ index: i, success: true, type, id: targetId, message: 'Mis à jour' });

        } else if (type === 'delete') {
          if (!Number.isInteger(targetId)) {
            results.push({ index: i, success: false, type, message: 'targetId manquant pour delete' });
            continue;
          }
          const before = articles.length;
          articles = articles.filter(a => a.id !== targetId);
          if (articles.length === before) {
            results.push({ index: i, success: false, type, message: `Article ${targetId} introuvable` });
            continue;
          }
          results.push({ index: i, success: true, type, id: targetId, message: 'Supprimé' });

        } else {
          results.push({ index: i, success: false, type, message: `Type inconnu: ${type}` });
        }
      } catch (errChange) {
        console.error(`[BATCH] Erreur changement #${i}:`, errChange);
        results.push({ index: i, success: false, type, message: errChange?.message || 'Erreur interne' });
      }
    }

    // Écrire le résultat final sur disque
    await fs.writeFile(ARTICLES_FILE, JSON.stringify(articles, null, 2));

    const success = results.every(r => r.success);
    res.status(success ? 200 : 207).json({ success, results, total: articles.length });
  } catch (error) {
    console.error('Erreur lors de l\'application du batch:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Démarrer le serveur
const startServer = async () => {
  await ensureDataDirectoryExists();
  
  // Créer une sauvegarde au démarrage
  try {
    await backupFile(ARTICLES_FILE);
    console.log('Sauvegarde initiale créée avec succès');
  } catch (error) {
    console.error('Erreur lors de la création de la sauvegarde initiale:', error);
  }
  
  // Planifier une sauvegarde toutes les 24 heures
  setInterval(async () => {
    try {
      await backupFile(ARTICLES_FILE);
      console.log('Sauvegarde planifiée effectuée avec succès');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde planifiée:', error);
    }
  }, 24 * 60 * 60 * 1000); // 24 heures
  
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
  });
};

startServer().catch(console.error);
