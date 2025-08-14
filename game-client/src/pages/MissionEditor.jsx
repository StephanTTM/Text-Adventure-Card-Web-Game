import React from 'react';
import { Link } from 'react-router-dom';
import MissionGraph from '../components/MissionGraph';

export default function MissionEditor() {
  return (
    <div style={{ padding: 16 }}>
      <Link to="/">
        <button style={{ marginBottom: 16 }}>Back to Menu</button>
      </Link>
      <h1>Mission Editor</h1>
      <MissionGraph />
      <p style={{ marginTop: 16 }}>Mission editor content coming soon.</p>
    </div>
  );
}
