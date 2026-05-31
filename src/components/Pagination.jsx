/**
 * Pagination.jsx
 * Renders a smart page navigator with ellipsis for large page ranges.
 * The OMDB free tier supports a maximum of 100 pages per query.
 */

const OMDB_MAX_PAGES = 100;

/**
 * Builds a compact list of page numbers and '...' separators.
 * @param {number} current - Active page (1-based)
 * @param {number} total   - Total number of pages
 * @returns {(number|string)[]}
 */
function buildPageRange(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 4) {
    return [1, 2, 3, 4, 5, '...', total];
  }
  if (current >= total - 3) {
    return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, '...', current - 1, current, current + 1, '...', total];
}

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  // Cap at OMDB's maximum of 100 pages
  const maxPages = Math.min(totalPages, OMDB_MAX_PAGES);

  if (maxPages <= 1) return null;

  const pages = buildPageRange(currentPage, maxPages);

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-10" aria-label="Pagination">
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-lg bg-zinc-800 text-white text-sm disabled:opacity-40 hover:bg-zinc-700 transition-colors disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        ← Prev
      </button>

      {/* Page numbers */}
      {pages.map((page, idx) =>
        page === '...' ? (
          <span
            key={`ellipsis-${idx}`}
            className="text-gray-500 px-2 select-none"
            aria-hidden="true"
          >
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
            className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
              page === currentPage
                ? 'bg-yellow-400 text-zinc-900 font-bold'
                : 'bg-zinc-800 text-white hover:bg-zinc-700'
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === maxPages}
        className="px-4 py-2 rounded-lg bg-zinc-800 text-white text-sm disabled:opacity-40 hover:bg-zinc-700 transition-colors disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        Next →
      </button>
    </nav>
  );
}
