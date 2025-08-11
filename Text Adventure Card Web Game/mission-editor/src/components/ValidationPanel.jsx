import React from 'react';

/**
 * Displays validation issues for the mission.
 * @param {Object} props
 * @param {Array<string>} props.issues Array of issue strings
 */
export default function ValidationPanel({ issues }) {
  return (
    <div className="validation-panel">
      <h2>Validation</h2>
      <div className="validation-issues">
        {issues.length === 0 ? (
          <p style={{ color: '#0a0' }}>No issues detected</p>
        ) : (
          <ul>
            {issues.map((issue, idx) => (
              <li key={idx}>{issue}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}