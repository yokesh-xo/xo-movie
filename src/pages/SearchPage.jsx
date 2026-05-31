/**
 * SearchPage.jsx
 * Main search interface. Search state (query, type, page) is stored in the
 * URL via useSearchParams so browser back/forward navigation works correctly.
 *
 * Type filtering is performed by the OMDB API's `type` parameter —
 * Array.prototype.filter() is never called on result data.
 */
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMovies } from '../services/omdbApi';
import SearchBar from '../components/SearchBar';
import TypeFilter from '../components/TypeFilter';
import MovieGrid from '../components/MovieGrid';
import Pagination from '../components/Pagination';
import ErrorMessage from '../components/ErrorMessage';
import Loader from '../components/Loader';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Derive state from URL params so links are shareable and history works
  const query   = searchParams.get('q')    || '';
  const type    = searchParams.get('type') || '';
  const page    = parseInt(searchParams.get('page') || '1', 10);

  const [movies,       setMovies]       = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState('');

  /** Fetches movies for the given parameters and updates component state. */
  const fetchMovies = useCallback(async (q, t, p) => {
    if (!q.trim()) return;
    setLoading(true);
    setError('');
    try {
      const data = await searchMovies({ query: q, type: t, page: p });
      if (data.Response === 'True') {
        setMovies(data.Search);
        setTotalResults(parseInt(data.totalResults, 10));
      } else {
        setMovies([]);
        setTotalResults(0);
        setError(data.Error || 'No results found.');
      }
    } catch {
      setMovies([]);
      setTotalResults(0);
      setError('Failed to fetch movies. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Re-fetch whenever URL params change (includes back/forward navigation)
  useEffect(() => {
    if (query) fetchMovies(query, type, page);
    else { setMovies([]); setTotalResults(0); setError(''); }
  }, [query, type, page, fetchMovies]);

  const handleSearch = (newQuery) => {
    setSearchParams({ q: newQuery, type, page: '1' });
  };

  const handleTypeChange = (newType) => {
    // Only trigger a new search if there's already an active query
    if (!query) return;
    setSearchParams({ q: query, type: newType, page: '1' });
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ q: query, type, page: String(newPage) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.ceil(totalResults / 10);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <SearchBar onSearch={handleSearch} initialValue={query} />
        <TypeFilter value={type} onChange={handleTypeChange} />
      </div>

      {/* Loading state */}
      {loading && <Loader />}

      {/* Error / no-results state */}
      {!loading && error && <ErrorMessage message={error} />}

      {/* Results */}
      {!loading && !error && movies.length > 0 && (
        <>
          <p className="text-gray-500 text-sm mb-5">
            Page {page} — {totalResults.toLocaleString()} result{totalResults !== 1 ? 's' : ''} found
          </p>
          <MovieGrid movies={movies} />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Empty / welcome state */}
      {!loading && !query && (
        <div className="flex flex-col items-center justify-center py-24 text-center select-none">
          <span className="text-8xl mb-6" aria-hidden="true">🎬</span>
          <h2 className="text-2xl font-bold text-white mb-2">Discover Movies &amp; Series</h2>
          <p className="text-gray-400">Search by title, keyword, or actor name</p>
        </div>
      )}
    </div>
  );
}
