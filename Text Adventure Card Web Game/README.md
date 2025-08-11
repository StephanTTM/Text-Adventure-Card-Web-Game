# Text Adventure Card Web Game

This repository contains the foundational structure for a card‑driven text adventure web game.  It’s organized as a multi‑package project to separate concerns between the mission editor, the game client, backend services, and shared assets.  Use this scaffold as a starting point for further development.

## Project Structure

```
Text Adventure Card Web Game/
├── mission-editor/    # Stand‑alone React app for authoring missions
├── game-client/       # Front‑end game runtime (placeholder)
├── server/            # Backend services (placeholder)
├── assets/            # Shared art, music and mission data
├── docs/              # Design documentation and schemas
├── README.md          # Project overview (this file)
└── .gitignore         # Files and folders to be excluded from version control
```

### mission-editor

This folder contains a Vite + React application that provides a mission node graph editor.  It allows you to import/export JSON missions, edit rooms and nodes, visualize mission flow as a node graph and run basic validation.  See the `mission-editor/README.md` for details on running and developing the editor.

### game-client

A future React application that will present missions to players.  This folder currently contains minimal boilerplate to get started with Vite and React.  It will eventually house the runtime for your text adventure game, including card decks, stat checks and UI components.

### server

Placeholder for backend services such as saving progress, serving mission data, or handling multiplayer features.  It currently includes a minimal Express setup.  Expand this as needed.

### assets

This directory holds shared resources including missions, images and music.  A sample mission (`whispering_corridors.json`) is provided under `assets/missions/`.

### docs

Documentation for the project.  You can describe the mission schema, game rules, API contracts, or any other information relevant to development.

## Getting Started

Each sub‑package (`mission-editor`, `game-client`, `server`) has its own `package.json`.  To install dependencies and run a development server:

```bash
cd mission-editor
npm install
npm run dev
```

Repeat for `game-client` and `server` as you flesh out those packages.

## Contributing

Please add additional documentation, code, and assets as the project evolves.  Pull requests and code reviews should be targeted to the appropriate sub‑package.