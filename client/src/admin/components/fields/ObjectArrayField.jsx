/**
 * @param value array of objects
 * @param itemFields [{ name, label, type: 'text'|'textarea' }]
 * @param onChange(newArray)
 * @param emptyItem object to push when "add" is clicked
 */
export default function ObjectArrayField({ value = [], itemFields, onChange, emptyItem, addLabel = 'Add item' }) {
  function updateItem(index, fieldName, fieldValue) {
    const next = value.map((item, i) => (i === index ? { ...item, [fieldName]: fieldValue } : item));
    onChange(next);
  }

  function removeItem(index) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      {value.map((item, index) => (
        <div key={index} className="border border-ink-border rounded-lg p-4 relative">
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="absolute top-3 right-3 text-xs font-mono text-text-muted hover:text-accent-rose"
          >
            remove
          </button>
          <div className="space-y-3 pr-16">
            {itemFields.map((f) => (
              <div key={f.name}>
                <label className="block text-xs font-mono text-text-muted mb-1">{f.label}</label>
                {f.type === 'textarea' ? (
                  <textarea
                    value={item[f.name] || ''}
                    onChange={(e) => updateItem(index, f.name, e.target.value)}
                    rows={2}
                    className="w-full bg-ink border border-ink-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent/60"
                  />
                ) : (
                  <input
                    type="text"
                    value={item[f.name] || ''}
                    onChange={(e) => updateItem(index, f.name, e.target.value)}
                    className="w-full bg-ink border border-ink-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent/60"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...value, emptyItem])}
        className="font-mono text-xs text-accent hover:underline"
      >
        + {addLabel}
      </button>
    </div>
  );
}
