import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../../../lib/api.js';
import { useUnsavedChangesWarning } from '../../hooks/useUnsavedChangesWarning.js';
import Field, { inputClass } from '../../components/fields/Field.jsx';
import TagInput from '../../components/fields/TagInput.jsx';
import { LoadingState, ErrorBanner } from '../../components/StatusStates.jsx';

const EMPTY = {
  title: '', slug: '', shortDescription: '', content: '', coverImage: '',
  tags: [], technologies: [], readingTimeMinutes: '', referenceLinks: [], status: 'draft',
};

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function validate(v) {
  const errors = {};
  if (!v.title.trim()) errors.title = 'title is required';
  if (!v.slug.trim()) errors.slug = 'slug is required';
  else if (!SLUG_RE.test(v.slug)) errors.slug = 'slug must be URL-safe, e.g. how-caching-works';
  if (!v.shortDescription.trim()) errors.shortDescription = 'shortDescription is required';
  if (!v.content.trim()) errors.content = 'content is required';
  return errors;
}

export default function ArticleForm() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [values, setValues] = useState(EMPTY);
  const [originalStatus, setOriginalStatus] = useState(null);
  const [loading, setLoading] = useState(isEditMode);
  const [loadError, setLoadError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [clientErrors, setClientErrors] = useState({});
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!isEditMode) return;
    api
      .get(`/articles/admin/${id}`)
      .then((data) => {
        setValues({ ...EMPTY, ...data, readingTimeMinutes: data.readingTimeMinutes ?? '' });
        setOriginalStatus(data.status);
      })
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEditMode]);

  useUnsavedChangesWarning(dirty);

  function set(name, value) {
    setValues((v) => ({ ...v, [name]: value }));
    setDirty(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errors = validate(values);
    setClientErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    setSaveError(null);
    setFieldErrors({});

    // Status changes route through the dedicated /:id/status endpoint so
    // publishedDate gets auto-stamped by the backend exactly once — the
    // plain PUT below intentionally excludes status to avoid a second,
    // silently-inconsistent write path for the same field.
    const statusChanged = isEditMode && values.status !== originalStatus;
    const { status, ...rest } = values;
    const payload = {
      ...rest,
      coverImage: values.coverImage || null,
      readingTimeMinutes: values.readingTimeMinutes === '' ? null : Number(values.readingTimeMinutes),
    };
    if (!isEditMode) payload.status = status; // creation still sets initial status directly

    try {
      let savedId = id;
      if (isEditMode) {
        await api.put(`/articles/${id}`, payload);
      } else {
        const created = await api.post('/articles', payload);
        savedId = created._id;
      }
      if (statusChanged) {
        await api.patch(`/articles/${savedId}/status`, { status });
      }
      setDirty(false);
      navigate('/admin/articles');
    } catch (err) {
      if (err.status === 422 && Array.isArray(err.errors)) {
        const mapped = {};
        err.errors.forEach((e) => (mapped[e.field] = e.message));
        setFieldErrors(mapped);
      } else {
        setSaveError(err.message);
      }
    } finally {
      setSaving(false);
    }
  }

  if (isEditMode && loading) return <LoadingState label="Loading article..." />;
  if (isEditMode && loadError) return <ErrorBanner message={loadError} />;

  const errors = { ...clientErrors, ...fieldErrors };

  return (
    <div className="max-w-2xl">
      <Link to="/admin/articles" className="font-mono text-xs text-text-muted hover:text-accent">
        ← back to articles
      </Link>
      <h1 className="font-display text-2xl font-semibold mt-4 mb-6">{isEditMode ? 'Edit article' : 'New article'}</h1>

      <ErrorBanner message={saveError} />

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Title" required error={errors.title}>
          <input type="text" value={values.title} onChange={(e) => set('title', e.target.value)} className={inputClass} />
        </Field>
        <Field label="Slug" required error={errors.slug} hint="URL-safe, e.g. how-caching-works">
          <input type="text" value={values.slug} onChange={(e) => set('slug', e.target.value)} className={inputClass} />
        </Field>
        <Field label="Short description" required error={errors.shortDescription}>
          <textarea value={values.shortDescription} onChange={(e) => set('shortDescription', e.target.value)} rows={2} className={inputClass} />
        </Field>
        <Field label="Content" required error={errors.content} hint="Markdown supported">
          <textarea value={values.content} onChange={(e) => set('content', e.target.value)} rows={12} className={inputClass} />
        </Field>
        <Field label="Cover image URL" error={errors.coverImage}>
          <input type="text" value={values.coverImage} onChange={(e) => set('coverImage', e.target.value)} placeholder="https://..." className={inputClass} />
        </Field>
        <Field label="Tags">
          <TagInput value={values.tags} onChange={(v) => set('tags', v)} />
        </Field>
        <Field label="Technologies">
          <TagInput value={values.technologies} onChange={(v) => set('technologies', v)} />
        </Field>
        <Field label="Reference links">
          <TagInput value={values.referenceLinks} onChange={(v) => set('referenceLinks', v)} placeholder="https://..." />
        </Field>
        <Field label="Reading time (minutes)">
          <input type="number" value={values.readingTimeMinutes} onChange={(e) => set('readingTimeMinutes', e.target.value)} min={0} className={inputClass} />
        </Field>
        <Field label="Status" hint="Changing this and saving auto-stamps today's date as publishedDate when publishing">
          <select value={values.status} onChange={(e) => set('status', e.target.value)} className={inputClass}>
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
        </Field>

        <div className="flex gap-3 pt-4 border-t border-ink-border">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-lg bg-accent text-ink font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? 'Saving...' : isEditMode ? 'Save changes' : 'Create article'}
          </button>
          <Link to="/admin/articles" className="px-5 py-2.5 rounded-lg border border-ink-border text-sm hover:border-accent/60 transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
