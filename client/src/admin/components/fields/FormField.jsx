import Field, { inputClass } from './Field.jsx';
import TagInput from './TagInput.jsx';
import ObjectArrayField from './ObjectArrayField.jsx';

/**
 * @param field { name, label, type, required, options?, hint?, itemFields?, emptyItem? }
 * type: 'text' | 'textarea' | 'number' | 'date' | 'month' | 'select' | 'boolean' | 'tags' | 'stringArray' | 'objectArray'
 */
export default function FormField({ field, value, onChange, error }) {
  const common = { label: field.label, required: field.required, error, hint: field.hint };

  switch (field.type) {
    case 'textarea':
      return (
        <Field {...common}>
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            rows={field.rows || 3}
            className={inputClass}
          />
        </Field>
      );

    case 'number':
      return (
        <Field {...common}>
          <input
            type="number"
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
            min={field.min}
            max={field.max}
            className={inputClass}
          />
        </Field>
      );

    case 'date':
      return (
        <Field {...common}>
          <input type="date" value={value || ''} onChange={(e) => onChange(e.target.value)} className={inputClass} />
        </Field>
      );

    case 'month':
      return (
        <Field {...common} hint={field.hint || 'Format: YYYY-MM'}>
          <input
            type="month"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={inputClass}
          />
        </Field>
      );

    case 'select':
      return (
        <Field {...common}>
          <select value={value || ''} onChange={(e) => onChange(e.target.value)} className={inputClass}>
            <option value="">— select —</option>
            {field.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </Field>
      );

    case 'boolean':
      return (
        <label className="flex items-center gap-2.5 text-sm cursor-pointer select-none">
          <input
            type="checkbox"
            checked={!!value}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 rounded accent-accent"
          />
          {field.label}
        </label>
      );

    case 'tags':
    case 'stringArray':
      return (
        <Field {...common}>
          <TagInput value={value || []} onChange={onChange} placeholder={field.placeholder} />
        </Field>
      );

    case 'objectArray':
      return (
        <Field {...common}>
          <ObjectArrayField
            value={value || []}
            itemFields={field.itemFields}
            emptyItem={field.emptyItem}
            addLabel={field.addLabel}
            onChange={onChange}
          />
        </Field>
      );

    case 'url':
      return (
        <Field {...common} hint={field.hint || 'Leave blank if you don\u2019t have one yet'}>
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://..."
            className={inputClass}
          />
        </Field>
      );

    case 'text':
    default:
      return (
        <Field {...common}>
          <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} className={inputClass} />
        </Field>
      );
  }
}
