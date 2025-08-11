import React, { useState } from 'react';

/**
 * Panel for viewing and editing rooms. Allows selecting, editing and adding rooms.
 * @param {Object} props
 * @param {Object} props.mission Mission object
 * @param {string|null} props.selectedRoomId ID of currently selected room
 * @param {Function} props.onSelectRoom Called with room id when selected
 * @param {Function} props.onChange Called with updater function when mission changes
 */
export default function RoomsPanel({ mission, selectedRoomId, onSelectRoom, onChange }) {
  const rooms = Array.isArray(mission.rooms) ? mission.rooms : [];
  const selectedRoom = rooms.find((r) => r.id === selectedRoomId);

  // Add a new room with default values
  const addRoom = () => {
    const newId = `room_${Date.now()}`;
    onChange((m) => {
      if (!Array.isArray(m.rooms)) m.rooms = [];
      m.rooms.push({
        id: newId,
        name: `Room ${m.rooms.length + 1}`,
        art: '',
        music: '',
        exits: [],
        auto_nodes: [],
      });
    });
    onSelectRoom(newId);
  };

  // Handle changes to room fields
  const updateRoomField = (field, value) => {
    onChange((m) => {
      const room = m.rooms.find((r) => r.id === selectedRoomId);
      if (room) {
        room[field] = value;
      }
    });
  };

  // Handle exit change
  const updateExit = (index, field, value) => {
    onChange((m) => {
      const room = m.rooms.find((r) => r.id === selectedRoomId);
      if (room && Array.isArray(room.exits)) {
        room.exits[index][field] = value;
      }
    });
  };

  const addExit = () => {
    onChange((m) => {
      const room = m.rooms.find((r) => r.id === selectedRoomId);
      if (room) {
        if (!Array.isArray(room.exits)) room.exits = [];
        room.exits.push({ to: '', label: '' });
      }
    });
  };

  const removeExit = (index) => {
    onChange((m) => {
      const room = m.rooms.find((r) => r.id === selectedRoomId);
      if (room && Array.isArray(room.exits)) {
        room.exits.splice(index, 1);
      }
    });
  };

  // Handle auto_nodes list changes
  const updateAutoNode = (index, value) => {
    onChange((m) => {
      const room = m.rooms.find((r) => r.id === selectedRoomId);
      if (room && Array.isArray(room.auto_nodes)) {
        room.auto_nodes[index] = value;
      }
    });
  };

  const addAutoNode = () => {
    onChange((m) => {
      const room = m.rooms.find((r) => r.id === selectedRoomId);
      if (room) {
        if (!Array.isArray(room.auto_nodes)) room.auto_nodes = [];
        room.auto_nodes.push('');
      }
    });
  };

  const removeAutoNode = (index) => {
    onChange((m) => {
      const room = m.rooms.find((r) => r.id === selectedRoomId);
      if (room && Array.isArray(room.auto_nodes)) {
        room.auto_nodes.splice(index, 1);
      }
    });
  };

  return (
    <div className="rooms-panel">
      <h2>Rooms</h2>
      <ul>
        {rooms.map((room) => (
          <li
            key={room.id}
            className={room.id === selectedRoomId ? 'selected' : ''}
            onClick={() => onSelectRoom(room.id)}
          >
            {room.name || room.id}
          </li>
        ))}
      </ul>
      <button onClick={addRoom}>Add Room</button>

      {selectedRoom && (
        <div className="room-editor">
          <h3>Edit Room</h3>
          <label>
            Name
            <input
              type="text"
              value={selectedRoom.name}
              onChange={(e) => updateRoomField('name', e.target.value)}
            />
          </label>
          <label>
            Art (path)
            <input
              type="text"
              value={selectedRoom.art || ''}
              onChange={(e) => updateRoomField('art', e.target.value)}
            />
          </label>
          <label>
            Music (path)
            <input
              type="text"
              value={selectedRoom.music || ''}
              onChange={(e) => updateRoomField('music', e.target.value)}
            />
          </label>
          <h4>Exits</h4>
          <table>
            <thead>
              <tr>
                <th>To Room</th>
                <th>Label</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(selectedRoom.exits) &&
                selectedRoom.exits.map((ex, idx) => (
                  <tr key={idx}>
                    <td>
                      <input
                        type="text"
                        value={ex.to}
                        onChange={(e) => updateExit(idx, 'to', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={ex.label}
                        onChange={(e) => updateExit(idx, 'label', e.target.value)}
                      />
                    </td>
                    <td>
                      <button onClick={() => removeExit(idx)}>X</button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <button onClick={addExit}>Add Exit</button>
          <h4>Auto Nodes</h4>
          <ul>
            {Array.isArray(selectedRoom.auto_nodes) &&
              selectedRoom.auto_nodes.map((an, idx) => (
                <li key={idx} style={{ marginBottom: 4 }}>
                  <input
                    type="text"
                    value={an}
                    onChange={(e) => updateAutoNode(idx, e.target.value)}
                  />
                  <button onClick={() => removeAutoNode(idx)}>X</button>
                </li>
              ))}
          </ul>
          <button onClick={addAutoNode}>Add Auto Node</button>
        </div>
      )}
    </div>
  );
}