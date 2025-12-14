# Virtual Closet — Project Documentation

Comprehensive reference for setting up, operating, and extending the Virtual Closet platform.

## Table of Contents
1. [Project Setup](#1-project-setup)
   1. [Repository Layout](#11-repository-layout)
   2. [Prerequisites](#12-prerequisites)
   3. [Environment Configuration](#13-environment-configuration)
   4. [Installation](#14-installation)
   5. [Database Preparation](#15-database-preparation)
2. [Running & Testing](#2-running--testing)
   1. [Local Development Workflow](#21-local-development-workflow)
   2. [Automated Tests & Linters](#22-automated-tests--linters)
   3. [Manual QA Checklist](#23-manual-qa-checklist)
3. [API Endpoints & Usage](#3-api-endpoints--usage)
   1. [Authentication & User Operations](#31-authentication--user-operations)
   2. [Wardrobe, Tags, & Canvas](#32-wardrobe-tags--canvas)
   3. [Social, Scheduling, & Insights](#33-social-scheduling--insights)
   4. [AI Stylist & Weather](#34-ai-stylist--weather)
   5. [Sample Queries & Mutations](#35-sample-queries--mutations)
4. [Database Schema](#4-database-schema)
5. [Third-Party Libraries & Tools](#5-third-party-libraries--tools)
6. [Technical Reference (Methods)](#6-technical-reference-methods)
   1. [Backend Services](#61-backend-services)
   2. [Supporting Services](#62-supporting-services)
   3. [Frontend API Client & Hooks](#63-frontend-api-client--hooks)
   4. [Redux Thunks](#64-redux-thunks)
7. [Troubleshooting & Tips](#7-troubleshooting--tips)

---

## 1. Project Setup

### 1.1 Repository Layout
```
virtual_closet/
├── backend/                # NestJS GraphQL API + PostgreSQL access layer
├── frontend/               # React + Vite single-page app
├── docs/                   # Long-form documentation (this file)
└── .env.example            # Shared configuration template
```

### 1.2 Prerequisites
- **Runtime**: Node.js ≥ 18, npm ≥ 9
- **Database**: PostgreSQL ≥ 14 with an empty database ready for the app
- **Tooling**: Git, PowerShell/Bash, optional pnpm/yarn
- **API Keys** (recommended for full functionality):
  - Groq (`GROQ_API_KEY`) for AI stylist responses
  - OpenWeather (`OPENWEATHER_API_KEY`) for weather-aware styling
  - SMTP credentials for password reset emails

### 1.3 Environment Configuration
Create a root `.env` file (or separate `.env` files inside `backend/` and `frontend/`) based on `.env.example`. Key settings:

| Scope | Keys | Description |
| --- | --- | --- |
| Backend (`backend/.env`) | `NODE_ENV`, `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `GROQ_API_KEY`, `GROQ_MODEL`, `OPENWEATHER_API_KEY` | Database credentials, JWT signing secret, mail server config, AI & weather APIs. |
| Frontend (`frontend/.env`) | `VITE_GRAPHQL_ENDPOINT`, `VITE_WEATHER_API_KEY` | GraphQL endpoint (defaults to `http://localhost:3000/graphql`) and optional weather override for UI widgets. |

**Sample `.env` excerpt:**
```env
# Backend
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=virtual_closet_dev
JWT_SECRET=replace-with-long-random-string
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=your-user
SMTP_PASS=your-pass
SMTP_FROM="Virtual Closet <no-reply@virtualcloset.dev>"
GROQ_API_KEY=grsk-...
OPENWEATHER_API_KEY=your-openweather-key

# Frontend
VITE_GRAPHQL_ENDPOINT=http://localhost:3000/graphql
VITE_WEATHER_API_KEY=your-openweather-key
```

### 1.4 Installation
```bash
# Install backend packages
cd backend
npm install

# Install frontend packages
cd ../frontend
npm install
```

### 1.5 Database Preparation
- Ensure PostgreSQL is running and the database defined by `DB_NAME` exists:
  ```bash
  createdb virtual_closet_dev
  ```
- In development, TypeORM is configured with `synchronize: true`, so tables will be created automatically on server start. Disable this and add migrations before deploying to production environments.
- Uploaded wardrobe images are stored under `backend/public/images/uploads`. Confirm the process has write access to that directory.

---

## 2. Running & Testing

### 2.1 Local Development Workflow
1. **Backend**
   ```bash
   cd backend
   npm run start:dev
   # GraphQL Playground: http://localhost:3000/graphql
   ```
2. **Frontend**
   ```bash
   cd frontend
   npm run dev
   # Vite serves on http://localhost:5173 (overridable via --host/--port)
   ```
3. Login/Register at `http://localhost:5173`, upload wardrobe items, drag them into the studio canvas, and interact with the feed/scheduler.

### 2.2 Automated Tests & Linters
| Area | Command | Notes |
| --- | --- | --- |
| Backend unit tests | `npm run test` | Jest (unit + resolver/service coverage) |
| Backend e2e tests | `npm run test:e2e` | Requires a running PostgreSQL instance; hits real GraphQL endpoint |
| Backend lint | `npm run lint` | ESLint (TS) |
| Frontend lint | `npm run lint` | ESLint + TypeScript; run from `frontend/` |

### 2.3 Manual QA Checklist
1. **Auth**: Register → verify auto-login → logout → login.
2. **Wardrobe**: Upload clothing items with tags/colors/images, edit and delete them, confirm image URLs resolve via `/images/...`.
3. **Outfit Studio**: Drag clothing items to the canvas, adjust position/z-index, save as public/private, reopen to edit, export preview (html2canvas).
4. **Feed & Social**: Visit `/feed`, like/unlike outfits, add comments, ensure counts and viewer state update in real-time.
5. **Scheduler & Highlights**: Schedule outfits on different dates, open profile to verify calendar entries and wardrobe summary tiles (latest items/outfits, favorite colors/tags, most worn item).
6. **AI Stylist**: Open stylist chat, send a prompt, confirm outfits reference real wardrobe items and weather if configured.
7. **Notifications**: Trigger likes on your outfits (via another user or GraphQL) and verify dashboard notifications/inbox linking works.

---

## 3. API Endpoints & Usage

- All functionality is routed through **`POST /graphql`** (`backend` server, default `http://localhost:3000/graphql`). Send a JSON payload containing `query` and optional `variables`.
- Authentication: Include `Authorization: Bearer <JWT>` for any protected queries/mutations (`login` and `register` are unauthenticated).
- Responses follow the GraphQL specification (`{ "data": { ... }, "errors": [...] }`). The frontend throws if `errors` exist.

### 3.1 Authentication & User Operations
| Operation | Type | Arguments | Returns |
| --- | --- | --- | --- |
| `register(input: CreateUserInput!)` | Mutation | `username`, `email`, `password` | `{ user { ... }, message }` |
| `login(input: LoginInput!)` | Mutation | `email`, `password` | `{ token, user, message }` |
| `me` | Query | — | `User` (current user) |
| `users` / `user(id: Int!)` | Query | optional `id` | `User[]` / `User` |
| `updateUser(input: UpdateUserInput!)` | Mutation | `id`, optional profile fields, optional password | `{ user, message }` |
| `requestPasswordReset(input: ForgotPasswordInput!)` | Mutation | `email` | `{ message, resetToken, resetCode? }` |
| `resetPassword(input: ResetPasswordInput!)` | Mutation | `token`, `code`, `password` | `{ message }` |
| `wardrobeSummary(userId: Int!)` | Query | `userId` | Aggregated stats (latest items/outfits, favorite colors/tags, most worn item) |

### 3.2 Wardrobe, Tags, & Canvas
| Operation | Type | Arguments | Returns |
| --- | --- | --- | --- |
| `clothingItems`, `clothingItem(id)`, `clothingItemsByUser(userId)` | Query | filters optional | `[ClothingItem]`, `ClothingItem` |
| `createClothingItem(input: CreateClothingItemInput!)` | Mutation | `name`, `category`, `user_id`, optional `image_url`, tags | `ClothingItem` |
| `updateClothingItem(input: UpdateClothingItemInput!)` | Mutation | `item_id` + partial fields | `ClothingItem` |
| `deleteClothingItem(id: Int!)` | Mutation | `id` | `{ message }` |
| `tags`, `tag(id)` | Query | optional `id` | `[Tag]` / `Tag` |
| `createTag`, `updateTag`, `deleteTag` | Mutation | payload / ID | `Tag` or `{ message }` |
| `clothingItemTags`, `clothingItemTag(id)`, `clothingItemTagsByItem(itemId)` | Query | optional filters | `[ClothingItemTag]` |
| `addTagToItem(input: CreateClothingItemTagInput!)` | Mutation | `item_id`, `tag_id` | `{ message, mapping }` |
| `removeClothingItemTag(id: Int!)` | Mutation | `id` | `{ message }` |
| `outfits`, `outfit(id)`, `outfitsByUser(userId)` | Query | optional filters | `[Outfit]` / `Outfit` |
| `createOutfit(input: CreateOutfitInput!)` | Mutation | `user_id`, `name?`, `is_public?`, `cover_image_url?` | `Outfit` |
| `updateOutfit(input: UpdateOutfitInput!)` | Mutation | `outfit_id`, partial fields | `Outfit` |
| `deleteOutfit(id: Int!)` | Mutation | `outfit_id` | `{ message }` |
| `outfitItems`, `outfitItem(id)`, `outfitItemsByOutfit(outfitId)` | Query | optional filters | `[OutfitItem]` |
| `createOutfitItem`, `updateOutfitItem`, `deleteOutfitItem` | Mutation | outfit canvas payloads | `OutfitItem` / `{ message }` |
| `publicOutfitFeed(search?, viewerId?)` | Query | optional text search + viewer | `[Outfit]` with `like_count`, `comment_count`, `liked_by_viewer` |

### 3.3 Social, Scheduling, & Insights
| Operation | Type | Arguments | Returns |
| --- | --- | --- | --- |
| `likes`, `like(id)`, `likesByUser(userId)`, `likesForCreator(creatorId)` | Query | optional filters | `[Like]` |
| `likeOutfit(input: CreateLikeInput!)` | Mutation | `user_id`, `outfit_id` | `Like` or `{ message }` |
| `toggleLike(input: CreateLikeInput!)` | Mutation | `user_id`, `outfit_id` | `Like` (liked) or `null` (unliked) |
| `deleteLike(id: Int!)` | Mutation | `id` | `{ message }` |
| `commentsByOutfit(outfitId)` | Query | `outfitId` | `[Comment]` |
| `comment(id)` | Query | `id` | `Comment` |
| `createComment`, `updateComment`, `deleteComment` | Mutation | payload / ID | `Comment` / `{ message }` |
| `scheduledOutfits`, `scheduledOutfit(id)`, `scheduledOutfitsByUser(userId)` | Query | optional filters | `[ScheduledOutfit]` |
| `createScheduledOutfit`, `updateScheduledOutfit`, `deleteScheduledOutfit` | Mutation | schedule payload / ID | `ScheduledOutfit` / `{ message }` |

### 3.4 AI Stylist & Weather
| Operation | Type | Arguments | Returns |
| --- | --- | --- | --- |
| `askStylist(input: AskStylistInput!)` | Mutation | `userId`, `message` | `{ messages[], outfits[], shoppingSuggestions[] }` |
| (Server-only) `WeatherService.getCurrentWeatherForUser` | Service | `userId?` | Latest OpenWeather snapshot or `null` |

### 3.5 Sample Queries & Mutations
**Login Mutation**
```graphql
mutation Login($input: LoginInput!) {
  login(loginInput: $input) {
    token
    message
    user {
      user_id
      username
      email
    }
  }
}
```

**Wardrobe Query**
```graphql
query Wardrobe($userId: Int!) {
  clothingItemsByUser(userId: $userId) {
    item_id
    name
    category
    color
    image_url
    tags {
      tag_id
      name
    }
  }
}
```

**Create Outfit Mutation**
```graphql
mutation SaveOutfit($input: CreateOutfitInput!) {
  createOutfit(input: $input) {
    outfit_id
    name
    is_public
    cover_image_url
  }
}
```

**Ask Stylist Mutation**
```graphql
mutation AskStylist($input: AskStylistInput!) {
  askStylist(input: $input) {
    messages { sender text }
    outfits {
      name
      reasoning
      items { itemId reason }
    }
    shoppingSuggestions { category reason }
  }
}
```

**Curl Example**
```bash
curl http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <JWT>" \
  -d '{ "query": "query { wardrobeSummary(userId: 1) { total_items total_outfits } }" }'
```

---

## 4. Database Schema
| Table | Key Columns | Description |
| --- | --- | --- |
| `users` | `user_id`, `username`, `email`, `password_hash`, `profile_image_url`, timestamps | Auth identities and profile metadata. Owns clothing items, outfits, tags, likes, comments, and scheduled outfits. |
| `clothing_items` | `item_id`, `user_id`, `name`, `category`, `color`, `image_url`, `uploaded_at`, `updated_at` | Wardrobe inventory per user. Linked to tags via `clothing_item_tags`. |
| `tags` | `tag_id`, `user_id`, `name` | User-defined labels for filtering wardrobe items. |
| `clothing_item_tags` | `id`, `item_id`, `tag_id` | Many-to-many join mapping items to tags. |
| `outfits` | `outfit_id`, `user_id`, `name`, `is_public`, `cover_image_url`, `created_at`, `updated_at` | Saved looks shown in the dashboard, feed, and profile. |
| `outfit_items` | `outfit_item_id`, `outfit_id`, `item_id`, `x_position`, `y_position`, `z_index`, `transform` | Canvas placement metadata for each clothing item in an outfit. |
| `likes` | `like_id`, `user_id`, `outfit_id`, `created_at` | Social signal connecting users to outfits. |
| `comments` | `comment_id`, `user_id`, `outfit_id`, `content`, `created_at`, `updated_at` | Feed discussion threads. |
| `scheduled_outfits` | `schedule_id`, `user_id`, `outfit_id`, `schedule_date`, `created_at` | Calendar entries linking outfits to future dates. |
| `password_reset_tokens` | `token`, `user_id`, `code_hash`, `expires_at`, `used` | Stores verification codes for password reset flow. |

**Relationships**
- `users` ⇄ `clothing_items` (One-to-Many)
- `users` ⇄ `outfits` (One-to-Many) ⇄ `outfit_items` (One-to-Many) ⇄ `clothing_items`
- `users` ⇄ `likes` / `comments` / `scheduled_outfits`
- `clothing_items` ⇄ `tags` through `clothing_item_tags`
- Cascade rules remove dependent records when a user or outfit is deleted.

---

## 5. Third-Party Libraries & Tools
| Layer | Libraries / Tools | Purpose |
| --- | --- | --- |
| Backend | NestJS, Apollo GraphQL, TypeORM, class-validator, bcrypt, jsonwebtoken, Nodemailer, RxJS | API framework, GraphQL execution, ORM, validation, auth, email delivery. |
| Frontend | React 18, React Router, Redux Toolkit, React Redux, Axios, html2canvas, TypeScript, Vite | SPA framework, routing, state management, GraphQL client, canvas export, DX tooling. |
| AI & Weather | Groq API (`openai`-compatible) and OpenWeather REST API | Generates stylist suggestions and fetches localized weather. |
| Tooling | Jest, ESLint, Prettier, Nest CLI, Vite dev server | Testing, linting, formatting, scaffolding, and hot-module reload. |

---

## 6. Technical Reference (Methods)
Every exported service method, hook, and thunk is cataloged below with parameters and return values. Paths are relative to the repository root.

### 6.1 Backend Services

#### `AuthService` (`backend/src/auth/auth.service.ts`)
| Method | Parameters | Returns | Notes |
| --- | --- | --- | --- |
| `register(input)` | `CreateUserInput` | `Promise<UserPayload>` | Delegates to `UserService.register`. |
| `login(input)` | `LoginInput` | `Promise<AuthPayload>` | Delegates to `UserService.login`. |
| `requestPasswordReset(input)` | `ForgotPasswordInput` | `Promise<PasswordResetRequestPayload>` | Sends reset code + token via `UserService`. |
| `resetPassword(input)` | `ResetPasswordInput` | `Promise<MessagePayload>` | Verifies code/token, updates password. |
| `me(req)` | Express request (with headers) | `Promise<User>` | Extracts JWT from `Authorization` header and loads the user. |

#### `UserService` (`backend/src/user/user.service.ts`)
| Method | Parameters | Returns | Notes |
| --- | --- | --- | --- |
| `getAllUsers()` | — | `Promise<User[]>` | Retrieves every user with wardrobe items; strips password hashes. |
| `getUserById(id)` | `number` | `Promise<User>` | Loads one user by primary key. |
| `register(input)` | `CreateUserInput` | `Promise<UserPayload>` | Validates uniqueness, hashes password, stores user. |
| `login(input)` | `LoginInput` | `Promise<AuthPayload>` | Validates credentials, issues JWT. |
| `requestPasswordReset(input)` | `ForgotPasswordInput` | `Promise<PasswordResetRequestPayload>` | Generates reset token/code and emails the user. |
| `resetPassword(input)` | `ResetPasswordInput` | `Promise<MessagePayload>` | Verifies code/token, updates password hash. |
| `updateProfile(input)` | `UpdateUserInput` | `Promise<UserPayload>` | Updates username/email/password/profile image. |
| `deleteUser(id)` | `number` | `Promise<MessagePayload>` | Hard deletes user account. |
| `getWardrobeSummary(user_id)` | `number` | `Promise<WardrobeSummary>` | Aggregated totals, latest items/outfits, favorite colors/tags, most worn item. |

#### `ClothingItemService` (`backend/src/clothing-item/clothing-item.service.ts`)
| Method | Parameters | Returns | Notes |
| --- | --- | --- | --- |
| `getAll()` | — | `Promise<ClothingItemPayload[]>` | Lists all clothing items with tags and owner. |
| `getById(id)` | `number` | `Promise<ClothingItemPayload>` | Fetches a single item. |
| `getByUser(user_id)` | `number` | `Promise<ClothingItemPayload[]>` | Lists wardrobe items for one user. |
| `create(dto)` | `CreateClothingItemInput` | `Promise<{ message: string; item: ClothingItemPayload }>` | Saves item, persists tags, processes base64 images. |
| `update(id, dto)` | `number`, `UpdateClothingItemInput` | Same as `create` | Updates metadata, re-stores images when base64 provided. |
| `delete(id)` | `number` | `Promise<MessagePayload>` | Removes the clothing item. |

#### `ClothingItemTagsService` (`backend/src/clothing-item-tag/clothing-item-tags.service.ts`)
| Method | Parameters | Returns | Notes |
| --- | --- | --- | --- |
| `findAll()` | — | `Promise<ClothingItemTag[]>` | Lists all item-tag mappings. |
| `findOne(id)` | `number` | `Promise<ClothingItemTag>` | Fetches a mapping. |
| `getByItem(item_id)` | `number` | `Promise<ClothingItemTag[]>` | All mappings for a clothing item. |
| `addTagToItem(dto)` | `CreateClothingItemTagInput` | `Promise<{ message: string; mapping: ClothingItemTag }>` | Validates duplicates before linking. |
| `create(dto)` | `CreateClothingItemTagInput` | `Promise<ClothingItemTag>` | Alias of `addTagToItem`, returns hydrated entity. |
| `remove(id)` | `number` | `Promise<MessagePayload>` | Deletes a mapping. |

#### `TagsService` (`backend/src/tag/tags.service.ts`)
| Method | Parameters | Returns | Notes |
| --- | --- | --- | --- |
| `findAll()` | — | `Promise<Tag[]>` | Lists all tags with owners. |
| `findOne(id)` | `number` | `Promise<Tag>` | Gets a single tag. |
| `create(dto)` | `CreateTagInput` | `Promise<{ message: string; tag: Tag }>` | Creates a tag (assign user in DTO). |
| `update(id, dto)` | `number`, `UpdateTagInput` | Same return | Updates tag metadata. |
| `delete(id)` | `number` | `Promise<MessagePayload>` | Deletes a tag. |

#### `OutfitService` (`backend/src/outfit/outfit.service.ts`)
| Method | Parameters | Returns | Notes |
| --- | --- | --- | --- |
| `getAll()` | — | `Promise<OutfitPayload[]>` | Lists every outfit with owner summary. |
| `getPublicFeed(search?, viewerId?)` | optional `string`, `number` | `Promise<OutfitPayload[]>` | Filters public outfits, injects like/comment counts + viewer like flag. |
| `getById(id)` | `number` | `Promise<OutfitPayload>` | Loads one outfit. |
| `getByUser(user_id)` | `number` | `Promise<OutfitPayload[]>` | Lists outfits by creator. |
| `create(dto)` | `CreateOutfitInput` | `Promise<{ message: string; outfit: OutfitPayload }>` | Persists outfit row. |
| `update(id, updates)` | `number`, `UpdateOutfitInput` | Same return | Updates outfit fields. |
| `delete(id)` | `number` | `Promise<MessagePayload>` | Deletes the outfit (cascade removes canvas items). |

#### `OutfitItemService` (`backend/src/outfit-item/outfit-item.service.ts`)
| Method | Parameters | Returns | Notes |
| --- | --- | --- | --- |
| `getAll()` | — | `Promise<OutfitItemPayload[]>` | Lists all canvas placements. |
| `getById(id)` | `number` | `Promise<OutfitItemPayload>` | Fetches one placement. |
| `getByOutfit(outfit_id)` | `number` | `Promise<OutfitItemPayload[]>` | Canvas items for an outfit. |
| `create(data)` | `CreateOutfitItemInput` | `Promise<{ message: string; outfit_item: OutfitItemPayload }>` | Links clothing item to outfit with layout data. |
| `update(id, updates)` | `number`, `UpdateOutfitItemInput` | Same return | Updates drag/resize data. |
| `delete(id)` | `number` | `Promise<MessagePayload>` | Removes the placement. |

#### `ScheduledOutfitService` (`backend/src/scheduled-outfit/scheduled-outfit.service.ts`)
| Method | Parameters | Returns | Notes |
| --- | --- | --- | --- |
| `create(dto)` | `CreateScheduledOutfitInput` | `Promise<ScheduledOutfitWithMessage>` | Links user+outfit to a calendar date. |
| `findAll()` | — | `Promise<ScheduledOutfitPayload[]>` | Lists every schedule entry. |
| `findAllByUser(user_id)` | `number` | `Promise<ScheduledOutfitPayload[]>` | Calendar for one user. |
| `findOne(id)` | `number` | `Promise<ScheduledOutfitPayload>` | Fetches single entry. |
| `update(dto)` | `UpdateScheduledOutfitInput` | `Promise<ScheduledOutfitWithMessage>` | Updates schedule date. |
| `delete(id)` | `number` | `Promise<MessagePayload>` | Deletes a scheduled outfit. |

#### `CommentService` (`backend/src/comments/comment.service.ts`)
| Method | Parameters | Returns | Notes |
| --- | --- | --- | --- |
| `create(dto)` | `CreateCommentInput` | `Promise<Comment>` | Validates user/outfit existence, stores comment. |
| `findAllByOutfit(outfit_id)` | `number` | `Promise<Comment[]>` | All comments for one outfit. |
| `findOne(id)` | `number` | `Promise<Comment>` | Fetches a single comment. |
| `update(id, dto)` | `number`, `UpdateCommentInput` | `Promise<Comment>` | Updates content text. |
| `delete(id)` | `number` | `Promise<MessagePayload>` | Deletes comment. |

#### `LikesService` (`backend/src/like/like.service.ts`)
| Method | Parameters | Returns | Notes |
| --- | --- | --- | --- |
| `getAll()` | — | `Promise<Like[]>` | Lists every like with relations. |
| `getById(id)` | `number` | `Promise<Like>` | Fetches like row. |
| `getByUser(user_id)` | `number` | `Promise<Like[]>` | Likes a user has made. |
| `getForCreator(user_id)` | `number` | `Promise<Like[]>` | Likes received on a creator’s outfits. |
| `create(user_id, outfit_id)` | numbers | `Promise<{ message: string; like?: Like; liked: boolean }>` | Adds like or returns existing. |
| `toggle(user_id, outfit_id)` | numbers | Same return | Adds or removes like. |
| `delete(id)` | `number` | `Promise<MessagePayload>` | Deletes like. |

#### `StylistService` (`backend/src/stylist/stylist.service.ts`)
| Method | Parameters | Returns | Notes |
| --- | --- | --- | --- |
| `askStylist(userId, message)` | `number`, `string` | `Promise<StylistResponse>` | Loads user wardrobe + weather, sends prompt to Groq, normalizes outfits/messages/shopping suggestions. |

### 6.2 Supporting Services
| Service | Method | Parameters | Returns | Notes |
| --- | --- | --- | --- | --- |
| `OpenAiClientService` (`backend/src/stylist/openai-client.service.ts`) | `generateStylistResponse(systemPrompt, userPrompt)` | `string`, `string` | `Promise<string>` | Calls Groq’s OpenAI-compatible chat completions API, returns assistant text. |
| `WeatherService` (`backend/src/weather/weather.service.ts`) | `getCurrentWeatherForUser(userId?)` | optional `number` | `Promise<WeatherSnapshot | null>` | Fetches OpenWeather data (currently using fallback coordinates). |

### 6.3 Frontend API Client & Hooks

#### GraphQL Client (`frontend/src/api/client.ts`)
| Method | Parameters | Returns | Notes |
| --- | --- | --- | --- |
| `executeGraphQL<T>(query, variables?)` | `string`, optional `Record<string, any>` | `Promise<T>` | POSTs to `VITE_GRAPHQL_ENDPOINT`, throws on GraphQL errors. |
| `setAuthToken(token)` | `string | null` | `void` | Persists Authorization header on the shared Axios instance. |

#### React Hooks
| Hook | File | Parameters | Returns | Description |
| --- | --- | --- | --- | --- |
| `useAppDispatch()` | `frontend/src/hooks/useAppDispatch.ts` | — | Typed Redux `dispatch` | Wraps `useDispatch<AppDispatch>`. |
| `useAppSelector()` | `frontend/src/hooks/useAppSelector.ts` | selector fn | Selected slice | Typed `useSelector`. |
| `useAuth()` | `frontend/src/hooks/useAuth.ts` | — | `{ user, token, loading, error, success, login, register, logout, clearStatus, applyUserUpdate }` | Gateway to auth slice, handles login/register/logout flows. |
| `useClothingItems(options?)` | `frontend/src/hooks/useClothingItems.ts` | `{ userId?, mode? }` | `{ items, loading, error, refetch }` | Loads wardrobe items globally or for a specific user, normalizes image URLs. |
| `useOutfits()` | `frontend/src/hooks/useOutfits.ts` | — | `{ outfits, loading, error, refetch }` | Fetches entire outfit list and exposes refetch helper. |
| `useDashboardPage()` | `frontend/src/hooks/useDashboardPage.ts` | — | Large object (user metadata, wardrobe filters, canvas handlers, dialog state, notifications, save/export helpers) | Centralized state machine for the dashboard experience (canvas interactions, add-item dialog, save dialog, inbox notifications, navigation). |
| `useHomeCarousel()` | `frontend/src/hooks/useHomeCarousel.ts` | — | `{ loading, error, refetch, hasOutfits, cards, showCounter, counterText, handleCardClick }` | Drives landing page carousel from public feed data. |
| `useLoginForm()` | `frontend/src/hooks/useLoginForm.ts` | — | `{ formValues, registeredMessage, showPassword, loading, error, success, handleChange, toggleShowPassword, handleSubmit }` | Handles login form state and redirects after success. |
| `useRegisterForm()` | `frontend/src/hooks/useRegisterForm.ts` | — | `{ formValues, showPassword, localError, loading, error, success, handleChange, toggleShowPassword, handleSubmit }` | Wraps registration form including password confirmation and auto-login. |

### 6.4 Redux Thunks
Each thunk lives in `frontend/src/store/*/*Slice.ts` and returns a Promise that resolves with the GraphQL payload or rejects with an Error (consumed via `.unwrap()`).

#### Auth Slice (`frontend/src/store/auth/authSlice.ts`)
| Thunk | Parameters | Returns |
| --- | --- | --- |
| `loginThunk` | `{ email, password }` | `AuthPayload` |
| `registerThunk` | `{ username, email, password }` | `User` |
| `meThunk` | — | `User` |
| `requestPasswordResetThunk` | `{ email }` | `{ message, resetToken?, resetCode?, email?, emailDelivery? }` |
| `resetPasswordThunk` | `{ token, code, password }` | `{ message }` |

#### Clothing Items Slice (`frontend/src/store/clothingItems/clothingItemsSlice.ts`)
| Thunk | Parameters | Returns |
| --- | --- | --- |
| `fetchClothingItemsThunk` | — | `ClothingItem[]` |
| `fetchClothingItemThunk` | `item_id` | `ClothingItem` |
| `fetchUserClothingItemsThunk` | `userId` | `ClothingItem[]` |
| `createClothingItemThunk` | `CreateClothingItemInput` | `ClothingItem` |
| `updateClothingItemThunk` | `UpdateClothingItemInput` | `ClothingItem` |
| `deleteClothingItemThunk` | `item_id` | `{ message }` |

#### Outfits Slice (`frontend/src/store/outfits/outfitsSlice.ts`)
| Thunk | Parameters | Returns |
| --- | --- | --- |
| `fetchOutfitsThunk` | — | `Outfit[]` |
| `fetchOutfitThunk` | `outfit_id` | `Outfit` |
| `fetchUserOutfitsThunk` | `userId` | `Outfit[]` |
| `fetchPublicFeedThunk` | `{ search?, viewerId? }` | `Outfit[]` |
| `createOutfitThunk` | `Partial<Outfit>` | `Outfit` |
| `updateOutfitThunk` | `Partial<Outfit>` | `Outfit` |
| `deleteOutfitThunk` | `outfit_id` | `{ message }` |

#### Outfit Items Slice (`frontend/src/store/outfitItems/outfitItemsSlice.ts`)
| Thunk | Parameters | Returns |
| --- | --- | --- |
| `fetchOutfitItemsThunk` | — | `OutfitItem[]` |
| `fetchOutfitItemThunk` | `outfit_item_id` | `OutfitItem` |
| `fetchOutfitItemsByOutfitThunk` | `outfitId` | `OutfitItem[]` |
| `createOutfitItemThunk` | `Partial<OutfitItem>` | `OutfitItem` |
| `updateOutfitItemThunk` | `Partial<OutfitItem>` | `OutfitItem` |
| `deleteOutfitItemThunk` | `outfit_item_id` | `{ message }` |

#### Likes Slice (`frontend/src/store/likes/likesSlice.ts`)
| Thunk | Parameters | Returns |
| --- | --- | --- |
| `fetchLikesThunk` | — | `Like[]` |
| `fetchLikeThunk` | `like_id` | `Like` |
| `fetchLikesByUserThunk` | `userId` | `Like[]` |
| `fetchLikesForCreatorThunk` | `creatorId` | `Like[]` |
| `likeOutfitThunk` | `{ user_id, outfit_id }` | `Like` |
| `toggleLikeThunk` | `{ user_id, outfit_id }` | `Like | null` |
| `deleteLikeThunk` | `like_id` | `{ message }` |

#### Comments Slice (`frontend/src/store/comments/commentsSlice.ts`)
| Thunk | Parameters | Returns |
| --- | --- | --- |
| `fetchCommentsByOutfitThunk` | `outfitId` | `Comment[]` |
| `fetchCommentThunk` | `comment_id` | `Comment` |
| `createCommentThunk` | `{ content, user_id, outfit_id }` | `Comment` |
| `updateCommentThunk` | `{ comment_id, content? }` | `Comment` |
| `deleteCommentThunk` | `comment_id` | `{ message }` |

#### Scheduled Outfits Slice (`frontend/src/store/scheduledOutfits/scheduledOutfitsSlice.ts`)
| Thunk | Parameters | Returns |
| --- | --- | --- |
| `fetchScheduledOutfitsThunk` | — | `ScheduledOutfit[]` |
| `fetchScheduledOutfitsByUserThunk` | `userId` | `ScheduledOutfit[]` |
| `fetchScheduledOutfitThunk` | `schedule_id` | `ScheduledOutfit` |
| `createScheduledOutfitThunk` | `Partial<ScheduledOutfit>` | `ScheduledOutfit` |
| `updateScheduledOutfitThunk` | `Partial<ScheduledOutfit>` | `ScheduledOutfit` |
| `deleteScheduledOutfitThunk` | `schedule_id` | `{ message }` |

#### Tags Slice (`frontend/src/store/tags/tagsSlice.ts`)
| Thunk | Parameters | Returns |
| --- | --- | --- |
| `fetchTagsThunk` | — | `Tag[]` |
| `fetchTagThunk` | `tag_id` | `Tag` |
| `createTagThunk` | `{ name }` | `Tag` |
| `updateTagThunk` | `Tag` | `Tag` |
| `deleteTagThunk` | `tag_id` | `{ message }` |

#### Users Slice (`frontend/src/store/users/usersSlice.ts`)
| Thunk | Parameters | Returns |
| --- | --- | --- |
| `fetchUsersThunk` | — | `User[]` |
| `fetchUserThunk` / `fetchCreatorProfileThunk` | `userId` | `User` |
| `fetchWardrobeSummaryThunk` | `userId` | `WardrobeSummary` |
| `updateUserProfileThunk` | `UpdateUserInput` | `{ message, user }` |

#### Stylist Slice (`frontend/src/store/stylist/stylistSlice.ts`)
| Thunk | Parameters | Returns |
| --- | --- | --- |
| `askStylistThunk` | `{ userId, message }` | `StylistResponse` |

---

## 7. Troubleshooting & Tips
- **JWT errors**: Ensure `JWT_SECRET` matches between backend environment variables and any deployed instances. A mismatched secret causes `Unauthorized` errors from `AuthService.me`.
- **Image uploads**: Base64 uploads must start with `data:image/...;base64,`; otherwise `ClothingItemService.storeBase64Image` throws `BadRequestException`.
- **OpenWeather unavailable**: If `OPENWEATHER_API_KEY` is missing or invalid, `WeatherService` simply logs a warning and the stylist falls back to seasonless outfits.
- **Stylist JSON parsing**: When Groq returns malformed JSON, `StylistService` emits a warning and sends a friendly fallback message to the UI.
- **Database schema drift**: Disable `synchronize` and add migrations before pushing to production to prevent accidental schema changes.

Keep this document aligned with your code changes—update setup steps, API contracts, and method documentation whenever behavior changes.
