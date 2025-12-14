# Virtual Closet – Frontend

This React + TypeScript + Vite SPA consumes the NestJS GraphQL API and manages all client-side state through Redux Toolkit slices. REST endpoints and Axios service files were removed; every network call now goes through GraphQL thunks defined in `src/store/**`.

## Quick Start

```bash
cd frontend
cp .env.example .env        # set VITE_GRAPHQL_ENDPOINT (default http://localhost:3000/graphql)
npm install
npm run dev                 # start Vite dev server
npm run build               # production build (tsc -b && vite build)
```

The app expects the backend GraphQL server to run locally on port 3000 with JWT auth enabled. Adjust `VITE_GRAPHQL_ENDPOINT` if the API lives elsewhere.

## Architecture Highlights

- **GraphQL-only data layer** – every thunk uses `executeGraphQL` (see `src/api/client.ts`) and a single `/graphql` endpoint.
- **Redux Toolkit slices** – per-domain slices (`auth`, `users`, `clothingItems`, `outfits`, `outfitItems`, `likes`, `comments`, `scheduledOutfits`, `tags`) store normalized data for Profile, Feed, Dashboard, and Creator Profile pages.
- **Typed hooks** – `useAppDispatch`, `useAppSelector`, `useAuth`, `useDashboardPage`, `useClothingItems`, and `useHomeCarousel` expose strongly-typed helpers for components.
- **UI** – React Router pages (`src/pages/*.tsx`) read from Redux selectors and dispatch thunks; no component calls fetch/axios directly.

## GraphQL Cheat Sheet

```graphql
# Query viewer profile and wardrobe
query Profile($userId: Int!) {
  user(id: $userId) {
    user_id
    username
    clothing_items {
      item_id
      name
      tags { tag_id name }
    }
  }
  wardrobeSummary(userId: $userId) {
    total_items
    total_outfits
  }
}

# Create outfit + schedule it
mutation SaveOutfit($outfit: CreateOutfitInput!, $schedule: CreateScheduledOutfitInput!) {
  createOutfit(createOutfitInput: $outfit) {
    outfit_id
    name
    is_public
  }
  createScheduledOutfit(createScheduledOutfitInput: $schedule) {
    schedule_id
    schedule_date
    outfit { outfit_id name }
  }
}
```

More detailed endpoint/method tables live in `docs/PROJECT_DOCUMENTATION.md`.

## Testing & Smoke Checks

1. Log in / register using the Auth GraphQL mutations.
2. Create wardrobe items + outfits from the Dashboard (`useDashboardPage` dispatches clothing/outfit/outfit-item thunks).
3. Browse Feed, like/comment on outfits (`toggleLikeThunk`, `createCommentThunk`).
4. Open Profile & Creator Profile to verify Redux state sync (scheduled outfits, likes, wardrobe stats).
5. Run `npm run build` before deploying.

For deeper technical docs (service methods, thunks, schema, grading summary) see `../docs/PROJECT_DOCUMENTATION.md`.
