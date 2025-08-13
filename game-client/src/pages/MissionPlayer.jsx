import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import BattleSystem from '../components/BattleSystem.jsx';
import TypewriterText from '../components/TypewriterText.jsx';

// Load all mission JSON files eagerly so we can look them up by id
const modules = import.meta.glob('../../../assets/missions/*.json', { eager: true });
const missions = Object.values(modules).map((m) => m.default);

export default function MissionPlayer({ player }) {
  const { missionId } = useParams();
  const navigate = useNavigate();
  const mission = missions.find((m) => m.id === missionId);

  const [currentRoomId, setCurrentRoomId] = useState(mission ? mission.start_room_id : null);
  const [ended, setEnded] = useState(false);
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0);

  if (!mission) {
    return (
      <div style={{ padding: 16 }}>
        <Link to="/missions">
          <button style={{ marginBottom: 16 }}>Back to Mission Selection</button>
        </Link>
        <p>Mission not found.</p>
      </div>
    );
  }

  const room = mission.rooms.find((r) => r.id === currentRoomId);
  const nodes =
    room?.auto_nodes.map((id) => mission.nodes.find((n) => n.id === id)).filter(Boolean) || [];
  const node = nodes[currentNodeIndex];

  useEffect(() => {
    setCurrentNodeIndex(0);
  }, [currentRoomId]);

  useEffect(() => {
    if (ended || !room) {
      navigate(`/missions/${missionId}/results`);
    }
  }, [ended, room, navigate, missionId]);

  if (ended || !room) {
    return null;
  }

  function handleOutcome(outcome) {
    if (outcome.move_room) {
      setCurrentRoomId(outcome.move_room);
    }
    if (outcome.end_mission) {
      setEnded(true);
    }
  }

  function advanceNode() {
    setCurrentNodeIndex((idx) => idx + 1);
  }

  function handleChoice(choice, node) {
    const outcomes = choice.outcomes || choice.success_outcomes || [];
    let moved = false;
    let finished = false;
    outcomes.forEach((o) => {
      if (o.move_room) moved = true;
      if (o.end_mission) finished = true;
      handleOutcome(o);
    });
    if (!moved && !finished && !node.repeatable) {
      advanceNode();
    }
  }

  function handleBattleOutcome(victory, node) {
    const outcomes = victory ? node.on_victory || [] : node.on_defeat || [];
    let moved = false;
    let finished = false;
    outcomes.forEach((o) => {
      if (o.move_room) moved = true;
      if (o.end_mission) finished = true;
      handleOutcome(o);
    });
    if (!moved && !finished && !node.repeatable) {
      advanceNode();
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <Link to="/missions">
        <button style={{ marginBottom: 16 }}>Back to Mission Selection</button>
      </Link>
      <h1 style={{ marginBottom: 8 }}>Mission Name</h1>
      <p style={{ marginBottom: 24 }}>{mission.title}</p>
      <h2 style={{ marginBottom: 8 }}>Room Name</h2>
      <p style={{ marginBottom: 24 }}>{room.name}</p>
      {node && (
        <div key={node.id} style={{ marginBottom: 24 }}>
          <h3 style={{ marginBottom: 8 }}>Event Title</h3>
          <p style={{ marginBottom: 16 }}>{node.title}</p>
          <h3 style={{ marginBottom: 8 }}>Event Description</h3>
          <p style={{ marginBottom: 16 }}>
            <TypewriterText text={node.text} />
          </p>
          <h3 style={{ marginBottom: 8 }}>Options</h3>
          {node.type === 'battle' ? (
            <BattleSystem
              deck={player.deck}
              onVictory={() => handleBattleOutcome(true, node)}
              onDefeat={() => handleBattleOutcome(false, node)}
            />
          ) : (
            node.choices?.map((choice, idx) => (
              <button
                key={idx}
                onClick={() => handleChoice(choice, node)}
                style={{ marginRight: 8, marginBottom: 8 }}
              >
                {choice.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

