/**
 * FavoritesContext.jsx
 * Provides a shared favorites list to the entire app via React Context.
 * State is persisted to localStorage so favorites survive page refreshes.
 *
 * NOTE: Array.prototype.filter() is intentionally avoided.
 *       Removal uses Array.prototype.reduce() instead.
 */
import { createContext, useContext, useState, useCallback } from 'react';

const STORAGE_KEY = 'cinesearch_favorites';

/** Load favorites array from localStorage (returns [] on any failure). */
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Persist favorites array to localStorage (silently ignores storage errors). */
function saveToStorage(favorites) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch {
    // localStorage may be unavailable (e.g. private-browsing quotas)
  }
}

const FavoritesContext = createContext(null);

/**
 * Wrap your component tree with this provider to enable favorites functionality.
 */
export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(loadFromStorage);

  /** Returns true if a movie with the given imdbID is in favorites. */
  const isFavorite = useCallback(
    (imdbID) => favorites.some((m) => m.imdbID === imdbID),
    [favorites]
  );

  /**
   * Add a movie to favorites if not present; remove it if it already is.
   * The movie object should contain at minimum: { imdbID, Title, Year, Type, Poster }.
   */
  const toggleFavorite = useCallback((movie) => {
    setFavorites((prev) => {
      const exists = prev.some((m) => m.imdbID === movie.imdbID);

      // Remove using reduce (not Array.prototype.filter) as per project requirements
      const updated = exists
        ? prev.reduce((acc, m) => {
            if (m.imdbID !== movie.imdbID) acc.push(m);
            return acc;
          }, [])
        : [...prev, movie];

      saveToStorage(updated);
      return updated;
    });
  }, []);

  /** Remove all favorites and clear localStorage. */
  const clearFavorites = useCallback(() => {
    setFavorites([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // storage unavailable
    }
  }, []);

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, clearFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
}

/**
 * Hook to access favorites state and actions.
 * Must be used inside <FavoritesProvider>.
 */
export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used inside <FavoritesProvider>');
  return ctx;
}
