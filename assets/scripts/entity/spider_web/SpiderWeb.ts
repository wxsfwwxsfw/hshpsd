// Created by carolsail 

import { ENTITY_STATE_ENUM, TILE_INFO_ENUM } from './../../Enum';
import Entity from "../Entity";
import { IEntity } from "../../level/Index";
import SpiderWebFsm from './SpiderWebFsm';
import { randomByRange } from '../../Util';

export default class SpiderWeb extends Entity {
    async init(data: IEntity) {
        // 动画
        this.fsm = this.node.addComponent(SpiderWebFsm)
        await Promise.all([this.fsm.init()])
        // 初始化
        const random = randomByRange(30, 75)
        const params = Object.assign(data, { width: random, height: random })
        super.init(params)
    }
}
