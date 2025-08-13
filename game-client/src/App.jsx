import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainMenu from './pages/MainMenu';
import DeckBuilder from './pages/DeckBuilder';
import MissionEditor from './pages/MissionEditor';
import MissionSelection from './pages/MissionSelection';
import MissionPlayer from './pages/MissionPlayer';
import MissionResults from './pages/MissionResults';
import examplePlayer from '../../assets/players/example_player.json';

export default function App() {
  const [player, setPlayer] = useState(() => {
    try {
      const saved = localStorage.getItem('player');
      return saved ? JSON.parse(saved) : examplePlayer;
    } catch {
      return examplePlayer;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('player', JSON.stringify(player));
    } catch {
      // ignore write errors
    }
  }, [player]);

  return (
    <Routes>
      <Route path="/" element={<MainMenu player={player} />} />
      <Route path="/deck" element={<DeckBuilder player={player} setPlayer={setPlayer} />} />
      <Route path="/mission-editor" element={<MissionEditor player={player} />} />
      <Route path="/missions" element={<MissionSelection />} />
      <Route path="/missions/:missionId" element={<MissionPlayer player={player} />} />
      <Route path="/missions/:missionId/results" element={<MissionResults />} />
    </Routes>
  );
}
