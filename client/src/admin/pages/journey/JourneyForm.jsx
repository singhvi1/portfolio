import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../../../lib/api.js';
import { useUnsavedChangesWarning } from '../../hooks/useUnsavedChangesWarning.js';
import Field, { inputClass } from '../../components/fields/Field.jsx';
import TagInput from '../../components/fields/TagInput.jsx';
import { LoadingState, ErrorBanner } from '../../components/StatusStates.jsx';

const EMPTY = {
  month: '',
  title: '',
  summary: '',
  highlights: [],
  dsaProblemsSolvedCount: 0,
  coursesCompletedCount: 0,
  projects: [],
  technologies: [],
  achievements: [],
  articles: [],
  aiExperiments: [],
};

// Which entity each reference field pulls its options from, and how to
// label each option in the multi-select.
const REFERENCE_FIELDS = [
  { name: 'projects', label: 'Projects', endpoint: '/projects', display: (p) => p.name },
  { name: 'technologies', label: 'Technologies', endpoint: '/technologies', display: (t) => `${t.name} (${t.category})` },
  { name: 'achievements', label: 'Achievements', endpoint: '/achievements', display: (a) => a.title },
  { name: 'articles', label: 'Articles', endpoint: '/articles/admin/all', display: (a) => `${a.title} [${a.status}]` },
  { name: 'aiExperiments', label: 'AI Experiments', endpoint: '/ai-experiments', display: (e) => e.name },
];

const MONTH_RE = /^\d{4}-\d{2}$/;

function validate(v, isEditMode) {
  const errors = {};
  if (!isEditMode) {
    if (!v.month) errors.month = 'month is required';
    else if (!MONTH_RE.test(v.month)) errors.month = 'must be in YYYY-MM format';
  }
  return errors;
}

// Reference fields store arrays of Mongo ids. Fetched objects may come back
// either as populated sub-documents ({_id, name, ...}) or plain id strings,
// depending on the route — normalize to plain id strings for the <select>.
function toIds(value) {
  if (!Array.isArray(value)) return [];
  return value.map((v) => (typeof v === 'string' ? v : v._id));
}

export default function JourneyForm() {
  const { month: monthParam } = useParams();
  const isEditMode = Boolean(monthParam);
  const navigate = useNavigate();

  const [values, setValues] = useState(EMPTY);
  const [options, setOptions] = useState(null); // { projects: [...], technologies: [...], ... }
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [clientErrors, setClientErrors] = useState({});
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setLoadError(null);
      try {
        const [optionResults, entry] = await Promise.all([
          Promise.all(
            REFERENCE_FIELDS.map(async (f) => {
              const data = await api.get(`${f.endpoint}${f.endpoint.includes('?') ? '&' : '?'}limit=100`);
              const items = Array.isArray(data) ? data : data.items || [];
              return [f.name, items];
            })
          ),
          isEditMode ? api.get(`/journey/${monthParam}`) : Promise.resolve(null),
        ]);

        if (cancelled) return;
        setOptions(Object.fromEntries(optionResults));
        if (entry) {
          setValues({
            ...EMPTY,
            ...entry,
            projects: toIds(entry.projects),
            technologies: toIds(entry.technologies),
            achievements: toIds(entry.achievements),
            articles: toIds(entry.articles),
            aiExperiments: toIds(entry.aiExperiments),
          });
        } else {
          setValues(EMPTY);
        }
      } catch (err) {
        if (!cancelled) setLoadError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [monthParam, isEditMode]);

  useUnsavedChangesWarning(dirty);

  function set(name, value) {
    setValues((v) => ({ ...v, [name]: value }));
    setDirty(true);
  }

  function setMultiSelect(name, e) {
    const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
    set(name, selected);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errors = validate(values, isEditMode);
    setClientErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    setSaveError(null);

    try {
      if (isEditMode) {
        await api.put(`/journey/${monthParam}`, values);
      } else {
        await api.post('/journey', values);
      }
      setDirty(false);
      navigate('/admin/journey');
    } catch (err) {
      setSaveError(err.status === 409 ? `A journey entry for ${values.month} already exists.` : err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingState label="Loading..." />;
  if (loadError) return <ErrorBanner message={loadError} />;

  const errors = clientErrors;

  return (
    <div className="max-w-2xl">
      <Link to="/admin/journey" className="font-mono text-xs text-text-muted hover:text-accent">
        ← back to journey entries
      </Link>
      <h1 className="font-display text-2xl font-semibold mt-4 mb-6">
        {isEditMode ? `Edit ${monthParam}` : 'New journey entry'}
      </h1>

      <ErrorBanner message={saveError} />

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Month" required error={errors.month} hint={isEditMode ? 'Month can\u2019t be changed after creation' : 'YYYY-MM'}>
          <input
            type="month"
            value={values.month}
            disabled={isEditMode}
            onChange={(e) => set('month', e.target.value)}
            className={`${inputClass} disabled:opacity-50`}
          />
        </Field>

        <Field label="Title" hint="Optional short headline for the month">
          <input type="text" value={values.title} onChange={(e) => set('title', e.target.value)} className={inputClass} />
        </Field>

        <Field label="Summary">
          <textarea value={values.summary} onChange={(e) => set('summary', e.target.value)} rows={3} className={inputClass} />
        </Field>

        <Field label="Highlights" hint="Free-text bullet points for this month">
          <TagInput value={values.highlights} onChange={(v) => set('highlights', v)} placeholder="Add a highlight and press Enter" />
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="DSA problems solved">
            <input
              type="number"
              min={0}
              value={values.dsaProblemsSolvedCount}
              onChange={(e) => set('dsaProblemsSolvedCount', Number(e.target.value))}
              className={inputClass}
            />
          </Field>
          <Field label="Courses completed">
            <input
              type="number"
              min={0}
              value={values.coursesCompletedCount}
              onChange={(e) => set('coursesCompletedCount', Number(e.target.value))}
              className={inputClass}
            />
          </Field>
        </div>

        <section className="space-y-4 pt-2 border-t border-ink-border">
          <h2 className="font-mono text-xs text-accent pt-4">link this month's items</h2>
          {REFERENCE_FIELDS.map((f) => (
            <Field key={f.name} label={f.label} hint="Cmd/Ctrl-click to select multiple">
              {options[f.name]?.length ? (
                <select
                  multiple
                  value={values[f.name]}
                  onChange={(e) => setMultiSelect(f.name, e)}
                  className={`${inputClass} h-32`}
                >
                  {options[f.name].map((item) => (
                    <option key={item._id} value={item._id}>
                      {f.display(item)}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-xs text-text-muted font-mono">Nothing in {f.label.toLowerCase()} yet.</p>
              )}
            </Field>
          ))}
        </section>

        <div className="flex gap-3 pt-4 border-t border-ink-border">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-lg bg-accent text-ink font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? 'Saving...' : isEditMode ? 'Save changes' : 'Create entry'}
          </button>
          <Link to="/admin/journey" className="px-5 py-2.5 rounded-lg border border-ink-border text-sm hover:border-accent/60 transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
