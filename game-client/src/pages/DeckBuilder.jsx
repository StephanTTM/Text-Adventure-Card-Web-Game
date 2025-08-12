import React from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';

export default function DeckBuilder({ player }) {
  if (!player) {
    return <div>Loading...</div>;
  }

  const deck = [
    player.deck.character,
    player.deck.weapon,
    ...Object.values(player.deck.equipment || {}),
    ...player.deck.accessories,
    player.deck.utility,
  ].filter(Boolean);

  const gridStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 16,
  };

  return (
    <div style={{ padding: 16 }}>
      <Link to="/">
        <button style={{ marginBottom: 16 }}>Back to Menu</button>
      </Link>
      <h1>Deck Builder</h1>
      <div style={gridStyle}>
        {deck.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
