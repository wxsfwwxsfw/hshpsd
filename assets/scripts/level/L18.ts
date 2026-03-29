// L18 - 绝境
// 第八关：三蜘蛛全方位封锁，必须用桃子遮挡视线，双地刺卡节奏，最高难度
import { ENTITY_DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, TILE_TYPE_ENUM } from './../Enum';

// 布局要点：
// 蜘蛛C x=5,y=5 LEFT：威胁y=5行，石块x=4,y=5保护x=1..3,y=5（玩家出生区）
// 蜘蛛A x=1,y=3 RIGHT：威胁y=3行，桃子投到x=2,y=3遮挡（草x=2,y=2控制落点）
// 蜘蛛B x=5,y=2 DOWN：威胁x=5列y=3+，钥匙在x=5,y=1（y=1<y=2安全）
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
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },  // y=2 草C（使桃子停在y=3）
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
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=3 地刺T1（双孔）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=4
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },  // y=5 玩家P
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    // x=4
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_5' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=1 地刺T2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=3 石块S（挡蜘蛛A）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=4
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },  // y=5 石块S（挡蜘蛛C）
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    // x=5
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_6' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },  // y=1 钥匙K（蜘蛛B之上，安全）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },  // y=2 蜘蛛B H↓
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },  // y=3
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },  // y=4
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_2_2' },  // y=5 蜘蛛C H←
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

// 钥匙x=5,y=1：蜘蛛B在x=5,y=2朝下，y=1在蜘蛛上方，不被攻击
const key = {
    type: ENTITY_TYPE_ENUM.KEY,
    x: 5, y: 1,
    dir: ENTITY_DIRECTION_ENUM.UP,
    state: ENTITY_STATE_ENUM.IDLE,
}

// 桃子x=1,y=5：石块x=4,y=5遮挡蜘蛛C，x=1..3,y=5安全可拾取
const peaches = [{
    type: ENTITY_TYPE_ENUM.PEACH,
    x: 1, y: 5,
    dir: ENTITY_DIRECTION_ENUM.UP,
    state: ENTITY_STATE_ENUM.IDLE,
}]

// 蜘蛛A x=1,y=3 RIGHT：威胁y=3行，必须用桃子在x=2,y=3遮挡
// 蜘蛛B x=5,y=2 DOWN：威胁x=5列y=3..5，取钥匙绕道y=1
// 蜘蛛C x=5,y=5 LEFT：威胁y=5行，石块x=4,y=5遮挡（x=1..3,y=5安全）
const spiders = [
    {
        type: ENTITY_TYPE_ENUM.SPIDER,
        x: 1, y: 3,
        dir: ENTITY_DIRECTION_ENUM.RIGHT,
        state: ENTITY_STATE_ENUM.IDLE,
    },
    {
        type: ENTITY_TYPE_ENUM.SPIDER,
        x: 5, y: 2,
        dir: ENTITY_DIRECTION_ENUM.DOWN,
        state: ENTITY_STATE_ENUM.IDLE,
    },
    {
        type: ENTITY_TYPE_ENUM.SPIDER,
        x: 5, y: 5,
        dir: ENTITY_DIRECTION_ENUM.LEFT,
        state: ENTITY_STATE_ENUM.IDLE,
    },
]

// 机关门x=3,y=1（ATTACK），踩x=1,y=4开关后开启
const floor_traps = [{
    type: ENTITY_TYPE_ENUM.FLOOR_TRAP,
    x: 3, y: 1,
    dir: ENTITY_DIRECTION_ENUM.DOWN,
    state: ENTITY_STATE_ENUM.ATTACK,
    entityId: 'l18_ft_1',
}]

const floor_trap_switches = [{
    type: ENTITY_TYPE_ENUM.FLOOR_TRAP_SWITCH,
    x: 1, y: 4,
    dir: ENTITY_DIRECTION_ENUM.DOWN,
    state: ENTITY_STATE_ENUM.IDLE,
    entityId: 'l18_ft_1',
}]

// 地刺T1 x=3,y=3 双孔：穿越y=3唯一通路，节奏严苛
// 地刺T2 x=4,y=1 单孔：取钥匙返回出口必经
const floor_spikes = [
    {
        type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_TWO,
        x: 3, y: 3,
        dir: ENTITY_DIRECTION_ENUM.DOWN,
        state: ENTITY_STATE_ENUM.IDLE,
        numCurrent: 0,
    },
    {
        type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_ONE,
        x: 4, y: 1,
        dir: ENTITY_DIRECTION_ENUM.DOWN,
        state: ENTITY_STATE_ENUM.IDLE,
        numCurrent: 0,
    },
]

// 石块x=4,y=3：挡蜘蛛A，使x=5,y=3安全（但蜘蛛B在那列，实际无法去x=5,y=3+）
// 石块x=4,y=5：挡蜘蛛C，使x=1..3,y=5安全（玩家出生区和桃子取放区）
const stones = [
    {
        type: ENTITY_TYPE_ENUM.STONE,
        x: 4, y: 3,
        dir: ENTITY_DIRECTION_ENUM.UP,
        state: ENTITY_STATE_ENUM.IDLE,
    },
    {
        type: ENTITY_TYPE_ENUM.STONE,
        x: 4, y: 5,
        dir: ENTITY_DIRECTION_ENUM.UP,
        state: ENTITY_STATE_ENUM.IDLE,
    },
]

// 草x=2,y=2：阻止桃子上滑，使桃子精确停在x=2,y=3遮挡蜘蛛A视线
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
