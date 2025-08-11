import React, { useState, useEffect } from 'react';
import { NODE_TYPES } from '../lib/schema.js';

/**
 * Inspector for editing a single node's fields. Works with minimal controls
 * for common fields and JSON editing for complex arrays.
 * @param {Object} props
 * @param {Object} props.mission Mission object
 * @param {string|null} props.selectedNodeId Selected node id
 * @param {Function} props.onChange Called with updater when mission changes
 */
export default function NodeInspector({ mission, selectedNodeId, onChange }) {
  const node = mission.nodes?.find((n) => n.id === selectedNodeId);
  const [conditionsText, setConditionsText] = useState('');
  const [choicesState, setChoicesState] = useState([]);

  // Sync local state when node changes
  useEffect(() => {
    if (node) {
      setConditionsText(JSON.stringify(node.entry_conditions || [], null, 2));
      setChoicesState(() => {
        return (node.choices || []).map((choice) => ({
          label: choice.label || '',
          conditions: JSON.stringify(choice.entry_conditions || [], null, 2),
          outcomes: JSON.stringify(choice.outcomes || [], null, 2),
        }));
      });
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

  // Handle simple field updates
  const handleFieldChange = (field, value) => {
    onChange((m) => {
      const n = m.nodes.find((nd) => nd.id === node.id);
      if (n) n[field] = value;
    });
  };

  // Handle entry conditions text area on blur
  const handleConditionsBlur = () => {
    try {
      const parsed = JSON.parse(conditionsText);
      onChange((m) => {
        const n = m.nodes.find((nd) => nd.id === node.id);
        if (n) n.entry_conditions = parsed;
      });
    } catch (err) {
      console.warn('Invalid JSON for entry conditions');
    }
  };

  // Handle choices editing
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
        n.choices = choicesState.map((choice) => {
          const entry_conditions = safeParseJSON(choice.conditions, []);
          const outcomes = safeParseJSON(choice.outcomes, []);
          return {
            label: choice.label,
            entry_conditions,
            outcomes,
          };
        });
      }
    });
  };

  const addChoice = () => {
    setChoicesState((prev) => [...prev, { label: '', conditions: '[]', outcomes: '[]' }]);
  };

  const removeChoice = (idx) => {
    setChoicesState((prev) => prev.filter((_, i) => i !== idx));
  };

  // Render
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
        Entry Conditions (JSON)
        <textarea
          value={conditionsText}
          onChange={(e) => setConditionsText(e.target.value)}
          onBlur={handleConditionsBlur}
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
              Entry Conditions (JSON)
              <textarea
                value={choice.conditions}
                onChange={(e) => handleChoiceChange(idx, 'conditions', e.target.value)}
                rows={3}
              />
            </label>
            <label>
              Outcomes (JSON)
              <textarea
                value={choice.outcomes}
                onChange={(e) => handleChoiceChange(idx, 'outcomes', e.target.value)}
                rows={3}
              />
            </label>
            <button onClick={() => removeChoice(idx)}>Delete Choice</button>
          </div>
        ))}
        <button onClick={addChoice}>Add Choice</button>
        {/* Synchronize choices to mission when leaving editor area */}
        <button onClick={syncChoicesToMission}>Save Choices</button>
      </div>
    </div>
  );
}

// Helper to safely parse JSON, returning fallback on error
function safeParseJSON(str, fallback) {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
}