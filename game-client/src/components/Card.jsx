import React from 'react';

// Basic card template that can be reused across the project
// Accepts a `card` object and renders its name and data based on slot type
export default function Card({ card }) {
  const containerStyle = {
    border: '1px solid #333',
    borderRadius: 8,
    padding: 12,
    width: 150,
    background: '#fff',
    textAlign: 'center',
  };

  const nameStyle = {
    fontWeight: 'bold',
    marginBottom: 8,
  };

  function renderDetails() {
    switch (card.slot) {
      case 'character':
        return (
          <>
            <div>Class: {card.class}</div>
            <div>Race: {card.race}</div>
            <div>
              Stats: STR {card.stats?.str}, DEX {card.stats?.dex}, INT {card.stats?.int}
            </div>
            {card.abilities && <div>Abilities: {card.abilities.join(', ')}</div>}
            {card.primary_attack && <div>Primary: {card.primary_attack}</div>}
          </>
        );
      case 'weapon':
        return (
          <>
            {card.attack_bonus !== undefined && (
              <div>Attack Bonus: {card.attack_bonus}</div>
            )}
            {card.skills && <div>Skills: {card.skills.join(', ')}</div>}
          </>
        );
      case 'body':
      case 'gloves':
      case 'boots':
        return card.armor !== undefined ? <div>Armor: {card.armor}</div> : null;
      case 'accessory':
        return card.effect ? <div>{card.effect}</div> : null;
      case 'utility':
        return card.bonus ? <div>{card.bonus}</div> : null;
      default:
        return (
          <>
            {card.description && <div>{card.description}</div>}
            {card.effect && <div>{card.effect}</div>}
            {card.power !== undefined && <div>Power: {card.power}</div>}
          </>
        );
    }
  }

  return (
    <div style={containerStyle}>
      <div style={nameStyle}>{card.name}</div>
      {renderDetails()}
    </div>
  );
}
