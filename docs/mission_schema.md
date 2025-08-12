# Mission Schema

Missions define the content and structure of a text adventure.  They are encoded as JSON objects containing metadata, rooms, nodes, NPCs and other assets.  Below is an overview of the core fields; see the sample mission (`whispering_corridors.json`) for a concrete example.

## Top‑Level Fields

| Field            | Type    | Description                                         |
|------------------|---------|-----------------------------------------------------|
| `id`             | string  | Unique identifier for the mission                   |
| `title`          | string  | Human‑readable mission title                        |
| `start_room_id`  | string  | ID of the room where the mission begins            |
| `version`        | number  | Schema version for potential migrations            |
| `rooms`          | array   | List of rooms present in the mission                |
| `nodes`          | array   | List of story nodes (scenes, events, etc.)          |
| `npcs`           | array   | Optional list of NPC definitions                    |
| `battle_templates` | array | Optional list of battle template definitions       |
| `loot_tables`    | array   | Optional list of loot table definitions             |

## Rooms

A room groups together nodes and defines connections to other rooms.

| Field        | Type    | Description                                          |
|--------------|---------|------------------------------------------------------|
| `id`         | string  | Unique room identifier                               |
| `name`       | string  | Display name for the room                            |
| `art`        | string  | Optional path to background art                      |
| `music`      | string  | Optional path to background music                    |
| `exits`      | array   | List of exits; each has `to` (room id) and `label`   |
| `auto_nodes` | array   | IDs of nodes that are automatically revealed on entry |

## Nodes

Nodes represent individual pieces of narrative or gameplay.  Each node belongs to a room and has a type.  Common fields include:

| Field              | Type      | Description                                                        |
|--------------------|-----------|--------------------------------------------------------------------|
| `id`               | string    | Unique node identifier                                             |
| `type`             | string    | Node type (e.g. `scene`, `npc`, `battle`, `loot`, `end`, etc.)      |
| `room_id`          | string    | ID of the containing room                                          |
| `title`            | string    | Title used for display in the editor                               |
| `text`             | string    | Narrative text shown to the player                                 |
| `entry_conditions` | array     | Conditions that must be met to reveal this node                    |
| `choices`          | array     | List of choices available to the player, each with outcomes        |
| `battle_id`        | string    | For `battle` nodes, the id of the battle template                  |

### Choices

A choice typically consists of a label, optional entry conditions and one or more outcomes.  Outcomes are JSON objects keyed by outcome type (e.g. `reveal_node`, `move_room`, `grant_item`, etc.).  The mission engine interprets these outcomes to control the flow of the game.

This schema is intentionally flexible; additional fields can be added as needed for new mechanics.  Validation logic in the editor helps ensure references are correct and that missions are playable.