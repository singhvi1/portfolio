export function LoadingState({ label = 'Loading...' }) {
  return (
    <div className="py-16 text-center font-mono text-sm text-text-muted">{label}</div>
  );
}

export function EmptyState({ title = 'Nothing here yet', action }) {
  return (
    <div className="py-16 text-center border border-dashed border-ink-border rounded-xl">
      <p className="text-text-muted">{title}</p>
      {action}
    </div>
  );
}

export function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="border border-accent-rose/40 bg-accent-rose/10 text-accent-rose text-sm rounded-lg px-4 py-3 mb-4">
      {message}
    </div>
  );
}

export function SuccessBanner({ message }) {
  if (!message) return null;
  return (
    <div className="border border-accent-green/40 bg-accent-green/10 text-accent-green text-sm rounded-lg px-4 py-3 mb-4">
      {message}
    </div>
  );
}
