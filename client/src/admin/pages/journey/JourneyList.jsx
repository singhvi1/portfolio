import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../lib/api.js';
import DataTable from '../../components/DataTable.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import { LoadingState, ErrorBanner, SuccessBanner } from '../../components/StatusStates.jsx';

export default function JourneyList() {
  const [entries, setEntries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [success, setSuccess] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setEntries(await api.get('/journey'));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function confirmDelete() {
    setDeleting(true);
    try {
      await api.delete(`/journey/${pendingDelete.month}`);
      setPendingDelete(null);
      setSuccess(`${pendingDelete.month} entry deleted.`);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  }

  const columns = [
    { key: 'month', label: 'Month' },
    { key: 'title', label: 'Title', render: (e) => e.title || '—' },
    { key: 'projects', label: 'Projects', render: (e) => e.projects?.length || 0 },
    { key: 'technologies', label: 'Technologies', render: (e) => e.technologies?.length || 0 },
    { key: 'dsaProblemsSolvedCount', label: 'DSA solved' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <p className="font-mono text-xs text-accent mb-2">./journey</p>
          <h1 className="font-display text-2xl font-semibold">Journey Entries</h1>
        </div>
        <Link
          to="/admin/journey/new"
          className="px-4 py-2 rounded-lg bg-accent text-ink text-sm font-medium hover:opacity-90 transition-opacity"
        >
          + New entry
        </Link>
      </div>

      <SuccessBanner message={success} />
      <ErrorBanner message={error} />

      {loading ? (
        <LoadingState />
      ) : (
        <DataTable
          columns={columns}
          items={entries}
          idField="month"
          basePath="/admin/journey"
          onDelete={(item) => setPendingDelete(item)}
          emptyLabel="No journey entries yet"
        />
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete journey entry?"
        message={`This permanently deletes the ${pendingDelete?.month} entry. This can't be undone.`}
        pending={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
