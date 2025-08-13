import React from 'react';
import { useParams, Link } from 'react-router-dom';

// Load all mission JSON files eagerly so we can look them up by id
const modules = import.meta.glob('../../../assets/missions/*.json', { eager: true });
const missions = Object.values(modules).map((m) => m.default);

export default function MissionResults() {
  const { missionId } = useParams();
  const mission = missions.find((m) => m.id === missionId);

  return (
    <div style={{ padding: 16 }}>
      <Link to="/missions">
        <button style={{ marginBottom: 16 }}>Back to Mission Selection</button>
      </Link>
      {mission ? (
        <>
          <h1>Mission Results</h1>
          <h2>{mission.title}</h2>
          <p>Mission complete.</p>
        </>
      ) : (
        <p>Mission not found.</p>
      )}
    </div>
  );
}
