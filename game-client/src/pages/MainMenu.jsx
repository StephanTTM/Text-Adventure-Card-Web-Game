import React from 'react';
import Card from '../components/Card';

export default function MainMenu({ player, onOpenDeckBuilder }) {
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

  if (!player) {
    return <div style={containerStyle}>Loading...</div>;
  }

  const deck = [
    player.deck.character,
    player.deck.weapon,
    ...Object.values(player.deck.equipment || {}),
    ...player.deck.accessories,
    player.deck.utility,
  ].filter(Boolean);

  return (
    <div style={containerStyle}>
      <div style={profileStyle}>
        <div style={avatarStyle}>{player.profile.name.charAt(0)}</div>
        <span>{player.profile.name}</span>
      </div>

      <h1>Main Menu</h1>
      <ul style={menuStyle}>
        <li>
          <button style={buttonStyle}>Mission Selection</button>
        </li>
        <li>
          <button style={buttonStyle} onClick={onOpenDeckBuilder}>
            Deck Editor
          </button>
        </li>
        <li>
          <button style={buttonStyle}>Inventory</button>
        </li>
        <li>
          <button style={buttonStyle}>Mission Editor</button>
        </li>
      </ul>

      <div style={{ marginTop: 32, textAlign: 'left' }}>
        <h2>Deck ({deck.length})</h2>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {deck.map((card) => (
            <Card key={card.id} card={card} />
          ))}
        </div>
      </div>
    </div>
  );
}
