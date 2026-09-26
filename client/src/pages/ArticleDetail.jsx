import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useApiGet } from '../hooks/useApiGet.js'
import { LoadingState, ErrorState } from '../components/StatusStates.jsx'
import MarkdownContent from '../components/MarkdownContent.jsx'

export default function ArticleDetail() {
  const { slug } = useParams()
  const { data: article, loading, error } = useApiGet(`/articles/slug/${slug}`)

  // Basic SEO: this app has no SSR/meta-framework, so document.title +
  // a meta description tag is the extent of what's feasible without
  // introducing a new dependency for a single-page use case.
  useEffect(() => {
    if (article) {
      document.title = `${article.title} — Writing`
      let meta = document.querySelector('meta[name="description"]')
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('name', 'description')
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', article.shortDescription || '')
    }
    return () => {
      document.title = 'Your Name — Software Engineer'
    }
  }, [article])

  if (loading) {
    return (
      <section className="max-w-2xl mx-auto px-6 py-16">
        <LoadingState label="Loading article..." />
      </section>
    )
  }

  // The API returns 404 for both "doesn't exist" and "exists but is a
  // draft" — so this correctly covers both without leaking which case it is.
  if (error) {
    return (
      <section className="max-w-2xl mx-auto px-6 py-16">
        <Link to="/articles" className="font-mono text-xs text-text-muted hover:text-accent">
          ← back to writing
        </Link>
        <div className="mt-8">
          <ErrorState message="This article doesn't exist or isn't published yet." />
        </div>
      </section>
    )
  }

  return (
    <section className="max-w-2xl mx-auto px-6 py-16">
      <Link to="/articles" className="font-mono text-xs text-text-muted hover:text-accent">
        ← back to writing
      </Link>

      <p className="font-mono text-xs text-accent mt-6">{article.publishedDate}</p>
      <h1 className="font-display text-3xl font-semibold mt-2">{article.title}</h1>
      {article.readingTimeMinutes && (
        <p className="text-text-muted text-sm mt-2 font-mono">{article.readingTimeMinutes} min read</p>
      )}

      {article.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {article.tags.map((t) => (
            <span key={t} className="text-xs font-mono text-text-muted border border-ink-border rounded-full px-2.5 py-1">
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="mt-8">
        <MarkdownContent content={article.content} />
      </div>

      {article.referenceLinks?.length > 0 && (
        <div className="mt-10 pt-6 border-t border-ink-border">
          <h2 className="font-mono text-xs text-text-muted mb-3">references</h2>
          <ul className="space-y-1.5">
            {article.referenceLinks.map((link) => (
              <li key={link}>
                <a href={link} target="_blank" rel="noreferrer" className="text-accent text-sm hover:underline break-all">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
