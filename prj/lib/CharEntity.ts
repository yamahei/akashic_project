"use strict";

export class CharEntity extends g.E {
    private sprite: g.FrameSprite;
    private hitarea: g.E;
    private effect: g.E;
    // private direction: "fore" | "back" | "left" | "right" = "fore";
    // private action: "idle" | "walk" | "run" | "jump" | "attack" = "idle";
    // private mental: "normal" | "silent" | "sleep" | "angry" | "" | "trouble" = "normal";
    // private is_damaged: boolean = false;

    constructor(param: g.EParameterObject, sprite: g.FrameSprite, hitarea: g.E, effect: g.E) {
        super(param);
        this.sprite = sprite;this.append(this.sprite);
        this.hitarea = hitarea;this.append(this.hitarea);
        this.effect = effect;this.append(this.effect);
        // this.setDirection("fore");
        // this.setAction("idle");
        // this.setMental("normal");
    }
    
}   

