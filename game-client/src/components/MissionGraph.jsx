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

  const findRoomAtPosition = (position, graphNodes) =>
    graphNodes.find((n) => {
      if (n.type !== 'room') return false;
      const width = n.width || n.style?.width || 200;
      const height = n.height || n.style?.height || 150;
      return (
        position.x >= n.position.x &&
        position.x <= n.position.x + width &&
        position.y >= n.position.y &&
        position.y <= n.position.y + height
      );
    });

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
          style: { width: 200, height: 150, zIndex: 0 },
        };
        setNodes((nds) => nds.concat(newNode));
        return;
      }

      if (type === 'mission_intro') {
        const graphNodes = reactFlowInstance.current.getNodes();
        const parent = findRoomAtPosition(position, graphNodes);

        const newNode = {
          id,
          type,
          position: parent
            ? {
                x: position.x - parent.position.x,
                y: position.y - parent.position.y,
              }
            : position,
          data: {
            title: '',
            text: '',
            room_id: parent ? parent.id : '',
            choices: [],
          },
          style: { width: 150, height: 80, zIndex: 1 },
          ...(parent ? { parentNode: parent.id } : {}),
        };
        setNodes((nds) => nds.concat(newNode));
      }
    },
    [nodes, setNodes]
  );

  const onNodeDragStop = useCallback(
    (event, node) => {
      if (node.type !== 'mission_intro') return;

      const graphNodes = reactFlowInstance.current.getNodes();
      const position = node.positionAbsolute || node.position;
      const parent = findRoomAtPosition(position, graphNodes);

      setNodes((nds) =>
        nds.map((n) => {
          if (n.id !== node.id) return n;
          const base = {
            ...n,
            style: { ...n.style, zIndex: 1 },
          };
          if (parent) {
            return {
              ...base,
              parentNode: parent.id,
              position: {
                x: position.x - parent.position.x,
                y: position.y - parent.position.y,
              },
              data: { ...n.data, room_id: parent.id },
            };
          }
          return {
            ...base,
            parentNode: undefined,
            position,
            data: { ...n.data, room_id: '' },
          };
        })
      );
    },
    [setNodes]
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
        onNodeDragStop={onNodeDragStop}
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
