import React from 'react';
import { Link } from 'react-router-dom';

export default function MissionSelection() {
  const modules = import.meta.glob('../../../assets/missions/*.json', { eager: true });
  const missions = Object.values(modules).map((m) => m.default);

  return (
    <div style={{ padding: 16 }}>
      <Link to="/">
        <button style={{ marginBottom: 16 }}>Back to Menu</button>
      </Link>
      <h1>Mission Selection</h1>
      <ul>
        {missions.map((mission) => (
          <li key={mission.id}>
            <Link to={`/missions/${mission.id}`}>{mission.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
