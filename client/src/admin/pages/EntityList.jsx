import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { entityConfigs } from '../config/entityConfigs.js';
import { useEntityList } from '../hooks/useEntityList.js';
import { deleteEntity } from '../hooks/useEntityRecord.js';
import DataTable from '../components/DataTable.jsx';
import Pagination from '../components/Pagination.jsx';
import SearchInput from '../components/SearchInput.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import { ErrorBanner, SuccessBanner } from '../components/StatusStates.jsx';

export default function EntityList() {
  const { entity } = useParams();
  const config = entityConfigs[entity];

  const { items, pagination, page, setPage, search, setSearch, loading, error, reload } = useEntityList(config.endpoint);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [success, setSuccess] = useState(null);

  async function confirmDelete() {
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteEntity(config.endpoint, pendingDelete._id);
      setPendingDelete(null);
      setSuccess('Deleted.');
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
          <p className="font-mono text-xs text-accent mb-2">./{entity}</p>
          <h1 className="font-display text-2xl font-semibold">{config.title}</h1>
        </div>
        <Link
          to={`/admin/${entity}/new`}
          className="px-4 py-2 rounded-lg bg-accent text-ink text-sm font-medium hover:opacity-90 transition-opacity"
        >
          + New
        </Link>
      </div>

      <SuccessBanner message={success} />
      <ErrorBanner message={error || deleteError} />

      <div className="mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder={`Search ${config.title.toLowerCase()}...`} />
      </div>

      <DataTable
        columns={config.listColumns}
        items={items}
        loading={loading}
        basePath={`/admin/${entity}`}
        onDelete={(item) => setPendingDelete(item)}
        emptyLabel={search ? `No results for "${search}"` : `No ${config.title.toLowerCase()} yet`}
      />

      <Pagination page={page} totalPages={pagination.totalPages} onChange={setPage} />

      <ConfirmDialog
        open={!!pendingDelete}
        title={`Delete this ${config.entityName.toLowerCase()}?`}
        message="This can't be undone."
        pending={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
