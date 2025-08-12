import React from 'react';

/**
 * Simple container node representing a room. It renders a label and a bordered box
 * that can contain storylet nodes as children.
 * @param {Object} props
 * @param {Object} props.data Data passed from ReactFlow node (expects label)
 */
export default function RoomNode({ data }) {
  const { label } = data;
  return (
    <div style={{ width: '100%', height: '100%', boxSizing: 'border-box' }}>
      <div style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 8 }}>{label}</div>
    </div>
  );
}
