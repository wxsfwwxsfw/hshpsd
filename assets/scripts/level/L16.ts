// L16 - 两关
// 第六关：两道机关门需按顺序解锁，双蜘蛛分别封左右通道，双地刺卡节奏
import { ENTITY_DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, TILE_TYPE_ENUM } from './../Enum';

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
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=1 蜘蛛A H→
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=3 开关2 O
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=4
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_2_1' },  // y=5
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    // x=2
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_2' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=1 石块S（挡蜘蛛A）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=3 地刺T1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=4
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },  // y=5
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    // x=3
    [
        { type: TILE_TYPE_ENUM.FLOOR, name: 'd_0_2' },  // y=0 出口门E
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=1 机关门G2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=2 机关门G1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=3
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=4
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },  // y=5 玩家P
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    // x=4
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_5' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=2 地刺T2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=3 石块S（挡蜘蛛B）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=4
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },  // y=5
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    // x=5
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_6' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },  // y=1 钥匙K
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },  // y=2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },  // y=3 蜘蛛B H←
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },  // y=4 开关1 O
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

const doors = [{
    type: ENTITY_TYPE_ENUM.DOOR,
    x: 3, y: 0,
    dir: ENTITY_DIRECTION_ENUM.DOWN,
    state: ENTITY_STATE_ENUM.IDLE,
}]

// 钥匙在y=1右侧，石块x=2,y=1挡蜘蛛A，x=3..5,y=1安全
const key = {
    type: ENTITY_TYPE_ENUM.KEY,
    x: 5, y: 1,
    dir: ENTITY_DIRECTION_ENUM.UP,
    state: ENTITY_STATE_ENUM.IDLE,
}

// 蜘蛛A x=1,y=1 RIGHT：封y=1行，石块x=2,y=1挡住
// 蜘蛛B x=5,y=3 LEFT：封y=3行，石块x=4,y=3挡住
const spiders = [
    {
        type: ENTITY_TYPE_ENUM.SPIDER,
        x: 1, y: 1,
        dir: ENTITY_DIRECTION_ENUM.RIGHT,
        state: ENTITY_STATE_ENUM.IDLE,
    },
    {
        type: ENTITY_TYPE_ENUM.SPIDER,
        x: 5, y: 3,
        dir: ENTITY_DIRECTION_ENUM.LEFT,
        state: ENTITY_STATE_ENUM.IDLE,
    },
]

// 机关门G1 x=3,y=2（ATTACK），踩x=5,y=4开关1后开启
// 机关门G2 x=3,y=1（ATTACK），踩x=1,y=3开关2后开启
const floor_traps = [
    {
        type: ENTITY_TYPE_ENUM.FLOOR_TRAP,
        x: 3, y: 2,
        dir: ENTITY_DIRECTION_ENUM.DOWN,
        state: ENTITY_STATE_ENUM.ATTACK,
        entityId: 'l16_ft_1',
    },
    {
        type: ENTITY_TYPE_ENUM.FLOOR_TRAP,
        x: 3, y: 1,
        dir: ENTITY_DIRECTION_ENUM.DOWN,
        state: ENTITY_STATE_ENUM.ATTACK,
        entityId: 'l16_ft_2',
    },
]

const floor_trap_switches = [
    {
        type: ENTITY_TYPE_ENUM.FLOOR_TRAP_SWITCH,
        x: 5, y: 4,
        dir: ENTITY_DIRECTION_ENUM.DOWN,
        state: ENTITY_STATE_ENUM.IDLE,
        entityId: 'l16_ft_1',
    },
    {
        type: ENTITY_TYPE_ENUM.FLOOR_TRAP_SWITCH,
        x: 1, y: 3,
        dir: ENTITY_DIRECTION_ENUM.DOWN,
        state: ENTITY_STATE_ENUM.IDLE,
        entityId: 'l16_ft_2',
    },
]

// 地刺T1 x=2,y=3（路过开关2前必经）
// 地刺T2 x=4,y=2（试图抄近道上行必踩）
const floor_spikes = [
    {
        type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_ONE,
        x: 2, y: 3,
        dir: ENTITY_DIRECTION_ENUM.DOWN,
        state: ENTITY_STATE_ENUM.IDLE,
        numCurrent: 0,
    },
    {
        type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_ONE,
        x: 4, y: 2,
        dir: ENTITY_DIRECTION_ENUM.DOWN,
        state: ENTITY_STATE_ENUM.IDLE,
        numCurrent: 0,
    },
]

// 石块x=2,y=1：挡蜘蛛A，x=3..5,y=1安全
// 石块x=4,y=3：挡蜘蛛B，x=1..3,y=3安全
const stones = [
    {
        type: ENTITY_TYPE_ENUM.STONE,
        x: 2, y: 1,
        dir: ENTITY_DIRECTION_ENUM.UP,
        state: ENTITY_STATE_ENUM.IDLE,
    },
    {
        type: ENTITY_TYPE_ENUM.STONE,
        x: 4, y: 3,
        dir: ENTITY_DIRECTION_ENUM.UP,
        state: ENTITY_STATE_ENUM.IDLE,
    },
]

export default {
    map, player, doors, key,
    spiders, floor_traps, floor_trap_switches,
    floor_spikes, stones,
}
