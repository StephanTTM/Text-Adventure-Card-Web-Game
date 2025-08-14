import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import MissionGraph from '../components/MissionGraph';
import NodeLibrary from '../components/NodeLibrary';
import NodeInspector from '../components/NodeInspector';
import { addEdge, useEdgesState, useNodesState } from 'reactflow';

export default function MissionEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const handleNodeUpdate = useCallback(
    (updatedNode) => {
      setNodes((nds) => nds.map((n) => (n.id === updatedNode.id ? updatedNode : n)));
    },
    [setNodes]
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
        <NodeLibrary />
        <MissionGraph
          nodes={nodes}
          edges={edges}
          setNodes={setNodes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeSelect={(node) => setSelectedNodeId(node ? node.id : null)}
        />
        <NodeInspector selectedNode={selectedNode} onChange={handleNodeUpdate} />
      </div>
      <p style={{ marginTop: 16 }}>Mission editor content coming soon.</p>
    </div>
  );
}
