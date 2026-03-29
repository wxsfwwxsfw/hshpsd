// L5 - 引蛛
// 第五关：右侧拿蘑菇引蜘蛛扑食，逼近后再近战击杀，随后过桥取钥开门
import { ENTITY_DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, TILE_TYPE_ENUM } from './../Enum';

const map = [
    [
        { type: TILE_TYPE_ENUM.WALL, name: '' },
        { type: TILE_TYPE_ENUM.WALL, name: 'w_left_0' },
        { type: TILE_TYPE_ENUM.WALL, name: 'w_left_1' },
        { type: TILE_TYPE_ENUM.WALL, name: 'w_left_0' },
        { type: TILE_TYPE_ENUM.WALL, name: 'w_left_1' },
        { type: TILE_TYPE_ENUM.WALL, name: 'w_left_0' },
        { type: TILE_TYPE_ENUM.WALL, name: '' },
    ],
    // x=1: 左侧钥匙区
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_1' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_1' },   // y=1 钥匙K
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=3 水W（不可踏）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=4 水W
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_2_1' },   // y=5 玩家@
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    // x=2: 陶罐封左桥
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_2' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=2 陶罐P
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=3 水W
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=4 水W
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },   // y=5
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    // x=3: 出口门y=0，蜘蛛守桥y=2，水y=3,y=4
    [
        { type: TILE_TYPE_ENUM.FLOOR, name: 'd_0_2' },   // y=0 出口门
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=2 蜘蛛H→
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=3 水W
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=4 水W
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },   // y=5
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    // x=4: y=1草挡蘑菇滑行，y=5蘑菇
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_5' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=1 草C
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=2 蘑菇落点
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=3 击杀位
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=4
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },   // y=5 蘑菇M
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    // x=5: 右侧绕行通道
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_6' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },   // y=1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },   // y=2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },   // y=3
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },   // y=4
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_2_2' },   // y=5
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
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

// 玩家x=1,y=5，中央水域封路，只能先绕右侧拿蘑菇
const player = {
    type: ENTITY_TYPE_ENUM.PLAYER,
    x: 1,
    y: 5,
    dir: ENTITY_DIRECTION_ENUM.UP,
    state: ENTITY_STATE_ENUM.IDLE_WEAPON,
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
    x: 1,
    y: 1,
    dir: ENTITY_DIRECTION_ENUM.UP,
    state: ENTITY_STATE_ENUM.IDLE,
}

// 水域：x=1..3,y=3..4（3×2水坑），x=4列留空作击杀位
const waters = [
    { type: ENTITY_TYPE_ENUM.WATER, x: 1, y: 3, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.WATER, x: 1, y: 4, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.WATER, x: 2, y: 3, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.WATER, x: 2, y: 4, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.WATER, x: 3, y: 3, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.WATER, x: 3, y: 4, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE },
]

// 蘑菇 x=4,y=5：拾取后在原地向上投掷，草x=4,y=1阻挡，使其停在x=4,y=2
const mushrooms = [{
    type: ENTITY_TYPE_ENUM.MUSHROOM,
    x: 4,
    y: 5,
    dir: ENTITY_DIRECTION_ENUM.UP,
    state: ENTITY_STATE_ENUM.IDLE,
}]

// 蜘蛛 x=3,y=2 朝RIGHT：守住通往左桥的唯一入口，必须先用蘑菇把它引到x=4,y=2
const spiders = [{
    type: ENTITY_TYPE_ENUM.SPIDER,
    x: 3,
    y: 2,
    dir: ENTITY_DIRECTION_ENUM.RIGHT,
    state: ENTITY_STATE_ENUM.IDLE,
}]

// 陶罐 x=2,y=2（封住左桥，只能从蜘蛛位通过）
const pots = [
    { type: ENTITY_TYPE_ENUM.POT, x: 2, y: 2, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE },
]

const grass = [
    { type: ENTITY_TYPE_ENUM.GRASS, x: 4, y: 1, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
]

const items = [{ type: ENTITY_TYPE_ENUM.WEAPON, num: 1 }]

export default {
    map,
    player,
    doors,
    key,
    waters,
    mushrooms,
    spiders,
    pots,
    grass,
    items,
}
