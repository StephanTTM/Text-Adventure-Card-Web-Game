import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainMenu from './pages/MainMenu';
import DeckBuilder from './pages/DeckBuilder';
import MissionEditor from './pages/MissionEditor';

export default function App() {
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/players/example_player')
      .then((res) => res.json())
      .then(setPlayer)
      .catch((err) => console.error('Failed to load player', err));
  }, []);

  return (
    <Routes>
      <Route path="/" element={<MainMenu player={player} />} />
      <Route path="/deck" element={<DeckBuilder player={player} />} />
      <Route path="/mission-editor" element={<MissionEditor player={player} />} />
    </Routes>
  );
}
