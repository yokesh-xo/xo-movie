/**
 * Navbar.jsx
 * Sticky top navigation with links to Search and Favorites pages.
 * Shows a badge with the current favorites count.
 */
import { Link, NavLink } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';

export default function Navbar() {
  const { favorites } = useFavorites();

  return (
    <nav className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl" aria-hidden="true">🎬</span>
          <span className="text-white font-bold text-xl group-hover:text-yellow-400 transition-colors">
            CineSearch
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-6">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive
                ? 'text-yellow-400 font-medium'
                : 'text-gray-300 hover:text-white transition-colors'
            }
          >
            Search
          </NavLink>

          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `flex items-center gap-1.5 transition-colors ${
                isActive ? 'text-yellow-400 font-medium' : 'text-gray-300 hover:text-white'
              }`
            }
          >
            Favorites
            {favorites.length > 0 && (
              <span className="bg-yellow-400 text-zinc-900 text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center leading-none">
                {favorites.length}
              </span>
            )}
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
