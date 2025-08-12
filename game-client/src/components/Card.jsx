import React from 'react';

// Basic card template that can be reused across the project
// Accepts a `card` object and renders its name and any additional text
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

  return (
    <div style={containerStyle}>
      <div style={nameStyle}>{card.name}</div>
      {card.description && <div>{card.description}</div>}
      {card.effect && <div>{card.effect}</div>}
    </div>
  );
}
