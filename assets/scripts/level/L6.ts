// L6 - 裂地
// 第六关：桃子压机关、裂地断后、地刺卡步、蜘蛛封线
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
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=2 裂地带入口
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=3 裂地带
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=4 桃子A
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_2_1' },
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_2' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=1 石头S（封捷径）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=2 裂地带出口
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=3 裂地带
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=4 裂地带
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.FLOOR, name: 'd_0_2' },   // y=0 出口门
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=1 机关门G（l6_ft_1）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=2 地刺T
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=3
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=4
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },   // y=5 玩家@
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_5' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=1 武器W
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=2 开关O（l6_ft_1）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=3
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=4
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_6' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },   // y=1 蜘蛛H↓
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },   // y=2 草挡桃子
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },   // y=3 钥匙K
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
    y: 3,
    dir: ENTITY_DIRECTION_ENUM.UP,
    state: ENTITY_STATE_ENUM.IDLE,
}

// 武器在门后，逼玩家先完成桃子机关，再清掉蜘蛛
const weapon = {
    type: ENTITY_TYPE_ENUM.WEAPON,
    x: 4,
    y: 1,
    dir: ENTITY_DIRECTION_ENUM.RIGHT,
    state: ENTITY_STATE_ENUM.IDLE,
}

// 左侧裂地带：拿桃后必须一路压进中路，后路会逐格断掉
const floor_brokens = [
    { type: ENTITY_TYPE_ENUM.FLOOR_BROKEN, x: 1, y: 2, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.FLOOR_BROKEN, x: 1, y: 3, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.FLOOR_BROKEN, x: 1, y: 4, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.FLOOR_BROKEN, x: 2, y: 2, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.FLOOR_BROKEN, x: 2, y: 3, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.FLOOR_BROKEN, x: 2, y: 4, state: ENTITY_STATE_ENUM.IDLE },
]

// 中央地刺：默认奇数回合出刺，直冲或多走一步都会死
const floor_spikes = [{
    type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_ONE,
    x: 3,
    y: 2,
    dir: ENTITY_DIRECTION_ENUM.DOWN,
    state: ENTITY_STATE_ENUM.IDLE,
    numCurrent: 1,
}]

// 机关门：初始关闭，必须把桃子掷到 x=4,y=2 才能常开
const floor_traps = [{
    type: ENTITY_TYPE_ENUM.FLOOR_TRAP,
    x: 3,
    y: 1,
    dir: ENTITY_DIRECTION_ENUM.DOWN,
    state: ENTITY_STATE_ENUM.ATTACK,
    entityId: 'l6_ft_1',
}]

const floor_trap_switches = [{
    type: ENTITY_TYPE_ENUM.FLOOR_TRAP_SWITCH,
    x: 4,
    y: 2,
    dir: ENTITY_DIRECTION_ENUM.DOWN,
    state: ENTITY_STATE_ENUM.IDLE,
    entityId: 'l6_ft_1',
}]

// 从 x=2,y=2 朝 RIGHT 投掷，桃子会被草挡在 x=4,y=2 的开关上
const peaches = [{
    type: ENTITY_TYPE_ENUM.PEACH,
    x: 1,
    y: 4,
    dir: ENTITY_DIRECTION_ENUM.UP,
    state: ENTITY_STATE_ENUM.IDLE,
}]

// 蜘蛛压住右列，拿到门后的武器前不能硬闯
const spiders = [{
    type: ENTITY_TYPE_ENUM.SPIDER,
    x: 5,
    y: 1,
    dir: ENTITY_DIRECTION_ENUM.DOWN,
    state: ENTITY_STATE_ENUM.IDLE,
}]

// 封掉 x=2,y=1 的捷径，逼玩家从地刺口穿过去
const stones = [{
    type: ENTITY_TYPE_ENUM.STONE,
    x: 2,
    y: 1,
    dir: ENTITY_DIRECTION_ENUM.UP,
    state: ENTITY_STATE_ENUM.IDLE,
}]

// 草只挡桃子，不挡玩家；用于把桃子精准停在开关位
const grass = [{
    type: ENTITY_TYPE_ENUM.GRASS,
    x: 5,
    y: 2,
    dir: ENTITY_DIRECTION_ENUM.UP,
    state: ENTITY_STATE_ENUM.IDLE,
}]

const items = []

export default {
    map,
    player,
    weapon,
    doors,
    key,
    floor_brokens,
    floor_spikes,
    floor_traps,
    floor_trap_switches,
    peaches,
    spiders,
    stones,
    grass,
    items,
}
