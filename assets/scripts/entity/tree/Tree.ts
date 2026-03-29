// Created by carolsail 

import { ENTITY_TYPE_ENUM, EVENT_ENUM, TILE_INFO_ENUM } from '../../Enum';
import Entity from "../Entity";
import { IEntity } from "../../level/Index";
import DataManager from '../../runtime/DataManager';
import TreeFsm from './TreeFsm';
import EventManager from '../../runtime/EventManager';

export default class Tree extends Entity {
    async init(data: IEntity) {
        // 动画
        this.fsm = this.node.addComponent(TreeFsm)
        await Promise.all([this.fsm.init()])
        // 初始化
        // const params = Object.assign(data, { width: DataManager.instance.currentLevelTileWidth - 10, height: DataManager.instance.currentLevelTileWidth - 10 })
        const params = Object.assign(data, { width: DataManager.instance.currentLevelTileWidth, height: DataManager.instance.currentLevelTileWidth, offsetY: 0 })
        super.init(params)

        // 事件
        // EventManager.instance.on(EVENT_ENUM.ENTITY_STEP_FINISHED, this.onStepFinished, this)
    }

    // onStepFinished(entity: Entity): void {
    //     console.log('tree------------onStepFinished', entity)
    //     if (!entity) return
    //     switch (entity.type) {
    //         case ENTITY_TYPE_ENUM.PLAYER:

    //             break
    //     }
    // }
}