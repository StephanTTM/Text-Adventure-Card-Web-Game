import React from 'react';
import { Handle } from 'reactflow';

export default function MissionIntroNode({ id, data }) {
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
        justifyContent: 'flex-start',
        position: 'relative',
        gap: 4,
      }}
    >
      <Handle type="target" position="left" />
      <strong>{data.title || 'Intro'}</strong>
      {!data.room_id && (
        <div style={{ color: 'orange', fontSize: 12 }}>⚠ Not in room</div>
      )}
      {(!data.choices || data.choices.length === 0) && (
        <div style={{ color: 'orange', fontSize: 12 }}>⚠ No outputs</div>
      )}
      {data.choices?.map((choice, idx) => (
        <div
          key={idx}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            fontSize: 12,
            paddingRight: 8,
          }}
        >
          <span>{choice.label || `Choice ${idx + 1}`}</span>
          <Handle
            type="source"
            position="right"
            id={`${id}-out-${idx}`}
          />
        </div>
      ))}
    </div>
  );
}
