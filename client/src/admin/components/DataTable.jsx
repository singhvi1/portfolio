import { Link } from 'react-router-dom';
import { LoadingState, EmptyState } from './StatusStates.jsx';

/**
 * @param columns [{ key, label, render?(item) }]
 * @param items array of records (each needs an `_id`)
 * @param basePath e.g. "/admin/projects" — edit links go to `${basePath}/${item._id}`
 * @param onDelete(item)
 */
export default function DataTable({ columns, items, loading, basePath, idField = '_id', onDelete, emptyLabel }) {
  if (loading) return <LoadingState label="Loading..." />;
  if (!items || items.length === 0) return <EmptyState title={emptyLabel || 'No records yet'} />;

  return (
    <div className="border border-ink-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-border bg-ink-surface">
              {columns.map((col) => (
                <th key={col.key} className="text-left font-mono text-xs text-text-muted px-4 py-3 whitespace-nowrap">
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item[idField]} className="border-b border-ink-border last:border-0 hover:bg-ink-surface/60">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 align-top max-w-xs truncate">
                    {col.render ? col.render(item) : String(item[col.key] ?? '—')}
                  </td>
                ))}
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <Link to={`${basePath}/${item[idField]}`} className="font-mono text-xs text-accent hover:underline mr-4">
                    edit
                  </Link>
                  <button
                    onClick={() => onDelete(item)}
                    className="font-mono text-xs text-accent-rose hover:underline"
                  >
                    delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
