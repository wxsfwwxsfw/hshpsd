// L22 - 连环
// 第十二关：三蜘蛛+双门，门G1开启后才能到达开关2，路线环环相扣
import { ENTITY_DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, TILE_TYPE_ENUM } from './../Enum';

const map = [
    [{ type: TILE_TYPE_ENUM.WALL, name: '' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_left_0' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_left_1' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_left_0' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_left_1' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_left_0' }, { type: TILE_TYPE_ENUM.WALL, name: '' }],
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_1' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=3 开关2 O
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=4 开关1 O
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_2_1' },  // y=5
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_2' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=2 蜘蛛A H→（石块x=4,y=2挡）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=3 地刺T1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=4
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },  // y=5
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.FLOOR, name: 'd_0_2' },  // y=0 出口门
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=1 机关门G2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=2 机关门G1（开启后通往开关2）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=3 地刺T2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=4
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },  // y=5 玩家P
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_5' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=3 石块S（挡蜘蛛B）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=4 地刺T3
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },  // y=5
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_6' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },  // y=1 钥匙K
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },  // y=2 蜘蛛C H↓（威胁x=5,y=3..5）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },  // y=3 蜘蛛B H←（石块x=4,y=3挡）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },  // y=4
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_2_2' },  // y=5
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [{ type: TILE_TYPE_ENUM.WALL, name: '' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_right_0' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_right_1' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_right_0' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_right_1' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_right_0' }, { type: TILE_TYPE_ENUM.WALL, name: '' }],
]

const player = { type: ENTITY_TYPE_ENUM.PLAYER, x: 3, y: 5, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE }
const doors = [{ type: ENTITY_TYPE_ENUM.DOOR, x: 3, y: 0, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE }]
const key = { type: ENTITY_TYPE_ENUM.KEY, x: 5, y: 1, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE }

// A x=2,y=2 RIGHT（石块x=3,y=2挡 → x=4..5,y=2安全）
// B x=5,y=3 LEFT（石块x=4,y=3挡 → x=1..3,y=3安全）
// C x=5,y=2 DOWN（威胁x=5,y=3..5；钥匙在y=1安全）
const spiders = [
    { type: ENTITY_TYPE_ENUM.SPIDER, x: 2, y: 2, dir: ENTITY_DIRECTION_ENUM.RIGHT, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.SPIDER, x: 5, y: 3, dir: ENTITY_DIRECTION_ENUM.LEFT, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.SPIDER, x: 5, y: 2, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE },
]

// G1 x=3,y=2 ATTACK → 开关1 x=1,y=4 （门G1开后可向上穿越，再达开关2）
// G2 x=3,y=1 ATTACK → 开关2 x=1,y=3 （门G2开后方可出口）
const floor_traps = [
    { type: ENTITY_TYPE_ENUM.FLOOR_TRAP, x: 3, y: 2, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.ATTACK, entityId: 'l22_ft_1' },
    { type: ENTITY_TYPE_ENUM.FLOOR_TRAP, x: 3, y: 1, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.ATTACK, entityId: 'l22_ft_2' },
]
const floor_trap_switches = [
    { type: ENTITY_TYPE_ENUM.FLOOR_TRAP_SWITCH, x: 1, y: 4, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, entityId: 'l22_ft_1' },
    { type: ENTITY_TYPE_ENUM.FLOOR_TRAP_SWITCH, x: 1, y: 3, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, entityId: 'l22_ft_2' },
]

// T1 x=2,y=3（路过开关2必经）T2 x=3,y=3（穿越中段）T3 x=4,y=4（强行绕路的代价）
const floor_spikes = [
    { type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_ONE, x: 2, y: 3, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, numCurrent: 0 },
    { type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_ONE, x: 3, y: 3, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, numCurrent: 0 },
    { type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_ONE, x: 4, y: 4, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, numCurrent: 0 },
]

// 石块x=4,y=2挡蜘蛛A（x=5,y=2安全）；石块x=4,y=3挡蜘蛛B（x=1..3,y=3安全）
const stones = [
    { type: ENTITY_TYPE_ENUM.STONE, x: 4, y: 2, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.STONE, x: 4, y: 3, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
]

export default { map, player, doors, key, spiders, floor_traps, floor_trap_switches, floor_spikes, stones }
