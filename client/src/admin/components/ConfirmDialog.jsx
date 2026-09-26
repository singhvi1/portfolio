export default function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', pending, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-sm border border-ink-border bg-ink-surface rounded-xl p-6">
        <h3 className="font-display font-semibold text-lg">{title}</h3>
        <p className="text-text-muted text-sm mt-2 leading-relaxed">{message}</p>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            disabled={pending}
            className="px-4 py-2 rounded-lg text-sm border border-ink-border hover:border-accent/60 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={pending}
            className="px-4 py-2 rounded-lg text-sm bg-accent-rose text-ink font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {pending ? 'Deleting...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
