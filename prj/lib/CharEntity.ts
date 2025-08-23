"use strict";

/** キャラクタの向き指定子 */
type char_directions = "fore" | "back" | "left" | "right";
/** キャラクタのアクション指定子 */
type char_actions = "stop" | "walk" | "jump" | "attack" | "die";
/** キャラクタのメンタル指定子 */
type char_mental = "normal" | "silent" | "sleep" | "angry" | "trouble" | "emergency" | "shine1" | "shine2" | "shine3" | "shine4";

const char_interval = 120;//ms
const char_interval_fast = 30;//ms
const char_animation_patterns = [
    // stop
    { direction:"back",  action:"stop", frames: [ 1], loop: true, interval: char_interval },
    { direction:"right", action:"stop", frames: [ 4], loop: true, interval: char_interval },
    { direction:"fore",  action:"stop", frames: [ 7], loop: true, interval: char_interval },
    { direction:"left",  action:"stop", frames: [10], loop: true, interval: char_interval },
    // walk
    { direction:"back",  action:"walk", frames: [ 1,  0,  1,  2], loop: true, interval: char_interval },
    { direction:"right", action:"walk", frames: [ 4,  3,  4,  5], loop: true, interval: char_interval },
    { direction:"fore",  action:"walk", frames: [ 7,  6,  7,  8], loop: true, interval: char_interval },
    { direction:"left",  action:"walk", frames: [10,  9, 10, 11], loop: true, interval: char_interval },
    // jump
    { direction:"back",  action:"jump", frames: [ 2], loop: true, interval: char_interval },
    { direction:"right", action:"jump", frames: [ 5], loop: true, interval: char_interval },
    { direction:"fore",  action:"jump", frames: [ 8], loop: true, interval: char_interval },
    { direction:"left",  action:"jump", frames: [11], loop: true, interval: char_interval },
    // attack
    { direction:"back",  action:"attack", frames: [ 1,  0,  1,  2,  1,  0,  1,  2], loop: false, interval: char_interval_fast },
    { direction:"right", action:"attack", frames: [ 4,  3,  4,  5,  4,  3,  4,  5], loop: false, interval: char_interval_fast },
    { direction:"fore",  action:"attack", frames: [ 7,  6,  7,  8,  7,  6,  7,  8], loop: false, interval: char_interval_fast },
    { direction:"left",  action:"attack", frames: [10,  9, 10, 11, 10,  9, 10, 11], loop: false, interval: char_interval_fast },
    // die
    { direction:"back",  action:"die", frames: [ 1, 4, 7, 10], loop: true, interval: char_interval_fast },
    { direction:"right", action:"die", frames: [ 1, 4, 7, 10], loop: true, interval: char_interval_fast },
    { direction:"fore",  action:"die", frames: [ 1, 4, 7, 10], loop: true, interval: char_interval_fast },
    { direction:"left",  action:"die", frames: [ 1, 4, 7, 10], loop: true, interval: char_interval_fast },
];

const default_damagling_sec = 1.2;//sec
const default_mentaling_sec = 1.2;//sec
const effect_interval_slow = 250;//ms
const effect_interval_fast = 100;//ms
const effect_animation_patterns = [
    { mental:"normal",    show: false, frames_offset: 0, y_offset: 0, interval: effect_interval_slow },
    { mental:"silent",    show: true,  frames_offset: 0, y_offset: -16, interval: effect_interval_slow },
    { mental:"sleep",     show: true,  frames_offset: 1, y_offset: -16, interval: effect_interval_slow },
    { mental:"angry",     show: true,  frames_offset: 2, y_offset: -16, interval: effect_interval_fast },
    { mental:"trouble",   show: true,  frames_offset: 3, y_offset: 0, interval: effect_interval_slow },
    { mental:"emergency", show: true,  frames_offset: 4, y_offset: -16, interval: effect_interval_fast },
    { mental:"shine1",    show: true,  frames_offset: 5, y_offset: 0, interval: effect_interval_fast },
    { mental:"shine2",    show: true,  frames_offset: 6, y_offset: 0, interval: effect_interval_fast },
    { mental:"shine3",    show: true,  frames_offset: 7, y_offset: 0, interval: effect_interval_fast },
    { mental:"shine4",    show: true,  frames_offset: 8, y_offset: 0, interval: effect_interval_fast },
];

