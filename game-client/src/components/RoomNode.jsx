import React from 'react';
import { NodeResizer } from '@reactflow/node-resizer';
import '@reactflow/node-resizer/dist/style.css';

export default function RoomNode({ data, selected }) {
  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.9)',
        border: '1px solid #888',
        borderRadius: 4,
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <NodeResizer minWidth={150} minHeight={100} isVisible={selected} />
      <div
        style={{
          background: '#333',
          color: '#fff',
          padding: '4px 8px',
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
          fontWeight: 'bold',
        }}
      >
        {data.name || 'Room'}
      </div>
      <div style={{ flex: 1 }} />
    </div>
  );
}
