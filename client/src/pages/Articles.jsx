import { Link } from 'react-router-dom'
import { useApiGet } from '../hooks/useApiGet.js'
import { LoadingState, EmptyState, ErrorState } from '../components/StatusStates.jsx'

export default function Articles() {
  // The public /api/articles endpoint only ever returns status: 'published'
  // articles — enforced server-side, not just hidden client-side.
  const { data, loading, error, reload } = useApiGet('/articles?limit=50')
  const items = data?.items || []

  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <p className="font-mono text-xs text-accent mb-2">./articles</p>
      <h1 className="font-display text-3xl font-semibold">Writing</h1>
      <p className="text-text-muted mt-3 leading-relaxed">Technical notes on things I've built and learned.</p>

      <div className="mt-10">
        {loading ? (
          <LoadingState label="Loading articles..." />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : items.length === 0 ? (
          <EmptyState title="No articles published yet." hint="Published articles will show up here." />
        ) : (
          <div className="flex flex-col gap-5">
            {items.map((a) => (
              <Link
                key={a._id}
                to={`/articles/${a.slug}`}
                className="border border-ink-border rounded-xl p-6 bg-ink-surface hover:border-accent/50 transition-colors"
              >
                <span className="font-mono text-xs text-text-muted">{a.publishedDate}</span>
                <h2 className="font-display text-xl font-semibold mt-1">{a.title}</h2>
                <p className="text-text-muted text-sm mt-2 leading-relaxed">{a.shortDescription}</p>
                {a.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {a.tags.map((t) => (
                      <span key={t} className="text-xs font-mono text-text-muted border border-ink-border rounded-full px-2.5 py-1">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
