import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { LoadingState, ErrorBanner } from '../components/StatusStates.jsx';

const ENTITIES = [
  { key: 'projects', label: 'Projects', path: '/projects' },
  { key: 'technologies', label: 'Technologies', path: '/technologies' },
  { key: 'dsa', label: 'DSA Problems', path: '/dsa' },
  { key: 'courses', label: 'Courses', path: '/courses' },
  { key: 'achievements', label: 'Achievements', path: '/achievements' },
  { key: 'experience', label: 'Experience', path: '/experience' },
  { key: 'articles', label: 'Articles', path: '/articles' },
  { key: 'ai-experiments', label: 'AI Experiments', path: '/ai-experiments' },
  { key: 'journey', label: 'Journey Entries', path: '/journey' },
];

export default function Dashboard() {
  const [counts, setCounts] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCounts() {
      const results = await Promise.all(
        ENTITIES.map(async (entity) => {
          try {
            if (entity.key === 'journey') {
              // journey isn't paginated — it's a small, always-fetch-all list
              const items = await api.get('/journey');
              return [entity.key, Array.isArray(items) ? items.length : 0];
            }
            const data = await api.get(`${entity.path}?limit=1`);
            return [entity.key, data.pagination?.total ?? 0];
          } catch {
            return [entity.key, null]; // null = failed to load, shown distinctly
          }
        })
      );
      if (!cancelled) setCounts(Object.fromEntries(results));
    }

    loadCounts().catch((err) => !cancelled && setError(err.message));

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <p className="font-mono text-xs text-accent mb-2">./dashboard</p>
      <h1 className="font-display text-2xl font-semibold mb-8">Overview</h1>

      <ErrorBanner message={error} />

      {!counts ? (
        <LoadingState />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {ENTITIES.map((entity) => (
            <Link
              key={entity.key}
              to={`/admin${entity.path}`}
              className="border border-ink-border rounded-xl p-5 bg-ink-surface hover:border-accent/50 transition-colors"
            >
              <p className="font-mono text-xs text-text-muted">{entity.label}</p>
              <p className="font-display text-3xl font-semibold mt-2">
                {counts[entity.key] === null ? (
                  <span className="text-accent-rose text-base font-mono">error</span>
                ) : (
                  counts[entity.key]
                )}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
