// Created by carolsail 

import { TILE_INFO_ENUM } from '../../Enum';
import Entity from "../Entity";
import { IEntity } from "../../level/Index";
import DataManager from '../../runtime/DataManager';
import CobwebSpecialFsm from './CobwebSpecialFsm';

export default class CobwebSpecial extends Entity {
    async init(data: IEntity) {
        // 动画
        this.fsm = this.node.addComponent(CobwebSpecialFsm)
        await Promise.all([this.fsm.init()])
        // 初始化
        // const params = Object.assign(data, { width: DataManager.instance.currentLevelTileWidth - 10, height: DataManager.instance.currentLevelTileWidth - 10 })
        const params = Object.assign(data, { width: DataManager.instance.currentLevelTileWidth * 0.7, height: DataManager.instance.currentLevelTileWidth, offsetY: -40 })
        super.init(params)
    }
}
