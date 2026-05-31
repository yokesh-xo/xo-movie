/**
 * omdbApi.js
 * Service layer for all OMDB API requests.
 * API docs: https://www.omdbapi.com/
 */

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = 'https://www.omdbapi.com/';

/**
 * Internal helper — builds a query string and fetches from the OMDB base URL.
 * Throws on network errors; callers should check `data.Response === 'False'`
 * for logical API errors (e.g. "Movie not found!").
 *
 * @param {Record<string, string|number>} params
 * @returns {Promise<Object>}
 */
async function omdbFetch(params) {
  const searchParams = new URLSearchParams({ ...params, apikey: API_KEY });
  const response = await fetch(`${BASE_URL}?${searchParams}`);

  if (!response.ok) {
    throw new Error(`Network error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Search for movies/series/episodes by keyword.
 *
 * Filtering by type is handled entirely by the OMDB `type` query parameter —
 * no client-side Array.prototype.filter() is used.
 *
 * @param {Object} options
 * @param {string} options.query   - Search keyword or title
 * @param {string} [options.type]  - 'movie' | 'series' | 'episode' | '' (all)
 * @param {number} [options.page]  - Page number (10 results per page, default 1)
 * @returns {Promise<{ Search: Array, totalResults: string, Response: string, Error?: string }>}
 */
export async function searchMovies({ query, type = '', page = 1 }) {
  const params = { s: query, page };
  // Only include 'type' when a specific type is selected;
  // omitting it returns all types from the API.
  if (type) params.type = type;
  return omdbFetch(params);
}

/**
 * Fetch full details for a single title by its IMDb ID.
 *
 * @param {string} imdbID - The IMDb ID (e.g. "tt0111161")
 * @returns {Promise<Object>} Full movie/series data object
 */
export async function getMovieById(imdbID) {
  return omdbFetch({ i: imdbID, plot: 'full' });
}
