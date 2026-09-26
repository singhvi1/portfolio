export default function Pagination({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-6 font-mono text-xs text-text-muted">
      <button
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="px-3 py-1.5 border border-ink-border rounded-lg disabled:opacity-30 hover:border-accent/60"
      >
        ← prev
      </button>
      <span>
        page {page} / {totalPages}
      </span>
      <button
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className="px-3 py-1.5 border border-ink-border rounded-lg disabled:opacity-30 hover:border-accent/60"
      >
        next →
      </button>
    </div>
  );
}
