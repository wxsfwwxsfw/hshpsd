// Created by carolsail 

import Entity from "../Entity";
import { TILE_INFO_ENUM } from "../../Enum";
import { IEntity } from "../../level/Index";
import DustFsm from "./DustFsm";
import DataManager from "../../runtime/DataManager";

export default class Dust extends Entity {

    async init(data: IEntity) {
        // 动画
        this.fsm = this.node.addComponent(DustFsm)
        await Promise.all([this.fsm.init()])
        // 初始化
        const params = Object.assign(data, { width: DataManager.instance.currentLevelTileWidth * 2, height: DataManager.instance.currentLevelTileWidth * 2, offsetY: 8 })
        super.init(params)
    }
}
