// Created by carolsail 

import { TILE_INFO_ENUM } from '../../Enum';
import Entity from "../Entity";
import { IEntity } from "../../level/Index";
import DataManager from '../../runtime/DataManager';
import SteleFsm from './SteleFsm';

export default class Stele extends Entity {
    async init(data: IEntity) {
        // 动画
        this.fsm = this.node.addComponent(SteleFsm)
        await Promise.all([this.fsm.init()])
        // 初始化
        // const params = Object.assign(data, { width: DataManager.instance.currentLevelTileWidth - 10, height: DataManager.instance.currentLevelTileWidth - 10 })
        const params = Object.assign(data, { width: DataManager.instance.currentLevelTileWidth - 32, height: (DataManager.instance.currentLevelTileWidth - 32) * 1.688, offsetY: 0 })
        super.init(params)
    }
}
