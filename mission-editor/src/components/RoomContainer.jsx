import React from 'react';

/**
 * Visual container node representing a room. Child storylet nodes are rendered
 * inside this container by React Flow when they reference this node as their
 * parent. The container itself is not interactive; it simply displays the room
 * name and a bordered box that groups its children.
 *
 * @param {Object} props
 * @param {Object} props.data Node data containing label
 */
export default function RoomContainer({ data }) {
  const { label } = data;
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        background: '#f5f5f5',
        border: '2px solid #888',
        borderRadius: 8,
        padding: 8,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          fontWeight: 'bold',
          marginBottom: 4,
          pointerEvents: 'none',
        }}
      >
        {label}
      </div>
    </div>
  );
}
