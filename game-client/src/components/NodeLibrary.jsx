import React from 'react';

export default function NodeLibrary() {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside style={{ padding: 8, borderRight: '1px solid #ccc', width: 150 }}>
      <h3 style={{ marginTop: 0 }}>Nodes</h3>
      <div
        style={{ padding: 8, border: '1px solid #999', borderRadius: 4, cursor: 'grab' }}
        onDragStart={(event) => onDragStart(event, 'room')}
        draggable
      >
        Room Node
      </div>
      <div
        style={{
          padding: 8,
          border: '1px solid #999',
          borderRadius: 4,
          cursor: 'grab',
          marginTop: 8,
        }}
        onDragStart={(event) => onDragStart(event, 'mission_intro')}
        draggable
      >
        Mission Intro Node
      </div>
    </aside>
  );
}
