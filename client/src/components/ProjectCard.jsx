import { useNavigate } from 'react-router-dom'
import TagBadge from './TagBadge.jsx'

export default function ProjectCard({ project }) {
  const navigate = useNavigate()

  function goToDetail() {
    if (project.slug) navigate(`/projects/${project.slug}`)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      goToDetail()
    }
  }

  return (
    <article
      onClick={goToDetail}
      onKeyDown={handleKeyDown}
      role={project.slug ? 'link' : undefined}
      tabIndex={project.slug ? 0 : undefined}
      className={`group border border-ink-border rounded-xl p-6 bg-ink-surface hover:border-accent/50 transition-colors ${
        project.slug ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-display text-lg font-semibold">{project.name}</h3>
        <div className="flex items-center gap-2 shrink-0">
          {project.isPlaceholder && (
            <span className="text-xs font-mono text-text-muted border border-ink-border rounded-full px-2 py-0.5">
              unverified
            </span>
          )}
          {project.featured && !project.isPlaceholder && (
            <span className="text-xs font-mono text-accent-amber">featured</span>
          )}
        </div>
      </div>

      <p className="text-text-muted text-sm mt-2 leading-relaxed">{project.shortDescription}</p>

      <div className="flex flex-wrap gap-2 mt-4">
        {(project.tags || []).map((t) => (
          <TagBadge key={t} tag={t} />
        ))}
      </div>

      <div className="flex gap-5 mt-5 font-mono text-sm">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-accent hover:underline"
          >
            live →
          </a>
        )}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-text-muted hover:text-text-primary hover:underline"
          >
            source →
          </a>
        )}
      </div>
    </article>
  )
}
