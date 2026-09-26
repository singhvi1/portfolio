import { useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useApiGet } from '../hooks/useApiGet.js'
import { LoadingState, EmptyState, ErrorState } from '../components/StatusStates.jsx'
import { setActiveTechCategory, clearTechCategory } from '../store/slices/uiSlice.js'

const PROFICIENCY_WIDTH = { Beginner: 33, Intermediate: 66, Advanced: 100 }

export default function Technologies() {
  const activeCategory = useSelector((s) => s.ui.activeTechCategory)
  const dispatch = useDispatch()
  const { data, loading, error, reload } = useApiGet('/technologies?limit=100')

  const items = data?.items || []

  const categories = useMemo(() => {
    const set = new Set(items.map((t) => t.category))
    return Array.from(set).sort()
  }, [items])

  const visible = activeCategory ? items.filter((t) => t.category === activeCategory) : items

  const grouped = useMemo(() => {
    const map = new Map()
    for (const t of visible) {
      if (!map.has(t.category)) map.set(t.category, [])
      map.get(t.category).push(t)
    }
    return Array.from(map.entries());
  }, [visible])

  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="font-mono text-xs text-accent mb-2">./technologies</p>
          <h1 className="font-display text-3xl font-semibold">Technologies</h1>
        </div>
        {activeCategory && (
          <button
            onClick={() => dispatch(clearTechCategory())}
            className="font-mono text-xs text-text-muted hover:text-accent"
          >
            clear filter: {activeCategory} ✕
          </button>
        )}
      </div>
      <p className="text-text-muted mt-3 leading-relaxed">
        Updated as I grow — logged month by month through the journey.
      </p>

      {!loading && !error && categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-6">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => dispatch(setActiveTechCategory(c))}
              className={`px-2.5 py-1 rounded-full text-xs font-mono border transition-colors ${
                activeCategory === c
                  ? 'bg-accent/10 border-accent text-accent'
                  : 'border-ink-border text-text-muted hover:border-accent/60 hover:text-text-primary'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <div className="mt-10">
        {loading ? (
          <LoadingState label="Loading technologies..." />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : items.length === 0 ? (
          <EmptyState
            title="No technologies logged yet."
            hint="This fills in as monthly entries are added through the admin dashboard."
          />
        ) : grouped.length === 0 ? (
          <EmptyState title={`Nothing in "${activeCategory}" yet.`} />
        ) : (
          <div className="space-y-10">
            {grouped.map(([category, techs]) => (
              <div key={category}>
                <h2 className="font-mono text-sm text-text-muted mb-4">{category}</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {techs.map((item) => (
                    <div key={item._id}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span>{item.name}</span>
                        <span className="font-mono text-xs text-text-muted">{item.proficiency}</span>
                      </div>
                      <div className="h-1.5 bg-ink-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full"
                          style={{ width: `${PROFICIENCY_WIDTH[item.proficiency] || 0}%` }}
                        />
                      </div>
                      {item.monthLearned && (
                        <p className="text-xs font-mono text-text-muted mt-1">since {item.monthLearned}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
