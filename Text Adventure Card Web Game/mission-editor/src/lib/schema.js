// Constants describing game model, node types and helper builders.

export const NODE_TYPES = [
  'scene',
  'npc',
  'lock',
  'event',
  'battle',
  'trap',
  'loot',
  'shop',
  'transition',
  'end',
];

export const STAT_NAMES = ['STR', 'AGI', 'END', 'MND', 'CHA', 'LCK'];

export const REQUIREMENT_TYPES = [
  'stat_at_least',
  'has_ability',
  'has_tag',
  'faction_is',
  'flag_set',
  'flag_not_set',
  'has_item_tag',
  'roll_under',
];

export const OUTCOME_TYPES = [
  'move_room',
  'reveal_node',
  'hide_node',
  'set_flag',
  'clear_flag',
  'grant_item',
  'grant_card',
  'grant_info',
  'grant_xp',
  'apply_status',
  'start_battle',
  'end_mission',
  'play_scene_fx',
];

/**
 * Helper to build a new node with sensible defaults.
 * @param {string} type Node type
 * @param {string} roomId Parent room id
 */
export function createNode(type, roomId) {
  return {
    id: `${type}_${Date.now()}`,
    type,
    room_id: roomId,
    title: `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
    text: '',
    entry_conditions: [],
    choices: [],
  };
}