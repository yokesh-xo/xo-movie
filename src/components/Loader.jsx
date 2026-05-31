/**
 * Loader.jsx
 * Centered spinner used while API requests are in-flight.
 */
export default function Loader() {
  return (
    <div className="flex items-center justify-center py-20" role="status" aria-label="Loading">
      <div className="w-12 h-12 border-4 border-zinc-700 border-t-yellow-400 rounded-full animate-spin" />
    </div>
  );
}
