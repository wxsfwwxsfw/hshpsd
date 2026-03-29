// Created by carolsail 

import Singleton from "../Singleton";
import FadeManager from "../effect/FadeManager";

export default class LayerManager extends Singleton {

    static get instance() {
        return super.getInstance<LayerManager>()
    }

    fadeIn(seconds?: number){
        return cc.find('FadeLayer')?.getComponent(FadeManager).fadeIn(seconds)
    }

    fadeOut(seconds?: number){
        return cc.find('FadeLayer')?.getComponent(FadeManager).fadeOut(seconds)
    }
}
