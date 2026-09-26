import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEntityList } from '../../hooks/useEntityList.js';
import { deleteEntity } from '../../hooks/useEntityRecord.js';
import DataTable from '../../components/DataTable.jsx';
import Pagination from '../../components/Pagination.jsx';
import SearchInput from '../../components/SearchInput.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import { ErrorBanner, SuccessBanner } from '../../components/StatusStates.jsx';

const COLUMNS = [
  { key: 'name', label: 'Name' },
  {
    key: 'tags',
    label: 'Tags',
    render: (p) => (p.tags?.length ? p.tags.slice(0, 3).join(', ') + (p.tags.length > 3 ? '…' : '') : '—'),
  },
  { key: 'featured', label: 'Featured', render: (p) => (p.featured ? 'Yes' : '—') },
  { key: 'isPortfolioApp', label: 'Portfolio app', render: (p) => (p.isPortfolioApp ? 'Yes' : '—') },
  { key: 'isPlaceholder', label: 'Placeholder', render: (p) => (p.isPlaceholder ? '⚠ Yes' : '—') },
];

export default function ProjectList() {
  const { items, pagination, page, setPage, search, setSearch, loading, error, reload } = useEntityList('/projects');
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [success, setSuccess] = useState(null);

  async function confirmDelete() {
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteEntity('/projects', pendingDelete._id);
      setPendingDelete(null);
      setSuccess(`"${pendingDelete.name}" deleted.`);
      reload();
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <p className="font-mono text-xs text-accent mb-2">./projects</p>
          <h1 className="font-display text-2xl font-semibold">Projects</h1>
        </div>
        <Link
          to="/admin/projects/new"
          className="px-4 py-2 rounded-lg bg-accent text-ink text-sm font-medium hover:opacity-90 transition-opacity"
        >
          + New project
        </Link>
      </div>

      <SuccessBanner message={success} />
      <ErrorBanner message={error || deleteError} />

      <div className="mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search projects..." />
      </div>

      <DataTable
        columns={COLUMNS}
        items={items}
        loading={loading}
        basePath="/admin/projects"
        onDelete={(item) => setPendingDelete(item)}
        emptyLabel={search ? `No projects match "${search}"` : 'No projects yet — create your first one'}
      />

      <Pagination page={page} totalPages={pagination.totalPages} onChange={setPage} />

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete project?"
        message={`This permanently deletes "${pendingDelete?.name}". This can't be undone.`}
        pending={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
