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
  const [flags, setFlags] = useState({});
  const [infos, setInfos] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [visibleNodes, setVisibleNodes] = useState(() => {
    const initial = {};
    mission.rooms.forEach((r) => {
      initial[r.id] = [...(r.auto_nodes || [])];
    });
    return initial;
  });
  const [message, setMessage] = useState('');

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

  function checkEntryConditions(n) {
    return (n.entry_conditions || []).every((cond) => {
      if (cond.flag_not_set) return !flags[cond.flag_not_set];
      if (cond.flag_set) return !!flags[cond.flag_set];
      return true;
    });
  }

  const nodeIds = visibleNodes[currentRoomId] || [];
  const nodes = nodeIds
    .map((id) => mission.nodes.find((n) => n.id === id))
    .filter(Boolean)
    .filter((n) => checkEntryConditions(n))
    .sort((a, b) => (b.priority || 0) - (a.priority || 0));
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
    if (outcome.set_flag) {
      setFlags((f) => ({ ...f, [outcome.set_flag]: true }));
      return 'You help the scout.';
    }
    if (outcome.grant_info) {
      setInfos((i) => [...i, outcome.grant_info]);
      return 'He shares a hint.';
    }
    if (outcome.apply_status) {
      setStatuses((s) => {
        const updated = { ...s };
        Object.entries(outcome.apply_status).forEach(([k, v]) => {
          updated[k] = (updated[k] || 0) + v;
        });
        return updated;
      });
      if (outcome.apply_status.wound) {
        return 'You are wounded.';
      }
      return 'You suffer a status effect.';
    }
    if (outcome.reveal_node) {
      const nodeToReveal = mission.nodes.find((n) => n.id === outcome.reveal_node);
      if (nodeToReveal) {
        setVisibleNodes((prev) => {
          const updated = { ...prev };
          const arr = updated[nodeToReveal.room_id] || [];
          if (!arr.includes(nodeToReveal.id)) {
            updated[nodeToReveal.room_id] = [...arr, nodeToReveal.id];
          }
          return updated;
        });
      }
      if (outcome.reveal_node === 'secret_shortcut') {
        return 'A secret shortcut is revealed.';
      }
    }
    return '';
  }

  function advanceNode() {
    setMessage('');
    setCurrentNodeIndex((idx) => idx + 1);
  }

  function requirementsMet(choice) {
    if (!choice.requirements) return true;
    return choice.requirements.every((req) => {
      if (req.has_item_tag) {
        return player.inventory.items?.some((item) =>
          item.tags?.includes(req.has_item_tag)
        );
      }
      return true;
    });
  }

  function handleChoice(choice, node) {
    setMessage('');
    if (!requirementsMet(choice)) {
      const tag = choice.requirements.find((r) => r.has_item_tag)?.has_item_tag;
      if (tag === 'food') {
        setMessage("You don't have food to offer.");
      } else {
        setMessage("You don't have the required item.");
      }
      return;
    }
    let outcomes = [];
    let moved = false;
    let finished = false;
    const messages = [];
    if (choice.skill_check) {
      const { stat, dc } = choice.skill_check;
      const statValue = player.deck.character.stats[stat.toLowerCase()] || 0;
      const roll = Math.floor(Math.random() * 20) + 1 + statValue;
      const success = roll >= dc;
      outcomes = success
        ? choice.success_outcomes || []
        : choice.fail_outcomes || [];
      messages.push(success ? 'You succeed.' : 'You fail.');
    } else {
      outcomes = choice.outcomes || [];
    }
    outcomes.forEach((o) => {
      if (o.move_room) moved = true;
      if (o.end_mission) finished = true;
      const msg = handleOutcome(o);
      if (msg) messages.push(msg);
    });
    if (messages.length) {
      setMessage(messages.join(' '));
    }
    if (!moved && !finished && !node.repeatable) {
      const removesNode = outcomes.some(
        (o) =>
          o.set_flag &&
          node.entry_conditions?.some((c) => c.flag_not_set === o.set_flag)
      );
      if (removesNode) {
        setMessage('');
        setCurrentNodeIndex((idx) => idx);
      } else {
        advanceNode();
      }
    }
  }

  function handleBattleOutcome(victory, node) {
    const outcomes = victory ? node.on_victory || [] : node.on_defeat || [];
    let moved = false;
    let finished = false;
    const messages = [];
    outcomes.forEach((o) => {
      if (o.move_room) moved = true;
      if (o.end_mission) finished = true;
      const msg = handleOutcome(o);
      if (msg) messages.push(msg);
    });
    if (messages.length) {
      setMessage(messages.join(' '));
    }
    if (!moved && !finished && !node.repeatable) {
      advanceNode();
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        padding: 16,
      }}
    >
      <Link to="/missions">
        <button style={{ marginBottom: 32 }}>Back to Mission Selection</button>
      </Link>
      <h1 style={{ marginBottom: 16 }}>Mission Name</h1>
      <p style={{ marginBottom: 32 }}>{mission.title}</p>
      <h2 style={{ marginBottom: 16 }}>Room Name</h2>
      <p style={{ marginBottom: 32 }}>{room.name}</p>
      {node && (
        <div key={node.id} style={{ marginTop: 'auto' }}>
          <h3 style={{ marginBottom: 16 }}>Event Title</h3>
          <p style={{ marginBottom: 24 }}>{node.title}</p>
          <h3 style={{ marginBottom: 16 }}>Event Description</h3>
          <p style={{ marginBottom: 24 }}>
            <TypewriterText text={node.text} />
          </p>
          <h3 style={{ marginBottom: 16 }}>Options</h3>
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
          {message && <p style={{ marginTop: 16 }}>{message}</p>}
        </div>
      )}
    </div>
  );
}

