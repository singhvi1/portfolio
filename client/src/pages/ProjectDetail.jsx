import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import { useApiGet } from '../hooks/useApiGet.js'
import { LoadingState, ErrorState } from '../components/StatusStates.jsx'
import TagBadge from '../components/TagBadge.jsx'

const STACK_LABELS = {
  frontend: 'Frontend',
  backend: 'Backend',
  services: 'Services',
  cloud: 'Cloud',
  infra: 'Infrastructure',
  tools: 'Tools',
}

// Order used for both the Tech Stack section and the derived architecture
// flow below. "tools" is deliberately excluded from the architecture flow
// further down — dev tooling (ESLint, etc.) isn't part of a runtime data
// flow, even though it belongs in the full stack listing.
const STACK_ORDER = ['frontend', 'backend', 'services', 'cloud', 'infra', 'tools'];
const ARCHITECTURE_LAYERS = ['frontend', 'backend', 'services', 'cloud', 'infra'];

function getStackGroups(techStack) {
  if (!techStack) return [];
  return STACK_ORDER.filter((key) => techStack[key]?.length > 0).map((key) => ({
    label: STACK_LABELS[key],
    items: techStack[key],
  }));
}

// Derives a simple layer-flow from which tech-stack categories are actually
// populated — not a fabricated architecture, just the real stack data
// visualized as a flow instead of a category list. Only renders when there
// are at least 2 layers to connect; otherwise the caller falls back to a
// plain "Technical Approach" paragraph.
function getArchitectureFlow(techStack) {
  if (!techStack) return [];
  return ARCHITECTURE_LAYERS.filter((key) => techStack[key]?.length > 0).map((key) => STACK_LABELS[key]);
}

