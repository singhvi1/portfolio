import { useDispatch, useSelector } from 'react-redux'
import { setActiveTag } from '../store/slices/uiSlice.js'

export default function TagBadge({ tag, clickable = true }) {
  const dispatch = useDispatch()
  const activeTag = useSelector((s) => s.ui.activeTag)
  const isActive = activeTag === tag

  const base =
    'inline-block px-2.5 py-1 rounded-full text-xs font-mono border transition-colors'
  const state = isActive
    ? 'bg-accent/10 border-accent text-accent'
    : 'border-ink-border text-text-muted hover:border-accent/60 hover:text-text-primary'

  if (!clickable) {
    return <span className={`${base} border-ink-border text-text-muted`}>{tag}</span>
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation() // cards may be clickable themselves (project detail); a tag click should filter, not navigate
        dispatch(setActiveTag(tag))
      }}
      className={`${base} ${state}`}
    >
      {tag}
    </button>
  )
}
