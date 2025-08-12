import React, { useState, useEffect, useCallback } from 'react';
import Graph from './components/Graph.jsx';
import RoomsPanel from './components/RoomsPanel.jsx';
import Palette from './components/Palette.jsx';
import NodeInspector from './components/NodeInspector.jsx';
import ExportImport from './components/ExportImport.jsx';
import ValidationPanel from './components/ValidationPanel.jsx';
import { validateMission } from './lib/validate.js';
import defaultMission from './assets/defaultMission.json';

/**
 * Main application component.
 * Handles mission state, selection state and validation.
 */
export default function App() {
  // Mission state holds rooms, nodes and other metadata. Start with null (no mission loaded).
  const [mission, setMission] = useState(null);
  // The ID of the currently selected node (or null if none).
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  // The ID of the currently selected room for editing in the rooms panel.
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  // List of validation issues. Recomputed whenever mission changes.
  const [validationIssues, setValidationIssues] = useState([]);
  // Whether unreachable nodes should be highlighted in the graph.
  const [highlightUnreachable, setHighlightUnreachable] = useState(false);

  // Run validation whenever the mission object changes.
  useEffect(() => {
    if (mission) {
      const { issues } = validateMission(mission);
      setValidationIssues(issues);
    } else {
      setValidationIssues([]);
    }
  }, [mission]);

  // Update mission state in an immutable way.
  const updateMission = useCallback((updater) => {
    setMission((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      updater(copy);
      return copy;
    });
  }, []);

  // Handle importing a mission JSON from ExportImport component.
  const handleImport = (importedMission) => {
    try {
      setMission(JSON.parse(JSON.stringify(importedMission)));
      setSelectedNodeId(null);
      setSelectedRoomId(importedMission.start_room_id || null);
    } catch (err) {
      console.error('Failed to import mission:', err);
    }
  };

  // Toggle unreachable highlighting. When true, the Graph component will
  // highlight nodes that live in rooms deemed unreachable via exits.
  const handlePlaytest = () => {
    setHighlightUnreachable((val) => !val);
  };
  // Load sample mission from the bundled default mission JSON.
  const loadSample = () => {
    setMission(JSON.parse(JSON.stringify(defaultMission)));
    setSelectedNodeId(null);
    setSelectedRoomId(defaultMission.start_room_id || null);
  };

  // Create a new empty mission with one room container
  const createNewMission = () => {
    const firstRoomId = `room_${Date.now()}`;
    const newMission = {
      rooms: [
        { id: firstRoomId, name: 'Room 1', art: '', music: '', exits: [], auto_nodes: [] },
      ],
      nodes: [],
      start_room_id: firstRoomId,
    };
    setMission(newMission);
    setSelectedNodeId(null);
    setSelectedRoomId(firstRoomId);
  };

  // Render empty state when no mission is loaded
  if (!mission) {
    return (
      <div className="app-container">
        <header className="app-header">
          <h1>Mission Node Graph Editor</h1>
        </header>
        <div className="app-body" style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ maxWidth: 600, padding: '16px', textAlign: 'center' }}>
            <h2>No mission loaded</h2>
            <p>Create a new mission, load the sample mission, or import an existing JSON file.</p>
            <button onClick={createNewMission} style={{ marginBottom: '8px' }}>New Empty Mission</button>
            <button onClick={loadSample} style={{ marginBottom: '8px' }}>Load Sample Mission</button>
            <div>
              <ExportImport mission={{}} onImport={handleImport} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Mission Node Graph Editor</h1>
      </header>
      <div className="app-body">
        {/* Left sidebar containing rooms, node palette and import/export */}
        <aside className="left-panel">
          <RoomsPanel
            mission={mission}
            selectedRoomId={selectedRoomId}
            onSelectRoom={setSelectedRoomId}
            onChange={updateMission}
          />
          <Palette
            mission={mission}
            selectedRoomId={selectedRoomId}
            onChange={updateMission}
          />
          <ExportImport mission={mission} onImport={handleImport} />
        </aside>
        {/* Center graph canvas */}
        <main className="graph-container">
          <Graph
            mission={mission}
            selectedNodeId={selectedNodeId}
            onSelectNode={setSelectedNodeId}
            highlightUnreachable={highlightUnreachable}
          />
        </main>
        {/* Right sidebar containing node inspector and validation issues */}
        <aside className="right-panel">
          <NodeInspector
            mission={mission}
            selectedNodeId={selectedNodeId}
            onChange={updateMission}
          />
          <ValidationPanel issues={validationIssues} />
        </aside>
      </div>
      {/* Bottom bar with playtest stub */}
      <footer className="app-footer">
        <button onClick={handlePlaytest} className="playtest-btn">
          {highlightUnreachable ? 'Hide Unreachable' : 'Highlight Unreachable'}
        </button>
      </footer>
    </div>
  );
}