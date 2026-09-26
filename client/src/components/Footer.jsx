import { profile } from '../data/profile.js'

export default function Footer() {
  return (
    <footer className="border-t border-ink-border mt-24">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row justify-between gap-4 text-sm text-text-muted font-mono">
        <span>&copy; {new Date().getFullYear()} {profile.name}</span>
        <div className="flex gap-6">
          <a href={profile.github} className="hover:text-accent" target="_blank" rel="noreferrer">
            github
          </a>
          <a href={profile.linkedin} className="hover:text-accent" target="_blank" rel="noreferrer">
            linkedin
          </a>
          <a href={`mailto:${profile.email}`} className="hover:text-accent">
            email
          </a>
        </div>
      </div>
    </footer>
  )
}
