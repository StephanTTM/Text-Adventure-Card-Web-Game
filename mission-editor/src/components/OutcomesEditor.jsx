import React from 'react';
import { OUTCOME_TYPES } from '../lib/schema.js';

/**
 * Editor for an array of outcomes.
 * @param {{mission: Object, outcomes: Array, onChange: Function}} props
 */
export default function OutcomesEditor({ mission, outcomes, onChange }) {
  const update = (idx, field, value) => {
    const copy = [...outcomes];
    copy[idx] = { ...copy[idx], [field]: value };
    onChange(copy);
  };

  const updateType = (idx, type) => {
    const copy = [...outcomes];
    copy[idx] = { type };
    onChange(copy);
  };

  const addOutcome = () => {
    onChange([...outcomes, { type: OUTCOME_TYPES[0] }]);
  };

  const removeOutcome = (idx) => {
    onChange(outcomes.filter((_, i) => i !== idx));
  };

  const renderFields = (outcome, idx) => {
    switch (outcome.type) {
      case 'move_room':
        return (
          <select value={outcome.room_id || ''} onChange={(e) => update(idx, 'room_id', e.target.value)}>
            <option value="" disabled>Select room</option>
            {mission.rooms?.map((r) => (
              <option key={r.id} value={r.id}>{r.name || r.id}</option>
            ))}
          </select>
        );
      case 'damage_player':
        return (
          <input
            type="number"
            value={outcome.amount ?? 0}
            onChange={(e) => update(idx, 'amount', Number(e.target.value))}
          />
        );
      default:
        return (
          <input
            type="text"
            value={outcome.value || ''}
            onChange={(e) => update(idx, 'value', e.target.value)}
          />
        );
    }
  };

  return (
    <div className="outcomes-editor">
      {outcomes.map((outcome, idx) => (
        <div key={idx} className="outcome-row">
          <select value={outcome.type} onChange={(e) => updateType(idx, e.target.value)}>
            {OUTCOME_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {renderFields(outcome, idx)}
          <button type="button" onClick={() => removeOutcome(idx)}>Delete</button>
        </div>
      ))}
      <button type="button" onClick={addOutcome}>Add Outcome</button>
    </div>
  );
}
