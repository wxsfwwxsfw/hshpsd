// Created by carolsail 

import { TILE_INFO_ENUM } from '../../Enum';
import Entity from "../Entity";
import { IEntity } from "../../level/Index";
import DataManager from '../../runtime/DataManager';
import ExpressionFsm from './ExpressionFsm';

export default class Expression extends Entity {
    async init(data: IEntity) {
        // 动画
        this.fsm = this.node.addComponent(ExpressionFsm)
        await Promise.all([this.fsm.init()])
        // 初始化
        // const params = Object.assign(data, { width: DataManager.instance.currentLevelTileWidth - 10, height: DataManager.instance.currentLevelTileWidth - 10 })
        const params = Object.assign(data, { width: DataManager.instance.currentLevelTileWidth * 0.3, height: DataManager.instance.currentLevelTileWidth * 0.3, offsetY: DataManager.instance.currentLevelTileWidth * 0.5 })
        super.init(params)
    }
}
