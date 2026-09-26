import { profile } from '../data/profile.js'

export default function About() {
  return (
    <section className="max-w-2xl mx-auto px-6 py-16">
      <p className="font-mono text-xs text-accent mb-2">./about</p>
      <h1 className="font-display text-3xl font-semibold">{profile.name}</h1>
      <p className="text-text-muted mt-1">{profile.role} · {profile.location}</p>

      <p className="mt-8 text-text-primary leading-relaxed whitespace-pre-line">{profile.bio}</p>

      <div className="flex flex-wrap gap-4 mt-8">
        <a
          href={profile.resumeUrl}
          className="px-5 py-2.5 rounded-lg bg-accent text-ink font-medium text-sm hover:opacity-90 transition-opacity"
        >
          Download resume
        </a>
        <a
          href={`mailto:${profile.email}`}
          className="px-5 py-2.5 rounded-lg border border-ink-border text-sm hover:border-accent/60 transition-colors"
        >
          Email me
        </a>
      </div>
    </section>
  )
}
