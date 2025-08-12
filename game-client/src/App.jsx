import React from 'react';

export default function App() {
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
        <div style={avatarStyle}>P</div>
        <span>Player</span>
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
    </div>
  );
}

