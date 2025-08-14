import React from 'react';

export default function NodeInspector({
  selectedNode,
  onChange,
  mission,
  onMissionChange,
}) {
  if (!selectedNode) {
    const handleMissionFieldChange = (field, value) => {
      onMissionChange({ ...mission, [field]: value });
    };

    return (
      <aside style={{ padding: 8, borderLeft: '1px solid #ccc', width: 200 }}>
        <h3 style={{ marginTop: 0 }}>Mission</h3>
        <label>
          Mission ID:
          <input
            type="text"
            value={mission.id || ''}
            readOnly
            style={{ width: '100%' }}
          />
        </label>
        <label>
          Mission Name:
          <input
            type="text"
            value={mission.title || ''}
            onChange={(e) => handleMissionFieldChange('title', e.target.value)}
            style={{ width: '100%' }}
          />
        </label>
        <label>
          Start Room ID:
          <input
            type="text"
            value={mission.start_room_id || ''}
            onChange={(e) =>
              handleMissionFieldChange('start_room_id', e.target.value)
            }
            style={{ width: '100%' }}
          />
        </label>
        <label>
          Rooms:
          <textarea
            value={JSON.stringify(mission.rooms || [], null, 2)}
            readOnly
            style={{ width: '100%', height: 80 }}
          />
        </label>
        <label>
          Nodes:
          <textarea
            value={JSON.stringify(mission.nodes || [], null, 2)}
            readOnly
            style={{ width: '100%', height: 80 }}
          />
        </label>
      </aside>
    );
  }

  const { id, type, data } = selectedNode;

  const handleFieldChange = (field, value) => {
    onChange({ ...selectedNode, data: { ...data, [field]: value } });
  };

  if (type === 'mission_intro') {
    return (
      <aside style={{ padding: 8, borderLeft: '1px solid #ccc', width: 200 }}>
        <h3 style={{ marginTop: 0 }}>Intro Node</h3>
        <div style={{ marginBottom: 8 }}>ID: {id}</div>
        <label>
          Title:
          <input
            type="text"
            value={data.title || ''}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            style={{ width: '100%' }}
          />
        </label>
        <label>
          Text:
          <textarea
            value={data.text || ''}
            onChange={(e) => handleFieldChange('text', e.target.value)}
            style={{ width: '100%', height: 80 }}
          />
        </label>
        <div>Room ID: {data.room_id}</div>
        {(!data.choices || data.choices.length === 0) && (
          <div style={{ color: 'orange', marginTop: 8 }}>
            Warning: Intro node has no outputs
          </div>
        )}
      </aside>
    );
  }

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
