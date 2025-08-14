import React from 'react';
import { Handle } from 'reactflow';

export default function MissionIntroNode({ id, data }) {
  const outputCount = data.choices?.length || 0;
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
      <strong>{data.title || 'Intro'}</strong>
      {!data.room_id && (
        <div style={{ color: 'orange', fontSize: 12 }}>⚠ Not in room</div>
      )}
      {(!data.choices || data.choices.length === 0) && (
        <div style={{ color: 'orange', fontSize: 12 }}>⚠ No outputs</div>
      )}
      {data.choices?.map((_, idx) => (
        <Handle
          key={idx}
          type="source"
          position="bottom"
          id={`${id}-out-${idx}`}
          style={{ left: `${((idx + 1) / (outputCount + 1)) * 100}%` }}
        />
      ))}
    </div>
  );
}
