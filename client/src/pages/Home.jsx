import { Link } from 'react-router-dom'
import { profile } from '../data/profile.js'
import { useApiGet } from '../hooks/useApiGet.js'
import ProjectCard from '../components/ProjectCard.jsx'
import { LoadingState, ErrorState } from '../components/StatusStates.jsx'

export default function Home() {
  const featured = useApiGet('/projects/featured')
  const journey = useApiGet('/journey')

  const featuredProjects = (featured.data || []).slice(0, 2)
  const latestEntry = (journey.data || [])[0] // API returns newest-month-first

  return (
    <>
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16">
        <p className="font-mono text-sm text-accent mb-4">$ whoami</p>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-tight max-w-2xl">
          {profile.name} — {profile.role}
        </h1>
        <p className="text-text-muted mt-5 max-w-xl leading-relaxed">{profile.tagline}</p>
        <div className="flex flex-wrap gap-4 mt-8">
          <Link
            to="/projects"
            className="px-5 py-2.5 rounded-lg bg-accent text-ink font-medium text-sm hover:opacity-90 transition-opacity"
          >
            See my projects
          </Link>
          <Link
            to="/journey"
            className="px-5 py-2.5 rounded-lg border border-ink-border text-sm hover:border-accent/60 transition-colors"
          >
            Read the journey
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-xl font-semibold">Featured work</h2>
          <Link to="/projects" className="font-mono text-xs text-text-muted hover:text-accent">
            all projects →
          </Link>
        </div>
        <div className="mt-6">
          {featured.loading ? (
            <LoadingState label="Loading featured projects..." />
          ) : featured.error ? (
            <ErrorState message={featured.error} onRetry={featured.reload} />
          ) : featuredProjects.length === 0 ? (
            <p className="text-text-muted text-sm font-mono">No featured projects marked yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-5">
              {featuredProjects.map((p) => (
                <ProjectCard key={p._id} project={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="font-display text-xl font-semibold">Latest from the journey</h2>
        <div className="mt-6">
          {journey.loading ? (
            <LoadingState label="Loading latest entry..." />
          ) : journey.error ? (
            <ErrorState message={journey.error} onRetry={journey.reload} />
          ) : !latestEntry ? (
            <p className="text-text-muted text-sm font-mono">
              No journey entries yet — <Link to="/journey" className="text-accent hover:underline">check back soon</Link>.
            </p>
          ) : (
            <Link
              to="/journey"
              className="block border border-ink-border rounded-xl p-6 bg-ink-surface hover:border-accent/50 transition-colors"
            >
              <span className="font-mono text-xs text-text-muted">{latestEntry.month}</span>
              <p className="mt-2 leading-relaxed">
                {latestEntry.title || latestEntry.summary || 'This month\u2019s update'}
              </p>
              <span className="font-mono text-xs text-accent mt-3 inline-block">read entry →</span>
            </Link>
          )}
        </div>
      </section>
    </>
  )
}
