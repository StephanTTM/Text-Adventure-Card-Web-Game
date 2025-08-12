import React, { useMemo, useCallback } from 'react';
import ReactFlow, { Controls, Background, MarkerType } from 'reactflow';
import { validateMission } from '../lib/validate.js';
import CustomNode from './CustomNode.jsx';
import RoomContainer from './RoomContainer.jsx';

import 'reactflow/dist/style.css';

/**
 * Graph component renders mission nodes and relationships using React Flow.
 * Nodes are grouped by room horizontally, with vertical spacing within each room.
 * @param {Object} props
 * @param {Object} props.mission Mission data
 * @param {string|null} props.selectedNodeId Selected node id
 * @param {Function} props.onSelectNode Callback when node is clicked
 * @param {boolean} props.highlightUnreachable Whether unreachable nodes should be highlighted
 * @param {Array} props.validationIssues Not used directly (for re-render)
 */
export default function Graph({ mission, selectedNodeId, onSelectNode, highlightUnreachable }) {
  // Build nodes and edges from mission
  const { nodes, edges } = useMemo(() => {
    const nodes = [];
    const edges = [];
    if (!mission) return { nodes, edges };

    // Determine unreachable nodes if highlight is enabled
    let unreachableIds = [];
    if (highlightUnreachable) {
      const { unreachableNodeIds } = validateMission(mission);
      unreachableIds = unreachableNodeIds;
    }

    // Group nodes by room
    const rooms = Array.isArray(mission.rooms) ? mission.rooms : [];
    const roomIndex = new Map();
    rooms.forEach((room, idx) => {
      roomIndex.set(room.id, idx);
    });
    const nodesByRoom = new Map();
    if (Array.isArray(mission.nodes)) {
      mission.nodes.forEach((node) => {
        if (!nodesByRoom.has(node.room_id)) nodesByRoom.set(node.room_id, []);
        nodesByRoom.get(node.room_id).push(node);
      });
    }
    // For each room, sort nodes to maintain consistent ordering
    nodesByRoom.forEach((arr) => arr.sort((a, b) => a.id.localeCompare(b.id)));

    // Build edges from outcomes referencing reveal_node
    const addEdge = (sourceId, targetId, handleId = null) => {
      const edge = {
        id: `${sourceId}-${targetId}-${edges.length}`,
        source: sourceId,
        target: targetId,
        markerEnd: { type: MarkerType.ArrowClosed },
      };
      if (handleId) edge.sourceHandle = handleId;
      edges.push(edge);
    };
    if (Array.isArray(mission.nodes)) {
      mission.nodes.forEach((node) => {
        if (Array.isArray(node.choices)) {
          node.choices.forEach((choice, choiceIdx) => {
            const outcomesArray = [];
            if (Array.isArray(choice.outcomes)) outcomesArray.push(...choice.outcomes);
            if (Array.isArray(choice.success)) outcomesArray.push(...choice.success);
            if (Array.isArray(choice.failure)) outcomesArray.push(...choice.failure);
            outcomesArray.forEach((outcome) => {
              if (outcome && outcome.reveal_node) {
                const target = outcome.reveal_node;
                if (typeof target === 'string') {
                  // assign edge to handle corresponding to choice index
                  addEdge(node.id, target, `out-${choiceIdx}`);
                } else if (Array.isArray(target)) {
                  target.forEach((t) => addEdge(node.id, t, `out-${choiceIdx}`));
                }
              }
              // Edges for move_room? Not drawn to avoid cross-room clutter
            });
          });
        }
      });
    }

    // Determine incoming edges to mark nodes without inputs
    const incoming = new Set(edges.map((e) => e.target));

    // Build React Flow nodes with positions and custom metadata
    const roomWidth = 240;
    const xSpacing = roomWidth + 80;
    const ySpacing = 120;
    const headerHeight = 30;
    const padding = 10;

    rooms.forEach((room) => {
      const idx = roomIndex.get(room.id) || 0;
      const x = idx * xSpacing;
      const list = nodesByRoom.get(room.id) || [];
      const roomHeight = Math.max(list.length * ySpacing + headerHeight + padding * 2, 80);
      const containerId = `room-container-${room.id}`;
      nodes.push({
        id: containerId,
        data: { label: room.name || room.id },
        position: { x, y: 0 },
        type: 'room',
        style: { width: roomWidth, height: roomHeight, zIndex: -1 },
        draggable: false,
        selectable: false,
      });

      list.forEach((node, nodeIdx) => {
        const y = headerHeight + padding + nodeIdx * ySpacing;
        const isUnreachable = unreachableIds.includes(node.id);
        const outputsCount = Array.isArray(node.choices) && node.choices.length > 0 ? node.choices.length : 1;
        const noInput = !incoming.has(node.id);
        nodes.push({
          id: node.id,
          data: {
            label: node.title || node.id,
            type: node.type,
            room: node.room_id,
            outputs: outputsCount,
            noInput,
          },
          position: { x: padding, y },
          type: 'custom',
          parentNode: containerId,
          extent: 'parent',
          style: {
            border: selectedNodeId === node.id ? '2px solid #007acc' : isUnreachable ? '2px dashed #d9534f' : '1px solid #999',
            borderRadius: 4,
            background: '#fff',
          },
        });
      });
    });

    return { nodes, edges };
  }, [mission, selectedNodeId, highlightUnreachable]);

  // Node click handler
  const handleNodeClick = useCallback((event, node) => {
    if (onSelectNode) onSelectNode(node.id);
  }, [onSelectNode]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={handleNodeClick}
        nodesConnectable={false}
        zoomOnScroll={true}
        zoomOnPinch={true}
        zoomOnDoubleClick={true}
        nodeTypes={{ custom: CustomNode, room: RoomContainer }}
      >
        <Background color="#aaa" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
}