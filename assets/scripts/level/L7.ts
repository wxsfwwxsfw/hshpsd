// L7 - 重围
// 第七关：四蜘蛛多向封锁，陶罐和箱子提供遮挡，配合地刺节奏穿越——综合考验
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
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=3 蜘蛛A→
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_2_1' },
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_2' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=3 陶罐（遮挡A蜘蛛）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.FLOOR, name: 'd_0_2' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=1 机关门G（l7_ft_1）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=3 地刺T
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=4 开关O（l7_ft_1）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },   // y=5 玩家@
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_5' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=3 蜘蛛B（朝LEFT，箱子遮挡）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_6' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },   // y=1 钥匙K
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },   // y=3 蜘蛛C↓
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },   // y=4 蜘蛛D↑
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

// 四蜘蛛：A x=1,y=3→RIGHT; B x=5,y=3←LEFT; C x=5,y=3↓DOWN; D x=5,y=4↑UP
// 注：C和D在x=5同列；钥匙在x=5,y=1，需绕路避开蜘蛛或用陶罐/箱子遮挡
const spiders = [
    { type: ENTITY_TYPE_ENUM.SPIDER, x: 1, y: 3, dir: ENTITY_DIRECTION_ENUM.RIGHT, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.SPIDER, x: 4, y: 3, dir: ENTITY_DIRECTION_ENUM.LEFT, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.SPIDER, x: 5, y: 2, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.SPIDER, x: 5, y: 4, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
]

// 陶罐 x=2,y=3（遮挡A蜘蛛右向射线，使y=3行x=3..4安全）
// 箱子 x=4,y=2（可推向x=5,y=2遮挡C蜘蛛下向，让玩家安全在x=5,y=1取钥匙）
const pots = [
    { type: ENTITY_TYPE_ENUM.POT, x: 2, y: 3, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE },
]

const boxes = [
    { type: ENTITY_TYPE_ENUM.BOX, x: 4, y: 2, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE },
]

// 地刺 x=3,y=3（双孔，节奏更快）
const floor_spikes = [{
    type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_TWO,
    x: 3,
    y: 3,
    dir: ENTITY_DIRECTION_ENUM.DOWN,
    state: ENTITY_STATE_ENUM.IDLE,
    numCurrent: 0,
}]

// 机关门 x=3,y=1；开关 x=3,y=4
const floor_traps = [{
    type: ENTITY_TYPE_ENUM.FLOOR_TRAP,
    x: 3,
    y: 1,
    dir: ENTITY_DIRECTION_ENUM.DOWN,
    state: ENTITY_STATE_ENUM.ATTACK,
    entityId: 'l7_ft_1',
}]

const floor_trap_switches = [{
    type: ENTITY_TYPE_ENUM.FLOOR_TRAP_SWITCH,
    x: 3,
    y: 4,
    dir: ENTITY_DIRECTION_ENUM.DOWN,
    state: ENTITY_STATE_ENUM.IDLE,
    entityId: 'l7_ft_1',
}]

const stones = [
    { type: ENTITY_TYPE_ENUM.STONE, x: 2, y: 2, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.STONE, x: 4, y: 4, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
]

const items = [{ type: ENTITY_TYPE_ENUM.WEAPON, num: 1 }]

export default {
    map,
    player,
    doors,
    key,
    spiders,
    pots,
    boxes,
    floor_spikes,
    floor_traps,
    floor_trap_switches,
    stones,
    items,
}
