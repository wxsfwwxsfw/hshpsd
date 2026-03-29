// L2 - 退路
// 第二关：引入地刺节奏、桃子投掷开关、黄蜘蛛封左路
import { ENTITY_DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, TILE_TYPE_ENUM } from './../Enum';

// 7×7 map: map[x][y], x=0..6(左→右), y=0..6(上→下)
// 可行走区域: x=1..5, y=1..5
// 门位行: y=0, 出口门在 x=3
const map = [
    // x=0: 左边界
    [
        { type: TILE_TYPE_ENUM.WALL, name: '' },
        { type: TILE_TYPE_ENUM.WALL, name: 'w_left_0' },
        { type: TILE_TYPE_ENUM.WALL, name: 'w_left_1' },
        { type: TILE_TYPE_ENUM.WALL, name: 'w_left_0' },
        { type: TILE_TYPE_ENUM.WALL, name: 'w_left_1' },
        { type: TILE_TYPE_ENUM.WALL, name: 'w_left_0' },
        { type: TILE_TYPE_ENUM.WALL, name: '' },
    ],
    // x=1: 第1列（草y=1，钥匙y=2，蜘蛛y=3，草y=5）
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_1' },       // y=0 ##
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_1' },      // y=1 草C
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },      // y=2 钥匙K
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },      // y=3 蜘蛛H
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },      // y=4 空地
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_2_1' },      // y=5 草C
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    // x=2: 第2列（空地y=1..3，草y=4，木桶y=5）
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_2' },       // y=0 ##
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },      // y=1 空地
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },      // y=2 空地
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },      // y=3 空地
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },      // y=4 草C
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },      // y=5 木桶B
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    // x=3: 第3列（出口门y=0，机关门G y=1，开关O y=4，玩家y=5）
    [
        { type: TILE_TYPE_ENUM.FLOOR, name: 'd_0_2' },      // y=0 出口门E
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },      // y=1 机关门G
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },      // y=2 空地
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },      // y=3 空地
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },      // y=4 开关O
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },      // y=5 玩家P
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    // x=4: 第4列（石块y=2,y=3，其余空地）
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_5' },       // y=0 ##
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },      // y=1 空地
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },      // y=2 石块S
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },      // y=3 石块S
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },      // y=4 空地
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },      // y=5 空地
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    // x=5: 第5列（桃子y=1，空地y=2，地刺y=3，空地y=4,y=5）
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_6' },       // y=0 ##
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },      // y=1 桃子A
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },      // y=2 空地
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },      // y=3 地刺T
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },      // y=4 空地
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_2_2' },      // y=5 空地
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    // x=6: 右边界
    [
        { type: TILE_TYPE_ENUM.WALL, name: '' },
        { type: TILE_TYPE_ENUM.WALL, name: 'w_right_0' },
        { type: TILE_TYPE_ENUM.WALL, name: 'w_right_1' },
        { type: TILE_TYPE_ENUM.WALL, name: 'w_right_0' },
        { type: TILE_TYPE_ENUM.WALL, name: 'w_right_1' },
        { type: TILE_TYPE_ENUM.WALL, name: 'w_right_0' },
        { type: TILE_TYPE_ENUM.WALL, name: '' },
    ]
]

// 玩家出生点 x=3,y=5
const player = {
    type: ENTITY_TYPE_ENUM.PLAYER,
    x: 3,
    y: 5,
    dir: ENTITY_DIRECTION_ENUM.UP,
    state: ENTITY_STATE_ENUM.IDLE,
}

// 出口门 x=3,y=0（需要钥匙才能通过）
const doors = [{
    type: ENTITY_TYPE_ENUM.DOOR,
    x: 3,
    y: 0,
    dir: ENTITY_DIRECTION_ENUM.DOWN,
    state: ENTITY_STATE_ENUM.IDLE,
}]

// 钥匙 x=1,y=2
const key = {
    type: ENTITY_TYPE_ENUM.KEY,
    x: 1,
    y: 2,
    dir: ENTITY_DIRECTION_ENUM.UP,
    state: ENTITY_STATE_ENUM.IDLE,
}

