# Text Adventure Card Web Game

This repository contains the foundational structure for a card‑driven text adventure web game.  It’s organized as a multi‑package project to separate concerns between the game client and shared assets.  Use this scaffold as a starting point for further development.

## Project Structure

```
Text Adventure Card Web Game/
├── game-client/       # Front‑end game runtime (placeholder)
├── assets/            # Shared art, music and mission data
├── docs/              # Design documentation and schemas
├── README.md          # Project overview (this file)
└── .gitignore         # Files and folders to be excluded from version control
```

### game-client

A future React application that will present missions to players.  This folder currently contains minimal boilerplate to get started with Vite and React.  It will eventually house the runtime for your text adventure game, including card decks, stat checks and UI components.

### assets

This directory holds shared resources including missions, images and music.  A sample mission (`whispering_corridors.json`) is provided under `assets/missions/`.

### docs

Documentation for the project.  You can describe the mission schema, game rules, API contracts, or any other information relevant to development.

## Deck Composition

Player decks have fixed slots to ensure consistent gameplay balance. A complete deck contains:

- **1 Character card** – defines class, race/species, core stats, abilities and the primary attack.
- **1 Weapon card** – modifies attacks and can grant additional skills.
- **3 Equipment cards** – one each for **Boots**, **Gloves** and **Body** armor.
- **2 Accessory cards** – such as pets, relics, charms or similar items.
- **1 Utility card** – provides bonuses, unlocks or a multiclass option.

## Character Cards

Character cards define the hero leading a deck. Each stat starts at **5** and is modified by species and class choices. The available stats are:

- **STR** – physical power
- **AGI** – agility and reflexes
- **INT** – intellect
- **END** – endurance and toughness
- **CHA** – charisma and social influence
- **LCK** – luck and fortune
- **ATK** – physical attack strength
- **DEF** – physical defense
- **SPATK** – special or magical attack
- **SPDEF** – resistance to special attacks
- **SPD** – movement speed

Character cards also list abilities and the primary attack. See `assets/players/example_player.json` for a sample.

## Getting Started

Each sub‑package (`game-client`) has its own `package.json`.  To install dependencies and run a development server:

```bash
cd game-client
npm install
npm run dev
```

Repeat for `game-client` as you flesh out that package.

## Contributing

Please add additional documentation, code, and assets as the project evolves.  Pull requests and code reviews should be targeted to the appropriate sub‑package.
