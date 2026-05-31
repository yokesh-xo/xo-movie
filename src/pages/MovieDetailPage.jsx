/**
 * MovieDetailPage.jsx
 * Displays full information for a single movie/series retrieved by IMDb ID.
 * Includes: large poster, metadata, plot, ratings grid, cast, and a
 * favorites toggle button.
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieById } from '../services/omdbApi';
import { useFavorites } from '../context/FavoritesContext';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

export default function MovieDetailPage() {
  const { imdbID }  = useParams();
  const navigate    = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [movie,   setMovie]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');
      setMovie(null);
      try {
        const data = await getMovieById(imdbID);
        if (cancelled) return;
        if (data.Response === 'True') {
          setMovie(data);
        } else {
          setError(data.Error || 'Movie not found.');
        }
      } catch {
        if (!cancelled) setError('Failed to load movie details. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    // Cleanup: ignore state updates if user navigates away before fetch completes
    return () => { cancelled = true; };
  }, [imdbID]);

  if (loading) return <Loader />;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <BackButton onBack={() => navigate(-1)} />
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!movie) return null;

  const fav = isFavorite(movie.imdbID);

  // Minimal shape stored in favorites (compatible with MovieCard)
  const favEntry = {
    imdbID: movie.imdbID,
    Title:  movie.Title,
    Year:   movie.Year,
    Type:   movie.Type,
    Poster: movie.Poster,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton onBack={() => navigate(-1)} />

      <div className="flex flex-col lg:flex-row gap-10 mt-2">
        {/* ── Left column: poster + favorite button ── */}
        <aside className="flex-shrink-0 flex flex-col items-center lg:items-start">
          <PosterImage poster={movie.Poster} title={movie.Title} />

          <button
            onClick={() => toggleFavorite(favEntry)}
            className={`w-full max-w-xs mt-4 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors border ${
              fav
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border-red-500/30'
                : 'bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20 border-yellow-400/30'
            }`}
          >
            {fav ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
          </button>
        </aside>

        {/* ── Right column: all metadata ── */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
            {movie.Title}
          </h1>

          {/* Quick meta row */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            {movie.Year    && movie.Year    !== 'N/A' && <MetaBadge>{movie.Year}</MetaBadge>}
            {movie.Runtime && movie.Runtime !== 'N/A' && <MetaBadge>{movie.Runtime}</MetaBadge>}
            {movie.Rated   && movie.Rated   !== 'N/A' && (
              <MetaBadge accent>{movie.Rated}</MetaBadge>
            )}
            {movie.Type && (
              <span className="bg-zinc-800 text-gray-300 px-2.5 py-0.5 rounded text-sm capitalize">
                {movie.Type}
              </span>
            )}
          </div>

          {/* Genre tags */}
          {movie.Genre && movie.Genre !== 'N/A' && (
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.Genre.split(',').map((g) => (
                <span
                  key={g.trim()}
                  className="bg-zinc-800 text-gray-300 px-3 py-1 rounded-full text-sm"
                >
                  {g.trim()}
                </span>
              ))}
            </div>
          )}

          {/* Plot */}
          {movie.Plot && movie.Plot !== 'N/A' && (
            <section className="mb-7">
              <h2 className="text-base font-semibold text-white mb-2 uppercase tracking-wider text-xs text-gray-500">
                Plot
              </h2>
              <p className="text-gray-300 leading-relaxed">{movie.Plot}</p>
            </section>
          )}

          {/* Ratings */}
          {movie.Ratings?.length > 0 && (
            <section className="mb-8">
              <SectionHeading>Ratings</SectionHeading>
              <div className="flex flex-wrap gap-4">
                {movie.Ratings.map((r) => (
                  <div
                    key={r.Source}
                    className="bg-zinc-800 rounded-xl px-5 py-3 text-center min-w-[100px]"
                  >
                    <p className="text-yellow-400 text-xl font-bold">{r.Value}</p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {r.Source === 'Internet Movie Database' ? 'IMDb' : r.Source}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Details grid */}
          <section>
            <SectionHeading>Details</SectionHeading>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0">
              <DetailRow label="Director"   value={movie.Director}  />
              <DetailRow label="Writers"    value={movie.Writer}    />
              <DetailRow label="Cast"       value={movie.Actors}    />
              <DetailRow label="Language"   value={movie.Language}  />
              <DetailRow label="Country"    value={movie.Country}   />
              <DetailRow label="Released"   value={movie.Released}  />
              <DetailRow label="Awards"     value={movie.Awards}    />
              <DetailRow label="Box Office" value={movie.BoxOffice} />
              <DetailRow label="Production" value={movie.Production}/>
              <DetailRow label="IMDb ID"    value={movie.imdbID}    />
            </dl>
          </section>
        </div>
      </div>
    </div>
  );
}

/* ── Small sub-components ── */

function BackButton({ onBack }) {
  return (
    <button
      onClick={onBack}
      className="text-yellow-400 hover:text-yellow-300 flex items-center gap-1 text-sm transition-colors mb-6"
    >
      ← Back to results
    </button>
  );
}

function PosterImage({ poster, title }) {
  const [failed, setFailed] = useState(false);
  const hasImage = poster && poster !== 'N/A';

  if (!hasImage || failed) {
    return (
      <div className="w-full max-w-xs lg:w-72 h-96 bg-zinc-800 rounded-2xl flex items-center justify-center">
        <span className="text-gray-500 text-sm">No Poster Available</span>
      </div>
    );
  }

  return (
    <img
      src={poster}
      alt={`${title} poster`}
      onError={() => setFailed(true)}
      className="w-full max-w-xs lg:w-72 rounded-2xl shadow-2xl object-cover"
    />
  );
}

function MetaBadge({ children, accent }) {
  return (
    <span
      className={`px-2.5 py-0.5 rounded text-sm ${
        accent
          ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20'
          : 'text-gray-400 bg-zinc-800'
      }`}
    >
      {children}
    </span>
  );
}

function SectionHeading({ children }) {
  return (
    <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
      {children}
    </h2>
  );
}

function DetailRow({ label, value }) {
  if (!value || value === 'N/A') return null;
  return (
    <div className="border-b border-zinc-800 py-3">
      <dt className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">{label}</dt>
      <dd className="text-gray-200 text-sm">{value}</dd>
    </div>
  );
}