function formatMonth(value) {
  if (!value) return null;
  const [year, month] = value.split('-');
  if (!year || !month) return value;
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function SectionHeading({ children }) {
  return <h2 className="font-display text-xl font-semibold mb-4">{children}</h2>;
}

function NumberedItem({ index, children }) {
  return (
    <div className="flex gap-4">
      <span className="font-mono text-2xl text-ink-border shrink-0 leading-none pt-0.5">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="pt-1">{children}</div>
    </div>
  );
}

function SidebarCard({ title, children }) {
  return (
    <div className="border border-ink-border rounded-xl p-5 bg-ink-surface">
      <p className="font-mono text-xs text-text-muted mb-3">{title}</p>
      {children}
    </div>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { data: project, loading, error } = useApiGet(`/projects/slug/${slug}`)

  useEffect(() => {
    if (project) {
      document.title = `${project.name} — Projects`
      let meta = document.querySelector('meta[name="description"]')
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('name', 'description')
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', project.shortDescription || '')
    }
    return () => {
      document.title = 'Your Name — Software Engineer'
    }
  }, [project])

  if (loading) {
    return (
      <section className="max-w-5xl mx-auto px-6 py-16">
        <LoadingState label="Loading project..." />
      </section>
    )
  }

  if (error) {
    return (
      <section className="max-w-2xl mx-auto px-6 py-16">
        <Link to="/projects" className="font-mono text-xs text-text-muted hover:text-accent">
          ← Back to Projects
        </Link>
        <div className="mt-8">
          <ErrorState message="This project doesn't exist." />
        </div>
      </section>
    )
  }

  const stackGroups = getStackGroups(project.techStack)
  const architectureFlow = getArchitectureFlow(project.techStack)
  const startLabel = formatMonth(project.startDate)
  const completionLabel = formatMonth(project.completionDate)
  const loggedLabel = !startLabel && !completionLabel ? formatMonth(project.month) : null
  const hasTimeline = startLabel || completionLabel || loggedLabel

  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <Link to="/projects" className="font-mono text-xs text-text-muted hover:text-accent">
        ← Back to Projects
      </Link>

      {/* Hero */}
      <div className="mt-8">
        <div className="flex items-center gap-2 font-mono text-xs">
          {project.isPlaceholder && (
            <span className="text-text-muted border border-ink-border rounded-full px-2 py-0.5">unverified</span>
          )}
          {project.featured && !project.isPlaceholder && <span className="text-accent-amber">featured</span>}
          {project.category && (
            <>
              {(project.isPlaceholder || project.featured) && <span className="text-text-muted">·</span>}
              <span className="text-text-muted">{project.category}</span>
            </>
          )}
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-semibold mt-3">{project.name}</h1>
        <p className="text-text-muted mt-4 max-w-2xl leading-relaxed">{project.shortDescription}</p>

        <div className="flex flex-wrap gap-3 mt-6">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-lg bg-accent text-ink font-medium text-sm hover:opacity-90 transition-opacity"
            >
              Live Demo →
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-lg border border-ink-border text-sm hover:border-accent/60 transition-colors"
            >
              GitHub →
            </a>
          )}
        </div>
      </div>

      {/* Two-column body: main content + sidebar. Not sticky — per spec,
          a sticky sidebar creates awkward mobile behavior, and it doesn't
          add much on a page this short anyway. */}
      <div className="grid lg:grid-cols-[1fr_280px] gap-12 mt-14">
        <div className="space-y-14 min-w-0">
          {(project.problemSolved || project.shortDescription) && (
            <div>
              <SectionHeading>Overview</SectionHeading>
              {project.problemSolved && (
                <div className="mb-5">
                  <p className="font-mono text-xs text-accent-rose mb-2">the problem</p>
                  <p className="text-text-primary leading-relaxed">{project.problemSolved}</p>
                </div>
              )}
              <div>
                <p className="font-mono text-xs text-accent mb-2">what I built</p>
                <p className="text-text-primary leading-relaxed">{project.shortDescription}</p>
              </div>
            </div>
          )}

          {project.keyFeatures?.length > 0 && (
            <div>
              <SectionHeading>Key Features</SectionHeading>
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
                {project.keyFeatures.map((feature, i) => (
                  <NumberedItem key={i} index={i}>
                    <p className="text-sm text-text-primary leading-relaxed">{feature}</p>
                  </NumberedItem>
                ))}
              </div>
            </div>
          )}

          {(architectureFlow.length >= 2 || project.category || project.shortDescription) && (
            <div>
              <SectionHeading>{architectureFlow.length >= 2 ? 'How It Works' : 'Technical Approach'}</SectionHeading>
              {architectureFlow.length >= 2 ? (
                <div className="flex flex-col items-start font-mono text-sm">
                  {architectureFlow.map((layer, i) => (
                    <div key={layer} className="flex flex-col items-start">
                      <span className="border border-ink-border rounded-lg px-4 py-2 bg-ink-surface">{layer}</span>
                      {i < architectureFlow.length - 1 && <span className="text-text-muted pl-4 py-1">↓</span>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-text-primary leading-relaxed text-sm">
                  {[project.category, project.shortDescription].filter(Boolean).join(' — ')}
                </p>
              )}
            </div>
          )}

          {project.myRole && (
            <div>
              <SectionHeading>My Role</SectionHeading>
              <p className="text-text-primary leading-relaxed italic border-l-2 border-ink-border pl-4">
                {project.myRole}
              </p>
            </div>
          )}

          {project.technicalChallenges?.length > 0 && (
            <div>
              <SectionHeading>Technical Challenges</SectionHeading>
              <div className="space-y-6">
                {project.technicalChallenges.map((c, i) => (
                  <NumberedItem key={i} index={i}>
                    <p className="text-sm text-text-primary leading-relaxed">{c.problem}</p>
                    {c.approach && (
                      <p className="text-sm text-text-muted leading-relaxed mt-2">{c.approach}</p>
                    )}
                  </NumberedItem>
                ))}
              </div>
            </div>
          )}

          {project.whatILearned?.length > 0 && (
            <div>
              <SectionHeading>What I Learned</SectionHeading>
              <div className="grid sm:grid-cols-2 gap-3">
                {project.whatILearned.map((item, i) => (
                  <div key={i} className="border border-ink-border rounded-lg p-4 bg-ink-surface">
                    <p className="text-sm text-text-primary leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <SidebarCard title="at a glance">
            <dl className="space-y-2.5 text-sm">
              {project.category && (
                <div className="flex justify-between gap-3">
                  <dt className="text-text-muted">Category</dt>
                  <dd className="text-right">{project.category}</dd>
                </div>
              )}
              <div className="flex justify-between gap-3">
                <dt className="text-text-muted">Status</dt>
                <dd className="text-right">
                  {project.isPlaceholder ? 'Unverified' : project.featured ? 'Featured' : 'Shipped'}
                </dd>
              </div>
            </dl>
            {project.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {project.tags.map((t) => (
                  <TagBadge key={t} tag={t} />
                ))}
              </div>
            )}
          </SidebarCard>

          {stackGroups.length > 0 && (
            <SidebarCard title="stack">
              <div className="space-y-4">
                {stackGroups.map((group) => (
                  <div key={group.label}>
                    <p className="text-xs text-text-muted mb-1.5">{group.label}</p>
                    <p className="text-sm text-text-primary leading-relaxed">{group.items.join(' · ')}</p>
                  </div>
                ))}
              </div>
            </SidebarCard>
          )}

          {hasTimeline && (
            <SidebarCard title="timeline">
              <div className="space-y-3 font-mono text-sm">
                {loggedLabel && (
                  <div>
                    <p className="text-text-muted text-xs">Logged</p>
                    <p>{loggedLabel}</p>
                  </div>
                )}
                {startLabel && (
                  <div>
                    <p className="text-text-muted text-xs">Started</p>
                    <p>{startLabel}</p>
                  </div>
                )}
                {completionLabel && (
                  <div>
                    <p className="text-text-muted text-xs">Completed</p>
                    <p>{completionLabel}</p>
                  </div>
                )}
              </div>
            </SidebarCard>
          )}

          {(project.githubUrl || project.liveUrl) && (
            <SidebarCard title="links">
              <div className="flex flex-col gap-2 font-mono text-sm">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                    live demo →
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-text-muted hover:text-text-primary hover:underline"
                  >
                    source →
                  </a>
                )}
              </div>
            </SidebarCard>
          )}
        </div>
      </div>

      {/* Final CTA */}
      {(project.githubUrl || project.liveUrl) && (
        <div className="mt-16 pt-10 border-t border-ink-border text-center">
          <p className="text-text-muted mb-5">Interested in the implementation?</p>
          <div className="flex flex-wrap justify-center gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-lg border border-ink-border text-sm hover:border-accent/60 transition-colors"
              >
                View Source on GitHub →
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-lg bg-accent text-ink font-medium text-sm hover:opacity-90 transition-opacity"
              >
                Open Live Demo →
              </a>
            )}
          </div>
        </div>
      )}

      <div className="mt-10 text-center">
        <button
          onClick={() => navigate('/projects')}
          className="font-mono text-xs text-text-muted hover:text-accent"
        >
          ← Back to Projects
        </button>
      </div>
    </section>
  )
}
