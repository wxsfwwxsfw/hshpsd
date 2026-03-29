// L15 - 双煞
// 第五关：双蜘蛛夹击，必须投掷桃子遮挡视线才能安全穿越
import { ENTITY_DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, TILE_TYPE_ENUM } from './../Enum';

// 7×7 map
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
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=3 蜘蛛A H→
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=4 开关O
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_2_1' },  // y=5 桃子A
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    // x=2
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_2' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },  // y=2 草C（阻桃子上滑）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=3 桃子落点
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=4 桃子投掷站位
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },  // y=5
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    // x=3
    [
        { type: TILE_TYPE_ENUM.FLOOR, name: 'd_0_2' },  // y=0 出口门E
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=1 机关门G
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=3 地刺T
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=4
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },  // y=5 玩家P
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    // x=4
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_5' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=3
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=4 石块S（挡蜘蛛B）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },  // y=5
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    // x=5
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_6' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },  // y=1 钥匙K
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },  // y=2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },  // y=3
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },  // y=4 蜘蛛B H←
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

const key = {
    type: ENTITY_TYPE_ENUM.KEY,
    x: 5, y: 1,
    dir: ENTITY_DIRECTION_ENUM.UP,
    state: ENTITY_STATE_ENUM.IDLE,
}

// 桃子A x=1,y=5：拾取后站在x=2,y=4向上投，落x=2,y=3遮挡蜘蛛A视线
const peaches = [{
    type: ENTITY_TYPE_ENUM.PEACH,
    x: 1, y: 5,
    dir: ENTITY_DIRECTION_ENUM.UP,
    state: ENTITY_STATE_ENUM.IDLE,
}]

// 蜘蛛A x=1,y=3 RIGHT：威胁y=3行（桃子落x=2,y=3后视线被遮）
// 蜘蛛B x=5,y=4 LEFT：威胁y=4行（石块x=4,y=4保护x=1..3）
const spiders = [
    {
        type: ENTITY_TYPE_ENUM.SPIDER,
        x: 1, y: 3,
        dir: ENTITY_DIRECTION_ENUM.RIGHT,
        state: ENTITY_STATE_ENUM.IDLE,
    },
    {
        type: ENTITY_TYPE_ENUM.SPIDER,
        x: 5, y: 4,
        dir: ENTITY_DIRECTION_ENUM.LEFT,
        state: ENTITY_STATE_ENUM.IDLE,
    },
]

// 机关门x=3,y=1（初始ATTACK），踩开关x=1,y=4后开启
const floor_traps = [{
    type: ENTITY_TYPE_ENUM.FLOOR_TRAP,
    x: 3, y: 1,
    dir: ENTITY_DIRECTION_ENUM.DOWN,
    state: ENTITY_STATE_ENUM.ATTACK,
    entityId: 'l15_ft_1',
}]

const floor_trap_switches = [{
    type: ENTITY_TYPE_ENUM.FLOOR_TRAP_SWITCH,
    x: 1, y: 4,
    dir: ENTITY_DIRECTION_ENUM.DOWN,
    state: ENTITY_STATE_ENUM.IDLE,
    entityId: 'l15_ft_1',
}]

// 地刺x=3,y=3：穿越y=3行的核心险点
const floor_spikes = [{
    type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_ONE,
    x: 3, y: 3,
    dir: ENTITY_DIRECTION_ENUM.DOWN,
    state: ENTITY_STATE_ENUM.IDLE,
    numCurrent: 0,
}]

// 石块x=4,y=4：阻挡蜘蛛B视线，y=4行x=1..3安全
const stones = [{
    type: ENTITY_TYPE_ENUM.STONE,
    x: 4, y: 4,
    dir: ENTITY_DIRECTION_ENUM.UP,
    state: ENTITY_STATE_ENUM.IDLE,
}]

// 草x=2,y=2：阻止桃子继续上滑，使桃子精确停在x=2,y=3
const grass = [{
    type: ENTITY_TYPE_ENUM.GRASS,
    x: 2, y: 2,
    dir: ENTITY_DIRECTION_ENUM.UP,
    state: ENTITY_STATE_ENUM.IDLE,
}]

export default {
    map, player, doors, key,
    peaches, spiders, floor_traps, floor_trap_switches,
    floor_spikes, stones, grass,
}
