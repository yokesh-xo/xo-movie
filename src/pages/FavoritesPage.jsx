/**
 * FavoritesPage.jsx
 * Displays all movies/series the user has saved to favorites.
 * Favorites are stored in localStorage via FavoritesContext.
 */
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import MovieGrid from '../components/MovieGrid';

export default function FavoritesPage() {
  const { favorites, clearFavorites } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 flex flex-col items-center justify-center py-24 text-center">
        <span className="text-7xl mb-6" aria-hidden="true">💔</span>
        <h2 className="text-2xl font-bold text-white mb-2">No Favorites Yet</h2>
        <p className="text-gray-400 mb-8">
          Search for movies and click the ❤️ icon to save them here.
        </p>
        <Link
          to="/"
          className="bg-yellow-400 hover:bg-yellow-300 text-zinc-900 font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Start Searching
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">
          My Favorites{' '}
          <span className="text-yellow-400">({favorites.length})</span>
        </h1>
        <button
          onClick={clearFavorites}
          className="text-sm text-red-400 hover:text-red-300 border border-red-400/30 hover:border-red-400/60 px-3 py-1.5 rounded-lg transition-colors"
        >
          Clear All
        </button>
      </div>

      <MovieGrid movies={favorites} />
    </div>
  );
}
