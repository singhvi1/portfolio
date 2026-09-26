import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../lib/api.js';
import DataTable from '../../components/DataTable.jsx';
import SearchInput from '../../components/SearchInput.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import { LoadingState, ErrorBanner, SuccessBanner } from '../../components/StatusStates.jsx';

export default function ArticleList() {
  const [articles, setArticles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [statusPending, setStatusPending] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get('/articles/admin/all');
      setArticles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleStatus(article) {
    setStatusPending(article._id);
    const nextStatus = article.status === 'published' ? 'draft' : 'published';
    try {
      await api.patch(`/articles/${article._id}/status`, { status: nextStatus });
      setSuccess(`"${article.title}" is now ${nextStatus}.`);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setStatusPending(null);
    }
  }

  async function confirmDelete() {
    setDeleting(true);
    try {
      await api.delete(`/articles/${pendingDelete._id}`);
      setPendingDelete(null);
      setSuccess(`"${pendingDelete.title}" deleted.`);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  }

  const filtered = (articles || []).filter((a) => a.title.toLowerCase().includes(search.toLowerCase()));

  const columns = [
    { key: 'title', label: 'Title' },
    {
      key: 'status',
      label: 'Status',
      render: (a) => (
        <span className={a.status === 'published' ? 'text-accent-green' : 'text-accent-amber'}>{a.status}</span>
      ),
    },
    { key: 'publishedDate', label: 'Published', render: (a) => a.publishedDate || '—' },
    { key: 'tags', label: 'Tags', render: (a) => (a.tags?.length ? a.tags.slice(0, 3).join(', ') : '—') },
    {
      key: 'toggle',
      label: '',
      render: (a) => (
        <button
          onClick={() => toggleStatus(a)}
          disabled={statusPending === a._id}
          className="font-mono text-xs text-accent hover:underline disabled:opacity-50"
        >
          {statusPending === a._id ? '...' : a.status === 'published' ? 'unpublish' : 'publish'}
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <p className="font-mono text-xs text-accent mb-2">./articles</p>
          <h1 className="font-display text-2xl font-semibold">Articles</h1>
        </div>
        <Link
          to="/admin/articles/new"
          className="px-4 py-2 rounded-lg bg-accent text-ink text-sm font-medium hover:opacity-90 transition-opacity"
        >
          + New article
        </Link>
      </div>

      <SuccessBanner message={success} />
      <ErrorBanner message={error} />

      <div className="mb-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search articles..." />
      </div>

      {loading ? (
        <LoadingState />
      ) : (
        <DataTable
          columns={columns}
          items={filtered}
          basePath="/admin/articles"
          onDelete={(item) => setPendingDelete(item)}
          emptyLabel={search ? `No articles match "${search}"` : 'No articles yet'}
        />
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete article?"
        message={`This permanently deletes "${pendingDelete?.title}". This can't be undone.`}
        pending={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
