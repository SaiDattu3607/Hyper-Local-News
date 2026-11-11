# Telangana and Andhra Pradesh News API

A Node.js and MongoDB API for district-wise news from Telangana and Andhra Pradesh. The service imports articles from Google News RSS feeds, classifies them by state and district, and exposes endpoints for querying the collected articles.

## Features

- News search by state, district, and text.
- Pagination with newest articles returned first.
- A directory of supported districts for both states.
- Manual ingestion trigger and automatic ingestion every 30 minutes.
- Duplicate articles updated by their feed link.

## Requirements

- Node.js 18 or later
- MongoDB, running locally or available through a connection URI
- Internet access for fetching Google News RSS feeds

## Setup

1. Install dependencies:

   ```sh
   npm install
   ```

2. Copy `.env.example` to `.env` and update the values if needed:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/telangana_ap_news
   ```

   `PORT` and `MONGODB_URI` are optional; the values above are the defaults.

3. Start the API:

   ```sh
   npm start
   ```

   For development with Node's watch mode:

   ```sh
   npm run dev
   ```

The API is available at `http://localhost:5000` by default. MongoDB must be reachable before the server starts. After connecting to MongoDB, the service schedules RSS ingestion every 30 minutes.

## API

### Health check

```http
GET /health
```

Returns:

```json
{ "status": "ok" }
```

### List districts

```http
GET /api/districts
```

Returns an object with `Telangana` and `Andhra Pradesh` arrays of supported district names.

### Get news

```http
GET /api/news
```

Optional query parameters:

| Parameter | Default | Description |
| --- | --- | --- |
| `state` | — | Filter by `Telangana` or `Andhra Pradesh`. |
| `district` | — | Filter by district name. |
| `search` | — | Case-insensitive search in article titles, descriptions, and content. |
| `page` | `1` | Page number; values below 1 are treated as 1. |
| `limit` | `10` | Articles per page, from 1 to 100. |

Example:

```http
GET /api/news?state=Telangana&district=Warangal&page=1&limit=10&search=festival
```

The response contains an `articles` array and pagination metadata:

```json
{
  "articles": [
    {
      "title": "Example local news",
      "description": "Article summary",
      "content": "Article summary",
      "link": "https://example.com/article",
      "source": "Example News",
      "state": "Telangana",
      "district": "Warangal",
      "publishedAt": "2025-01-01T10:00:00.000Z",
      "createdAt": "2025-01-01T10:05:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

Articles are sorted by publication date, newest first. Fields such as `publishedAt` may be absent when the feed does not provide a valid publication date.

### Trigger ingestion

```http
POST /api/scrape/trigger
```

Runs ingestion for the configured district feeds and returns a `202` response with a message and ingestion totals, including feed failures when present. If an ingestion run is already in progress, the new request is skipped.

## Data source and classification

The ingestion worker queries Google News RSS for each supported district in both states. It extracts article details from feed entries and infers state and district from the title and description. Articles that cannot be classified are stored as `Unknown` / `General`. Repeated feed links update the existing article rather than creating a duplicate.

## License

No license is currently specified.
