// L4 - 甲虫
// 第四关：引入甲虫（BEATLE）——两只甲虫守路，需用武器逐一击杀后才能安全取钥匙过门
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
    // x=1: 通道（石块y=3封路）
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_1' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_1' },   // y=1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=3 石块S
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=4 草C
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_2_1' },   // y=5
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    // x=2: 甲虫y=2，玩家y=5
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_2' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=2 甲虫B↓
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=3
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=4
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },   // y=5 玩家@
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    // x=3: 出口门y=0，陶罐y=3封路
    [
        { type: TILE_TYPE_ENUM.FLOOR, name: 'd_0_2' },   // y=0 出口门
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=3 陶罐P（中路障碍）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=4
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },   // y=5
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    // x=4: 甲虫y=3，石块y=4
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_5' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=3 甲虫B←
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=4 石块S
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },   // y=5
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    // x=5: 钥匙y=2，陶罐y=4
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_6' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },   // y=1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },   // y=2 钥匙K
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },   // y=3
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },   // y=4 陶罐P
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
    x: 2,
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
    x: 5,
    y: 2,
    dir: ENTITY_DIRECTION_ENUM.UP,
    state: ENTITY_STATE_ENUM.IDLE,
}

// 甲虫x=2,y=2（朝DOWN逼近玩家）；甲虫x=4,y=3（朝LEFT守钥匙通路）
const beetles = [
    { type: ENTITY_TYPE_ENUM.BEATLE, x: 2, y: 2, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.BEATLE, x: 4, y: 3, dir: ENTITY_DIRECTION_ENUM.LEFT, state: ENTITY_STATE_ENUM.IDLE },
]

const pots = [
    { type: ENTITY_TYPE_ENUM.POT, x: 3, y: 3, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.POT, x: 5, y: 4, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE },
]

const stones = [
    { type: ENTITY_TYPE_ENUM.STONE, x: 1, y: 3, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.STONE, x: 4, y: 4, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
]

const grass = [
    { type: ENTITY_TYPE_ENUM.GRASS, x: 1, y: 4, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.GRASS, x: 5, y: 5, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
]

const items = [{ type: ENTITY_TYPE_ENUM.WEAPON, num: 1 }]

export default {
    map,
    player,
    doors,
    key,
    beetles,
    pots,
    stones,
    grass,
    items,
}
