# Installation

## Prérequis

- [Docker](https://www.docker.com/) (avec Docker Compose)

## Étapes

1. **Cloner le dépôt**

   ```bash
   git clone https://github.com/maxoux53/sm-kiosk.git
   cd sm-kiosk
   ```

2. **Configurer les variables d'environnement**

   ```bash
   cp example.env .env
   ```

   Renseigner les valeurs dans `.env` (utilisateur/mot de passe PostgreSQL, secrets JWT, identifiants Cloudflare).

3. **Lancer le projet**

   ```bash
   docker compose up --build
   ```

   La base de données est créée et remplie automatiquement au démarrage (tables + données de seed).

## Accès

| Service | URL |
|---|---|
| API | http://localhost:3001 |
| Documentation Swagger | http://localhost:3001/docs |

## Arrêt

```bash
docker compose down
```

Pour tout supprimer (conteneurs + données) :

```bash
docker compose down -v
```
