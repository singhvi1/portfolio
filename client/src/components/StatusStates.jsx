export function LoadingState({ label = 'Loading...' }) {
  return <div className="py-16 text-center font-mono text-sm text-text-muted">{label}</div>;
}

export function EmptyState({ title = 'Nothing here yet', hint }) {
  return (
    <div className="py-16 text-center border border-dashed border-ink-border rounded-xl">
      <p className="text-text-muted">{title}</p>
      {hint && <p className="text-text-muted text-xs font-mono mt-2">{hint}</p>}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="py-16 text-center border border-accent-rose/30 bg-accent-rose/5 rounded-xl">
      <p className="text-accent-rose text-sm">{message || 'Something went wrong loading this.'}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-4 font-mono text-xs text-accent hover:underline">
          try again
        </button>
      )}
    </div>
  );
}
