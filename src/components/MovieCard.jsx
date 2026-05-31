/**
 * MovieCard.jsx
 * Displays a single search-result card: poster, title, year, type badge,
 * and a favorites toggle button. Clicking the poster/title navigates to
 * the movie detail page.
 */
import { Link } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';

export default function MovieCard({ movie }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(movie.imdbID);

  /** Handle broken poster URLs gracefully. */
  const handleImgError = (e) => {
    e.currentTarget.style.display = 'none';
    e.currentTarget.nextSibling.style.display = 'flex';
  };

  return (
    <article className="bg-zinc-800 rounded-xl overflow-hidden shadow-md hover:shadow-yellow-400/10 hover:-translate-y-1 transition-all duration-200 group relative">
      {/* Favorites toggle */}
      <button
        onClick={() => toggleFavorite(movie)}
        className="absolute top-2 right-2 z-10 bg-zinc-900/80 backdrop-blur-sm rounded-full w-8 h-8 flex items-center justify-center text-base hover:scale-110 transition-transform"
        aria-label={fav ? `Remove ${movie.Title} from favorites` : `Add ${movie.Title} to favorites`}
        title={fav ? 'Remove from favorites' : 'Add to favorites'}
      >
        {fav ? '❤️' : '🤍'}
      </button>

      {/* Poster */}
      <Link to={`/movie/${movie.imdbID}`} tabIndex="-1" aria-hidden="true">
        <img
          src={movie.Poster !== 'N/A' ? movie.Poster : ''}
          alt={`${movie.Title} poster`}
          onError={handleImgError}
          className="w-full h-64 object-cover group-hover:opacity-90 transition-opacity"
          loading="lazy"
        />
        {/* Fallback shown when poster is N/A or fails to load */}
        <div
          style={{ display: movie.Poster !== 'N/A' ? 'none' : 'flex' }}
          className="w-full h-64 bg-zinc-700 items-center justify-center"
          aria-hidden="true"
        >
          <span className="text-gray-500 text-sm text-center px-4">No Poster Available</span>
        </div>
      </Link>

      {/* Info */}
      <div className="p-3">
        <Link to={`/movie/${movie.imdbID}`}>
          <h3 className="text-white font-semibold text-sm leading-snug mb-1.5 line-clamp-2 hover:text-yellow-400 transition-colors">
            {movie.Title}
          </h3>
        </Link>
        <div className="flex items-center justify-between gap-2">
          <span className="text-gray-400 text-xs">{movie.Year}</span>
          <span className="text-xs bg-zinc-700 text-gray-300 px-2 py-0.5 rounded capitalize flex-shrink-0">
            {movie.Type}
          </span>
        </div>
      </div>
    </article>
  );
}
