import React from 'react';

export default function NodeInspector({
  selectedNode,
  onChange,
  mission,
  onMissionChange,
  onAddEdge,
  onRemoveEdge,
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
    const handleChoiceLabelChange = (idx, value) => {
      const newChoices = [...(data.choices || [])];
      newChoices[idx] = { ...newChoices[idx], label: value };
      handleFieldChange('choices', newChoices);
    };

    const handleOutcomeTypeChange = (choiceIdx, outcomeIdx, newType) => {
      const newChoices = [...(data.choices || [])];
      const outcomes = [...(newChoices[choiceIdx].outcomes || [])];
      const prev = outcomes[outcomeIdx];
      const prevType = Object.keys(prev)[0] || 'change_node';
      const prevValue = prev[prevType] || '';
      if (prevType === 'change_node' && prevValue) {
        onRemoveEdge?.(id, prevValue);
      }
      outcomes[outcomeIdx] = { [newType]: prevValue };
      newChoices[choiceIdx] = { ...newChoices[choiceIdx], outcomes };
      handleFieldChange('choices', newChoices);
    };

    const handleOutcomeNodeChange = (
      choiceIdx,
      outcomeIdx,
      value
    ) => {
      const newChoices = [...(data.choices || [])];
      const outcomes = [...(newChoices[choiceIdx].outcomes || [])];
      const type = Object.keys(outcomes[outcomeIdx])[0] || 'change_node';
      const prevValue = outcomes[outcomeIdx][type] || '';
      outcomes[outcomeIdx] = { [type]: value };
      newChoices[choiceIdx] = { ...newChoices[choiceIdx], outcomes };
      handleFieldChange('choices', newChoices);
      if (type === 'change_node') {
        if (prevValue && prevValue !== value) {
          onRemoveEdge?.(id, prevValue);
        }
        if (value) {
          onAddEdge?.(id, value);
        }
      }
    };

    const addChoice = () => {
      const newChoices = [...(data.choices || [])];
      newChoices.push({ label: '', outcomes: [{ change_node: '' }] });
      handleFieldChange('choices', newChoices);
    };

    const removeChoice = (idx) => {
      const choice = data.choices?.[idx];
      const newChoices = (data.choices || []).filter((_, i) => i !== idx);
      handleFieldChange('choices', newChoices);
      choice?.outcomes?.forEach((outcome) => {
        const type = Object.keys(outcome)[0];
        const target = outcome[type];
        if (type === 'change_node' && target) {
          onRemoveEdge?.(id, target);
        }
      });
    };

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
        <div style={{ marginTop: 8 }}>
          <h4 style={{ margin: '8px 0 4px' }}>Choices</h4>
          {data.choices?.map((choice, idx) => (
            <div key={idx} style={{ marginBottom: 8 }}>
              <input
                type="text"
                value={choice.label || ''}
                onChange={(e) => handleChoiceLabelChange(idx, e.target.value)}
                style={{ width: '100%', marginBottom: 4 }}
                placeholder={`Choice ${idx + 1}`}
              />
              {choice.outcomes?.map((outcome, oIdx) => {
                const type = Object.keys(outcome)[0] || 'change_node';
                return (
                  <div
                    key={oIdx}
                    style={{ display: 'flex', marginBottom: 4 }}
                  >
                    <select
                      value={type}
                      onChange={(e) =>
                        handleOutcomeTypeChange(idx, oIdx, e.target.value)
                      }
                      style={{ flex: 1, marginRight: 4 }}
                    >
                      <option value="change_node">Change Node</option>
                    </select>
                    <input
                      type="text"
                      value={outcome[type] || ''}
                      onChange={(e) =>
                        handleOutcomeNodeChange(idx, oIdx, e.target.value)
                      }
                      style={{ flex: 1 }}
                      placeholder="Node ID"
                    />
                  </div>
                );
              })}
              <button
                type="button"
                onClick={() => removeChoice(idx)}
                style={{ marginTop: 4 }}
              >
                Remove Choice
              </button>
            </div>
          ))}
          <button onClick={addChoice}>Add Choice</button>
        </div>
        <div>Room ID: {data.room_id || '(none)'}</div>
        {!data.room_id && (
          <div style={{ color: 'orange', marginTop: 8 }}>
            Warning: Intro node is not in a room
          </div>
        )}
        {(!data.choices || data.choices.length === 0) && (
          <div style={{ color: 'orange', marginTop: 8 }}>
            Warning: Intro node has no outputs
          </div>
        )}
      </aside>
    );
  }

  if (type === 'npc') {
    return (
      <aside style={{ padding: 8, borderLeft: '1px solid #ccc', width: 200 }}>
        <h3 style={{ marginTop: 0 }}>NPC Node</h3>
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
          Text:
          <textarea
            value={data.text || ''}
            onChange={(e) => handleFieldChange('text', e.target.value)}
            style={{ width: '100%', height: 80 }}
          />
        </label>
        <div>Room ID: {data.room_id || '(none)'}</div>
        {!data.room_id && (
          <div style={{ color: 'orange', marginTop: 8 }}>
            Warning: NPC node is not in a room
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
