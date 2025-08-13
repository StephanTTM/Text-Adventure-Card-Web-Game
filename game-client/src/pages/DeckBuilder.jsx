import React from 'react';
import { Link } from 'react-router-dom';
import DeckDisplay from '../components/DeckDisplay';

export default function DeckBuilder({ player }) {
  if (!player) {
    return <div>Loading...</div>;
  }

  const deckSlots = [
    player.deck.character,
    player.deck.weapon,
    player.deck.equipment?.body,
    player.deck.equipment?.gloves,
    player.deck.equipment?.boots,
    player.deck.accessories?.[0],
    player.deck.accessories?.[1],
    player.deck.utility,
  ];

  const deckCount = deckSlots.filter(Boolean).length;

  return (
    <div style={{ padding: 16 }}>
      <Link to="/">
        <button style={{ marginBottom: 16 }}>Back to Menu</button>
      </Link>
      <h1>Deck Builder</h1>
      <p>Equipped Cards ({deckCount})</p>
      <DeckDisplay deck={player.deck} />
    </div>
  );
}
