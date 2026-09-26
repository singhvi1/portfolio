import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toggleNav, closeNav } from '../store/slices/uiSlice.js'

const links = [
  { to: '/projects', label: 'Projects' },
  { to: '/journey', label: 'Journey' },
  { to: '/dsa', label: 'DSA' },
  { to: '/technologies', label: 'Tech' },
  { to: '/experience', label: 'Experience' },
  { to: '/ai-lab', label: 'AI Lab' },
  { to: '/articles', label: 'Writing' },
  { to: '/about', label: 'About' },
]

function NavItem({ to, label, end }) {
  const dispatch = useDispatch()
  return (
    <NavLink
      to={to}
      end={end}
      onClick={() => dispatch(closeNav())}
      className={({ isActive }) =>
        `font-mono text-sm tracking-tight transition-colors ${
          isActive ? 'text-accent' : 'text-text-muted hover:text-text-primary'
        }`
      }
    >
      {label}
    </NavLink>
  )
}

export default function Navbar() {
  const navOpen = useSelector((s) => s.ui.navOpen)
  const dispatch = useDispatch()

  return (
    <header className="sticky top-0 z-40 border-b border-ink-border bg-ink/90 backdrop-blur">
      <nav className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
        <NavLink to="/" className="font-display font-semibold text-lg">
          <span className="text-accent">~/</span>you
        </NavLink>

        <div className="hidden md:flex items-center gap-5">
          {links.map((l) => (
            <NavItem key={l.to} {...l} />
          ))}
        </div>

        <button
          className="md:hidden text-text-primary"
          aria-label="Toggle navigation menu"
          aria-expanded={navOpen}
          onClick={() => dispatch(toggleNav())}
        >
          <span className="font-mono text-sm">{navOpen ? 'close' : 'menu'}</span>
        </button>
      </nav>

      {navOpen && (
        <div className="md:hidden flex flex-col gap-4 px-6 pb-6 border-t border-ink-border pt-4">
          {links.map((l) => (
            <NavItem key={l.to} {...l} />
          ))}
        </div>
      )}
    </header>
  )
}
