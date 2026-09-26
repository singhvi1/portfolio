import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useEntityRecord } from '../../hooks/useEntityRecord.js';
import { useUnsavedChangesWarning } from '../../hooks/useUnsavedChangesWarning.js';
import Field, { inputClass } from '../../components/fields/Field.jsx';
import TagInput from '../../components/fields/TagInput.jsx';
import ObjectArrayField from '../../components/fields/ObjectArrayField.jsx';
import { LoadingState, ErrorBanner } from '../../components/StatusStates.jsx';

const EMPTY_FORM = {
  slug: '',
  name: '',
  shortDescription: '',
  problemSolved: '',
  keyFeatures: [],
  techStack: { frontend: [], backend: [], services: [], cloud: [], infra: [], tools: [] },
  tags: [],
  githubUrl: '',
  liveUrl: '',
  myRole: '',
  technicalChallenges: [],
  whatILearned: [],
  featured: false,
  isPortfolioApp: false,
  isPlaceholder: false,
  category: '',
  startDate: '',
  completionDate: '',
  month: '',
};

const TECH_STACK_GROUPS = [
  { key: 'frontend', label: 'Frontend' },
  { key: 'backend', label: 'Backend' },
  { key: 'services', label: 'Services / External APIs' },
  { key: 'cloud', label: 'Cloud' },
  { key: 'infra', label: 'Infra / Tools' },
  { key: 'tools', label: 'Dev tools' },
];

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const URL_RE = /^https?:\/\/.+/i;

function validate(values) {
  const errors = {};
  if (!values.slug.trim()) errors.slug = 'slug is required';
  else if (!SLUG_RE.test(values.slug)) errors.slug = 'slug must be URL-safe, e.g. my-project';
  if (!values.name.trim()) errors.name = 'name is required';
  if (!values.shortDescription.trim()) errors.shortDescription = 'shortDescription is required';
  if (values.githubUrl && !URL_RE.test(values.githubUrl)) errors.githubUrl = 'must be a valid URL (https://...)';
  if (values.liveUrl && !URL_RE.test(values.liveUrl)) errors.liveUrl = 'must be a valid URL (https://...)';
  return errors;
}

