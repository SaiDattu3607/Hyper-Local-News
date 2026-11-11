# Hyper Local News — Telangana and Andhra Pradesh

District-wise news for all 33 districts of Telangana and 26 of Andhra Pradesh. An Express + MongoDB
API pulls Google News RSS every 30 minutes and sorts each story into a district; a React frontend
(`client/`) presents it as a broadsheet front page, a state edition and a page for every district.

## Setup

1. Install Node.js 18+ (Node 22+ if you use the taste skill) and start MongoDB. With Docker:
   `docker run -d --name hln-mongo -p 27017:27017 -v hln-mongo-data:/data/db mongo:8`
2. Copy `.env.example` to `.env` and set `MONGODB_URI` if it differs from the default.
3. `npm install`, then `npm run dev` for the API on `http://localhost:5000`.
4. In a second terminal: `npm --prefix client install`, then `npm run client:dev` for the frontend on
   `http://localhost:5173` (it proxies `/api` to the API).
5. The first scrape runs 30 minutes after start; to fill the database right away:
   `curl -X POST http://localhost:5000/api/scrape/trigger`

**Production:** `npm run build` builds `client/dist`, and `npm start` then serves the site and the API
from one port.

## Endpoints

- `GET /api/news?state=Telangana&district=Warangal&page=1&limit=10&search=festival`
- `GET /api/districts`
- `GET /api/stats` — when the wire last updated, and story counts per state and district (total and last 24 hours)
- `POST /api/scrape/trigger`

The search term is matched literally (regex characters are escaped).

## Frontend

- `client/src/routes/` — `FrontPage` (front page and state editions), `Edition` (one district), `Search`
- `client/src/components/DistrictMap.tsx` — the tile map of all 59 districts, shaded by stories in the
  last 24 hours; positions and Telugu names live in `client/src/data/districts.ts`
  (**the Telugu names should be checked by a native speaker**)
- `client/src/styles/tokens.css` — colours (day and night editions) and fonts

## Design skill

The frontend was built with the [taste skill](https://github.com/Leonxlnx/taste-skill)
(`design-taste-frontend`) for Claude Code. It is pinned in `skills-lock.json`; restore it with
`npx skills install`. It runs its checks with Node 22+ and Chrome or Edge.
