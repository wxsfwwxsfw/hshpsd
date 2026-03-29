// L11 - 刺海
// 第十一关：纯地刺节奏关——全场密布单/双/三孔地刺，分区域掌握节奏才能穿越
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
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_1' },   // y=1 地刺×1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=2 地刺×2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=3 地刺×1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=4 地刺×2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_2_1' },   // y=5 玩家@
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_2' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=2 地刺×2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=3 地刺×1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=4 地刺×2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },   // y=5
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.FLOOR, name: 'd_0_2' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=1 地刺×1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=2 地刺×2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=3 地刺×3（最快）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=4 地刺×1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },   // y=5
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_5' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=1 地刺×2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=2 地刺×1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=3 地刺×3
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=4
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },   // y=5
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_6' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },   // y=1 钥匙K（仅此格安全）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },   // y=2 地刺×2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },   // y=3 地刺×1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },   // y=4 地刺×2
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
    x: 1,
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
    x: 5,
    y: 1,
    dir: ENTITY_DIRECTION_ENUM.UP,
    state: ENTITY_STATE_ENUM.IDLE,
}

// 地刺阵——单孔(ONE)/双孔(TWO)/三孔(THREE)交错，初始偏移不同形成节奏差异
// 玩家须预判各格刺的状态再踏入，错误路线必死
const floor_spikes = [
    // x=1列
    { type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_ONE, x: 1, y: 1, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, numCurrent: 0 },
    { type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_TWO, x: 1, y: 2, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, numCurrent: 1 },
    { type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_ONE, x: 1, y: 3, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, numCurrent: 0 },
    { type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_TWO, x: 1, y: 4, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, numCurrent: 0 },
    // x=2列
    { type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_TWO, x: 2, y: 2, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, numCurrent: 0 },
    { type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_ONE, x: 2, y: 3, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, numCurrent: 1 },
    { type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_TWO, x: 2, y: 4, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, numCurrent: 1 },
    // x=3列
    { type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_ONE, x: 3, y: 1, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, numCurrent: 1 },
    { type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_TWO, x: 3, y: 2, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, numCurrent: 1 },
    { type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_THREE, x: 3, y: 3, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, numCurrent: 0 },
    { type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_ONE, x: 3, y: 4, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, numCurrent: 0 },
    // x=4列
    { type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_TWO, x: 4, y: 1, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, numCurrent: 0 },
    { type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_ONE, x: 4, y: 2, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, numCurrent: 0 },
    { type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_THREE, x: 4, y: 3, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, numCurrent: 2 },
    // x=5列（y=1是钥匙，y=2..4有刺）
    { type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_TWO, x: 5, y: 2, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, numCurrent: 0 },
    { type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_ONE, x: 5, y: 3, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, numCurrent: 1 },
    { type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_TWO, x: 5, y: 4, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE, numCurrent: 1 },
]

export default {
    map,
    player,
    doors,
    key,
    floor_spikes,
}