export default function ProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isEditMode, initial, loading, loadError, save, saving, fieldErrors, saveError } = useEntityRecord(
    '/projects',
    id
  );

  const [values, setValues] = useState(EMPTY_FORM);
  const [clientErrors, setClientErrors] = useState({});
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (initial) {
      setValues({
        ...EMPTY_FORM,
        ...initial,
        techStack: { ...EMPTY_FORM.techStack, ...initial.techStack },
        githubUrl: initial.githubUrl || '',
        liveUrl: initial.liveUrl || '',
        startDate: initial.startDate || '',
        completionDate: initial.completionDate || '',
        month: initial.month || '',
      });
    }
  }, [initial]);

  useUnsavedChangesWarning(dirty);

  function set(field, value) {
    setValues((v) => ({ ...v, [field]: value }));
    setDirty(true);
  }

  function setTechStack(group, value) {
    setValues((v) => ({ ...v, techStack: { ...v.techStack, [group]: value } }));
    setDirty(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errors = validate(values);
    setClientErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const payload = {
      ...values,
      githubUrl: values.githubUrl || null,
      liveUrl: values.liveUrl || null,
      startDate: values.startDate || null,
      completionDate: values.completionDate || null,
      month: values.month || null,
    };

    try {
      await save(payload);
      setDirty(false);
      navigate('/admin/projects');
    } catch {
      // fieldErrors / saveError from the hook are already displayed
    }
  }

  if (isEditMode && loading) return <LoadingState label="Loading project..." />;
  if (isEditMode && loadError) return <ErrorBanner message={loadError} />;

  const errors = { ...clientErrors, ...fieldErrors };

  return (
    <div className="max-w-3xl">
      <Link to="/admin/projects" className="font-mono text-xs text-text-muted hover:text-accent">
        ← back to projects
      </Link>
      <h1 className="font-display text-2xl font-semibold mt-4 mb-6">
        {isEditMode ? `Edit: ${initial?.name || ''}` : 'New project'}
      </h1>

      <ErrorBanner message={saveError} />

      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="space-y-4">
          <h2 className="font-mono text-xs text-accent">basics</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Slug" required error={errors.slug} hint="URL-safe, e.g. my-project">
              <input type="text" value={values.slug} onChange={(e) => set('slug', e.target.value)} className={inputClass} />
            </Field>
            <Field label="Name" required error={errors.name}>
              <input type="text" value={values.name} onChange={(e) => set('name', e.target.value)} className={inputClass} />
            </Field>
          </div>
          <Field label="Short description" required error={errors.shortDescription}>
            <textarea
              value={values.shortDescription}
              onChange={(e) => set('shortDescription', e.target.value)}
              rows={2}
              className={inputClass}
            />
          </Field>
          <Field label="Problem solved" error={errors.problemSolved}>
            <textarea
              value={values.problemSolved}
              onChange={(e) => set('problemSolved', e.target.value)}
              rows={2}
              className={inputClass}
            />
          </Field>
          <Field label="Category" hint="Free text, e.g. Full-Stack, Frontend, AI">
            <input type="text" value={values.category} onChange={(e) => set('category', e.target.value)} className={inputClass} />
          </Field>
        </section>

        <section className="space-y-4">
          <h2 className="font-mono text-xs text-accent">links</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="GitHub URL" error={errors.githubUrl} hint="Leave blank if you don't have one yet">
              <input type="text" value={values.githubUrl} onChange={(e) => set('githubUrl', e.target.value)} placeholder="https://github.com/..." className={inputClass} />
            </Field>
            <Field label="Live demo URL" error={errors.liveUrl} hint="Leave blank if you don't have one yet">
              <input type="text" value={values.liveUrl} onChange={(e) => set('liveUrl', e.target.value)} placeholder="https://..." className={inputClass} />
            </Field>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-mono text-xs text-accent">tags & features</h2>
          <Field label="Tags" hint="Powers the tag filter on the public Projects page">
            <TagInput value={values.tags} onChange={(v) => set('tags', v)} placeholder="React, Redux Toolkit, ..." />
          </Field>
          <Field label="Key features">
            <TagInput value={values.keyFeatures} onChange={(v) => set('keyFeatures', v)} placeholder="Add a feature and press Enter" />
          </Field>
          <Field label="What I learned">
            <TagInput value={values.whatILearned} onChange={(v) => set('whatILearned', v)} placeholder="Add a learning and press Enter" />
          </Field>
        </section>

        <section className="space-y-4">
          <h2 className="font-mono text-xs text-accent">tech stack</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {TECH_STACK_GROUPS.map((group) => (
              <Field key={group.key} label={group.label}>
                <TagInput value={values.techStack[group.key] || []} onChange={(v) => setTechStack(group.key, v)} />
              </Field>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-mono text-xs text-accent">role & challenges</h2>
          <Field label="My role">
            <textarea value={values.myRole} onChange={(e) => set('myRole', e.target.value)} rows={2} className={inputClass} />
          </Field>
          <Field label="Technical challenges">
            <ObjectArrayField
              value={values.technicalChallenges}
              itemFields={[
                { name: 'problem', label: 'Problem', type: 'textarea' },
                { name: 'approach', label: 'Approach / solution', type: 'textarea' },
              ]}
              emptyItem={{ problem: '', approach: '' }}
              addLabel="Add a challenge"
              onChange={(v) => set('technicalChallenges', v)}
            />
          </Field>
        </section>

        <section className="space-y-4">
          <h2 className="font-mono text-xs text-accent">dates</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Start date" hint="YYYY-MM">
              <input type="month" value={values.startDate} onChange={(e) => set('startDate', e.target.value)} className={inputClass} />
            </Field>
            <Field label="Completion date" hint="YYYY-MM">
              <input type="month" value={values.completionDate} onChange={(e) => set('completionDate', e.target.value)} className={inputClass} />
            </Field>
            <Field label="Journey month" hint="Links this project to a monthly log entry">
              <input type="month" value={values.month} onChange={(e) => set('month', e.target.value)} className={inputClass} />
            </Field>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-mono text-xs text-accent">flags</h2>
          <label className="flex items-center gap-2.5 text-sm cursor-pointer select-none">
            <input type="checkbox" checked={values.featured} onChange={(e) => set('featured', e.target.checked)} className="w-4 h-4 rounded accent-accent" />
            Featured (shows in the homepage's featured projects — portfolio app is always excluded regardless)
          </label>
          <label className="flex items-center gap-2.5 text-sm cursor-pointer select-none">
            <input type="checkbox" checked={values.isPortfolioApp} onChange={(e) => set('isPortfolioApp', e.target.checked)} className="w-4 h-4 rounded accent-accent" />
            This is the portfolio app itself (excluded from the 5 featured showcase projects)
          </label>
          <label className="flex items-center gap-2.5 text-sm cursor-pointer select-none">
            <input type="checkbox" checked={values.isPlaceholder} onChange={(e) => set('isPlaceholder', e.target.checked)} className="w-4 h-4 rounded accent-accent" />
            Placeholder (unverified data — flags this in the admin list)
          </label>
        </section>

        <div className="flex gap-3 pt-4 border-t border-ink-border">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-lg bg-accent text-ink font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? 'Saving...' : isEditMode ? 'Save changes' : 'Create project'}
          </button>
          <Link to="/admin/projects" className="px-5 py-2.5 rounded-lg border border-ink-border text-sm hover:border-accent/60 transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
