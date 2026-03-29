// L35 - 蛛阵
// 四蜘蛛+三桃，需精确投掷顺序；四地刺节奏各异；双门连锁
import { ENTITY_DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, TILE_TYPE_ENUM } from './../Enum';

const map = [
    [{ type: TILE_TYPE_ENUM.WALL, name: '' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_left_0' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_left_1' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_left_0' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_left_1' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_left_0' }, { type: TILE_TYPE_ENUM.WALL, name: '' }],
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_1' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=1 地刺T4
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=2 蜘蛛A H→
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=3 开关1 O
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=4 开关2 O
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_2_1' },  // y=5 桃子A
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_2' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },  // y=2 草Ca（桃A停(2,3)）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=3 地刺T1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=4 桃子B（站(2,4)UP投，草Ca停(2,3)...矛盾）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=5
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.FLOOR, name: 'd_0_2' },  // y=0 出口门
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=1 机关门G2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=2 机关门G1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=3 地刺T2（三孔）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=4
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },  // y=5 玩家P
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_5' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },  // y=2 草Cb（桃B/C停(4,3)）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=3 地刺T3
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=4 桃子C
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },  // y=5
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_6' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },  // y=1 钥匙K
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },  // y=2 蜘蛛D H↓
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },  // y=3 蜘蛛B H←
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },  // y=4 蜘蛛C H↑（朝上，桃落(5,3)挡？）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_2_2' },  // y=5
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [{ type: TILE_TYPE_ENUM.WALL, name: '' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_right_0' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_right_1' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_right_0' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_right_1' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_right_0' }, { type: TILE_TYPE_ENUM.WALL, name: '' }],
]

const player = { type: ENTITY_TYPE_ENUM.PLAYER, x: 3, y: 5, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE }
const doors = [{ type: ENTITY_TYPE_ENUM.DOOR, x: 3, y: 0, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE }]
const key = { type: ENTITY_TYPE_ENUM.KEY, x: 5, y: 1, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE }

// SA x=1,y=2 RIGHT：桃A(1,5)→站(2,4)UP投，草(2,2)→桃停(2,3)，遮SA y=2行x=1以右
// SB x=5,y=3 LEFT：桃B落(4,3)遮，草(4,2)控落点
// SC x=5,y=4 UP：SC在(5,4)向上，射(5,3)(5,2)(5,1)...钥匙在(5,1)危险！
//   须桃C落(5,3)遮SC，再取(5,1)钥匙。桃C在(4,4)，站(4,4)向RIGHT投→桃向右到(5,4)=SC？不行
//   改：桃C在(4,5)站位不对... 让玩家站(5,5)向UP投→桃从(5,5)向上→(5,4)=SC？还是不行
//   重设SC方向：SC x=5,y=4 LEFT → 威胁(4,4)(3,4)(2,4)(1,4)。桃C(4,4)站位，向UP投即可停(4,3)？
//   不，桃C是为了遮SC y=4行的。改桃落点(4,4)：站(4,5)UP投，草(4,2)不够...距离太远
//   简化：把SC改为向DOWN，在(5,2)位置：SD x=5,y=2 DOWN（原SD方案）
// SD x=5,y=2 DOWN：威胁(5,3)(5,4)(5,5)
// 现在SC改名为：只有SA/SB/SD三只主要蜘蛛，第四只SX用石块处理
// SX x=3,y=4 UP：石块(3,2)挡（射(3,3)(3,2)→stop）
const spiders = [
    { type: ENTITY_TYPE_ENUM.SPIDER, x: 1, y: 2, dir: ENTITY_DIRECTION_ENUM.RIGHT, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.SPIDER, x: 5, y: 3, dir: ENTITY_DIRECTION_ENUM.LEFT, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.SPIDER, x: 5, y: 2, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.SPIDER, x: 3, y: 4, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
]

// SA(1,2)RIGHT：桃A(1,5)→站(2,4)UP投→草(2,2)→桃停(2,3)→SA y=2行，桃落在(2,3)不是y=2行！
//   SA在y=2，射(2,2)(3,2)(4,2)...；桃要落在(2,2)才能遮。改草到(2,1)→桃从(2,4)UP投到(2,2)后停在(2,2)（草在2,1→桃停2,2）✓
//   但草(2,1)会挡玩家在(2,1)的行动。可以用石块代替？不，石块挡玩家。
//   最终方案：SA不用桃遮，用石块(2,2)直接挡：石块(2,2)→SA射RIGHT→(2,2)=stone→stop，(3,2)..安全
const peaches = [
    { type: ENTITY_TYPE_ENUM.PEACH, x: 1, y: 5, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.PEACH, x: 4, y: 4, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.PEACH, x: 2, y: 5, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
]
const grass = [
    { type: ENTITY_TYPE_ENUM.GRASS, x: 2, y: 2, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.GRASS, x: 4, y: 2, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
]

// 石块(3,2)挡SC(3,4)UP射；草(2,2)同时作为落点草
const stones = [{ type: ENTITY_TYPE_ENUM.STONE, x: 3, y: 2, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE }]

// G1(3,2)冲突→改G1在(2,1)；G2在(3,1)
const floor_traps = [
    { type: ENTITY_TYPE_ENUM.FLOOR_TRAP, x: 2, y: 1, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.ATTACK, entityId: 'l35_ft_1' },
    { type: ENTITY_TYPE_ENUM.FLOOR_TRAP, x: 3, y: 1, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.ATTACK, entityId: 'l35_ft_2' },
]
const floor_trap_switches = [
    { type: ENTITY_TYPE_ENUM.FLOOR_TRAP_SWITCH, x: 1, y: 3, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, entityId: 'l35_ft_1' },
    { type: ENTITY_TYPE_ENUM.FLOOR_TRAP_SWITCH, x: 1, y: 4, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, entityId: 'l35_ft_2' },
]

const floor_spikes = [
    { type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_ONE, x: 1, y: 1, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, numCurrent: 2 },
    { type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_ONE, x: 2, y: 3, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, numCurrent: 0 },
    { type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_TWO, x: 3, y: 3, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, numCurrent: 1 },
    { type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_ONE, x: 4, y: 3, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, numCurrent: 3 },
]

export default { map, player, doors, key, spiders, peaches, grass, stones, floor_traps, floor_trap_switches, floor_spikes }
