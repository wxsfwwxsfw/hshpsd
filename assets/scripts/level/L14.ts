// L14 - 推关
// 第四关：木桶推上开关打开机关门，蜘蛛封右路，地刺卡节奏
import { ENTITY_DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, TILE_TYPE_ENUM } from './../Enum';

// 7×7 map, 可行走 x=1..5, y=1..5, 出口门 x=3,y=0
const map = [
    // x=0
    [
        { type: TILE_TYPE_ENUM.WALL, name: '' },
        { type: TILE_TYPE_ENUM.WALL, name: 'w_left_0' },
        { type: TILE_TYPE_ENUM.WALL, name: 'w_left_1' },
        { type: TILE_TYPE_ENUM.WALL, name: 'w_left_0' },
        { type: TILE_TYPE_ENUM.WALL, name: 'w_left_1' },
        { type: TILE_TYPE_ENUM.WALL, name: 'w_left_0' },
        { type: TILE_TYPE_ENUM.WALL, name: '' },
    ],
    // x=1
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_1' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=3
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=4 箱推起点左侧
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_2_1' },  // y=5 草C
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    // x=2
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_2' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=3
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },  // y=4 木桶B
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },  // y=5
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    // x=3
    [
        { type: TILE_TYPE_ENUM.FLOOR, name: 'd_0_2' },  // y=0 出口门E
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=2 地刺T
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=3 机关门G
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=4
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },  // y=5 玩家P
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    // x=4
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_5' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=3 石块S（挡蜘蛛视线）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=4
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },  // y=5
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    // x=5
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_6' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },  // y=1 钥匙K
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },  // y=2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },  // y=3 蜘蛛H←
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },  // y=4 开关O
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_2_2' },  // y=5
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    // x=6
    [
        { type: TILE_TYPE_ENUM.WALL, name: '' },
        { type: TILE_TYPE_ENUM.WALL, name: 'w_right_0' },
        { type: TILE_TYPE_ENUM.WALL, name: 'w_right_1' },
        { type: TILE_TYPE_ENUM.WALL, name: 'w_right_0' },
        { type: TILE_TYPE_ENUM.WALL, name: 'w_right_1' },
        { type: TILE_TYPE_ENUM.WALL, name: 'w_right_0' },
        { type: TILE_TYPE_ENUM.WALL, name: '' },
    ],
]

const player = {
    type: ENTITY_TYPE_ENUM.PLAYER,
    x: 3, y: 5,
    dir: ENTITY_DIRECTION_ENUM.UP,
    state: ENTITY_STATE_ENUM.IDLE,
}

// 出口门需钥匙
const doors = [{
    type: ENTITY_TYPE_ENUM.DOOR,
    x: 3, y: 0,
    dir: ENTITY_DIRECTION_ENUM.DOWN,
    state: ENTITY_STATE_ENUM.IDLE,
}]

// 钥匙在蜘蛛正上方（蜘蛛攻击y=3，钥匙在y=1，安全）
const key = {
    type: ENTITY_TYPE_ENUM.KEY,
    x: 5, y: 1,
    dir: ENTITY_DIRECTION_ENUM.UP,
    state: ENTITY_STATE_ENUM.IDLE,
}

// 蜘蛛朝LEFT，封锁y=3行右侧，石块x=4,y=3挡视线保护左路
const spiders = [{
    type: ENTITY_TYPE_ENUM.SPIDER,
    x: 5, y: 3,
    dir: ENTITY_DIRECTION_ENUM.LEFT,
    state: ENTITY_STATE_ENUM.IDLE,
}]

// 机关门初始ATTACK阻断x=3通道，箱子推到开关后打开
const floor_traps = [{
    type: ENTITY_TYPE_ENUM.FLOOR_TRAP,
    x: 3, y: 3,
    dir: ENTITY_DIRECTION_ENUM.DOWN,
    state: ENTITY_STATE_ENUM.ATTACK,
    entityId: 'l14_ft_1',
}]

// 开关：箱子推到x=5,y=4触发
const floor_trap_switches = [{
    type: ENTITY_TYPE_ENUM.FLOOR_TRAP_SWITCH,
    x: 5, y: 4,
    dir: ENTITY_DIRECTION_ENUM.DOWN,
    state: ENTITY_STATE_ENUM.IDLE,
    entityId: 'l14_ft_1',
}]

// 地刺：通道x=3,y=2，需卡节奏通过
const floor_spikes = [{
    type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_ONE,
    x: 3, y: 2,
    dir: ENTITY_DIRECTION_ENUM.DOWN,
    state: ENTITY_STATE_ENUM.IDLE,
    numCurrent: 0,
}]

// 木桶：从x=2,y=4向右推3格到x=5,y=4触发开关
const boxes = [{
    type: ENTITY_TYPE_ENUM.BOX,
    x: 2, y: 4,
    dir: ENTITY_DIRECTION_ENUM.DOWN,
    state: ENTITY_STATE_ENUM.IDLE,
}]

// 石块：x=4,y=3 挡蜘蛛视线，x=3,y=3左侧安全
const stones = [{
    type: ENTITY_TYPE_ENUM.STONE,
    x: 4, y: 3,
    dir: ENTITY_DIRECTION_ENUM.UP,
    state: ENTITY_STATE_ENUM.IDLE,
}]

// 草：x=1,y=5 供玩家绕行时踩踏
const grass = [{
    type: ENTITY_TYPE_ENUM.GRASS,
    x: 1, y: 5,
    dir: ENTITY_DIRECTION_ENUM.UP,
    state: ENTITY_STATE_ENUM.IDLE,
}]

export default {
    map, player, doors, key,
    spiders, floor_traps, floor_trap_switches,
    floor_spikes, boxes, stones, grass,
}
