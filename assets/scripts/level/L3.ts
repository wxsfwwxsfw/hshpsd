// L3 - 碎陶
// 第三关：引入陶罐障碍——陶罐封堵竖向通路，用武器砸开一格穿越，蜘蛛守右列
import { ENTITY_DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, TILE_TYPE_ENUM } from './../Enum';

// 7×7 map: map[x][y], x=0..6(左→右), y=0..6(上→下)
// 可行走区域: x=1..5, y=1..5  门位: x=3,y=0
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
    // x=1: 第1列（草y=3,y=4，通行自由）
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_1' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_1' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_2_1' },
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    // x=2: 第2列（钥匙y=1，陶罐y=2，玩家y=5）
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_2' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=1 钥匙K
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=2 陶罐P（砸开此格可北上）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=3
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=4
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },   // y=5 玩家@
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    // x=3: 第3列（出口门y=0，陶罐y=2，石块y=4）
    [
        { type: TILE_TYPE_ENUM.FLOOR, name: 'd_0_2' },   // y=0 出口门
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=2 陶罐P
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=3
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=4 石块S
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },   // y=5
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    // x=4: 第4列（陶罐y=2，其余空地）
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_5' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=2 陶罐P
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=3
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=4
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },   // y=5
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    // x=5: 第5列（蜘蛛y=3朝LEFT，石块y=4遮挡蜘蛛向下射线）
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_6' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },   // y=1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },   // y=2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },   // y=3 蜘蛛H（朝LEFT）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },   // y=4 石块S
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_2_2' },   // y=5
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

const player = {
    type: ENTITY_TYPE_ENUM.PLAYER,
    x: 2,
    y: 5,
    dir: ENTITY_DIRECTION_ENUM.UP,
    state: ENTITY_STATE_ENUM.IDLE,
}

const doors = [{
    type: ENTITY_TYPE_ENUM.DOOR,
    x: 3,
    y: 0,
    dir: ENTITY_DIRECTION_ENUM.DOWN,
    state: ENTITY_STATE_ENUM.IDLE,
}]

const key = {
    type: ENTITY_TYPE_ENUM.KEY,
    x: 2,
    y: 1,
    dir: ENTITY_DIRECTION_ENUM.UP,
    state: ENTITY_STATE_ENUM.IDLE,
}

// 横向陶罐墙（x=2/3/4,y=2），需用武器砸开x=2处一格后可北行取钥匙
const pots = [
    { type: ENTITY_TYPE_ENUM.POT, x: 2, y: 2, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.POT, x: 3, y: 2, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.POT, x: 4, y: 2, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE },
]

// 石块：x=3,y=4（中路障碍，阻止玩家直接北上，必须先与树精对话）
const stones = [
    { type: ENTITY_TYPE_ENUM.STONE, x: 3, y: 4, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
]

// 树精 x=5,y=5：玩家向右撞上触发对话，对话结束后赠予武器
const tree = { type: ENTITY_TYPE_ENUM.TREE, x: 5, y: 5, dir: ENTITY_DIRECTION_ENUM.LEFT, state: ENTITY_STATE_ENUM.IDLE }

// 桃子 x=1,y=5（玩家向左拾取，在x=2,y=4往UP投掷，落x=2,y=3遮挡蜘蛛视线）
const peaches = [{
    type: ENTITY_TYPE_ENUM.PEACH,
    x: 1,
    y: 5,
    dir: ENTITY_DIRECTION_ENUM.UP,
    state: ENTITY_STATE_ENUM.IDLE,
}]

// 蜘蛛 x=5,y=3 朝LEFT——守护中右区y=3行
const spiders = [{
    type: ENTITY_TYPE_ENUM.SPIDER,
    x: 5,
    y: 3,
    dir: ENTITY_DIRECTION_ENUM.LEFT,
    state: ENTITY_STATE_ENUM.IDLE,
}]

const grass = [
    { type: ENTITY_TYPE_ENUM.GRASS, x: 1, y: 3, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.GRASS, x: 1, y: 4, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
]

export default {
    map,
    player,
    doors,
    key,
    pots,
    peaches,
    stones,
    spiders,
    grass,
    tree,
}
