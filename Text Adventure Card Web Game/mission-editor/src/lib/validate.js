// Validation logic for missions.

/**
 * Validate a mission object and return a set of issues and unreachable info.
 * @param {Object} mission Mission object
 * @returns {Object} { issues: string[], unreachableRooms: string[], unreachableNodeIds: string[] }
 */
export function validateMission(mission) {
  const issues = [];
  const roomsById = new Map();
  const nodesById = new Map();

  // Index rooms and nodes
  if (Array.isArray(mission.rooms)) {
    mission.rooms.forEach((room) => {
      roomsById.set(room.id, room);
    });
  }
  if (Array.isArray(mission.nodes)) {
    mission.nodes.forEach((node) => {
      nodesById.set(node.id, node);
    });
  }

  // start_room_id must exist
  if (!mission.start_room_id || !roomsById.has(mission.start_room_id)) {
    issues.push('Mission start_room_id does not exist');
  }

  // At least one end node
  let hasEnd = false;
  for (const node of nodesById.values()) {
    if (node.type === 'end') {
      hasEnd = true;
      break;
    }
    // also treat nodes with outcome end_mission as end
    if (Array.isArray(node.choices)) {
      for (const choice of node.choices) {
        if (choice.outcomes && choice.outcomes.some((oc) => oc.end_mission)) {
          hasEnd = true;
          break;
        }
      }
    }
    if (hasEnd) break;
  }
  if (!hasEnd) {
    issues.push('Mission has no end node (type end or outcome end_mission)');
  }

  // Every node’s room_id must exist
  for (const node of nodesById.values()) {
    if (!node.room_id || !roomsById.has(node.room_id)) {
      issues.push(`Node ${node.id} references unknown room_id ${node.room_id}`);
    }
  }

  // Reachability: compute reachable rooms via exits
  const reachableRooms = new Set();
  const queue = [];
  if (mission.start_room_id && roomsById.has(mission.start_room_id)) {
    queue.push(mission.start_room_id);
    reachableRooms.add(mission.start_room_id);
    while (queue.length) {
      const rid = queue.shift();
      const room = roomsById.get(rid);
      if (room && Array.isArray(room.exits)) {
        for (const ex of room.exits) {
          if (ex.to && !reachableRooms.has(ex.to) && roomsById.has(ex.to)) {
            reachableRooms.add(ex.to);
            queue.push(ex.to);
          }
        }
      }
    }
  }

  const unreachableRooms = [];
  for (const rid of roomsById.keys()) {
    if (!reachableRooms.has(rid)) unreachableRooms.push(rid);
  }
  if (unreachableRooms.length > 0) {
    issues.push(`Unreachable rooms: ${unreachableRooms.join(', ')}`);
  }

  // Nodes in unreachable rooms
  const unreachableNodeIds = [];
  for (const node of nodesById.values()) {
    if (unreachableRooms.includes(node.room_id)) {
      unreachableNodeIds.push(node.id);
    }
  }
  if (unreachableNodeIds.length > 0) {
    issues.push(`Nodes in unreachable rooms: ${unreachableNodeIds.join(', ')}`);
  }

  // Choice sanity: each choice must have at least one outcome (or success/fail outcomes)
  for (const node of nodesById.values()) {
    if (Array.isArray(node.choices)) {
      node.choices.forEach((choice, idx) => {
        const hasSuccess = choice.success && Array.isArray(choice.success);
        const hasFailure = choice.failure && Array.isArray(choice.failure);
        const hasOutcomes = choice.outcomes && Array.isArray(choice.outcomes) && choice.outcomes.length > 0;
        if (!hasOutcomes && !hasSuccess && !hasFailure) {
          issues.push(`Node ${node.id} choice #${idx + 1} has no outcomes`);
        }
      });
    }
  }

  // Battle nodes must reference existing battle template
  if (Array.isArray(mission.battle_templates)) {
    const battles = new Set(mission.battle_templates.map((bt) => bt.id));
    for (const node of nodesById.values()) {
      if (node.type === 'battle') {
        const battleId = node.battle_id;
        if (!battleId || !battles.has(battleId)) {
          issues.push(`Battle node ${node.id} has invalid battle_id ${battleId}`);
        }
      }
    }
  }

  return { issues, unreachableRooms, unreachableNodeIds };
}