export default function Field({ label, required, error, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">
        {label}
        {required && <span className="text-accent-rose ml-1">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-text-muted mt-1">{hint}</p>}
      {error && <p className="text-xs text-accent-rose mt-1">{error}</p>}
    </div>
  );
}

export const inputClass =
  'w-full bg-ink-surface border border-ink-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent/60 disabled:opacity-50';
