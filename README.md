# CineSearch — Movie Search App

A full-featured movie search application built with **React**, **React Router v6**, and **Tailwind CSS**, powered by the [OMDB API](https://www.omdbapi.com/).

---

## Features

| Feature | Details |
|---|---|
| **Search** | Search any movie, TV series, or episode by title or keyword |
| **Type Filter** | Filter results by type (Movies / TV Series / Episodes) via the OMDB API `type` parameter — no client-side `Array.prototype.filter()` |
| **Pagination** | Navigate large result sets (10 per page, up to 100 pages) |
| **Movie Details** | Full detail view: large poster, plot, genre tags, ratings, cast, and more |
| **Favorites** | Save/remove favorites via a heart toggle; persisted to `localStorage` |
| **Responsive** | Mobile-first layout, works on all screen sizes |
| **Error Handling** | Friendly messages for network errors, empty results, and invalid routes |

---

## Tech Stack

- **React 18** — UI library
- **React Router v6** — Client-side routing (`useSearchParams` for shareable URLs)
- **Tailwind CSS v3** — Utility-first styling with a dark cinema theme
- **Vite 5** — Fast dev server and production builds
- **OMDB API** — Free movie database (1,000 req/day on free tier)

---

## Getting Started

### 1. Get an OMDB API Key

Register for a free key at **[omdbapi.com/apikey.aspx](https://www.omdbapi.com/apikey.aspx)**.

### 2. Configure the Environment

```bash
cp .env.example .env
```

Open `.env` and replace the placeholder:

```
VITE_OMDB_API_KEY=your_actual_key_here
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Dev Server

```bash
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot-reload |
| `npm run build` | Build optimized production bundle |
| `npm run preview` | Locally preview the production build |

---

## Project Structure

```
movie-search/
├── src/
│   ├── components/
│   │   ├── ErrorMessage.jsx    # User-friendly error display
│   │   ├── Loader.jsx          # Animated loading spinner
│   │   ├── MovieCard.jsx       # Individual result card + favorites toggle
│   │   ├── MovieGrid.jsx       # Responsive grid of MovieCards
│   │   ├── Navbar.jsx          # Sticky nav with favorites count badge
│   │   ├── Pagination.jsx      # Smart page navigator with ellipsis
│   │   ├── SearchBar.jsx       # Search input form
│   │   └── TypeFilter.jsx      # Media-type dropdown (API-driven filter)
│   ├── context/
│   │   └── FavoritesContext.jsx  # React Context + localStorage for favorites
│   ├── pages/
│   │   ├── SearchPage.jsx        # Main search view
│   │   ├── MovieDetailPage.jsx   # Full movie/series detail view
│   │   └── FavoritesPage.jsx     # Saved favorites list
│   ├── services/
│   │   └── omdbApi.js            # searchMovies() and getMovieById() helpers
│   ├── App.jsx                   # BrowserRouter + route definitions
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Tailwind base styles
├── .env.example                  # Environment variable template
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

---

## Routes

| Path | Page |
|---|---|
| `/` | Search page |
| `/movie/:imdbID` | Movie detail page |
| `/favorites` | Saved favorites |
| `*` | 404 not-found page |

---

## Design Decisions

- **Type filtering uses the OMDB API** (`&type=movie|series|episode`), not `Array.prototype.filter()`.
- **Search state lives in the URL** (`?q=batman&type=movie&page=2`) so searches are shareable and browser history navigation works correctly.
- **Favorites use React Context** so the heart icon stays in sync across all cards on the page without prop drilling.
- **Cleanup flag in `useEffect`** (`cancelled = true`) prevents stale state updates when navigating away before a fetch completes.
