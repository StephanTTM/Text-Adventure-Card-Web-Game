import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DeckDisplay from '../components/DeckDisplay';
import Card from '../components/Card';

export default function DeckBuilder({ player }) {
  if (!player) {
    return <div>Loading...</div>;
  }

  const [deck, setDeck] = useState(() => JSON.parse(JSON.stringify(player.deck)));
  const [inventory, setInventory] = useState([...player.inventory.cards]);
  const [selected, setSelected] = useState(null);

  const deckSlots = [
    deck.character,
    deck.weapon,
    deck.equipment?.body,
    deck.equipment?.gloves,
    deck.equipment?.boots,
    deck.accessories?.[0],
    deck.accessories?.[1],
    deck.utility,
  ];

  const deckCount = deckSlots.filter(Boolean).length;

  function equipToSlot(slotKey) {
    if (!selected) return;
    const card = selected;
    const allowed =
      slotKey === 'accessory1' || slotKey === 'accessory2'
        ? card.slot === 'accessory'
        : card.slot === slotKey;
    if (!allowed) {
      alert('Card cannot be placed in this slot');
      return;
    }

    const newDeck = { ...deck };
    let previous = null;

    switch (slotKey) {
      case 'character':
        previous = newDeck.character;
        newDeck.character = card;
        break;
      case 'weapon':
        previous = newDeck.weapon;
        newDeck.weapon = card;
        break;
      case 'body':
      case 'gloves':
      case 'boots':
        newDeck.equipment = { ...newDeck.equipment };
        previous = newDeck.equipment[slotKey];
        newDeck.equipment[slotKey] = card;
        break;
      case 'accessory1':
      case 'accessory2':
        newDeck.accessories = newDeck.accessories ? [...newDeck.accessories] : [];
        const index = slotKey === 'accessory1' ? 0 : 1;
        previous = newDeck.accessories[index];
        newDeck.accessories[index] = card;
        break;
      case 'utility':
        previous = newDeck.utility;
        newDeck.utility = card;
        break;
      default:
        break;
    }

    setDeck(newDeck);
    setInventory((inv) => {
      const filtered = inv.filter((c) => c.id !== card.id);
      if (previous) filtered.push(previous);
      return filtered;
    });
    setSelected(null);
  }

  return (
    <div style={{ padding: 16 }}>
      <Link to="/">
        <button style={{ marginBottom: 16 }}>Back to Menu</button>
      </Link>
      <h1>Deck Builder</h1>
      <p>Equipped Cards ({deckCount})</p>
      <DeckDisplay deck={deck} onSlotClick={equipToSlot} />
      <h2>Inventory</h2>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {inventory.map((card) => (
          <div key={card.id} style={{ textAlign: 'center' }}>
            <Card card={card} />
            <button onClick={() => setSelected(card)}>
              {selected?.id === card.id ? 'Selected' : 'Select'}
            </button>
          </div>
        ))}
      </div>
      {selected && <p>Selected card: {selected.name}</p>}
    </div>
  );
}
