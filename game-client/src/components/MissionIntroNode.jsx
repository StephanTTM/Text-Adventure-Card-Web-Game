import React from 'react';

export default function MissionIntroNode({ data }) {
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
      <strong>{data.title || 'Intro'}</strong>
      {(!data.choices || data.choices.length === 0) && (
        <div style={{ color: 'orange', fontSize: 12 }}>⚠ No outputs</div>
      )}
    </div>
  );
}
