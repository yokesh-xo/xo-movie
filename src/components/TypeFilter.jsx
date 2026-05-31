/**
 * TypeFilter.jsx
 * Dropdown for filtering results by media type.
 *
 * IMPORTANT: Filtering is done entirely via the OMDB API's `type` query
 * parameter — Array.prototype.filter() is NOT used anywhere in this feature.
 */

const TYPE_OPTIONS = [
  { value: '',        label: 'All Types'  },
  { value: 'movie',   label: 'Movies'     },
  { value: 'series',  label: 'TV Series'  },
  { value: 'episode', label: 'Episodes'   },
];

export default function TypeFilter({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Filter by type"
      className="bg-zinc-800 text-white border border-zinc-700 rounded-lg px-4 py-2.5 focus:outline-none focus:border-yellow-400 transition-colors cursor-pointer min-w-[145px]"
    >
      {TYPE_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
