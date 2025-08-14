import React, { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes = [
  {
    id: 'room-1',
    type: 'input',
    position: { x: 250, y: 0 },
    data: { label: 'Start Room' },
  },
];

const initialEdges = [];

export default function MissionGraph() {
  if (typeof window === 'undefined' || typeof window.ResizeObserver === 'undefined') {
    // Avoid rendering React Flow during server-side rendering or tests
    return <div style={{ width: '100%', height: 600, background: '#f0f0f0' }} />;
  }
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: '100%', height: 600 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <Background gap={16} />
      </ReactFlow>
    </div>
  );
}
