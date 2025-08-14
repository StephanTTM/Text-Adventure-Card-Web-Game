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
            fontSize: 12,
            overflow: 'visible',
          }}
        >
          <Handle
            type="source"
            position="right"
            id={`${id}-out-${idx}`}
          />
          <span
            style={{
              position: 'absolute',
              left: '100%',
              marginLeft: 4,
              top: '50%',
              transform: 'translateY(-50%)',
              whiteSpace: 'nowrap',
            }}
          >
            {choice.label || `Choice ${idx + 1}`}
          </span>
        </div>
      ))}
    </div>
  );
}
