/**
 * MovieGrid.jsx
 * Responsive grid container that renders a MovieCard for each movie.
 */
import MovieCard from './MovieCard';

export default function MovieGrid({ movies }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {movies.map((movie) => (
        <MovieCard key={movie.imdbID} movie={movie} />
      ))}
    </div>
  );
}
