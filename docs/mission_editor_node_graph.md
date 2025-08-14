# Mission Editor Node Graph

The mission editor represents stories as a graph of rooms and nodes. When starting a new mission from an empty graph, narrative designers should set up the following structure to ensure the mission can be saved and played:

1. **Create a room** to contain the opening sequence of the mission.
2. **Add a mission intro node** within that room. This node:
   - Has no entry requirements so it is available to all players by default.
   - Acts as the default starting point of the mission.
   - Allows for additional starting nodes in other rooms in the future for players who possess certain tags or meet specific requirements.
3. **Connect the intro node** to other nodes as desired, but ensure that every path ultimately leads to an **end mission node**.

Following this pattern guarantees a valid starting point while leaving flexibility for multiple start points and branching paths as the mission evolves.

## Room Data

Each room acts as a container for nodes and defines how players transition to other locations. The mission editor stores room information using the following fields:

| Field        | Type   | Description                                                                  |
|------------- |--------|------------------------------------------------------------------------------|
| `id`         | string | Unique room identifier used by nodes and exits                              |
| `name`       | string | Display name shown in the editor                                            |
| `art`        | string | Optional path to background art                                             |
| `music`      | string | Optional background music track                                             |
| `exits`      | array  | List of exits; each has a `to` room id and `label` for the connection       |
| `auto_nodes` | array  | IDs of nodes that are automatically revealed when the room is entered       |

Example room JSON:

```json
{
  "id": "start",
  "name": "Entryway",
  "art": "img/entry.png",
  "music": "bgm/intro.mp3",
  "exits": [
    { "to": "hall", "label": "Hallway" }
  ],
  "auto_nodes": ["intro_node"]
}
```
