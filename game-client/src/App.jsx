import React, { useEffect, useState } from 'react';
import MainMenu from './pages/MainMenu';
import DeckBuilder from './pages/DeckBuilder';

export default function App() {
  const [player, setPlayer] = useState(null);
  const [view, setView] = useState('menu');

  useEffect(() => {
    fetch('http://localhost:4000/players/example_player')
      .then((res) => res.json())
      .then(setPlayer)
      .catch((err) => console.error('Failed to load player', err));
  }, []);

  if (view === 'deck') {
    return <DeckBuilder player={player} onBack={() => setView('menu')} />;
  }

  return <MainMenu player={player} onOpenDeckBuilder={() => setView('deck')} />;
}
