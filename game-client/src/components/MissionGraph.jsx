import React, { useCallback, useRef } from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import RoomNode from './RoomNode';

export default function MissionGraph({
  nodes,
  edges,
  setNodes,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeSelect,
}) {
  if (
    typeof window === 'undefined' ||
    typeof window.ResizeObserver === 'undefined'
  ) {
    // Avoid rendering React Flow during server-side rendering or tests
    return <div style={{ width: '100%', height: 600, background: '#f0f0f0' }} />;
  }

  const reactFlowWrapper = useRef(null);
  const reactFlowInstance = useRef(null);

  const nodeTypes = { room: RoomNode };

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = reactFlowInstance.current.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const id = `${type}-${nodes.length + 1}`;
      const newNode = {
        id,
        type,
        position,
        data: {
          name: 'Room',
          art: '',
          music: '',
          exits: [],
          auto_nodes: [],
        },
        style: { width: 200, height: 150 },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [nodes, setNodes]
  );

  return (
    <div style={{ flex: 1 }} ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onSelectionChange={({ nodes: selected }) =>
          onNodeSelect(selected[0] || null)
        }
        onInit={(instance) => (reactFlowInstance.current = instance)}
        fitView
      >
        <Controls />
        <Background gap={16} />
      </ReactFlow>
    </div>
  );
}
