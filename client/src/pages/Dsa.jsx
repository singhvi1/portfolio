import { useApiGet } from '../hooks/useApiGet.js'
import { LoadingState, EmptyState, ErrorState } from '../components/StatusStates.jsx'

const DIFFICULTY_COLOR = { Easy: 'text-accent-green', Medium: 'text-accent-amber', Hard: 'text-accent-rose' }

export default function Dsa() {
  const stats = useApiGet('/dsa/stats')
  const recent = useApiGet('/dsa?limit=10')

  const total = stats.data?.total ?? 0
  const byDifficulty = stats.data?.byDifficulty || {}
  const byTopic = stats.data?.byTopic || {}
  const recentItems = recent.data?.items || []

  const loading = stats.loading || recent.loading
  const error = stats.error || recent.error

  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <p className="font-mono text-xs text-accent mb-2">./dsa</p>
      <h1 className="font-display text-3xl font-semibold">DSA Progress</h1>
      <p className="text-text-muted mt-3 leading-relaxed">
        Problems solved, tracked as I go — no invented numbers, just what's actually logged.
      </p>

      {loading ? (
        <LoadingState label="Loading progress..." />
      ) : error ? (
        <ErrorState message={error} onRetry={() => { stats.reload(); recent.reload(); }} />
      ) : total === 0 ? (
        <EmptyState
          title="No DSA problems logged yet."
          hint="This page fills in automatically as problems are added through the admin dashboard."
        />
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
            <div className="border border-ink-border rounded-xl p-5 bg-ink-surface">
              <p className="font-mono text-xs text-text-muted">Total solved</p>
              <p className="font-display text-3xl font-semibold mt-2">{total}</p>
            </div>
            {['Easy', 'Medium', 'Hard'].map((d) => (
              <div key={d} className="border border-ink-border rounded-xl p-5 bg-ink-surface">
                <p className="font-mono text-xs text-text-muted">{d}</p>
                <p className={`font-display text-3xl font-semibold mt-2 ${DIFFICULTY_COLOR[d]}`}>
                  {byDifficulty[d] || 0}
                </p>
              </div>
            ))}
          </div>

          {Object.keys(byTopic).length > 0 && (
            <div className="mt-10">
              <h2 className="font-mono text-sm text-text-muted mb-4">By topic</h2>
              <div className="space-y-2">
                {Object.entries(byTopic).map(([topic, count]) => (
                  <div key={topic} className="flex items-center gap-3">
                    <span className="text-sm w-32 shrink-0 truncate">{topic}</span>
                    <div className="flex-1 h-1.5 bg-ink-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full"
                        style={{ width: `${Math.min(100, (count / total) * 100)}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs text-text-muted w-6 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {recentItems.length > 0 && (
            <div className="mt-10">
              <h2 className="font-mono text-sm text-text-muted mb-4">Recent</h2>
              <div className="space-y-3">
                {recentItems.map((p) => (
                  <div key={p._id} className="border border-ink-border rounded-xl p-4 bg-ink-surface flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-sm truncate">{p.problemName}</p>
                      <p className="font-mono text-xs text-text-muted mt-1">
                        {p.platform} · {p.topic} · {p.dateSolved}
                      </p>
                    </div>
                    <span className={`font-mono text-xs shrink-0 ${DIFFICULTY_COLOR[p.difficulty]}`}>{p.difficulty}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  )
}
