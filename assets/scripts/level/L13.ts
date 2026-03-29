// L13 - 险径
// 第三关：桃子遮挡蜘蛛视线 + 地刺节奏 + 双蜘蛛威胁
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
    // x=1: 第1列（草y=5，蜘蛛A y=3）
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_1' },       // y=0 ##
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },      // y=1 空地
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },      // y=2 空地
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },      // y=3 蜘蛛A H→
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },      // y=4 空地
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_2_1' },      // y=5 草C
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    // x=2: 第2列（石块y=2，草y=4）
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_2' },       // y=0 ##
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },      // y=1 空地
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },      // y=2 石块S
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },      // y=3 空地
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },      // y=4 草C
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },      // y=5 空地
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    // x=3: 第3列（出口门y=0，空y=1，空y=2，地刺y=3，空y=4，玩家y=5）
    [
        { type: TILE_TYPE_ENUM.FLOOR, name: 'd_0_2' },      // y=0 出口门E
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },      // y=1 空地
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },      // y=2 空地
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },      // y=3 地刺T
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },      // y=4 空地
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },      // y=5 玩家P
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    // x=4: 第4列（石块y=3）
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_5' },       // y=0 ##
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },      // y=1 空地
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },      // y=2 空地
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },      // y=3 石块S
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },      // y=4 空地
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },      // y=5 桃子A
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    // x=5: 第5列（钥匙y=1，蜘蛛B y=2）
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_6' },       // y=0 ##
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },      // y=1 钥匙K
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },      // y=2 蜘蛛B H↓
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },      // y=3 空地
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

// 钥匙 x=5,y=1（蜘蛛B正下方，需绕路取）
const key = {
    type: ENTITY_TYPE_ENUM.KEY,
    x: 5,
    y: 1,
    dir: ENTITY_DIRECTION_ENUM.UP,
    state: ENTITY_STATE_ENUM.IDLE,
}

// 桃子 x=4,y=5（拾取后投掷到 x=2,y=3 遮挡蜘蛛A视线）
const peaches = [{
    type: ENTITY_TYPE_ENUM.PEACH,
    x: 4,
    y: 5,
    dir: ENTITY_DIRECTION_ENUM.UP,
    state: ENTITY_STATE_ENUM.IDLE,
}]

// 蜘蛛A x=1,y=3，朝向RIGHT，威胁y=3行右侧（x=2~5）
// 玩家过x=3,y=3（地刺区）时需用桃子在x=2,y=3遮挡视线
const spiders = [
    {
        type: ENTITY_TYPE_ENUM.SPIDER,
        x: 1,
        y: 3,
        dir: ENTITY_DIRECTION_ENUM.RIGHT,
        state: ENTITY_STATE_ENUM.IDLE,
    },
    // 蜘蛛B x=5,y=2，朝向DOWN，威胁x=5列（y=3~5）
    // 玩家取钥匙需在蜘蛛B移动到y=4前到达x=5,y=1（石块x=4,y=3遮挡蜘蛛A）
    {
        type: ENTITY_TYPE_ENUM.SPIDER,
        x: 5,
        y: 2,
        dir: ENTITY_DIRECTION_ENUM.DOWN,
        state: ENTITY_STATE_ENUM.IDLE,
    },
]

// 地刺T x=3,y=3，双孔，玩家每移动一步切换状态
// numCurrent:0 表示初始未冒出（安全状态开始）
const floor_spikes = [{
    type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_TWO,
    x: 3,
    y: 3,
    dir: ENTITY_DIRECTION_ENUM.DOWN,
    state: ENTITY_STATE_ENUM.IDLE,
    numCurrent: 0,
}]

// 草C：x=1,y=5 / x=2,y=4
// 草可通行（人），但阻挡桃子滑行，使桃子定位在目标格
const grass = [
    {
        type: ENTITY_TYPE_ENUM.GRASS,
        x: 1,
        y: 5,
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
]

// 石块S：x=2,y=2 / x=4,y=3（不可通行，不可推动）
// x=2,y=2 阻挡桃子上滑，使桃子落在x=2,y=3（正好挡住蜘蛛A视线）
// x=4,y=3 阻挡蜘蛛A的视线延伸到x=5列，使玩家在x=5,y=1取钥匙时不被蜘蛛A攻击
const stones = [
    {
        type: ENTITY_TYPE_ENUM.STONE,
        x: 2,
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
    floor_spikes,
    grass,
    stones,
}
