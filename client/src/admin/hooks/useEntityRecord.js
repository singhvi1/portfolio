import { useCallback, useEffect, useState } from 'react';
import { api } from '../../lib/api.js';

/**
 * @param endpoint base REST path, e.g. "/projects"
 * @param id if provided, loads the record in edit mode; omit for create mode
 */
export function useEntityRecord(endpoint, id) {
  const isEditMode = Boolean(id);
  const [initial, setInitial] = useState(null);
  const [loading, setLoading] = useState(isEditMode);
  const [loadError, setLoadError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    if (!isEditMode || !endpoint) return;
    let cancelled = false;
    setLoading(true);
    api
      .get(`${endpoint}/${id}`)
      .then((data) => {
        if (!cancelled) setInitial(data);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [endpoint, id, isEditMode]);

  const save = useCallback(
    async (values) => {
      setSaving(true);
      setFieldErrors({});
      setSaveError(null);
      try {
        const result = isEditMode ? await api.put(`${endpoint}/${id}`, values) : await api.post(endpoint, values);
        return result;
      } catch (err) {
        if (err.status === 422 && Array.isArray(err.errors)) {
          const mapped = {};
          err.errors.forEach((e) => {
            mapped[e.field] = e.message;
          });
          setFieldErrors(mapped);
        } else {
          setSaveError(err.message || 'Something went wrong while saving.');
        }
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [endpoint, id, isEditMode]
  );

  return { isEditMode, initial, loading, loadError, save, saving, fieldErrors, saveError };
}

export async function deleteEntity(endpoint, id) {
  return api.delete(`${endpoint}/${id}`);
}