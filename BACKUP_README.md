# Système de Sauvegarde - La Marque du Battant

Ce document décrit le système de sauvegarde automatique et manuel mis en place pour protéger les données de l'application.

## Fonctionnalités

- **Sauvegarde automatique** avant chaque modification des données
- **Historique des sauvegardes** avec conservation des 5 dernières versions
- **Restauration facile** des sauvegardes
- **Interface en ligne de commande** pour la gestion manuelle

## Fichiers sauvegardés

- `public/data/articles.json`
- `public/data/articlestypes.json`

## Commandes disponibles

### 1. Créer une sauvegarde manuelle

```bash
npm run backup
```

Cette commande crée une sauvegarde manuelle de tous les fichiers de données.

### 2. Lister les sauvegardes disponibles

```bash
npm run list-backups
```

Affiche la liste de toutes les sauvegardes disponibles avec leur date et taille.

### 3. Restaurer une sauvegarde

```bash
npm run restore-backup
```

Lance un assistant interactif pour restaurer une sauvegarde précédente.

## Fonctionnement technique

### Emplacement des sauvegardes

Les sauvegardes sont stockées dans le dossier :
```
public/data/Sauvegarde/
```

### Format des noms de fichiers

Les sauvegardes sont nommées selon le format :
```
{TIMESTAMP}_{NOM_FICHIER}
```

Exemple : `2025-08-17T20-30-45_articles.json`

### Politique de rétention

- Les 5 dernières sauvegardes de chaque fichier sont conservées
- Les anciennes sauvegardes sont automatiquement supprimées
- Une sauvegarde est créée automatiquement avant chaque modification des données

## Bonnes pratiques

1. **Avant une mise à jour majeure** : Exécutez une sauvegarde manuelle
2. **En cas de problème** : Utilisez `npm run restore-backup` pour revenir à une version antérieure
3. **Vérifiez régulièrement** l'espace disque utilisé par les sauvegardes

## Dépannage

### Problème : Les sauvegardes ne sont pas créées
- Vérifiez que le serveur a les permissions d'écriture dans le dossier `public/data/Sauvegarde`
- Vérifiez les logs du serveur pour des erreurs potentielles

### Problème : Impossible de restaurer une sauvegarde
- Vérifiez que le fichier de sauvegarde n'est pas corrompu
- Assurez-vous que l'application n'est pas en cours d'exécution pendant la restauration

## Sécurité

- Les sauvegardes contiennent des données sensibles, protégez l'accès au dossier de sauvegarde
- Ne modifiez pas manuellement les fichiers de sauvegarde

---

*Dernière mise à jour : 17/08/2025*
