import React, { useState, useEffect } from 'react';
import { NODE_TYPES } from '../lib/schema.js';
import ConditionsEditor from './ConditionsEditor.jsx';
import OutcomesEditor from './OutcomesEditor.jsx';

/**
 * Inspector for editing a single node's fields using structured editors
 * for conditions and outcomes.
 */
export default function NodeInspector({ mission, selectedNodeId, onChange }) {
  const node = mission.nodes?.find((n) => n.id === selectedNodeId);
  const [conditionsState, setConditionsState] = useState([]);
  const [choicesState, setChoicesState] = useState([]);

  useEffect(() => {
    if (node) {
      setConditionsState(node.entry_conditions || []);
      setChoicesState(
        (node.choices || []).map((choice) => ({
          label: choice.label || '',
          conditions: choice.entry_conditions || [],
          outcomes: choice.outcomes || [],
        }))
      );
    }
  }, [node]);

  if (!node) {
    return (
      <div className="node-inspector">
        <h2>Inspector</h2>
        <p>Select a node to edit its properties.</p>
      </div>
    );
  }

  const handleFieldChange = (field, value) => {
    onChange((m) => {
      const n = m.nodes.find((nd) => nd.id === node.id);
      if (n) n[field] = value;
    });
  };

  const handleConditionsChange = (conds) => {
    setConditionsState(conds);
    handleFieldChange('entry_conditions', conds);
  };

  const handleChoiceChange = (idx, field, value) => {
    setChoicesState((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const syncChoicesToMission = () => {
    onChange((m) => {
      const n = m.nodes.find((nd) => nd.id === node.id);
      if (n) {
        n.choices = choicesState.map((choice) => ({
          label: choice.label,
          entry_conditions: choice.conditions,
          outcomes: choice.outcomes,
        }));
      }
    });
  };

  const addChoice = () => {
    setChoicesState((prev) => [...prev, { label: '', conditions: [], outcomes: [] }]);
  };

  const removeChoice = (idx) => {
    setChoicesState((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="node-inspector">
      <h2>Inspector</h2>
      <div>
        <strong>ID:</strong> {node.id}
      </div>
      <label>
        Type
        <select value={node.type} onChange={(e) => handleFieldChange('type', e.target.value)}>
          {NODE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>
      <label>
        Room
        <select value={node.room_id} onChange={(e) => handleFieldChange('room_id', e.target.value)}>
          {mission.rooms?.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name || room.id}
            </option>
          ))}
        </select>
      </label>
      <label>
        Title
        <input
          type="text"
          value={node.title || ''}
          onChange={(e) => handleFieldChange('title', e.target.value)}
        />
      </label>
      <label>
        Text
        <textarea
          value={node.text || ''}
          onChange={(e) => handleFieldChange('text', e.target.value)}
        />
      </label>
      <label>
        Entry Conditions
        <ConditionsEditor
          conditions={conditionsState}
          onChange={handleConditionsChange}
        />
      </label>
      <h3>Choices</h3>
      <div className="choices-editor">
        {choicesState.map((choice, idx) => (
          <div key={idx} className="choice">
            <label>
              Label
              <input
                type="text"
                value={choice.label}
                onChange={(e) => handleChoiceChange(idx, 'label', e.target.value)}
              />
            </label>
            <label>
              Entry Conditions
              <ConditionsEditor
                conditions={choice.conditions}
                onChange={(conds) => handleChoiceChange(idx, 'conditions', conds)}
              />
            </label>
            <label>
              Outcomes
              <OutcomesEditor
                mission={mission}
                outcomes={choice.outcomes}
                onChange={(outs) => handleChoiceChange(idx, 'outcomes', outs)}
              />
            </label>
            <button onClick={() => removeChoice(idx)}>Delete Choice</button>
          </div>
        ))}
        <button onClick={addChoice}>Add Choice</button>
        <button onClick={syncChoicesToMission}>Save Choices</button>
      </div>
    </div>
  );
}
