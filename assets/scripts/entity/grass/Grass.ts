// Created by carolsail 

import { TILE_INFO_ENUM } from '../../Enum';
import Entity from "../Entity";
import { IEntity } from "../../level/Index";
import DataManager from '../../runtime/DataManager';
import GrassFsm from './GrassFsm';

export default class Grass extends Entity {
    async init(data: IEntity) {
        // 动画
        this.fsm = this.node.addComponent(GrassFsm)
        await Promise.all([this.fsm.init()])
        // 初始化
        // const params = Object.assign(data, { width: DataManager.instance.currentLevelTileWidth - 10, height: DataManager.instance.currentLevelTileWidth - 10 })
        const params = Object.assign(data, { width: 70, height: 70 })
        super.init(params)
    }
}
