import React, { useState, useEffect } from 'react';

export default function BattleSystem({
  player = { name: 'Hero', hp: 10 },
  enemy = { name: 'Enemy', hp: 10 },
  onVictory,
  onDefeat,
}) {
  const [playerHp, setPlayerHp] = useState(player.hp);
  const [enemyHp, setEnemyHp] = useState(enemy.hp);
  const [playerTurn, setPlayerTurn] = useState(true);

  function attack() {
    if (!playerTurn || playerHp <= 0 || enemyHp <= 0) return;
    const damage = 3; // fixed for predictability
    setEnemyHp((hp) => Math.max(0, hp - damage));
    setPlayerTurn(false);
  }

  useEffect(() => {
    if (!playerTurn && enemyHp > 0) {
      const damage = 2;
      setPlayerHp((hp) => Math.max(0, hp - damage));
      setPlayerTurn(true);
    }
  }, [playerTurn, enemyHp]);

  useEffect(() => {
    if (enemyHp <= 0 && onVictory) {
      onVictory();
    }
  }, [enemyHp, onVictory]);

  useEffect(() => {
    if (playerHp <= 0 && onDefeat) {
      onDefeat();
    }
  }, [playerHp, onDefeat]);

  return (
    <div>
      <div>
        <strong>{player.name}</strong> HP: {playerHp}
      </div>
      <div>
        <strong>{enemy.name}</strong> HP: {enemyHp}
      </div>
      {enemyHp > 0 && playerHp > 0 && (
        <button onClick={attack} disabled={!playerTurn}>
          Attack
        </button>
      )}
      {!playerTurn && enemyHp > 0 && <p>{enemy.name} is attacking...</p>}
    </div>
  );
}

