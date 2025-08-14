import React from 'react';
import { Handle, useStoreState } from 'reactflow';

export default function NpcNode({ id, data }) {
  const hasInput = useStoreState((state) =>
    state.edges.some((e) => e.target === id)
  );

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
        position: 'relative',
      }}
    >
      <Handle type="target" position="top" />
      <strong>{data.name || 'NPC'}</strong>
      {data.text && <div style={{ fontSize: 12 }}>{data.text}</div>}
      {!hasInput && (
        <div style={{ color: 'orange', fontSize: 12 }}>⚠ No input</div>
      )}
    </div>
  );
}
