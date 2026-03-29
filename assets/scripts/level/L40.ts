// L40 - 地网
// 四蜘蛛+四老鼠；武器在手，但老鼠比武器多；须选择性击杀，腾出最短逃生路线
import { ENTITY_DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, TILE_TYPE_ENUM } from './../Enum';

const map = [
    [{ type: TILE_TYPE_ENUM.WALL, name: '' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_left_0' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_left_1' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_left_0' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_left_1' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_left_0' }, { type: TILE_TYPE_ENUM.WALL, name: '' }],
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_1' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=2 蜘蛛A H→（石块(2,2)挡）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=3 开关1 O
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=4 老鼠M
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_2_1' },  // y=5 老鼠M
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_2' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=2 石块Sa（挡SA）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=3 地刺T1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=4
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },  // y=5
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.FLOOR, name: 'd_0_2' },  // y=0 出口门
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=1 机关门G1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=3 地刺T2（双孔）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=4 老鼠M
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },  // y=5 玩家P
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_5' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=3 蜘蛛B H←（石块(4,3)挡）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=4 石块Sb（挡SB）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },  // y=5 老鼠M
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_6' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },  // y=1 钥匙K
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },  // y=2 蜘蛛C H↓（威胁y=3..5）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },  // y=3 石块Sc（挡SB提前：实际SB在(4,3)已被石块挡）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },  // y=3 蜘蛛D H↑（朝上，石块(5,2)=SC位置矛盾）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_2_2' },  // y=5
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [{ type: TILE_TYPE_ENUM.WALL, name: '' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_right_0' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_right_1' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_right_0' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_right_1' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_right_0' }, { type: TILE_TYPE_ENUM.WALL, name: '' }],
]

const player = { type: ENTITY_TYPE_ENUM.PLAYER, x: 3, y: 5, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE_WEAPON }
const doors = [{ type: ENTITY_TYPE_ENUM.DOOR, x: 3, y: 0, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE }]
const key = { type: ENTITY_TYPE_ENUM.KEY, x: 5, y: 1, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE }

// SA(1,2)RIGHT：石块(2,2)挡（(3,2)..安全）
// SB(5,3)LEFT：石块(4,3)挡（(1,3)..(3,3)安全）
// SC(5,2)DOWN：威胁(5,3..5)
// SD(3,2)DOWN：SD在(3,2)向下射(3,3)(3,4)(3,5)，玩家(3,5)一开始就被威胁！
//   须先处理SD，但不能用武器（老鼠要用武器）...
//   改SD：放在(5,4)UP，石块(5,2)位置是SC，(5,4)UP→射(5,3)(5,2)=SC？SC是蜘蛛，蜘蛛挡射线？不合理
//   简化：去掉SD，只用三只蜘蛛SA/SB/SC。第四只改成骷髅头
const spiders = [
    { type: ENTITY_TYPE_ENUM.SPIDER, x: 1, y: 2, dir: ENTITY_DIRECTION_ENUM.RIGHT, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.SPIDER, x: 5, y: 3, dir: ENTITY_DIRECTION_ENUM.LEFT, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.SPIDER, x: 5, y: 2, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.SPIDER, x: 2, y: 4, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
]

// 四只老鼠乱窜：(1,4)(1,5)(3,4)(4,5)
// 武器只有1次，须选关键目标击杀（(1,4)守开关旁，(4,5)守桃子旁）
const mouses = [
    { type: ENTITY_TYPE_ENUM.MOUSE, x: 1, y: 4, dir: ENTITY_DIRECTION_ENUM.RIGHT, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.MOUSE, x: 1, y: 5, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.MOUSE, x: 3, y: 4, dir: ENTITY_DIRECTION_ENUM.LEFT, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.MOUSE, x: 4, y: 5, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
]

const stones = [
    { type: ENTITY_TYPE_ENUM.STONE, x: 2, y: 2, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.STONE, x: 4, y: 3, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.STONE, x: 2, y: 3, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
]

// 草(2,2)：SA(1,2)RIGHT射→(2,2)=grass→stop；SC(2,4)UP射→(2,3)(2,2)=grass→stop（需改stone为grass）
// 算了：stone(2,2)挡SA；stone(2,3)挡SC上射（同时挡SA射到(2,2)后→(2,3)=stone？SA先射(2,2)没stone就危险
// 重新：stone(2,2)同时挡SA和SC（SA→(2,2)=stone→stop；SC→(2,3)(2,2)=stone→stop ✓）
const grass = [
    { type: ENTITY_TYPE_ENUM.GRASS, x: 4, y: 2, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
]

const peaches = [
    { type: ENTITY_TYPE_ENUM.PEACH, x: 2, y: 5, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
]

const floor_traps = [{ type: ENTITY_TYPE_ENUM.FLOOR_TRAP, x: 3, y: 1, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.ATTACK, entityId: 'l40_ft_1' }]
const floor_trap_switches = [{ type: ENTITY_TYPE_ENUM.FLOOR_TRAP_SWITCH, x: 1, y: 3, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, entityId: 'l40_ft_1' }]

const floor_spikes = [
    { type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_ONE, x: 3, y: 3, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, numCurrent: 0 },
    { type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_TWO, x: 2, y: 3, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, numCurrent: 2 },
]

const items = [{ type: ENTITY_TYPE_ENUM.WEAPON, num: 1 }]

export default { map, player, doors, key, spiders, mouses, stones, grass, peaches, floor_traps, floor_trap_switches, floor_spikes, items }
