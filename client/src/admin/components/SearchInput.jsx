export default function SearchInput({ value, onChange, placeholder = 'Search...' }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full sm:w-64 bg-ink-surface border border-ink-border rounded-lg px-3 py-2 text-sm placeholder:text-text-muted focus:border-accent/60 outline-none"
    />
  );
}
