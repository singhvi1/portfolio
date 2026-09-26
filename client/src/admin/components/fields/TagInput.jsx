import { useState } from 'react';

export default function TagInput({ value = [], onChange, placeholder = 'Type and press Enter' }) {
  const [draft, setDraft] = useState('');

  function commit() {
    const v = draft.trim();
    if (v && !value.includes(v)) {
      onChange([...value, v]);
    }
    setDraft('');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      commit();
    } else if (e.key === 'Backspace' && !draft && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  return (
    <div className="border border-ink-border rounded-lg px-2 py-2 flex flex-wrap gap-2 focus-within:border-accent/60">
      {value.map((tag, i) => (
        <span
          key={`${tag}-${i}`}
          className="inline-flex items-center gap-1.5 bg-accent/10 text-accent text-xs font-mono px-2 py-1 rounded-full"
        >
          {tag}
          <button
            type="button"
            onClick={() => onChange(value.filter((_, idx) => idx !== i))}
            className="hover:text-accent-rose"
            aria-label={`Remove ${tag}`}
          >
            ✕
          </button>
        </span>
      ))}
      <input
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commit}
        placeholder={value.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[8rem] bg-transparent text-sm outline-none placeholder:text-text-muted"
      />
    </div>
  );
}
