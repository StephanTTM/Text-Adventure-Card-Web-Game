import React from 'react';
import Card from './Card';

export default function DeckDisplay({ deck }) {
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

  function renderSlot(label, card) {
    return (
      <div key={label} style={slotStyle}>
        <div style={labelStyle}>{label}</div>
        {card ? <Card card={card} /> : <div style={emptyStyle}>Empty</div>}
      </div>
    );
  }

  const slots = [
    ['Character', deck.character],
    ['Weapon', deck.weapon],
    ['Body', deck.equipment?.body],
    ['Gloves', deck.equipment?.gloves],
    ['Boots', deck.equipment?.boots],
    ['Accessory 1', deck.accessories?.[0]],
    ['Accessory 2', deck.accessories?.[1]],
    ['Utility', deck.utility],
  ];

  return <div style={gridStyle}>{slots.map(([label, card]) => renderSlot(label, card))}</div>;
}
