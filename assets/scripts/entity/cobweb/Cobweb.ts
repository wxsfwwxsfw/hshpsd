// Created by carolsail 

import { TILE_INFO_ENUM } from '../../Enum';
import Entity from "../Entity";
import { IEntity } from "../../level/Index";
import DataManager from '../../runtime/DataManager';
import CobwebFsm from './CobwebFsm';

export default class Cobweb extends Entity {
    async init(data: IEntity) {
        // 动画
        this.fsm = this.node.addComponent(CobwebFsm)
        await Promise.all([this.fsm.init()])
        // 初始化
        // const params = Object.assign(data, { width: DataManager.instance.currentLevelTileWidth - 10, height: DataManager.instance.currentLevelTileWidth - 10 })
        const params = Object.assign(data, { width: DataManager.instance.currentLevelTileWidth, height: DataManager.instance.currentLevelTileWidth, offsetY: -10 })
        super.init(params)
    }
}
