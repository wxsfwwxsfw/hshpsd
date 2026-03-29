// L9 - 荷塘
// 第九关：引入荷叶（WATER_LILY）——荷叶浮于水面可站立，但只能踩有限次，过水须靠荷叶渡行
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
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_1' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_1' },   // y=1 钥匙K
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=2 水W
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=3 水W
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=4 水W
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_2_1' },   // y=5
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_2' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=2 水W（荷叶在此）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=3 水W（荷叶在此）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=4 水W
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.FLOOR, name: 'd_0_2' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=2 水W
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=3 水W（荷叶在此）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=4 水W
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },   // y=5 玩家@
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_5' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=2 水W
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=3 水W
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=4 水W
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_6' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },   // y=1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },   // y=2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },   // y=3 野猪PIG←
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },   // y=4 地刺T
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

const player = {
    type: ENTITY_TYPE_ENUM.PLAYER,
    x: 3,
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

// 大片水域：x=1..4,y=2..4（只有x=5列和y=1,y=5行可以陆行）
const waters = [
    { type: ENTITY_TYPE_ENUM.WATER, x: 1, y: 2, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.WATER, x: 1, y: 3, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.WATER, x: 1, y: 4, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.WATER, x: 2, y: 2, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.WATER, x: 2, y: 3, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.WATER, x: 2, y: 4, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.WATER, x: 3, y: 2, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.WATER, x: 3, y: 3, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.WATER, x: 3, y: 4, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.WATER, x: 4, y: 2, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.WATER, x: 4, y: 3, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.WATER, x: 4, y: 4, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE },
]

// 荷叶：x=2,y=2 / x=2,y=3 / x=3,y=3（三片荷叶作为渡水垫脚石，串联路线）
const water_lilies = [
    { type: ENTITY_TYPE_ENUM.WATER_LILY, x: 2, y: 2, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.WATER_LILY, x: 2, y: 3, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.WATER_LILY, x: 3, y: 3, state: ENTITY_STATE_ENUM.IDLE },
]

// 野猪 x=5,y=3 朝LEFT（守x=5列右侧通道，须用武器击杀）
const pigs = [
    { type: ENTITY_TYPE_ENUM.PIG, x: 5, y: 3, dir: ENTITY_DIRECTION_ENUM.LEFT, state: ENTITY_STATE_ENUM.IDLE },
]

// 地刺 x=5,y=4（单孔，卡节奏穿越x=5列）
const floor_spikes = [{
    type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_ONE,
    x: 5,
    y: 4,
    dir: ENTITY_DIRECTION_ENUM.DOWN,
    state: ENTITY_STATE_ENUM.IDLE,
    numCurrent: 0,
}]

const items = [{ type: ENTITY_TYPE_ENUM.WEAPON, num: 1 }]

export default {
    map,
    player,
    doors,
    key,
    waters,
    water_lilies,
    pigs,
    floor_spikes,
    items,
}
