/**
 * ErrorMessage.jsx
 * Displays a user-friendly error message with an icon.
 */
export default function ErrorMessage({ message }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <span className="text-5xl mb-4" aria-hidden="true">⚠️</span>
      <p className="text-red-400 text-base font-medium max-w-md">{message}</p>
    </div>
  );
}
