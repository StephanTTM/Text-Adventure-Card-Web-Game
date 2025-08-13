# Mission Editor Node Graph

The mission editor represents stories as a graph of rooms and nodes. When starting a new mission from an empty graph, narrative designers should set up the following structure to ensure the mission can be saved and played:

1. **Create a room** to contain the opening sequence of the mission.
2. **Add a mission intro node** within that room. This node:
   - Has no entry requirements so it is available to all players by default.
   - Acts as the default starting point of the mission.
   - Allows for additional starting nodes in other rooms in the future for players who possess certain tags or meet specific requirements.
3. **Connect the intro node** to other nodes as desired, but ensure that every path ultimately leads to an **end mission node**.

Following this pattern guarantees a valid starting point while leaving flexibility for multiple start points and branching paths as the mission evolves.
