import React, { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import MissionGraph from '../components/MissionGraph';
import NodeLibrary from '../components/NodeLibrary';
import NodeInspector from '../components/NodeInspector';
import { addEdge, useEdgesState, useNodesState } from 'reactflow';

export default function MissionEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [startRoomId, setStartRoomId] = useState('');
  const [missionId, setMissionId] = useState('mission-1');
  const [missionTitle, setMissionTitle] = useState('');
  const [isLibraryDragging, setIsLibraryDragging] = useState(false);

  const mission = useMemo(
    () => ({
      id: missionId,
      title: missionTitle,
      start_room_id: startRoomId,
      rooms: nodes
        .filter(({ type }) => type === 'room')
        .map(({ id, data }) => ({ id, ...data })),
      nodes: nodes
        .filter(({ type }) => type !== 'room')
        .map(({ id, type, data }) => ({ id, type, ...data })),
    }),
    [missionId, missionTitle, startRoomId, nodes]
  );

  const handleMissionChange = useCallback(
    (updatedMission) => {
      setStartRoomId(updatedMission.start_room_id || '');
      setMissionTitle(updatedMission.title || '');
      if (updatedMission.id) setMissionId(updatedMission.id);
    },
    []
  );

  const onConnect = useCallback(
    (connection) => {
      setEdges((eds) => {
        const filtered = eds.filter(
          (e) =>
            !(e.source === connection.source &&
              e.sourceHandle === connection.sourceHandle)
        );
        return addEdge(connection, filtered);
      });

      setNodes((nds) =>
        nds.map((n) => {
          if (n.id !== connection.source) return n;
          const handle = connection.sourceHandle || '';
          const match = handle.match(/-out-(\d+)/);
          if (!match) return n;
          const idx = Number(match[1]);
          const choices = [...(n.data.choices || [])];
          const choice = { ...choices[idx] };
          if (!choice) return n;
          const outcomes = [...(choice.outcomes || [])];
          const existingIdx = outcomes.findIndex((o) => 'change_node' in o);
          if (existingIdx >= 0) {
            outcomes[existingIdx] = { change_node: connection.target };
          } else {
            outcomes.push({ change_node: connection.target });
          }
          choices[idx] = { ...choice, outcomes };
          return { ...n, data: { ...n.data, choices } };
        })
      );
    },
    [setEdges, setNodes]
  );

  const handleNodeUpdate = useCallback(
    (updatedNode) => {
      setNodes((nds) => nds.map((n) => (n.id === updatedNode.id ? updatedNode : n)));
    },
    [setNodes]
  );

  const handleOutcomeConnection = useCallback(
    (sourceId, targetId) => {
      if (!nodes.some((n) => n.id === targetId)) return;
      setEdges((eds) => {
        if (eds.some((e) => e.source === sourceId && e.target === targetId)) {
          return eds;
        }
        return addEdge({ source: sourceId, target: targetId }, eds);
      });
    },
    [nodes, setEdges]
  );

  const handleOutcomeDisconnection = useCallback(
    (sourceId, targetId) => {
      setEdges((eds) =>
        eds.filter((e) => !(e.source === sourceId && e.target === targetId))
      );
    },
    [setEdges]
  );

  const selectedNode =
    nodes.find((node) => node.id === selectedNodeId) || null;

  return (
    <div style={{ padding: 16 }}>
      <Link to="/">
        <button style={{ marginBottom: 16 }}>Back to Menu</button>
      </Link>
      <h1>Mission Editor</h1>
      <div style={{ display: 'flex', height: 600 }}>
        <NodeLibrary
          onDragStart={() => setIsLibraryDragging(true)}
          onDragEnd={() => setIsLibraryDragging(false)}
        />
        <MissionGraph
          nodes={nodes}
          edges={edges}
          setNodes={setNodes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeSelect={(node) => setSelectedNodeId(node ? node.id : null)}
          isLibraryDragging={isLibraryDragging}
          onLibraryDragEnd={() => setIsLibraryDragging(false)}
        />
        <NodeInspector
          selectedNode={selectedNode}
          onChange={handleNodeUpdate}
          mission={mission}
          onMissionChange={handleMissionChange}
          onAddEdge={handleOutcomeConnection}
          onRemoveEdge={handleOutcomeDisconnection}
        />
      </div>
    </div>
  );
}
