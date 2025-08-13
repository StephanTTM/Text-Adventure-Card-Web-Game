import React from 'react';
import { Link } from 'react-router-dom';
import DeckDisplay from '../components/DeckDisplay';

export default function MainMenu({ player }) {
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
          <Link to="/deck">
            <button style={buttonStyle}>Deck Editor</button>
          </Link>
        </li>
        <li>
          <button style={buttonStyle}>Inventory</button>
        </li>
        <li>
          <Link to="/mission-editor">
            <button style={buttonStyle}>Mission Editor</button>
          </Link>
        </li>
      </ul>

      <div style={{ marginTop: 32, textAlign: 'left' }}>
        <h2>Deck ({deckCount})</h2>
        <DeckDisplay deck={player.deck} />
      </div>
    </div>
  );
}
