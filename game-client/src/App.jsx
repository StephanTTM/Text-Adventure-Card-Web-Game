import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainMenu from './pages/MainMenu';
import DeckBuilder from './pages/DeckBuilder';
import MissionEditor from './pages/MissionEditor';
import MissionSelection from './pages/MissionSelection';
import examplePlayer from '../../assets/players/example_player.json';

export default function App() {
  const player = examplePlayer;

  return (
    <Routes>
      <Route path="/" element={<MainMenu player={player} />} />
      <Route path="/deck" element={<DeckBuilder player={player} />} />
      <Route path="/mission-editor" element={<MissionEditor player={player} />} />
      <Route path="/missions" element={<MissionSelection />} />
    </Routes>
  );
}
