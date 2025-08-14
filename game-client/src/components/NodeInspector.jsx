import React from 'react';

export default function NodeInspector({ selectedNode, onChange }) {
  if (!selectedNode) {
    return (
      <aside style={{ padding: 8, borderLeft: '1px solid #ccc', width: 200 }}>
        <h3 style={{ marginTop: 0 }}>Inspector</h3>
        <div>No node selected</div>
      </aside>
    );
  }

  const { id, data } = selectedNode;

  const handleNameChange = (e) => {
    onChange({ ...selectedNode, data: { ...data, label: e.target.value } });
  };

  return (
    <aside style={{ padding: 8, borderLeft: '1px solid #ccc', width: 200 }}>
      <h3 style={{ marginTop: 0 }}>Inspector</h3>
      <div style={{ marginBottom: 8 }}>ID: {id}</div>
      <label>
        Name:
        <input
          type="text"
          value={data.label || ''}
          onChange={handleNameChange}
          style={{ width: '100%' }}
        />
      </label>
    </aside>
  );
}
