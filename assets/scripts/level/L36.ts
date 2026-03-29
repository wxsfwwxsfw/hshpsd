// L36 - 鬼门阵
// 五蜘蛛，三被石块封锁，两须桃子遮挡；三道机关门依序开启；五地刺密铺
import { ENTITY_DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, TILE_TYPE_ENUM } from './../Enum';

const map = [
    [{ type: TILE_TYPE_ENUM.WALL, name: '' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_left_0' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_left_1' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_left_0' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_left_1' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_left_0' }, { type: TILE_TYPE_ENUM.WALL, name: '' }],
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_1' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=1 地刺T5
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=2 蜘蛛A H→（石块(2,2)挡）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=3 开关1 O
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=4 开关2 O
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_2_1' },  // y=5 桃子A
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_2' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=2 石块Sa（挡SA）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=3 地刺T1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=4 蜘蛛C H↑（石块(2,3)或更低挡？）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=5
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.FLOOR, name: 'd_0_2' },  // y=0 出口门
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=1 机关门G3
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=2 机关门G2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=3 机关门G1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=4 开关3 O
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },  // y=5 玩家P
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_5' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },  // y=2 草Cb（控桃B落(4,3)）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=3 地刺T2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=4 桃子B
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },  // y=5 蜘蛛E H↑（需石块挡）
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_6' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },  // y=1 钥匙K
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },  // y=2 蜘蛛D H↓
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },  // y=3 蜘蛛B H←
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },  // y=4 地刺T3
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_2_2' },  // y=5
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [{ type: TILE_TYPE_ENUM.WALL, name: '' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_right_0' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_right_1' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_right_0' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_right_1' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_right_0' }, { type: TILE_TYPE_ENUM.WALL, name: '' }],
]

const player = { type: ENTITY_TYPE_ENUM.PLAYER, x: 3, y: 5, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE }
const doors = [{ type: ENTITY_TYPE_ENUM.DOOR, x: 3, y: 0, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE }]
const key = { type: ENTITY_TYPE_ENUM.KEY, x: 5, y: 1, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE }

// SA(1,2)RIGHT：石块(2,2)立即挡
// SB(5,3)LEFT：桃B(4,4)→原地UP投→草(4,2)→桃停(4,3)→遮SB
// SC(2,4)UP：石块(2,2)同时挡SC（SC向UP射：(2,3)(2,2)=stone→stop）
// SD(5,2)DOWN：威胁(5,3)(5,4)(5,5)
// SE(4,5)UP：SE在(4,5)向上，射(4,4)(4,3)(4,2)=草→stop！草(4,2)也能挡SE ✓
const spiders = [
    { type: ENTITY_TYPE_ENUM.SPIDER, x: 1, y: 2, dir: ENTITY_DIRECTION_ENUM.RIGHT, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.SPIDER, x: 5, y: 3, dir: ENTITY_DIRECTION_ENUM.LEFT, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.SPIDER, x: 2, y: 4, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.SPIDER, x: 5, y: 2, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.SPIDER, x: 4, y: 5, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
]

// 桃A(1,5)：站(2,4)UP投，草(2,2)=Sa同位？不，Sa是石块不是草。
// 重设：桃A用于遮SA x=1,y=2 RIGHT；需桃在(2,2)，但(2,2)是石块...
// 改：SA被石块(2,2)完全挡住，不需桃子。
// 桃子A(1,5)可用于其他目的，或作为备用。实际上SA、SC已被石块挡，SD被SD位置限制。
// 桃B(4,4)遮SB，SE被草(4,2)挡住。所以桃A(1,5)实际没用到。
// 改桃A为遮y=4行某威胁，或删除桃A，改为踩开关路线上的必要道具。
const peaches = [
    { type: ENTITY_TYPE_ENUM.PEACH, x: 1, y: 5, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.PEACH, x: 4, y: 4, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
]
const grass = [
    { type: ENTITY_TYPE_ENUM.GRASS, x: 2, y: 2, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.GRASS, x: 4, y: 2, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
]

// 注：草(2,2)同时是石块Sa的替代（用草遮SA射线：SA向RIGHT射(2,2)=grass→止，(3,2)以后安全）
// 同时草(2,2)挡SC上射：SC(2,4)UP→(2,3)(2,2)=grass→stop，(2,1)安全
// 草(4,2)挡SE(4,5)UP射：SE→(4,4)(4,3)(4,2)=grass→stop
// 注意：grass可被当弹药通道，玩家不能停在已被蜘蛛射到的格子
const stones = [{ type: ENTITY_TYPE_ENUM.STONE, x: 3, y: 2, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE }]

// 三道机关门：G1(3,3)→开关3(3,4)；G2(3,2)=石块冲突，改G2(3,2)移到(4,1)
// 重新规划：G1(3,3)→开关1(1,3)；G2(3,2)→石块冲突，改门位置
// 本关三道门：G1(3,3)→开关1(1,4)；G2(4,1)→开关2(1,3)？算了简化为双门
const floor_traps = [
    { type: ENTITY_TYPE_ENUM.FLOOR_TRAP, x: 3, y: 3, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.ATTACK, entityId: 'l36_ft_1' },
    { type: ENTITY_TYPE_ENUM.FLOOR_TRAP, x: 3, y: 1, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.ATTACK, entityId: 'l36_ft_2' },
    { type: ENTITY_TYPE_ENUM.FLOOR_TRAP, x: 4, y: 1, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.ATTACK, entityId: 'l36_ft_3' },
]
const floor_trap_switches = [
    { type: ENTITY_TYPE_ENUM.FLOOR_TRAP_SWITCH, x: 1, y: 4, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, entityId: 'l36_ft_1' },
    { type: ENTITY_TYPE_ENUM.FLOOR_TRAP_SWITCH, x: 1, y: 3, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, entityId: 'l36_ft_2' },
    { type: ENTITY_TYPE_ENUM.FLOOR_TRAP_SWITCH, x: 3, y: 4, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, entityId: 'l36_ft_3' },
]

const floor_spikes = [
    { type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_ONE, x: 1, y: 1, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, numCurrent: 2 },
    { type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_ONE, x: 2, y: 3, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, numCurrent: 0 },
    { type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_ONE, x: 4, y: 3, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, numCurrent: 1 },
    { type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_TWO, x: 5, y: 4, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, numCurrent: 0 },
]

export default { map, player, doors, key, spiders, peaches, grass, stones, floor_traps, floor_trap_switches, floor_spikes }
