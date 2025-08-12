import React from 'react';
import { REQUIREMENT_TYPES, STAT_NAMES } from '../lib/schema.js';

/**
 * Editor for an array of entry conditions.
 * @param {{conditions: Array, onChange: Function}} props
 */
export default function ConditionsEditor({ conditions, onChange }) {
  const update = (idx, field, value) => {
    const copy = [...conditions];
    copy[idx] = { ...copy[idx], [field]: value };
    onChange(copy);
  };

  const updateType = (idx, type) => {
    const copy = [...conditions];
    copy[idx] = { type };
    onChange(copy);
  };

  const addCondition = () => {
    onChange([...conditions, { type: REQUIREMENT_TYPES[0] }]);
  };

  const removeCondition = (idx) => {
    onChange(conditions.filter((_, i) => i !== idx));
  };

  const renderFields = (cond, idx) => {
    switch (cond.type) {
      case 'stat_at_least':
        return (
          <>
            <select value={cond.stat || STAT_NAMES[0]} onChange={(e) => update(idx, 'stat', e.target.value)}>
              {STAT_NAMES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <input
              type="number"
              value={cond.value ?? 0}
              onChange={(e) => update(idx, 'value', Number(e.target.value))}
            />
          </>
        );
      default:
        return (
          <input
            type="text"
            value={cond.value || ''}
            onChange={(e) => update(idx, 'value', e.target.value)}
          />
        );
    }
  };

  return (
    <div className="conditions-editor">
      {conditions.map((cond, idx) => (
        <div key={idx} className="condition-row">
          <select value={cond.type} onChange={(e) => updateType(idx, e.target.value)}>
            {REQUIREMENT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {renderFields(cond, idx)}
          <button type="button" onClick={() => removeCondition(idx)}>Delete</button>
        </div>
      ))}
      <button type="button" onClick={addCondition}>Add Condition</button>
    </div>
  );
}
