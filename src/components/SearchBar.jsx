/**
 * SearchBar.jsx
 * Controlled text input with a submit button for movie searches.
 * Syncs with the `initialValue` prop (used when navigating back via browser history).
 */
import { useState, useEffect } from 'react';

export default function SearchBar({ onSearch, initialValue = '' }) {
  const [input, setInput] = useState(initialValue);

  // Keep input in sync with URL-driven initialValue (back/forward navigation)
  useEffect(() => {
    setInput(initialValue);
  }, [initialValue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed) onSearch(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex gap-2" role="search">
      <input
        type="search"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search movies, series, episodes..."
        aria-label="Search movies"
        className="flex-1 bg-zinc-800 text-white placeholder-gray-500 border border-zinc-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-yellow-400 transition-colors"
      />
      <button
        type="submit"
        className="bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 text-zinc-900 font-semibold px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap"
      >
        Search
      </button>
    </form>
  );
}
