import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';

const app = express();
const PORT = process.env.PORT || 4000;

// Serve static mission and player JSON files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const missionsDir = path.resolve(__dirname, '../../assets/missions');
const playersDir = path.resolve(__dirname, '../../assets/players');

app.get('/missions/:missionId', async (req, res) => {
  const id = req.params.missionId;
  try {
    const file = await readFile(path.join(missionsDir, `${id}.json`), 'utf-8');
    res.json(JSON.parse(file));
  } catch {
    res.status(404).json({ error: 'Mission not found' });
  }
});

app.get('/players/:playerId', async (req, res) => {
  const id = req.params.playerId;
  try {
    const file = await readFile(path.join(playersDir, `${id}.json`), 'utf-8');
    res.json(JSON.parse(file));
  } catch {
    res.status(404).json({ error: 'Player not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
