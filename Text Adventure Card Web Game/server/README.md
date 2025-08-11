# Server

This directory contains a minimal Express server that can be expanded to support the Text Adventure Card Web Game.  The current implementation serves mission JSON files located in `../assets/missions` via a simple REST endpoint.

## Setup

Install dependencies and start the server:

```bash
npm install
npm run start
```

The server will run on `http://localhost:4000` by default.

## API Endpoints

* `GET /missions/:missionId` – returns the mission JSON for the given `missionId`, or a 404 if not found.  For example, `GET /missions/whispering_corridors` will return `whispering_corridors.json`.

You can expand this server with additional endpoints for saving progress, running game logic, authentication and more.