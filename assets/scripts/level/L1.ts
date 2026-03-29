// L1 - 贪桃 (Greedy Peach)
// 教学第一关：钥匙开门，贪桃致死
import { ENTITY_DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, TILE_TYPE_ENUM } from './../Enum';

// 7×7 map: map[x][y], x=0..6(左→右), y=0..6(上→下)
// 可行走区域: x=1..5, y=1..5
// 门位行: y=0, 门在 x=3
const map = [
    // x=0: 左边界
    [
        { type: TILE_TYPE_ENUM.WALL, name: '' },
        { type: TILE_TYPE_ENUM.WALL, name: 'w_left_0' },
        { type: TILE_TYPE_ENUM.WALL, name: 'w_left_1' },
        { type: TILE_TYPE_ENUM.WALL, name: 'w_left_0' },
        { type: TILE_TYPE_ENUM.WALL, name: 'w_left_1' },
        { type: TILE_TYPE_ENUM.WALL, name: 'w_left_0' },
        { type: TILE_TYPE_ENUM.WALL, name: '' },
    ],
    // x=1: 第1列可走区域（玩家出生列 & 黄蜘蛛列）
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_1' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_1' },  // y=1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=3 ← 玩家出生 x1y3
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=4 ← 黄蜘蛛 x1y4
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_2_1' },  // y=5
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    // x=2: 第2列（小草 y=2，木桶 y=3）
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_2' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=2 ← 小草 x2y2 (可通行)
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=3 ← 木桶 x2y3 (实体阻挡)
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=4
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },  // y=5
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    // x=3: 第3列（门列 y=0，通关主线列）
    [
        { type: TILE_TYPE_ENUM.FLOOR, name: 'd_0_2' },  // y=0 ← 门 x3y0
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=3
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=4
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },  // y=5
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    // x=4: 第4列（桃子 y=4）
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_5' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=3
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_0_1' },  // y=4 ← 桃子 x4y4 (诱饵)
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_2' },  // y=5
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    // x=5: 第5列（钥匙 y=5）
    [
        { type: TILE_TYPE_ENUM.WALL, name: 'w_0_6' },
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },  // y=1
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },  // y=2
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },  // y=3
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_1_3' },  // y=4
        { type: TILE_TYPE_ENUM.FLOOR, name: 'f_2_2' },  // y=5 ← 钥匙 x5y5
        { type: TILE_TYPE_ENUM.WALL, name: 'w_down_0' },
    ],
    // x=6: 右边界
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

// 玩家出生点 x3y5
const player = {
    type: ENTITY_TYPE_ENUM.PLAYER,
    x: 3,
    y: 5,
    dir: ENTITY_DIRECTION_ENUM.LEFT,
    state: ENTITY_STATE_ENUM.IDLE,
}

// 出口门 x3y0
const doors = [{
    type: ENTITY_TYPE_ENUM.DOOR,
    x: 3,
    y: 0,
    dir: ENTITY_DIRECTION_ENUM.DOWN,
    state: ENTITY_STATE_ENUM.IDLE
}]

// 钥匙 x5y1（使用新资源 yaosi.png）
const key = {
    type: ENTITY_TYPE_ENUM.KEY,
    x: 5,
    y: 1,
    dir: ENTITY_DIRECTION_ENUM.LEFT,
    state: ENTITY_STATE_ENUM.IDLE,
}

// 黄蜘蛛 x4y5，朝向 UP，攻击 x=4 列上所有目标
// 玩家走到 x4y2 时，蜘蛛攻击路径 y5→y2（x=4 列无阻挡）
const spiders = [{
    type: ENTITY_TYPE_ENUM.SPIDER,
    x: 4,
    y: 5,
    dir: ENTITY_DIRECTION_ENUM.UP,
    state: ENTITY_STATE_ENUM.IDLE,
}]

// 小草 x2y4（装饰，可通行，使用新资源 xiaocao.png）
const grass = [{
    type: ENTITY_TYPE_ENUM.GRASS,
    x: 2,
    y: 4,
    dir: ENTITY_DIRECTION_ENUM.LEFT,
    state: ENTITY_STATE_ENUM.IDLE,
}]

// 石头 x3y3（静态障碍，不可通行，不可推动）
const stones = [{
    type: ENTITY_TYPE_ENUM.STONE,
    x: 3,
    y: 3,
    dir: ENTITY_DIRECTION_ENUM.LEFT,
    state: ENTITY_STATE_ENUM.IDLE,
}]

// 桃子 x4y2（诱饵，可通行，使用新资源 tao.png）
// 玩家走到此格 → 黄蜘蛛攻击 → 死亡
const peaches = [{
    type: ENTITY_TYPE_ENUM.PEACH,
    x: 4,
    y: 2,
    dir: ENTITY_DIRECTION_ENUM.LEFT,
    state: ENTITY_STATE_ENUM.IDLE,
}]

export default {
    map,
    player,
    doors,
    key,
    spiders,
    grass,
    stones,
    peaches,
}
