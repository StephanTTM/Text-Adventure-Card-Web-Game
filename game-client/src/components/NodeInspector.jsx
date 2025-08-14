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

  const handleFieldChange = (field, value) => {
    onChange({ ...selectedNode, data: { ...data, [field]: value } });
  };

  const handleAutoNodesChange = (e) => {
    const parts = e.target.value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    handleFieldChange('auto_nodes', parts);
  };

  const handleExitsChange = (e) => {
    let exits = data.exits || [];
    try {
      exits = JSON.parse(e.target.value);
    } catch {
      // ignore parse errors and keep previous value
    }
    handleFieldChange('exits', exits);
  };

  return (
    <aside style={{ padding: 8, borderLeft: '1px solid #ccc', width: 200 }}>
      <h3 style={{ marginTop: 0 }}>Inspector</h3>
      <div style={{ marginBottom: 8 }}>ID: {id}</div>
      <label>
        Name:
        <input
          type="text"
          value={data.name || ''}
          onChange={(e) => handleFieldChange('name', e.target.value)}
          style={{ width: '100%' }}
        />
      </label>
      <label>
        Art:
        <input
          type="text"
          value={data.art || ''}
          onChange={(e) => handleFieldChange('art', e.target.value)}
          style={{ width: '100%' }}
        />
      </label>
      <label>
        Music:
        <input
          type="text"
          value={data.music || ''}
          onChange={(e) => handleFieldChange('music', e.target.value)}
          style={{ width: '100%' }}
        />
      </label>
      <label>
        Auto Nodes (comma separated):
        <input
          type="text"
          value={(data.auto_nodes || []).join(',')}
          onChange={handleAutoNodesChange}
          style={{ width: '100%' }}
        />
      </label>
      <label>
        Exits (JSON):
        <textarea
          value={JSON.stringify(data.exits || [])}
          onChange={handleExitsChange}
          style={{ width: '100%', height: 80 }}
        />
      </label>
    </aside>
  );
}
