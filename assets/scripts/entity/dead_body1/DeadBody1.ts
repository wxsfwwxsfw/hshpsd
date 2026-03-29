// Created by carolsail 

import { TILE_INFO_ENUM } from '../../Enum';
import Entity from "../Entity";
import { IEntity } from "../../level/Index";
import DataManager from '../../runtime/DataManager';
import DeadBody1Fsm from './DeadBody1Fsm';

export default class DeadBody1 extends Entity {
    async init(data: IEntity) {
        // 动画
        this.fsm = this.node.addComponent(DeadBody1Fsm)
        await Promise.all([this.fsm.init()])
        // 初始化
        // const params = Object.assign(data, { width: DataManager.instance.currentLevelTileWidth - 10, height: DataManager.instance.currentLevelTileWidth - 10 })
        const params = Object.assign(data, { width: DataManager.instance.currentLevelTileWidth, height: DataManager.instance.currentLevelTileWidth / 1.68, offsetY: 0 })
        super.init(params)
    }
}