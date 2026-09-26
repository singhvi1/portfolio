import { useApiGet } from '../hooks/useApiGet.js'
import { LoadingState, EmptyState, ErrorState } from '../components/StatusStates.jsx'

export default function Experience() {
  const { data, loading, error, reload } = useApiGet('/experience?limit=50')
  const items = data?.items || []

  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <p className="font-mono text-xs text-accent mb-2">./experience</p>
      <h1 className="font-display text-3xl font-semibold">Experience</h1>
      <p className="text-text-muted mt-3 leading-relaxed">Where I've worked and what I did there.</p>

      <div className="mt-10">
        {loading ? (
          <LoadingState label="Loading experience..." />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : items.length === 0 ? (
          <EmptyState title="No experience entries yet." hint="Added through the admin dashboard." />
        ) : (
          <div className="commit-line flex flex-col gap-10">
            {items.map((exp) => (
              <div key={exp._id} className="flex gap-5">
                <div className="flex flex-col items-center pt-1.5">
                  <span className="commit-dot" />
                </div>
                <div className="pb-2 flex-1 min-w-0">
                  <span className="font-mono text-xs text-text-muted">
                    {exp.startDate} — {exp.endDate || 'Present'}
                  </span>
                  <h2 className="font-display text-xl font-medium mt-1">
                    {exp.position} <span className="text-text-muted font-normal">· {exp.company}</span>
                  </h2>
                  {exp.location && <p className="text-text-muted text-xs font-mono mt-1">{exp.location}</p>}
                  {exp.description && <p className="text-text-muted text-sm mt-2 leading-relaxed">{exp.description}</p>}

                  {exp.responsibilities?.length > 0 && (
                    <ul className="list-disc list-inside text-sm text-text-primary mt-3 space-y-1">
                      {exp.responsibilities.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  )}

                  {exp.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {exp.technologies.map((t) => (
                        <span key={t} className="text-xs font-mono text-text-muted border border-ink-border rounded-full px-2.5 py-1">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
