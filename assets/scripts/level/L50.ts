// L50 - 无间 [HELL-10 · 终极关]
// 所有机制的终极融合：五蜘蛛全向封锁+四老鼠+双骷髅+武器+三桃+三道连锁门+五地刺
// 唯一正确解法步骤超过30步，任何一步错误均无法完成
// 解法提示：先投桃B遮SB → 投桃A遮辅助 → 击杀骷髅(4,1) → 踩开关1,2,3 → 穿越五地刺 → 取钥 → 出门
// 反直觉：不要先杀老鼠，留着武器给骷髅；顺序绝不可乱
import { ENTITY_DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, TILE_TYPE_ENUM } from './../Enum';

const map = [
    [{ type: TILE_TYPE_ENUM.WALL, name: '' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_left_0' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_left_1' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_left_0' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_left_1' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_left_0' }, { type: TILE_TYPE_ENUM.WALL, name: '' }],
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_1' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_1' },  // y=1 骷髅头SKL（守开关路）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=2 蜘蛛A H→（草Ca挡）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=3 开关1 O
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=4 老鼠M
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_2_1' },  // y=5 桃子A
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_2' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },  // y=2 草Ca（挡SA右射和SC上射）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=3 地刺T1（numCurrent=0）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=4 蜘蛛C H↑（草Ca挡：射(2,3)(2,2)→stop）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=5 老鼠M
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.FLOOR, name: 'd_0_2' },  // y=0 出口门
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=1 机关门G3
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=2 机关门G2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=3 机关门G1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=4 开关3 O（G1开后才能到达，蜘蛛E也在这附近）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },  // y=5 玩家P
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_5' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=1 骷髅头SKL（守取钥关键路口）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },  // y=2 草Cb（控桃B落(4,3)遮SB）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=3 地刺T2（双孔，numCurrent=2）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=4 桃子B
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },  // y=5 老鼠M
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_6' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },  // y=1 钥匙K
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },  // y=2 蜘蛛D H↓（威胁(5,3)(5,4)(5,5)）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },  // y=3 蜘蛛B H←（桃B停(4,3)遮挡后(1..3,3)安全）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },  // y=4 地刺T3（numCurrent=4）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_2_2' },  // y=5 老鼠M
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [{ type: TILE_TYPE_ENUM.WALL, name: '' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_right_0' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_right_1' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_right_0' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_right_1' }, { type: TILE_TYPE_ENUM.WALL, name: 'w_right_0' }, { type: TILE_TYPE_ENUM.WALL, name: '' }],
]

const player = { type: ENTITY_TYPE_ENUM.PLAYER, x: 3, y: 5, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE_WEAPON }
const doors = [{ type: ENTITY_TYPE_ENUM.DOOR, x: 3, y: 0, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE }]
const key = { type: ENTITY_TYPE_ENUM.KEY, x: 5, y: 1, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE }

// 五蜘蛛终极配置：
// SA(1,2)RIGHT：草Ca(2,2)立即挡 ✓
// SC(2,4)UP：草Ca(2,2)挡（(2,3)(2,2)=grass→stop）✓
// SB(5,3)LEFT：桃B(4,4)→原地UP投→草Cb(4,2)→桃停(4,3)→遮SB ✓
// SD(5,2)DOWN：威胁(5,3)(5,4)(5,5)，取钥须绕(4,1) ✓
// SE(3,4)UP：石块(3,2)挡（(3,3)(3,2)=stone→stop）✓
const spiders = [
    { type: ENTITY_TYPE_ENUM.SPIDER, x: 1, y: 2, dir: ENTITY_DIRECTION_ENUM.RIGHT, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.SPIDER, x: 5, y: 3, dir: ENTITY_DIRECTION_ENUM.LEFT, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.SPIDER, x: 2, y: 4, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.SPIDER, x: 5, y: 2, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.SPIDER, x: 3, y: 4, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
]

// 双骷髅：(1,1)守开关路，(4,1)守取钥路；武器只能杀其一
// 四老鼠：(1,4)(2,5)(4,5)(5,5)四面游走，营造极大压力
// 解法：先丢桃B遮SB → 用武器杀骷髅(4,1) → 踩开关1(1,3)→开关2(1,4)→穿G1 → 踩开关3(3,4)→穿G2G3
//       → 地刺节奏穿越 → 绕(4,1)[骷髅死，路开] → (5,1)取钥 → (3,0)出口
//       骷髅(1,1)用老鼠逃跑路线躲开（不在必经路上），骷髅(4,1)挡取钥必经路
const skull_heads = [
    { type: ENTITY_TYPE_ENUM.SKULL_HEAD, x: 1, y: 1, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.SKULL_HEAD, x: 4, y: 1, state: ENTITY_STATE_ENUM.IDLE },
]
const mouses = [
    { type: ENTITY_TYPE_ENUM.MOUSE, x: 1, y: 4, dir: ENTITY_DIRECTION_ENUM.RIGHT, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.MOUSE, x: 2, y: 5, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.MOUSE, x: 4, y: 5, dir: ENTITY_DIRECTION_ENUM.LEFT, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.MOUSE, x: 5, y: 5, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
]

const peaches = [
    { type: ENTITY_TYPE_ENUM.PEACH, x: 1, y: 5, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.PEACH, x: 4, y: 4, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.PEACH, x: 3, y: 5, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
]
const grass = [
    { type: ENTITY_TYPE_ENUM.GRASS, x: 2, y: 2, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.GRASS, x: 4, y: 2, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
]

const stones = [{ type: ENTITY_TYPE_ENUM.STONE, x: 3, y: 2, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE }]

// 三道连锁机关门：G1开后才能到达开关3的位置
const floor_traps = [
    { type: ENTITY_TYPE_ENUM.FLOOR_TRAP, x: 3, y: 3, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.ATTACK, entityId: 'l50_ft_1' },
    { type: ENTITY_TYPE_ENUM.FLOOR_TRAP, x: 3, y: 2, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.ATTACK, entityId: 'l50_ft_2' },
    { type: ENTITY_TYPE_ENUM.FLOOR_TRAP, x: 3, y: 1, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.ATTACK, entityId: 'l50_ft_3' },
]
const floor_trap_switches = [
    { type: ENTITY_TYPE_ENUM.FLOOR_TRAP_SWITCH, x: 1, y: 3, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, entityId: 'l50_ft_1' },
    { type: ENTITY_TYPE_ENUM.FLOOR_TRAP_SWITCH, x: 1, y: 4, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, entityId: 'l50_ft_2' },
    { type: ENTITY_TYPE_ENUM.FLOOR_TRAP_SWITCH, x: 3, y: 4, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, entityId: 'l50_ft_3' },
]

// 五地刺：节奏错落，必须在精确步数到达每格
const floor_spikes = [
    { type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_ONE, x: 1, y: 1, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, numCurrent: 0 },
    { type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_ONE, x: 2, y: 3, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, numCurrent: 1 },
    { type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_TWO, x: 4, y: 3, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, numCurrent: 3 },
    { type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_ONE, x: 4, y: 1, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, numCurrent: 2 },
    { type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_ONE, x: 5, y: 4, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, numCurrent: 4 },
]

const items = [{ type: ENTITY_TYPE_ENUM.WEAPON, num: 1 }]

export default { map, player, doors, key, spiders, skull_heads, mouses, peaches, grass, stones, floor_traps, floor_trap_switches, floor_spikes, items }
