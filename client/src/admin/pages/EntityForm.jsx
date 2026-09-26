import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { entityConfigs } from '../config/entityConfigs.js';
import { useEntityRecord } from '../hooks/useEntityRecord.js';
import { useUnsavedChangesWarning } from '../hooks/useUnsavedChangesWarning.js';
import FormField from '../components/fields/FormField.jsx';
import { LoadingState, ErrorBanner } from '../components/StatusStates.jsx';
import NotFound from '../../pages/NotFound.jsx';

function emptyValuesFor(fields) {
  const values = {};
  for (const f of fields) {
    if (f.type === 'tags' || f.type === 'stringArray' || f.type === 'objectArray') values[f.name] = [];
    else if (f.type === 'boolean') values[f.name] = false;
    else if (f.type === 'number') values[f.name] = undefined;
    else values[f.name] = '';
  }
  return values;
}

function clientValidate(fields, values) {
  const errors = {};
  for (const f of fields) {
    if (f.required) {
      const v = values[f.name];
      const empty = v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0);
      if (empty) errors[f.name] = `${f.label} is required`;
    }
    if (f.type === 'url' && values[f.name]) {
      if (!/^https?:\/\/.+/i.test(values[f.name])) errors[f.name] = 'must be a valid URL (https://...)';
    }
  }
  return errors;
}

export default function EntityForm() {
  const { entity, id } = useParams();
  const config = entityConfigs[entity];
  const navigate = useNavigate();

  const { isEditMode, initial, loading, loadError, save, saving, fieldErrors, saveError } =
    useEntityRecord(config?.endpoint, id);

  const [values, setValues] = useState(() => (config ? emptyValuesFor(config.fields) : {}));
  const [clientErrors, setClientErrors] = useState({});
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (config && initial) {
      setValues({ ...emptyValuesFor(config.fields), ...initial });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  useUnsavedChangesWarning(dirty);

  if (!config) {
    return <NotFound />;
  }

  function set(name, value) {
    setValues((v) => ({ ...v, [name]: value }));
    setDirty(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errors = clientValidate(config.fields, values);
    setClientErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const payload = { ...values };
    for (const f of config.fields) {
      if (!f.required && payload[f.name] === '') payload[f.name] = null;
    }

    try {
      await save(payload);
      setDirty(false);
      navigate(`/admin/${entity}`);
    } catch {
      // errors already surfaced via fieldErrors/saveError
    }
  }

  if (isEditMode && loading) return <LoadingState label="Loading..." />;
  if (isEditMode && loadError) return <ErrorBanner message={loadError} />;

  const errors = { ...clientErrors, ...fieldErrors };

  return (
    <div className="max-w-2xl">
      <Link to={`/admin/${entity}`} className="font-mono text-xs text-text-muted hover:text-accent">
        ← back to {config.title.toLowerCase()}
      </Link>
      <h1 className="font-display text-2xl font-semibold mt-4 mb-6">
        {isEditMode ? `Edit ${config.entityName}` : `New ${config.entityName}`}
      </h1>

      <ErrorBanner message={saveError} />

      <form onSubmit={handleSubmit} className="space-y-5">
        {config.fields.map((f) => (
          <FormField key={f.name} field={f} value={values[f.name]} onChange={(v) => set(f.name, v)} error={errors[f.name]} />
        ))}

        <div className="flex gap-3 pt-4 border-t border-ink-border">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-lg bg-accent text-ink font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? 'Saving...' : isEditMode ? 'Save changes' : `Create ${config.entityName.toLowerCase()}`}
          </button>
          <Link to={`/admin/${entity}`} className="px-5 py-2.5 rounded-lg border border-ink-border text-sm hover:border-accent/60 transition-colors">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}