// Created by carolsail 

import { TILE_INFO_ENUM } from '../../Enum';
import Entity from "../Entity";
import { IEntity } from "../../level/Index";
import DataManager from '../../runtime/DataManager';
import DeadBody2Fsm from './DeadBody2Fsm';

export default class DeadBody2 extends Entity {
    async init(data: IEntity) {
        // 动画
        this.fsm = this.node.addComponent(DeadBody2Fsm)
        await Promise.all([this.fsm.init()])
        // 初始化
        // const params = Object.assign(data, { width: DataManager.instance.currentLevelTileWidth - 10, height: DataManager.instance.currentLevelTileWidth - 10 })
        const params = Object.assign(data, { width: DataManager.instance.currentLevelTileWidth * 1.2, height: DataManager.instance.currentLevelTileWidth * 0.648, offsetY: 0 })
        super.init(params)
    }
}
