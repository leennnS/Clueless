# 🌟 Virtual Closet – Wardrobe & Outfit Studio

Virtual Closet digitizes wardrobes, powers a drag‑and‑drop outfit studio, and lets stylists share their looks with the community. The platform combines a TypeScript React SPA with a NestJS API backed by PostgreSQL.

---

## 🔍 Overview

- **Frontend:** React 18 · Vite · TypeScript · Axios · custom hooks
- **Backend:** NestJS 10 · TypeORM · PostgreSQL · JWT auth · Nodemailer
- **Features:** Wardrobe catalog, canvas editor, calendar scheduling, likes/comments, creator profiles, password reset, weather widget
- **Demo:** Self-host locally (`http://localhost:5173`) or deploy both apps and point `VITE_API_BASE_URL` to the API.

---

## 🚀 Quick Start

```bash
# Backend
cd backend
cp .env.example .env         # set DATABASE_URL, JWT_SECRET, SMTP_*
npm install
npm run typeorm migration:run
npm run start:dev

# Frontend
cd frontend
cp .env.example .env         # set VITE_API_BASE_URL=http://localhost:3000
npm install
npm run dev
```

---

## ⚙️ Environment Variables

| Location | Keys |
| --- | --- |
| `backend/.env` | `DATABASE_URL`, `JWT_SECRET`, `SMTP_HOST/PORT/USER/PASS`, `FRONTEND_URL` |
| `frontend/.env` | `VITE_API_BASE_URL`, `VITE_OPENWEATHER_KEY` *(optional override)* |

Sample `.env` snippets are included in [`docs/PROJECT_DOCUMENTATION.md`](./docs/PROJECT_DOCUMENTATION.md#101-sample-env-values).

---

## 🔌 API Highlights

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/users/register` | Create account and return sanitized user |
| `POST` | `/users/login` | Issue JWT + user payload for localStorage |
| `GET` | `/outfits/feed?search=` | Community feed with optional search term |
| `POST` | `/outfits` | Save/publish outfit designed in the studio |
| `POST` | `/likes/toggle` | Toggle heart on an outfit (powers inbox) |
| `POST` | `/scheduled-outfits` | Schedule outfit on profile calendar |

Full request/response samples live in the documentation file.

---

## 🗃️ Database Snapshot

- `users` owns clothing items, outfits, likes, comments, scheduled outfits
- `outfits` connect to clothing via `outfit_items` join table (stores canvas positions)
- `likes` provide creator inbox entries (filtered by current day)
- `tags` + `clothing_item_tag` enable custom wardrobe categorization

See the ERD description in [`docs/PROJECT_DOCUMENTATION.md`](./docs/PROJECT_DOCUMENTATION.md#5-%EF%B8%8F-database-schema).

---

## 🧪 Testing

```bash
# Backend
cd backend
npm run test      # unit (Jest)
npm run test:e2e  # end-to-end (requires Postgres)

# Frontend
cd frontend
npm run test      # Vitest unit/UI tests
npm run lint      # ESLint + TypeScript checks
```

Manual QA checklist (studio interactions, feed likes, profile calendar) is documented in the project docs.

---

## 📚 Documentation & Code Comments

- Comprehensive reference: [`docs/PROJECT_DOCUMENTATION.md`](./docs/PROJECT_DOCUMENTATION.md)
- Includes setup, API catalog, schema, troubleshooting, and code documentation standards (TSDoc/JSDoc usage is already applied to core services).

---

## 🤝 Contributing

1. Fork and clone the repository
2. `git checkout -b feat/awesome-improvement`
3. Run backend + frontend lint/tests
4. Submit a PR with screenshots/GIFs for UI work

---

## 📄 License

MIT © Virtual Closet Team

Made with ❤️ by stylists, for stylists.

