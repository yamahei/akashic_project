"use strict";

type char_directions = "fore" | "back" | "left" | "right";
type char_actions = "stop" | "walk" | "jump" | "attack" | "die";
type char_mental = "normal" | "silent" | "sleep" | "angry" | "" | "trouble";

const interval = 120;//ms
const interval_fast = 60;//ms
const animation_patterns = [
    // stop
    { direction:"back",  action:"stop", frames: [ 1], loop: true, interval: interval },
    { direction:"right", action:"stop", frames: [ 4], loop: true, interval: interval },
    { direction:"fore",  action:"stop", frames: [ 7], loop: true, interval: interval },
    { direction:"left",  action:"stop", frames: [10], loop: true, interval: interval },
    // walk
    { direction:"back",  action:"walk", frames: [ 1,  0,  1,  2], loop: true, interval: interval },
    { direction:"right", action:"walk", frames: [ 4,  3,  4,  5], loop: true, interval: interval },
    { direction:"fore",  action:"walk", frames: [ 7,  6,  7,  8], loop: true, interval: interval },
    { direction:"left",  action:"walk", frames: [10,  9, 10, 11], loop: true, interval: interval },
    // jump
    { direction:"back",  action:"jump", frames: [ 2], loop: true, interval: interval },
    { direction:"right", action:"jump", frames: [ 5], loop: true, interval: interval },
    { direction:"fore",  action:"jump", frames: [ 8], loop: true, interval: interval },
    { direction:"left",  action:"jump", frames: [11], loop: true, interval: interval },
    // attack
    { direction:"back",  action:"attack", frames: [ 1,  0,  1,  2,  1,  0,  1,  2], loop: false, interval: interval_fast },
    { direction:"right", action:"attack", frames: [ 4,  3,  4,  5,  4,  3,  4,  5], loop: false, interval: interval_fast },
    { direction:"fore",  action:"attack", frames: [ 7,  6,  7,  8,  7,  6,  7,  8], loop: false, interval: interval_fast },
    { direction:"left",  action:"attack", frames: [10,  9, 10, 11, 10,  9, 10, 11], loop: false, interval: interval_fast },
    // die
    { direction:"back",  action:"die", frames: [ 1, 4, 7, 10], loop: true, interval: interval_fast },
    { direction:"right", action:"die", frames: [ 1, 4, 7, 10], loop: true, interval: interval_fast },
    { direction:"fore",  action:"die", frames: [ 1, 4, 7, 10], loop: true, interval: interval_fast },
    { direction:"left",  action:"die", frames: [ 1, 4, 7, 10], loop: true, interval: interval_fast },
];

export class CharEntity extends g.E {
    /**/ public sprite: g.FrameSprite;//ATTENTION: to debug
    private hitarea: g.E;
    private effect: g.E;
    private direction: char_directions = "fore";
    private action: char_actions = "stop";
    private mental: char_mental = "normal";
    private is_damaged: boolean = false;

    constructor(param: g.EParameterObject, sprite: g.FrameSprite, hitarea: g.E, effect: g.E) {
        super(param);
        this.sprite = sprite;this.append(this.sprite);
        this.hitarea = hitarea;this.append(this.hitarea);
        this.effect = effect;this.append(this.effect);
        this.setDirection("fore");
        this.setAction("stop");
        this.setMental("normal");
    }

    public setDirection(direction:char_directions):void{
        this.direction = direction;
        this.setSpriteAnimation();
    }
    public setAction(action:char_actions):void{
        this.action = action;
        this.setSpriteAnimation();
    }
    public setMental(mental:char_mental):void{
        this.mental = mental;
        this.setMentalAnimation();
    }
    public setDamaged(is_damaged:boolean):void{
        this.is_damaged = is_damaged;
    }

    private setSpriteAnimation():void{
        const direction = this.direction;
        const action = this.action;
        const patterns = animation_patterns.filter(p=>{
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
        //TODO
    }
    
}   

