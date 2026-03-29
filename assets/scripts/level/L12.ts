// L12 - 骸骨
// 第十二关：引入骷髅（SKELETON跟随型）和蜘蛛尸（SPIDERZ）——箱子遮挡SPIDERZ，
// 骷髅紧追玩家，须在移动中保持安全距离并取钥匙通关，难度大幅跃升
import { ENTITY_DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, TILE_TYPE_ENUM, ENTITY_AI_TYPE } from './../Enum';

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
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=2 钥匙K
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=3 骷髅SKE（追玩家）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_2_1' },
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_2' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=3 箱子B（推向x=3挡SPIDERZ）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.FLOOR, name: 'd_0_2' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=1 机关门G（l12_ft_1）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=2 地刺T
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=3 SPIDERZ（朝DOWN）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=4 开关O（l12_ft_1）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },   // y=5 玩家@
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_5' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },   // y=4 石块S
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_6' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },   // y=2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },   // y=3 蜘蛛SPD←（右侧守卫）
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },   // y=4
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
    x: 1,
    y: 2,
    dir: ENTITY_DIRECTION_ENUM.UP,
    state: ENTITY_STATE_ENUM.IDLE,
}

// 骷髅 x=1,y=3（追踪型AI，跟随玩家移动）
const skeletons = [{
    type: ENTITY_TYPE_ENUM.SKELETON,
    x: 1,
    y: 3,
    dir: ENTITY_DIRECTION_ENUM.DOWN,
    state: ENTITY_STATE_ENUM.IDLE,
    aiType: ENTITY_AI_TYPE.MOVE_FOLLOW,
}]

// SPIDERZ x=3,y=3（蜘蛛尸，朝DOWN方向攻击）；箱子x=2,y=3可推到x=3,y=3前方遮挡
const spiderzs = [{
    type: ENTITY_TYPE_ENUM.SPIDERZ,
    x: 3,
    y: 3,
    dir: ENTITY_DIRECTION_ENUM.DOWN,
    state: ENTITY_STATE_ENUM.IDLE,
}]

// 箱子 x=2,y=3（推入x=3,y=3？不行，SPIDERZ在此；实际推向不同方向创造遮挡）
// 箱子x=4,y=2（可推向x=3,y=2遮挡SPIDERZ向上射线）
const boxes = [
    { type: ENTITY_TYPE_ENUM.BOX, x: 4, y: 2, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.BOX, x: 2, y: 4, dir: ENTITY_DIRECTION_ENUM.DOWN, state: ENTITY_STATE_ENUM.IDLE },
]

// 蜘蛛 x=5,y=3（朝LEFT守右列）
const spiders = [{
    type: ENTITY_TYPE_ENUM.SPIDER,
    x: 5,
    y: 3,
    dir: ENTITY_DIRECTION_ENUM.LEFT,
    state: ENTITY_STATE_ENUM.IDLE,
}]

// 地刺 x=3,y=2（双孔，卡穿越机关门节奏）
const floor_spikes = [{
    type: ENTITY_TYPE_ENUM.FLOOR_SPIKE_TWO,
    x: 3,
    y: 2,
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
    entityId: 'l12_ft_1',
}]

const floor_trap_switches = [{
    type: ENTITY_TYPE_ENUM.FLOOR_TRAP_SWITCH,
    x: 3,
    y: 4,
    dir: ENTITY_DIRECTION_ENUM.DOWN,
    state: ENTITY_STATE_ENUM.IDLE,
    entityId: 'l12_ft_1',
}]

const stones = [
    { type: ENTITY_TYPE_ENUM.STONE, x: 4, y: 4, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
    { type: ENTITY_TYPE_ENUM.STONE, x: 2, y: 1, dir: ENTITY_DIRECTION_ENUM.UP, state: ENTITY_STATE_ENUM.IDLE },
]

const items = [{ type: ENTITY_TYPE_ENUM.WEAPON, num: 1 }]

export default {
    map,
    player,
    doors,
    key,
    skeletons,
    spiderzs,
    boxes,
    spiders,
    floor_spikes,
    floor_traps,
    floor_trap_switches,
    stones,
    items,
}
