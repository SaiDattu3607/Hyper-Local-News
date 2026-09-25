# Telangana and Andhra Pradesh News API

## Setup

1. Install Node.js 18+ and MongoDB.
2. Copy `.env.example` to `.env` and set `MONGODB_URI`.
3. Install dependencies with `npm install`.
4. Start the API with `npm start` or `npm run dev`.

The API listens on `http://localhost:5000` by default.

## Endpoints

- `GET /api/news?state=Telangana&district=Warangal&page=1&limit=10&search=festival`
- `GET /api/districts`
- `POST /api/scrape/trigger`

The worker also runs automatically every 30 minutes after MongoDB connects. Google News RSS is used as the feed source; `axios` and `cheerio` are included for future source adapters and HTML cleanup.
