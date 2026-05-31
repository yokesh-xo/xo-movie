/**
 * App.jsx
 * Root component: sets up React Router, wraps the app in FavoritesProvider,
 * and defines all client-side routes.
 */
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { FavoritesProvider } from './context/FavoritesContext';
import Navbar from './components/Navbar';
import SearchPage from './pages/SearchPage';
import MovieDetailPage from './pages/MovieDetailPage';
import FavoritesPage from './pages/FavoritesPage';

export default function App() {
  return (
    <BrowserRouter>
      <FavoritesProvider>
        <div className="min-h-screen bg-zinc-950 text-white">
          <Navbar />
          <main>
            <Routes>
              <Route path="/"                 element={<SearchPage />}      />
              <Route path="/movie/:imdbID"    element={<MovieDetailPage />} />
              <Route path="/favorites"        element={<FavoritesPage />}   />
              <Route path="*"                 element={<NotFoundPage />}    />
            </Routes>
          </main>
        </div>
      </FavoritesProvider>
    </BrowserRouter>
  );
}

/** Fallback for unknown routes. */
function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <span className="text-7xl mb-6" aria-hidden="true">🎭</span>
      <h2 className="text-3xl font-bold text-white mb-2">404 — Page Not Found</h2>
      <p className="text-gray-400 mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link
        to="/"
        className="bg-yellow-400 hover:bg-yellow-300 text-zinc-900 font-semibold px-6 py-3 rounded-lg transition-colors"
      >
        Go to Search
      </Link>
    </div>
  );
}
