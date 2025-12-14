# Virtual Closet – Backend (NestJS GraphQL)

The backend is a NestJS + TypeORM service that exposes a single GraphQL endpoint at `http://localhost:3000/graphql`. All REST controllers have been removed; every feature (auth, users, clothing items, outfits, outfit items, likes, comments, tags, scheduled outfits) is exposed via resolvers and backed by dedicated services/entities.

## Setup

```bash
cd backend
cp .env.example .env            # configure DB credentials, JWT_SECRET, SMTP settings
npm install
npm run start:dev               # starts Nest in watch mode
```

Ensure PostgreSQL (or your configured database) is running and the schema exists (TypeORM migrations or manual setup).

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run start` | Production mode |
| `npm run start:dev` | Development (watch) |
| `npm run start:prod` | Compiled prod build |

Tests are not included in this repo, but Nest’s default `npm run test` / `test:e2e` scripts remain available if you add specs.

## GraphQL

- Playground: `http://localhost:3000/graphql`
- Auth: JWT via `Authorization: Bearer <token>`
- Resolvers mirror Redux thunks on the frontend (see `docs/PROJECT_DOCUMENTATION.md` for the full schema and method tables).
