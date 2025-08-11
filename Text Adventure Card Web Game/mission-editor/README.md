# Mission Editor

This package provides a visual editor for authoring missions used by the Text Adventure Card Web Game.  It’s built with Vite, React and React Flow.  You can import an existing mission JSON file, modify rooms and nodes, validate mission structure, and export your changes back to JSON.

## Setup

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

The editor will launch on `http://localhost:3000` by default.

## Usage

* **Load a mission**: On first launch the editor shows an empty state.  Click **Load Sample Mission** to load the provided example or paste your own JSON into the import panel.
* **Rooms panel**: Create new rooms, select a room to edit its details and exits, and specify which nodes appear automatically when the room is entered.
* **Node palette**: Add new nodes of various types (scene, npc, battle, etc.) to the selected room.
* **Graph canvas**: Visualize and lay out your story graph.  Nodes are grouped by room horizontally.  Click a node to edit it in the inspector.  Connections are drawn based on `reveal_node` outcomes on choices.
* **Inspector**: Edit properties of the selected node, including its title, text, entry conditions and choices.  Conditions and outcomes are edited as raw JSON arrays for flexibility.
* **Validation panel**: See a list of validation issues in real time, such as unreachable rooms or nodes missing outcomes.
* **Playtest**: Use the button in the footer to highlight unreachable nodes.  Further playtest functionality can be added later.

## Files

* `src/App.jsx` – top‑level application that orchestrates the UI.
* `src/components/` – React components for the graph, panels and editor controls.
* `src/lib/` – mission schema constants and validation logic.
* `src/assets/defaultMission.json` – the sample mission loaded when you click **Load Sample Mission**.

## Extending

This editor is designed to be extended.  Consider adding support for additional outcome types, a prettier JSON editor (e.g. with Monaco), or saving missions to a backend service.  You can also integrate custom node types for different mission mechanics.