// 桃子 x=5,y=1（拾取后可投掷触发开关）
const peaches = [{
    type: ENTITY_TYPE_ENUM.PEACH,
    x: 5,
    y: 1,
    dir: ENTITY_DIRECTION_ENUM.UP,
    state: ENTITY_STATE_ENUM.IDLE,
}]

// 黄蜘蛛 x=1,y=3，朝向RIGHT，威胁y=3行右侧区域（封锁玩家过早横穿左路）
const spiders = [{
    type: ENTITY_TYPE_ENUM.SPIDER,
    x: 1,
    y: 3,
    dir: ENTITY_DIRECTION_ENUM.RIGHT,
    state: ENTITY_STATE_ENUM.IDLE,
}]

// 机关门G x=3,y=1，初始ATTACK（阻挡通道），被开关触发后变IDLE（通路开放）
// entityId与开关保持一致
const floor_traps = [{
    type: ENTITY_TYPE_ENUM.FLOOR_TRAP,
    x: 3,
    y: 1,
    dir: ENTITY_DIRECTION_ENUM.DOWN,
    state: ENTITY_STATE_ENUM.ATTACK,
    entityId: 'l2_ft_1',
}]

// 开关O x=3,y=4，被玩家/桃子压住后触发机关门
const floor_trap_switches = [{
    type: ENTITY_TYPE_ENUM.FLOOR_TRAP_SWITCH,
    x: 3,
    y: 4,
    dir: ENTITY_DIRECTION_ENUM.DOWN,
    state: ENTITY_STATE_ENUM.IDLE,
    entityId: 'l2_ft_1',
}]

// 地刺T x=5,y=3，玩家每移动一步切换状态（单孔FLOOR_SPIKE_ONE）
// numCurrent:0 表示初始未冒出（安全状态开始）
const floor_spikes = [{
    type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_ONE,
    x: 5,
    y: 3,
    dir: ENTITY_DIRECTION_ENUM.DOWN,
    state: ENTITY_STATE_ENUM.IDLE,
    numCurrent: 0,
}]

// 木桶B x=2,y=5（可推动，阻挡直接左行）
const boxes = [{
    type: ENTITY_TYPE_ENUM.BOX,
    x: 2,
    y: 5,
    dir: ENTITY_DIRECTION_ENUM.DOWN,
    state: ENTITY_STATE_ENUM.IDLE,
}]

// 草C：x=1,y=1 / x=2,y=4 / x=1,y=5
// 草可通行（人），但会阻挡桃子滑行
const grass = [
    {
        type: ENTITY_TYPE_ENUM.GRASS,
        x: 1,
        y: 1,
        dir: ENTITY_DIRECTION_ENUM.UP,
        state: ENTITY_STATE_ENUM.IDLE,
    },
    {
        type: ENTITY_TYPE_ENUM.GRASS,
        x: 2,
        y: 4,
        dir: ENTITY_DIRECTION_ENUM.UP,
        state: ENTITY_STATE_ENUM.IDLE,
    },
    {
        type: ENTITY_TYPE_ENUM.GRASS,
        x: 1,
        y: 5,
        dir: ENTITY_DIRECTION_ENUM.UP,
        state: ENTITY_STATE_ENUM.IDLE,
    },
]

// 石块S：x=4,y=2 / x=4,y=3（不可通行，不可推动）
const stones = [
    {
        type: ENTITY_TYPE_ENUM.STONE,
        x: 4,
        y: 2,
        dir: ENTITY_DIRECTION_ENUM.UP,
        state: ENTITY_STATE_ENUM.IDLE,
    },
    {
        type: ENTITY_TYPE_ENUM.STONE,
        x: 4,
        y: 3,
        dir: ENTITY_DIRECTION_ENUM.UP,
        state: ENTITY_STATE_ENUM.IDLE,
    },
]

export default {
    map,
    player,
    doors,
    key,
    peaches,
    spiders,
    floor_traps,
    floor_trap_switches,
    floor_spikes,
    boxes,
    grass,
    stones,
}
