// Created by carolsail 

import { AUDIO_EFFECT_ENUM, EVENT_ENUM, GAME_SCENE_ENUM } from "../Enum";
import DataManager from "../runtime/DataManager";
import EventManager from "../runtime/EventManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class AudioManager extends cc.Component {

    @property(cc.AudioClip)
    game_bgm: cc.AudioClip = null
    @property(cc.AudioClip)
    game_click: cc.AudioClip = null
    @property(cc.AudioClip)
    player_attack: cc.AudioClip = null
    @property(cc.AudioClip)
    player_collect: cc.AudioClip = null
    @property(cc.AudioClip)
    player_throw: cc.AudioClip = null
    @property(cc.AudioClip)
    player_move_block: cc.AudioClip = null
    @property(cc.AudioClip)
    player_die: cc.AudioClip = null
    @property(cc.AudioClip)
    floor_spike: cc.AudioClip = null
    @property(cc.AudioClip)
    floor_trap: cc.AudioClip = null
    @property(cc.AudioClip)
    floor_broken: cc.AudioClip = null
    @property(cc.AudioClip)
    beatle_die: cc.AudioClip = null
    @property(cc.AudioClip)
    pot_die: cc.AudioClip = null
    @property(cc.AudioClip)
    spider_attack: cc.AudioClip = null
    @property(cc.AudioClip)
    spider_die: cc.AudioClip = null
    @property(cc.AudioClip)
    box_move: cc.AudioClip = null
    @property(cc.AudioClip)
    pig_notice: cc.AudioClip = null
    @property(cc.AudioClip)
    bomb: cc.AudioClip = null

    onLoad(){
        // 常驻节点（多场景共用）
        cc.game.addPersistRootNode(this.node)
        EventManager.instance.on(EVENT_ENUM.EFFECT_AUDIO_PLAY, this.onAudioPlay, this)
    }

    onAudioPlay(type: AUDIO_EFFECT_ENUM){
        if(DataManager.instance.isAudioEnable){
            cc.audioEngine.setMusicVolume(0.2)
            if(!cc.audioEngine.isMusicPlaying()) cc.audioEngine.playMusic(this.game_bgm, true)
        }else{
            cc.audioEngine.stopMusic()
        }

        if(!DataManager.instance.isAudioEnable) return

        if(!type) return

        switch(type){
            case AUDIO_EFFECT_ENUM.GAME_CLICK:
                cc.audioEngine.playEffect(this.game_click, false)
            break
            case AUDIO_EFFECT_ENUM.PLAYER_ATTACK:
                cc.audioEngine.playEffect(this.player_attack, false)
            break
            case AUDIO_EFFECT_ENUM.PLAYER_COLLECT:
                cc.audioEngine.playEffect(this.player_collect, false)
            break
            case AUDIO_EFFECT_ENUM.PLAYER_MOVE_BLOCK:
                cc.audioEngine.playEffect(this.player_move_block, false)
            break
            case AUDIO_EFFECT_ENUM.PLAYER_THROW:
                cc.audioEngine.playEffect(this.player_throw, false)
            break
            case AUDIO_EFFECT_ENUM.PLAYER_DIE:
                cc.audioEngine.playEffect(this.player_die, false)
            break
            case AUDIO_EFFECT_ENUM.FLOOR_BROKEN:
                cc.audioEngine.playEffect(this.floor_broken, false)
            break
            case AUDIO_EFFECT_ENUM.FLOOR_TRAP:
                cc.audioEngine.playEffect(this.floor_trap, false)
            break
            case AUDIO_EFFECT_ENUM.FLOOR_SPIKE:
                cc.audioEngine.playEffect(this.floor_spike, false)
            break
            case AUDIO_EFFECT_ENUM.BEATLE_DIE:
                cc.audioEngine.playEffect(this.beatle_die, false)
            break
            case AUDIO_EFFECT_ENUM.POT_DIE:
                cc.audioEngine.playEffect(this.pot_die, false)
            break
            case AUDIO_EFFECT_ENUM.SPIDER_ATTACK:
                cc.audioEngine.playEffect(this.spider_attack, false)
            break
            case AUDIO_EFFECT_ENUM.SPIDER_DIE:
                cc.audioEngine.playEffect(this.spider_die, false)
            break
            case AUDIO_EFFECT_ENUM.BOX_MOVE:
                cc.audioEngine.playEffect(this.box_move, false)
            break
            case AUDIO_EFFECT_ENUM.PIG_NOTICE:
                cc.audioEngine.playEffect(this.pig_notice, false)
            break
            case AUDIO_EFFECT_ENUM.BOMB:
                cc.audioEngine.playEffect(this.bomb, false)
            break
        }
    }

    protected onDestroy(): void {
        EventManager.instance.off(EVENT_ENUM.EFFECT_AUDIO_PLAY, this.onAudioPlay)
    }
}
