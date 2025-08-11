import React from 'react';
import { Handle, Position } from 'reactflow';

/**
 * Custom node component that displays a title and dynamic input/output handles.
 * @param {Object} props
 * @param {Object} props.data Custom data passed from Graph
 * @param {string} props.id Node id
 */
export default function CustomNode({ id, data }) {
  const { label, outputs = 1, noInput } = data;
  // Create an array for outputs to render that many handles
  const outputHandles = Array.from({ length: outputs }, (_, i) => i);
  return (
    <div className="custom-node" style={{ padding: 10, borderRadius: 4, background: '#fff', border: '1px solid #bbb', minWidth: 150 }}>
      {/* Input handle on the left, hidden if noInput is true */}
      {!noInput && (
        <Handle type="target" position={Position.Left} id={`in-${id}`} style={{ background: '#555' }} />
      )}
      <div style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 4 }}>{label}</div>
      {/* Output handles on the right */}
      {outputHandles.map((i) => (
        <Handle
          key={i}
          type="source"
          position={Position.Right}
          id={`out-${i}`}
          style={{ top: `${30 + i * 14}px`, background: '#555' }}
        />
      ))}
    </div>
  );
}