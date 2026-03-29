// L32 - 交叉封锁
// 四蜘蛛交叉覆盖，每条路线均受威胁，须精确利用两个石块开辟唯一通道
import { ENTITY_DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, TILE_TYPE_ENUM } from './../Enum';

const map = [
    [{ type: TILE_TYPE_ENUM.WALL, name: '' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_left_0' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_left_1' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_left_0' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_left_1' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_left_0' }, { type: TILE_TYPE_ENUM.WALL, name: '' }],
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_1' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=2 蜘蛛A H→
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=3 开关1 O
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=4 开关2 O
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_2_1' },  // y=5
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_2' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=2 石块Sa（挡SA：SA射(2,2)→stop）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=3 地刺T1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=4 蜘蛛C H↑（朝上，石块Sb(2,3)挡）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },  // y=5
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.FLOOR, name: 'd_0_2' },  // y=0 出口门
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=1 机关门G2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=2 机关门G1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=3 地刺T2（双孔）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=4
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },  // y=5 玩家P
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_5' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=3 地刺T3
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=4 石块Sb（挡SC上射）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },  // y=5
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_6' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },  // y=1 钥匙K
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },  // y=2 蜘蛛D H↓（威胁y=3..5）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },  // y=3 蜘蛛B H←（需桃子遮挡）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },  // y=4
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_2_2' },  // y=5
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [{ type: TILE_TYPE_ENUM.WALL, name: '' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_right_0' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_right_1' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_right_0' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_right_1' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_right_0' }, { type: TILE_TYPE_ENUM.WALL, name: '' }],
]

const player = { type: ENTITY_TYPE_ENUM.PLAYER, x: 3, y: 5, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE }
const doors = [{ type: ENTITY_TYPE_ENUM.DOOR, x: 3, y: 0, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE }]
const key = { type: ENTITY_TYPE_ENUM.KEY, x: 5, y: 1, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE }

// SA x=1,y=2 RIGHT：石块(2,2)挡→(3,2)..安全
// SB x=5,y=3 LEFT：桃子落(4,3)遮挡→(1,3)..(3,3)安全
// SC x=2,y=4 UP：石块(2,3)挡（注意：SC在(2,4)向上射，先射(2,3)=石块→stop）→(2,2)..安全不受SC
//   等等：stone在(2,2)挡的是SA，stone在(4,4)挡SC。重新分配：
//   SC x=2,y=4 UP：射(2,3)(2,2)=stone Sa→stop，(2,1)安全，(2,3)危险
//   但(2,3)有地刺，所以本来就不希望玩家在那
// SD x=5,y=2 DOWN：威胁(5,3)(5,4)(5,5)
const spiders = [
    { type: ENTITY_TYPE_ENUM.SPIDER, x: 1, y: 2, dir: ENTITY_DIRECTION_ENUM.RIGHT, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.SPIDER, x: 5, y: 3, dir: ENTITY_DIRECTION_ENUM.LEFT, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.SPIDER, x: 2, y: 4, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.SPIDER, x: 5, y: 2, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE },
]

// 桃子遮SB：x=1,y=5，站(4,4)投UP，草(4,2)控落点(4,3)
const peaches = [{ type: ENTITY_TYPE_ENUM.PEACH, x: 1, y: 5, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE }]
const grass = [{ type: ENTITY_TYPE_ENUM.GRASS, x: 4, y: 2, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE }]

// Sa (2,2)：挡SA右射；Sb (4,4)：挡SC上射（SC在(2,4)向上，但石块要在SC射线上：x=2,y=3? 不对）
// 重新：SC在(2,4)向UP，射线为(2,3),(2,2),(2,1)。石块(2,2)能挡SA也能挡SC（SA从x=1,y=2向RIGHT：(2,2)=stone→stop；SC从x=2,y=4向UP：(2,3),(2,2)=stone→stop。(2,1)安全）
// 因此石块(2,2)双重防护！但SC仍威胁(2,3)
const stones = [
    { type: ENTITY_TYPE_ENUM.STONE, x: 2, y: 2, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.STONE, x: 4, y: 4, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
]

// G1 x=3,y=2 → 开关1 x=1,y=3（SC威胁(2,3)，玩家走(1,3)踩开关）
// G2 x=3,y=1 → 开关2 x=1,y=4（需在(1,4)踩）
const floor_traps = [
    { type: ENTITY_TYPE_ENUM.FLOOR_TRAP, x: 3, y: 2, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.ATTACK, entityId: 'l32_ft_1' },
    { type: ENTITY_TYPE_ENUM.FLOOR_TRAP, x: 3, y: 1, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.ATTACK, entityId: 'l32_ft_2' },
]
const floor_trap_switches = [
    { type: ENTITY_TYPE_ENUM.FLOOR_TRAP_SWITCH, x: 1, y: 3, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, entityId: 'l32_ft_1' },
    { type: ENTITY_TYPE_ENUM.FLOOR_TRAP_SWITCH, x: 1, y: 4, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, entityId: 'l32_ft_2' },
]

const floor_spikes = [
    { type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_ONE, x: 2, y: 3, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, numCurrent: 0 },
    { type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_TWO, x: 3, y: 3, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, numCurrent: 1 },
    { type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_ONE, x: 4, y: 3, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, numCurrent: 2 },
]

export default { map, player, doors, key, spiders, peaches, grass, stones, floor_traps, floor_trap_switches, floor_spikes }
