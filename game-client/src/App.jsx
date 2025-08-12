import React, { useEffect, useState } from 'react';

export default function App() {
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/players/example_player')
      .then((res) => res.json())
      .then(setPlayer)
      .catch((err) => console.error('Failed to load player', err));
  }, []);

  const containerStyle = {
    position: 'relative',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'sans-serif',
  };

  const profileStyle = {
    position: 'absolute',
    top: 16,
    right: 16,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  };

  const avatarStyle = {
    width: 40,
    height: 40,
    borderRadius: '50%',
    background: '#ccc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  };

  const menuStyle = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  };

  const buttonStyle = {
    padding: '12px 24px',
    fontSize: 16,
    cursor: 'pointer',
  };

  return (
    <div style={containerStyle}>
      <div style={profileStyle}>
        <div style={avatarStyle}>
          {player ? player.profile.name.charAt(0) : 'P'}
        </div>
        <span>{player ? player.profile.name : 'Player'}</span>
      </div>

      <h1>Main Menu</h1>
      <ul style={menuStyle}>
        <li>
          <button style={buttonStyle}>Mission Selection</button>
        </li>
        <li>
          <button style={buttonStyle}>Deck Editor</button>
        </li>
        <li>
          <button style={buttonStyle}>Inventory</button>
        </li>
        <li>
          <button style={buttonStyle}>Mission Editor</button>
        </li>
      </ul>

      {player && (
        <div style={{ marginTop: 32, textAlign: 'left' }}>
          <h2>Deck ({player.deck.length})</h2>
          <ul>
            {player.deck.map((card) => (
              <li key={card.id}>{card.name}</li>
            ))}
          </ul>
          <h2>Inventory</h2>
          <ul>
            {player.inventory.items.map((item) => (
              <li key={item.id}>
                {item.name} x{item.quantity}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

