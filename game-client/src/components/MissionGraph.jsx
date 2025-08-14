import React, { useCallback, useRef } from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import RoomNode from './RoomNode';
import MissionIntroNode from './MissionIntroNode';

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

  const nodeTypes = { room: RoomNode, mission_intro: MissionIntroNode };

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

      if (type === 'room') {
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
        return;
      }

      if (type === 'mission_intro') {
        const rooms = reactFlowInstance.current.getNodes();
        const parent = rooms.find((n) => {
          if (n.type !== 'room') return false;
          const width = n.style?.width || 200;
          const height = n.style?.height || 150;
          return (
            position.x >= n.position.x &&
            position.x <= n.position.x + width &&
            position.y >= n.position.y &&
            position.y <= n.position.y + height
          );
        });
        if (!parent) return;
        const newNode = {
          id,
          type,
          position: {
            x: position.x - parent.position.x,
            y: position.y - parent.position.y,
          },
          data: {
            title: '',
            text: '',
            room_id: parent.id,
            choices: [],
          },
          parentNode: parent.id,
          extent: 'parent',
          style: { width: 150, height: 80 },
        };
        setNodes((nds) => nds.concat(newNode));
      }
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
