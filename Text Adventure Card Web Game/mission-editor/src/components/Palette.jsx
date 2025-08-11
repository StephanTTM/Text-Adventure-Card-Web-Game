import React from 'react';
import { NODE_TYPES, createNode } from '../lib/schema.js';

/**
 * Palette component lists node types and allows creating new nodes.
 * @param {Object} props
 * @param {Object} props.mission Mission object
 * @param {string|null} props.selectedRoomId ID of room to place new nodes
 * @param {Function} props.onChange Called with updater when mission changes
 */
export default function Palette({ mission, selectedRoomId, onChange }) {
  const createNewNode = (type) => {
    if (!selectedRoomId) return;
    const newNode = createNode(type, selectedRoomId);
    onChange((m) => {
      if (!Array.isArray(m.nodes)) m.nodes = [];
      m.nodes.push(newNode);
    });
  };
  return (
    <div className="palette">
      <h2>Add Node</h2>
      {NODE_TYPES.map((type) => (
        <button key={type} onClick={() => createNewNode(type)}>
          + {type.charAt(0).toUpperCase() + type.slice(1)}
        </button>
      ))}
    </div>
  );
}