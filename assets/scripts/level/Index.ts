// Created by carolsail

import { IInventoryItem } from '../runtime/DataManager';
import { ENTITY_DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, TILE_TYPE_ENUM, TIP_NODE_ENUM, ENTITY_AI_TYPE } from './../Enum';
import L1 from "./L1"
import L2 from "./L2"
import L3 from "./L3"
import L4 from "./L4"
import L5 from "./L5"
import L6_file from "./L6"
import L7 from "./L7"
import L8 from "./L8"
import L9 from "./L9"
import L10 from "./L10"
import L11 from "./L11"
import L12 from "./L12"
import L13 from "./L13"
import L14 from "./L14"
import L15 from "./L15"
import L16 from "./L16"
import L17 from "./L17"
import L18 from "./L18"
import L19_file from "./L19"
import L20 from "./L20"
import L21 from "./L21"
import L22 from "./L22"
import L23 from "./L23"
import L24 from "./L24"
import L25 from "./L25"
import L26 from "./L26"
import L27 from "./L27"
import L28 from "./L28"
import L29 from "./L29"
import L30 from "./L30"
import L31 from "./L31"
import L32 from "./L32"
import L33 from "./L33"
import L34 from "./L34"
import L35 from "./L35"
import L36 from "./L36"
import L37 from "./L37"
import L38 from "./L38"
import L39 from "./L39"
import L40 from "./L40"
import L41 from "./L41"
import L42 from "./L42"
import L43 from "./L43"
import L44 from "./L44"
import L45 from "./L45"
import L46 from "./L46"
import L47 from "./L47"
import L48 from "./L48"
import L49 from "./L49"
import L50 from "./L50"

export const LEVEL_COUNT = 50

export interface ILevelInfo {
    map: Array<Array<{ type: TILE_TYPE_ENUM | null, name?: string }>>,
    //+++++新增实体
    stele?: IEntity,
    grass?: IEntity[],
    stones?: IEntity[],
    tree?: IEntity,
    black_dusts?: IEntity[],
    cobwebs?: IEntity[],
    cobweb_specils?: IEntity[],
    cocoon1s?: IEntity[],
    cocoon2s?: IEntity[],
    dead_body1s?: IEntity[],
    dead_body2s?: IEntity[],
    expressions?: IEntity[],
    spiderzs?: IEntity[],
    peaches?: IEntity[],
    mushrooms?: IEntity[],
    //+++++

    player: IEntity,
    weapon?: IEntity,
    doors?: IEntity[],
    key?: IEntity,
    pots?: IEntity[],
    beetles?: IEntity[],
    spiders?: IEntity[],
    waters?: IEntity[],
    skull_heads?: IEntity[],
    boxes?: IEntity[],
    floor_brokens?: IEntity[],
    floor_traps?: IEntity[],
    floor_trap_switches?: IEntity[],
    floor_spikes?: IEntity[],
    pigs?: IEntity[],
    water_lilies?: IEntity[],
    spikes?: IEntity[],
    mouses?: IEntity[],
    bombs?: IEntity[],
    shovel?: IEntity,
    dirtpiles?: IEntity[],
    skeletons?: IEntity[],
    items?: Array<IInventoryItem>,
    tip?: TIP_NODE_ENUM,
}

export interface IEntity {
    type: ENTITY_TYPE_ENUM,
    x: number,
    y: number,
    dir?: ENTITY_DIRECTION_ENUM,
    state?: ENTITY_STATE_ENUM,
    subLevel?: ISubLevelData,
    entityId?: string,
    numCurrent?: number,
    aiType?: ENTITY_AI_TYPE,
}

export interface ISubLevelData {
    from: string,
    to: string
}

export default {
    L1,
    L2,
    L3,
    L4,
    L5,
    L6: L19_file,
    L7,
    L8,
    L9,
    L10,
    L11,
    L12,
    L13,
    L14,
    L15,
    L16,
    L17,
    L18,
    L19: L6_file,
    L20,
    L21,
    L22,
    L23,
    L24,
    L25,
    L26,
    L27,
    L28,
    L29,
    L30,
    L31,
    L32,
    L33,
    L34,
    L35,
    L36,
    L37,
    L38,
    L39,
    L40,
    L41,
    L42,
    L43,
    L44,
    L45,
    L46,
    L47,
    L48,
    L49,
    L50,
}
