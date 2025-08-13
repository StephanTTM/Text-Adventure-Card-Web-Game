import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainMenu from './pages/MainMenu';
import DeckBuilder from './pages/DeckBuilder';
import MissionEditor from './pages/MissionEditor';

export default function App() {
  const [player, setPlayer] = useState(null);

  const fallbackPlayer = {
    profile: { name: 'Test Player' },
    deck: { character: null, weapon: null, equipment: {}, accessories: [], utility: null },
  };

  useEffect(() => {
    async function loadPlayer() {
      try {
        const res = await fetch('http://localhost:4000/players/example_player');
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        setPlayer(data);
      } catch (err) {
        console.error('Failed to load player', err);
        setPlayer(fallbackPlayer);
      }
    }

    loadPlayer();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<MainMenu player={player} />} />
      <Route path="/deck" element={<DeckBuilder player={player} />} />
      <Route path="/mission-editor" element={<MissionEditor player={player} />} />
    </Routes>
  );
}
