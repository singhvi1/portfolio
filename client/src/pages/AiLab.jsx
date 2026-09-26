import { useApiGet } from '../hooks/useApiGet.js'
import { LoadingState, EmptyState, ErrorState } from '../components/StatusStates.jsx'

export default function AiLab() {
  const { data, loading, error, reload } = useApiGet('/ai-experiments?limit=50')
  const items = data?.items || []

  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <p className="font-mono text-xs text-accent mb-2">./ai-lab</p>
      <h1 className="font-display text-3xl font-semibold">AI Lab</h1>
      <p className="text-text-muted mt-3 leading-relaxed">
        Experiments — LLM apps, agents, RAG, prompt engineering. Not polished products, just documented attempts.
      </p>

      <div className="mt-10">
        {loading ? (
          <LoadingState label="Loading experiments..." />
        ) : error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : items.length === 0 ? (
          <EmptyState title="No experiments logged yet." hint="Added through the admin dashboard." />
        ) : (
          <div className="flex flex-col gap-6">
            {items.map((exp) => (
              // Visually distinct from ProjectCard — dashed border + amber
              // accent signals "experiment / lab" rather than "shipped work",
              // per the spec's request to differentiate this section.
              <article key={exp._id} className="border border-dashed border-accent-amber/40 rounded-xl p-6 bg-ink-surface">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="font-display text-lg font-semibold">{exp.name}</h2>
                  <span className="text-xs font-mono text-accent-amber shrink-0">{exp.date}</span>
                </div>

                <p className="text-text-muted text-sm mt-2 leading-relaxed">{exp.description}</p>

                {exp.modelUsed && (
                  <p className="text-xs font-mono text-text-muted mt-3">model/API: {exp.modelUsed}</p>
                )}

                {exp.problem && (
                  <div className="mt-4">
                    <p className="text-xs font-mono text-accent-rose mb-1">problem</p>
                    <p className="text-sm text-text-primary leading-relaxed">{exp.problem}</p>
                  </div>
                )}
                {exp.approach && (
                  <div className="mt-3">
                    <p className="text-xs font-mono text-accent mb-1">approach</p>
                    <p className="text-sm text-text-primary leading-relaxed">{exp.approach}</p>
                  </div>
                )}
                {exp.results && (
                  <div className="mt-3">
                    <p className="text-xs font-mono text-accent-green mb-1">results</p>
                    <p className="text-sm text-text-primary leading-relaxed">{exp.results}</p>
                  </div>
                )}

                {exp.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {exp.technologies.map((t) => (
                      <span key={t} className="text-xs font-mono text-text-muted border border-ink-border rounded-full px-2.5 py-1">
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {exp.whatILearned?.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-ink-border">
                    <p className="text-xs font-mono text-text-muted mb-2">what I learned</p>
                    <ul className="list-disc list-inside space-y-1">
                      {exp.whatILearned.map((l, i) => (
                        <li key={i} className="text-sm text-text-primary leading-relaxed">{l}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-5 mt-4 font-mono text-sm">
                  {exp.demoUrl && (
                    <a href={exp.demoUrl} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                      demo →
                    </a>
                  )}
                  {exp.githubUrl && (
                    <a href={exp.githubUrl} target="_blank" rel="noreferrer" className="text-text-muted hover:text-text-primary hover:underline">
                      source →
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