/**
 * キャラクタオブジェクトクラス
 */
export class CharEntity extends g.E {
    private sprite: g.FrameSprite;
    private hitarea: g.E;
    private effect: g.FrameSprite;
    private direction: char_directions = "fore";
    private action: char_actions = "stop";
    private mental: char_mental = "normal";
    private mental_counter = 0;//frame
    private damage_counter = 0;//frame

    /**
     * コンストラクタ
     * @param {g.EParameterObject} param 
     * @param {g.FrameSprite} sprite 
     * @param {g.E} hitarea 
     * @param {g.FrameSprite} effect 
     * @returns {CharEntity} 生成したキャラクタオブジェクト
     */
    constructor(param: g.EParameterObject, sprite: g.FrameSprite, hitarea: g.E, effect: g.FrameSprite) {
        super(param);
        this.sprite = sprite;this.append(this.sprite);
        this.hitarea = hitarea;this.append(this.hitarea);
        this.effect = effect;this.append(this.effect);
        this.setDirection("fore");
        this.setAction("stop");
        this.setMental("normal");

        const self = this;
        this.onUpdate.add(()=>{
            if(self.damage_counter){
                if(!!(self.damage_counter%2)){ sprite.show(); } else { sprite.hide(); }
                self.damage_counter -= 1;
                if(self.damage_counter <= 0){ 
                    self.damage_counter = 0;
                    sprite.show();
                }
            }
            if(self.mental_counter){
                self.mental_counter -= 1;
                if(self.mental_counter <= 0){
                    self.mental_counter = 0;
                    this.setMental("normal");
                }
            }
        });
    }

    /**
     * 衝突判定用エリアを取得する
     * @return {g.E} 衝突判定用エリア
     * */
    public getHitArea():g.E{
        return this.hitarea;
    }
    /**
     * キャラクタの向き指定
     * @param {char_directions} direction 
     */
    public setDirection(direction:char_directions):void{
        this.direction = direction;
        this.setSpriteAnimation();
    }
    /**
     * キャラクタのアクション指定
     * @param {char_actions} action 
     */
    public setAction(action:char_actions):void{
        this.action = action;
        this.setSpriteAnimation();
    }
    /**
     * キャラクタのメンタル指定
     * @param {char_mental} mental 
     * @param {number} mentaling_sec メンタル状態を維持する秒数（デフォルト1.2秒）
     */
    public setMental(mental:char_mental, mentaling_sec=default_mentaling_sec):void{
        this.mental = mental;
        this.setMentalAnimation();
        this.mental_counter = g.game.fps * mentaling_sec;
    }
    /**
     * キャラクタがダメージを受けた状態にする
     * @param {number} damaging_sec ダメージ状態を維持する秒数（デフォルト1.2秒）
     */
    public setDamage(damaging_sec=default_damagling_sec):void{
        this.damage_counter = g.game.fps * damaging_sec;
    }

    private setSpriteAnimation():void{
        const direction = this.direction;
        const action = this.action;
        const patterns = char_animation_patterns.filter(p=>{
            return p.direction == direction && p.action == action;
        });
        const pattern = patterns[0];
        if(!pattern){
            throw new Error(`Animation pattern not found for direction: ${direction} and action: ${action}`);
        }
        console.log({frameNumber: this.sprite.frameNumber, ...pattern});
        this.sprite.stop();
        this.sprite.frames = pattern.frames;
        this.sprite.frameNumber = 0;
        this.sprite.interval = pattern.interval;
        this.sprite.loop = pattern.loop;
        this.sprite.modified();
        this.sprite.start();
    }
    private setMentalAnimation():void{
        const mental = this.mental;
        const patterns = effect_animation_patterns.filter(p=>{
            return p.mental == mental;
        });
        const pattern = patterns[0];
        if(!pattern){
            throw new Error(`Effect pattern not found for mental: ${mental}`);
        }
        const base_frames = [0, 10, 20, 30];
        const frames = base_frames.map(f => f + pattern.frames_offset);

        if(pattern.show){ this.effect.show(); } else { this.effect.hide(); }
        this.effect.y = pattern.y_offset;
        this.effect.interval = pattern.interval;
        this.effect.frames = frames;
        this.effect.frameNumber = 0;
        this.effect.loop = true;
        this.effect.modified();
        this.effect.start();
    }
    
}   

