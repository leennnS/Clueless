# Virtual Closet — Wardrobe & Outfit Studio

Virtual Closet digitizes personal wardrobes, powers a drag-and-drop outfit studio, and lets creators share looks with the community. The platform pairs a Vite + React 18 SPA with a NestJS GraphQL API backed by PostgreSQL.

## Architecture at a Glance
- **Frontend**: React 18, TypeScript, Vite dev server, Redux Toolkit state, Axios GraphQL client, html2canvas for canvas exports.
- **Backend**: NestJS 11, Apollo GraphQL, TypeORM, PostgreSQL, JWT auth, Nodemailer, OpenWeather + Groq integrations for weather-aware AI styling.
- **Shared Contracts**: GraphQL schema (auto-generated) consumed by strongly-typed Redux slices and hooks.

## Feature Highlights
- Wardrobe catalog (upload, tag, color-code, delete items).
- Canvas-based outfit studio with z-index and transforms.
- Community feed with likes/comments plus creator inbox.
- Scheduler + wardrobe insights (favorite tags/colors, most worn item).
- AI stylist chat that references the user’s wardrobe and local weather.

## Project Setup

### Prerequisites
- Node.js 18+ and npm 9+
- PostgreSQL 14+
- Groq API key (for AI stylist) and OpenWeather API key (optional but recommended)
- Git, PowerShell/Bash shell

### Environment Variables
Copy `.env.example` to `.env` at the repo root and adjust as needed. The backend and frontend both read from this file.

| Scope | Keys | Notes |
| --- | --- | --- |
| Backend (`backend/.env`) | `NODE_ENV`, `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `GROQ_API_KEY`, `GROQ_MODEL`, `OPENWEATHER_API_KEY` | SMTP settings are required for password reset in production; Groq/OpenWeather unlock stylist + weather-aware prompts. |
| Frontend (`frontend/.env`) | `VITE_GRAPHQL_ENDPOINT`, `VITE_WEATHER_API_KEY` | Default GraphQL endpoint is `http://localhost:3000/graphql`. |

> **Tip:** In development TypeORM runs with `synchronize = true`, so schema changes are auto-applied. Disable this and use migrations before going to production.

### Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## Running Locally
1. **Start PostgreSQL** and ensure the database specified in `.env` exists.
2. **Backend**:
   ```bash
   cd backend
   npm run start:dev
   # GraphQL playground: http://localhost:3000/graphql
   ```
3. **Frontend**:
   ```bash
   cd frontend
   npm run dev
   # Vite serves on http://localhost:5173 by default
   ```
4. Open the frontend URL, register or log in, and begin uploading wardrobe items or building outfits.

## Testing & Quality Checks
- **Backend** (Jest): `npm run test`, `npm run test:e2e`, `npm run lint`
- **Frontend** (currently manual): `npm run lint`; add Vitest/RTL when UI tests are introduced.
- **Manual QA**: Sign in → upload wardrobe items → build & save outfits → like/comment/feed actions → schedule outfits → interact with stylist chat.

## API Entry Point
- Single GraphQL endpoint: `POST /graphql`
- Authentication: send `Authorization: Bearer <JWT>` for every mutation and protected query (`login` and `register` are unauthenticated).
- Detailed schema docs, sample queries, and mutation payloads live in [`docs/PROJECT_DOCUMENTATION.md`](docs/PROJECT_DOCUMENTATION.md#3-api-endpoints--usage).

## Database Snapshot
- `users` (auth + profile) relates to wardrobe (`clothing_items`), outfits (`outfits`), likes/comments, scheduled outfits, and tags (`tags` + `clothing_item_tags` join table).
- Cascades remove outfits, wardrobe items, likes, and scheduled entries when a user is deleted.
- A generated schema overview plus ERD notes are available in [`docs/PROJECT_DOCUMENTATION.md`](docs/PROJECT_DOCUMENTATION.md#4-database-schema).

## Tooling & Third-Party Services
- **Frontend**: React 18, React Router, Redux Toolkit, Axios, html2canvas, TypeScript, ESLint.
- **Backend**: NestJS, Apollo GraphQL, TypeORM, class-validator, bcrypt, jsonwebtoken, Nodemailer.
- **AI & Weather**: Groq (LLMs) and OpenWeather (current conditions).
- **Dev Experience**: Vite dev server, Nest CLI, Jest, ESLint, Prettier.

## Documentation & Support
The full project manual (setup, troubleshooting, API catalog, schema, manual QA script, and in-depth method reference) is maintained in [`docs/PROJECT_DOCUMENTATION.md`](docs/PROJECT_DOCUMENTATION.md). Keep that document in sync when code or contracts change.
