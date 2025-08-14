import React from 'react';

export default function NpcNode({ data }) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #888',
        borderRadius: 4,
        padding: 4,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <strong>{data.name || 'NPC'}</strong>
      {data.text && (
        <div style={{ fontSize: 12 }}>{data.text}</div>
      )}
    </div>
  );
}
