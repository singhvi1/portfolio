import { useSelector, useDispatch } from 'react-redux'
import { useMemo } from 'react'
import { useApiGet } from '../hooks/useApiGet.js'
import ProjectCard from '../components/ProjectCard.jsx'
import { LoadingState, EmptyState, ErrorState } from '../components/StatusStates.jsx'
import { clearTag } from '../store/slices/uiSlice.js'

export default function Projects() {
  const activeTag = useSelector((s) => s.ui.activeTag)
  const dispatch = useDispatch()

  // limit=100 rather than paginating — this is a personal portfolio's
  // project count, not a dataset that needs server-side paging yet.
  const { data, loading, error, reload } = useApiGet('/projects?limit=100')

  const projects = useMemo(() => {
    const items = data?.items || []
    // The portfolio app itself is a real Project record (so /admin can
    // manage it) but was never meant to appear in the public showcase.
    return items.filter((p) => !p.isPortfolioApp)
  }, [data])

  const visible = useMemo(() => {
    if (!activeTag) return projects
    return projects.filter((p) => (p.tags || []).includes(activeTag))
  }, [projects, activeTag])

  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <p className="font-mono text-xs text-accent mb-2">./projects</p>
          <h1 className="font-display text-3xl font-semibold">Things I've built</h1>
        </div>
        {activeTag && (
          <button
            onClick={() => dispatch(clearTag())}
            className="font-mono text-xs text-text-muted hover:text-accent"
          >
            clear filter: {activeTag} ✕
          </button>
        )}
      </div>

      <div className="mt-10">
        {loading ? (
          <LoadingState label="Loading projects..." />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : visible.length === 0 ? (
          <EmptyState
            title={activeTag ? `Nothing tagged "${activeTag}" yet.` : 'No projects yet.'}
          />
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {visible.map((p) => (
              <ProjectCard key={p._id || p.slug} project={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
