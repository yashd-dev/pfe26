# NMIMS Canteen

A small full-stack canteen menu app. The backend exposes menu data through a typed Bun API, and the frontend uses Astro to render fast pages that are easy to understand and extend.

## Backend API

The API lives in `api/`. It is built with Bun, Elysia, Drizzle, and libSQL. The server starts at `http://localhost:3000`, enables CORS, connects to the database through `@api/db`, and exposes menu and review routes.

### Main routes

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/` | Health check. Returns `OK`. |
| `GET` | `/menu` | Lists all menu items. Supports `?search=pasta`. |
| `GET` | `/menu/:slug` | Gets one menu item by slug. |
| `GET` | `/menu/cuisines` | Lists cuisines with slug, cover image, and item count. |
| `GET` | `/menu/cuisines/:slug` | Gets one cuisine summary. |
| `GET` | `/menu/cuisines/:slug/items` | Lists items for a cuisine. Supports `?search=pizza`. |
| `GET` | `/menu/:id/reviews` | Gets a menu item's average rating and review count. |
| `POST` | `/menu/:id/reviews` | Adds a rating from `1` to `5` and updates the average. |

The database has two main tables: `menu_items` for food details and `reviews` for submitted ratings. Most frontend screens only need the menu item shape: name, slug, cuisine, image, ingredients, cook time, calories, rating, and tags.

## Frontend

The frontend lives in `project/` and is built with Astro. Astro is used here because most of the app can be rendered as simple HTML first, with a small amount of browser JavaScript only where interaction is needed.

### How Astro is used

| File | What it does |
| --- | --- |
| `src/pages/index.astro` | Home route `/`. Fetches cuisines and menu items, renders the grid, then uses a small script for search and cuisine filtering. |
| `src/pages/menu/[slug].astro` | Dynamic detail route like `/menu/classic-margherita-pizza`. Uses the slug from the URL to render one item. |
| `src/layouts/Layout.astro` | Shared page shell: HTML document, fonts, metadata, header, and slot for page content. |
| `src/components/SiteHeader.astro` | Reusable header with title, optional back button, and search form. |
| `src/lib/menu-api.ts` | Small API client that wraps `fetch()` and keeps backend URLs/types in one place. |

Astro routes are file-based, so every file in `src/pages/` becomes a page. The `[slug].astro` filename creates a dynamic route, where `Astro.params.slug` contains the URL segment.

Astro files have two parts:

```astro
---
// Server-side code runs here before the HTML is sent.
---

<!-- Markup renders here. -->
```

In this project, the home page fetches API data in the frontmatter, renders real HTML cards, and embeds the loaded data as JSON so the page can filter instantly without calling the API again. The detail page uses `getStaticPaths()` to prebuild known menu pages when possible, then falls back to fetching the item by slug if needed.

## Running locally

Backend:

```sh
cd api
bun install
bun run db:push
bun run db:seed
bun run dev:server
```

Frontend:

```sh
cd project
bun install
bun run dev
```

By default, the frontend API client uses `PUBLIC_API_BASE_URL` or `API_BASE_URL` if provided, otherwise it falls back to the deployed Railway API.
