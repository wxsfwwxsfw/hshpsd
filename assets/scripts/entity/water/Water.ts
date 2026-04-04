// Created by carolsail

import { TILE_INFO_ENUM } from './../../Enum';
import Entity from "../Entity";
import { IEntity } from "../../level/Index";
import WaterFsm from './WaterFsm';
import DataManager from '../../runtime/DataManager';

export default class Water extends Entity {
    async init(data: IEntity) {
        this.fsm = this.node.addComponent(WaterFsm)
        await Promise.all([this.fsm.init()])

        // Water should read as sitting inside the floor tile, not edge-to-edge
        // with the full cell bounds, otherwise it visually bleeds past the grout.
        const inset = Math.max(8, Math.floor(DataManager.instance.currentLevelTileWidth * 0.12))
        const params = Object.assign(data, {
            width: DataManager.instance.currentLevelTileWidth - inset,
            height: DataManager.instance.currentLevelTileWidth - inset,
        })
        super.init(params)
    }
}
