import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/projects', label: 'Projects' },
  { to: '/admin/technologies', label: 'Technologies' },
  { to: '/admin/dsa', label: 'DSA' },
  { to: '/admin/courses', label: 'Courses' },
  { to: '/admin/achievements', label: 'Achievements' },
  { to: '/admin/experience', label: 'Experience' },
  { to: '/admin/articles', label: 'Articles' },
  { to: '/admin/ai-experiments', label: 'AI Experiments' },
  { to: '/admin/journey', label: 'Journey' },
];

export default function Sidebar({ onNavigate }) {
  return (
    <nav className="flex flex-col gap-1 p-4">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `px-3 py-2 rounded-lg text-sm font-mono transition-colors ${
              isActive
                ? 'bg-accent/10 text-accent'
                : 'text-text-muted hover:text-text-primary hover:bg-ink-surface'
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
