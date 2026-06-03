# Todo API

API REST de gestion de tâches, construite avec Node.js et PostgreSQL, entièrement dockerisée.

---

## Prérequis

- [Docker Desktop](https://www.docker.com/get-started) installé et démarré
- [Git](https://git-scm.com/)
- Pas besoin de Node.js, PostgreSQL ou XAMPP en local — Docker gère tout

---

## Installation

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd todo-api
```

### 2. Configurer les variables d'environnement

```bash
cp .env.example .env
```

Le fichier `.env` par défaut fonctionne directement, aucune modification nécessaire pour un lancement local.

---

## Lancer l'application

```bash
docker compose up --build
```

L'API est disponible sur [http://localhost:3000](http://localhost:3000)

> Au premier lancement, Docker télécharge les images Node.js et PostgreSQL. C'est normal que ça prenne 1-2 minutes.

Pour lancer en arrière-plan :

```bash
docker compose up -d --build
```

Pour arrêter :

```bash
docker compose down
```

---

## Endpoints

### Health check

```
GET /health
```

```json
{ "status": "ok", "timestamp": "2026-06-03T10:00:00.000Z" }
```

---

### Tâches

| Méthode | Route | Description |
|--------|-------|-------------|
| GET | `/api/tasks` | Lister toutes les tâches |
| GET | `/api/tasks/:id` | Voir une tâche |
| POST | `/api/tasks` | Créer une tâche |
| PUT | `/api/tasks/:id` | Modifier une tâche |
| DELETE | `/api/tasks/:id` | Supprimer une tâche |

### Modèle de données

```json
{
  "id": "uuid (généré automatiquement)",
  "title": "string (optionnel)",
  "description": "string (obligatoire)",
  "status": "todo | in_progress | done",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### Exemples de requêtes

**Créer une tâche**
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"description":"Ma tâche","status":"todo"}'
```

**Lister les tâches**
```bash
curl http://localhost:3000/api/tasks
```

**Modifier une tâche**
```bash
curl -X PUT http://localhost:3000/api/tasks/<id> \
  -H "Content-Type: application/json" \
  -d '{"description":"Tâche modifiée","status":"done"}'
```

**Supprimer une tâche**
```bash
curl -X DELETE http://localhost:3000/api/tasks/<id>
```

> Sur Windows (cmd), remplace les `\` par une seule ligne et échappe les guillemets : `\"`

---

## Tests

Les tests tournent en local sans Docker (Jest + Supertest, DB mockée) :

```bash
npm install
npm test
```

```
Test Suites: 2 passed
Tests:       18 passed
```

- `tests/unit/task.test.js` — teste le modèle Task de manière isolée
- `tests/integration/api.test.js` — teste les routes HTTP

---

## Structure du projet

```
todo-api/
├── src/
│   ├── app.js                  # point d'entrée, config Express
│   ├── routes/
│   │   └── tasks.js            # routes CRUD
│   ├── models/
│   │   └── task.js             # requêtes PostgreSQL
│   └── middleware/
│       └── errorHandler.js     # gestion des erreurs
├── tests/
│   ├── unit/
│   │   └── task.test.js
│   └── integration/
│       └── api.test.js
├── .env.example                # variables d'environnement à copier
├── .gitignore
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## Variables d'environnement

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `PORT` | Port de l'API | `3000` |
| `DB_HOST` | Hôte PostgreSQL | `db` |
| `DB_PORT` | Port PostgreSQL | `5432` |
| `DB_NAME` | Nom de la base | `todo_db` |
| `DB_USER` | Utilisateur | `todo_user` |
| `DB_PASSWORD` | Mot de passe | `todo_pass` |

---

## Persistance des données

Les données PostgreSQL survivent aux redémarrages grâce aux volumes Docker :

```bash
docker compose down   # stoppe les conteneurs
docker compose up -d  # relance — les données sont toujours là
```

Pour tout supprimer y compris les données :

```bash
docker compose down -v
```