// L10 - 鼠患
// 第十关：引入老鼠（MOUSE）——老鼠快速移动不规律，骷髅头配合封堵，须用武器快速清除
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
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_1' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=3 骷髅头SKL→
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_2_1' },   // y=5
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_2' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=2 老鼠M↓
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.FLOOR, name: 'd_0_2' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=1 机关门G（l10_ft_1）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=3 地刺T×2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=4 开关O（l10_ft_1）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },   // y=5 玩家@
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_5' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=1 老鼠M↓
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_6' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },   // y=1 钥匙K
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },   // y=2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },   // y=3 骷髅头SKL←
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_2_2' },
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
    x: 5,
    y: 1,
    dir: ENTITY_DIRECTION_ENUM.UP,
    state: ENTITY_STATE_ENUM.IDLE,
}

// 老鼠 x=2,y=2（快速跑动）；x=4,y=1（在钥匙附近伏击）
const mouses = [
    { type: ENTITY_TYPE_ENUM.MOUSE, x: 2, y: 2, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.MOUSE, x: 4, y: 1, dir: ENTITY_DIRECTION_ENUM.RIGHT, state: ENTITY_STATE_ENUM.IDLE },
]

// 双骷髅头：x=1,y=3 朝RIGHT；x=5,y=3 朝LEFT（对向封堵y=3整行）
const skull_heads = [
    { type: ENTITY_TYPE_ENUM.SKULL_HEAD, x: 1, y: 3, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.SKULL_HEAD, x: 5, y: 3, state: ENTITY_STATE_ENUM.IDLE },
]

// 双孔地刺 x=3,y=3（与双骷髅配合，y=3行极为危险）
const floor_spikes = [{
    type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_TWO,
    x: 3,
    y: 3,
    dir: ENTITY_DIRECTION_ENUM.DOWN,
    state: ENTITY_STATE_ENUM.IDLE,
    numCurrent: 0,
}]

// 机关门 x=3,y=1（ATTACK关闭）；开关 x=3,y=4
const floor_traps = [{
    type: ENTITY_TYPE_ENUM.FLOOR_TRAP,
    x: 3,
    y: 1,
    dir: ENTITY_DIRECTION_ENUM.DOWN,
    state: ENTITY_STATE_ENUM.ATTACK,
    entityId: 'l10_ft_1',
}]

const floor_trap_switches = [{
    type: ENTITY_TYPE_ENUM.FLOOR_TRAP_SWITCH,
    x: 3,
    y: 4,
    dir: ENTITY_DIRECTION_ENUM.DOWN,
    state: ENTITY_STATE_ENUM.IDLE,
    entityId: 'l10_ft_1',
}]

const stones = [
    { type: ENTITY_TYPE_ENUM.STONE, x: 2, y: 4, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.STONE, x: 4, y: 4, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
]

const items = [{ type: ENTITY_TYPE_ENUM.WEAPON, num: 1 }]

export default {
    map,
    player,
    doors,
    key,
    mouses,
    skull_heads,
    floor_spikes,
    floor_traps,
    floor_trap_switches,
    stones,
    items,
}
