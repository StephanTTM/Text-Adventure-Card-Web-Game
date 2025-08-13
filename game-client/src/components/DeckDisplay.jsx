import React from 'react';
import Card from './Card';

export default function DeckDisplay({ deck, onSlotClick }) {
  const gridStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 16,
  };

  const slotStyle = {
    width: 150,
    textAlign: 'center',
  };

  const labelStyle = {
    marginBottom: 8,
    fontWeight: 'bold',
  };

  const emptyStyle = {
    border: '1px dashed #999',
    borderRadius: 8,
    padding: 12,
    height: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f9f9f9',
  };

  function renderSlot(label, card, key) {
    const handleClick = () => {
      if (onSlotClick) onSlotClick(key);
    };
    return (
      <div key={label} style={slotStyle} onClick={handleClick}>
        <div style={labelStyle}>{label}</div>
        {card ? <Card card={card} /> : <div style={emptyStyle}>Empty</div>}
      </div>
    );
  }

  const slots = [
    ['Character', deck.character, 'character'],
    ['Weapon', deck.weapon, 'weapon'],
    ['Body', deck.equipment?.body, 'body'],
    ['Gloves', deck.equipment?.gloves, 'gloves'],
    ['Boots', deck.equipment?.boots, 'boots'],
    ['Accessory 1', deck.accessories?.[0], 'accessory1'],
    ['Accessory 2', deck.accessories?.[1], 'accessory2'],
    ['Utility', deck.utility, 'utility'],
  ];

  return <div style={gridStyle}>{slots.map(([label, card, key]) => renderSlot(label, card, key))}</div>;
}
