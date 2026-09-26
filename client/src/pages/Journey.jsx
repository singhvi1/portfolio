import { Link } from 'react-router-dom'
import { useApiGet } from '../hooks/useApiGet.js'
import { LoadingState, EmptyState, ErrorState } from '../components/StatusStates.jsx'

function Chip({ children }) {
  return (
    <span className="text-xs font-mono text-text-muted border border-ink-border rounded-full px-2.5 py-1">
      {children}
    </span>
  )
}

function Section({ label, color, children }) {
  return (
    <div className="mt-4">
      <p className={`text-xs font-mono mb-2 ${color}`}>{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

export default function Journey() {
  const { data: entries, loading, error, reload } = useApiGet('/journey')
  const items = entries || []

  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <p className="font-mono text-xs text-accent mb-2">./journey</p>
      <h1 className="font-display text-3xl font-semibold">Journey</h1>
      <p className="text-text-muted mt-3 leading-relaxed">
        Everything from a given month — projects, technologies learned, DSA progress, and more — in one place.
      </p>

      <div className="mt-12">
        {loading ? (
          <LoadingState label="Loading journey..." />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : items.length === 0 ? (
          <EmptyState title="No journey entries yet." hint="Added month by month through the admin dashboard." />
        ) : (
          <div className="commit-line flex flex-col gap-10">
            {items.map((entry) => {
              // Draft articles must never surface publicly, even if an
              // admin has linked one to this month's entry.
              const publishedArticles = (entry.articles || []).filter((a) => a.status === 'published')
              const hasAnyContent =
                (entry.projects?.length || 0) +
                (entry.technologies?.length || 0) +
                (entry.achievements?.length || 0) +
                publishedArticles.length +
                (entry.aiExperiments?.length || 0) +
                (entry.highlights?.length || 0) > 0

              return (
                <div key={entry.month || entry._id} className="flex gap-5">
                  <div className="flex flex-col items-center pt-1.5">
                    <span className="commit-dot" />
                  </div>
                  <div className="pb-2 flex-1 min-w-0">
                    <span className="font-mono text-xs text-text-muted">{entry.month}</span>
                    {entry.title && <h2 className="font-display text-xl font-medium mt-1">{entry.title}</h2>}
                    {entry.summary && <p className="text-text-muted text-sm mt-2 leading-relaxed">{entry.summary}</p>}

                    {(entry.dsaProblemsSolvedCount > 0 || entry.coursesCompletedCount > 0) && (
                      <div className="flex gap-4 mt-3 font-mono text-xs text-text-muted">
                        {entry.dsaProblemsSolvedCount > 0 && <span>{entry.dsaProblemsSolvedCount} DSA solved</span>}
                        {entry.coursesCompletedCount > 0 && <span>{entry.coursesCompletedCount} courses completed</span>}
                      </div>
                    )}

                    {entry.highlights?.length > 0 && (
                      <ul className="list-disc list-inside text-sm text-text-primary mt-3 space-y-1">
                        {entry.highlights.map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    )}

                    {entry.projects?.length > 0 && (
                      <Section label="projects" color="text-accent">
                        {entry.projects.map((p) => (
                          <Chip key={p._id}>{p.name}</Chip>
                        ))}
                      </Section>
                    )}

                    {entry.technologies?.length > 0 && (
                      <Section label="technologies learned" color="text-accent-amber">
                        {entry.technologies.map((t) => (
                          <Chip key={t._id}>{t.name}</Chip>
                        ))}
                      </Section>
                    )}

                    {entry.achievements?.length > 0 && (
                      <Section label="achievements" color="text-accent-green">
                        {entry.achievements.map((a) => (
                          <Chip key={a._id}>{a.title}</Chip>
                        ))}
                      </Section>
                    )}

                    {entry.aiExperiments?.length > 0 && (
                      <Section label="ai experiments" color="text-accent-rose">
                        {entry.aiExperiments.map((e) => (
                          <Chip key={e._id}>{e.name}</Chip>
                        ))}
                      </Section>
                    )}

                    {publishedArticles.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs font-mono text-text-muted mb-2">writing</p>
                        <div className="flex flex-wrap gap-2">
                          {publishedArticles.map((a) => (
                            <Link
                              key={a._id}
                              to={`/articles/${a.slug}`}
                              className="text-xs font-mono text-accent border border-accent/30 rounded-full px-2.5 py-1 hover:bg-accent/10"
                            >
                              {a.title}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {!hasAnyContent && (
                      <p className="text-xs font-mono text-text-muted mt-3">No details logged for this month yet.</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
