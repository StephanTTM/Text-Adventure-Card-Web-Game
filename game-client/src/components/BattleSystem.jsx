import React, { useState } from 'react';

/**
 * Simple turn-based battle prototype.
 * Uses the player's deck to determine stats and available actions.
 */
export default function BattleSystem({ deck, onVictory, onDefeat }) {
  const maxPlayerHp = deck?.character?.stats?.end ? deck.character.stats.end * 2 : 20;
  const attackPower = (deck?.character?.stats?.atk || 0) + (deck?.weapon?.attack_bonus || 0);
  const actions = [
    deck?.character?.primary_attack,
    ...(deck?.character?.abilities || []),
    ...(deck?.weapon?.skills || []),
  ].filter(Boolean);

  const [playerHp, setPlayerHp] = useState(maxPlayerHp);
  const [enemyHp, setEnemyHp] = useState(20);
  const [log, setLog] = useState([]);

  function addLog(msg) {
    setLog((prev) => [...prev, msg]);
  }

  function handleAction(label) {
    // Player attacks
    const newEnemyHp = enemyHp - attackPower;
    addLog(`You use ${label} for ${attackPower} damage.`);
    if (newEnemyHp <= 0) {
      setEnemyHp(0);
      addLog('Enemy defeated!');
      onVictory && onVictory();
      return;
    }
    setEnemyHp(newEnemyHp);

    // Enemy counterattacks
    const enemyDamage = 5;
    const newPlayerHp = playerHp - enemyDamage;
    addLog(`Enemy strikes back for ${enemyDamage} damage.`);
    if (newPlayerHp <= 0) {
      setPlayerHp(0);
      addLog('You were defeated...');
      onDefeat && onDefeat();
      return;
    }
    setPlayerHp(newPlayerHp);
  }

  return (
    <div>
      <p>Player HP: {playerHp}</p>
      <p>Enemy HP: {enemyHp}</p>
      {playerHp > 0 && enemyHp > 0 && (
        <div style={{ marginBottom: 8 }}>
          {actions.map((action) => (
            <button key={action} onClick={() => handleAction(action)} style={{ marginRight: 8 }}>
              {action}
            </button>
          ))}
        </div>
      )}
      <div style={{ minHeight: 60 }}>
        {log.map((entry, idx) => (
          <div key={idx}>{entry}</div>
        ))}
      </div>
    </div>
  );
}

