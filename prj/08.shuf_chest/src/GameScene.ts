import { DigitalWatch, DigitalWatchParameter } from "../lib/DigitalWatch";
import { FONT_ASSET_PATH, FONT_SIZE, GET_FONT_OBJECT161, WATCH_PARAMS } from "./Consts";

export class GameScene extends g.Scene {

    //ゲーム開始イベント
    private onSuccessLevel: g.Trigger<void> = new g.Trigger<void>();
    get OnSuccessLevel(): g.Trigger<void>{ return this.onSuccessLevel; }
    private onFailedLevel: g.Trigger<void> = new g.Trigger<void>();
    get OnFailedLevel(): g.Trigger<void>{ return this.onFailedLevel; }

    //
    private font161:g.BitmapFont;

    constructor(param: g.SceneParameterObject) {
        super(param);

        const scene = this;
        this.font161 = GET_FONT_OBJECT161(scene);
    }

    private cleanup():void{
        const scene = this;
        while(scene.children.length > 0) {
            // scene.children.forEachだと
            // なぜか全部消えないので
            // whileで（過剰に）頑張る
            const c = scene.children.shift();
            if(c) { c.y = scene.game.height + 100; }// 隠し
            if(c) { c.hide(); }// 消し
            if(c) { c.destroy(); }// 捨てる
        }
    }
    
    public refresh(level: number): void {

        const scene = this;
        scene.cleanup();

        /** UI */
        //debug
        const rectSuccess = new g.FilledRect({
            scene: scene, touchable: true,
            cssColor: "red", width: 20, height: 20, x: 210, y: 0,
        });
        scene.append(rectSuccess);
        rectSuccess.onPointDown.add((e)=>{
            this.onSuccessLevel.fire();
        });
        const rectFailed = new g.FilledRect({
            scene: scene, touchable: true,
            cssColor: "blue", width: 20, height: 20, x: 234, y: 0,
        });
        scene.append(rectFailed);
        rectFailed.onPointDown.add((e)=>{
            this.onFailedLevel.fire();
        });

        //level
        const levelLabel = this.createBitmapFontMessage(`Level ${level}`);
        levelLabel.y = scene.game.height / 2 + 60;
        levelLabel.x = (g.game.width - levelLabel.width) / 2;
        scene.append(levelLabel);

        //chests

        //watch
        scene.append(this.createDigitalWatchE());

        /**
         * game
         */
        //appear
        //shuffle
        //guess


    }

    private createDigitalWatchE():g.E{
        const scene = this;

		const param:DigitalWatchParameter = {
			EParam: { scene: scene },
            ...FONT_ASSET_PATH,
			...WATCH_PARAMS,
		}
		const watch = new DigitalWatch(param);
        const digitalWatchE = new g.E({ scene: scene });
        digitalWatchE.append(watch);
        return digitalWatchE;
    }

    private createBitMapFontGessMessage():g.Label {
        const messages:string[] = [
            "Which one?",
            "Which is it?",
            "Take your pick!",
            "Guess which one?",
            "Choose a chest!",
            "Select a box!",
            "Pick a box!",
        ];
        const index = Math.floor(new Array(messages.length).reduce((total)=>{
            total += g.game.random.generate();
        }, 0));
        const message = messages[index % messages.length];
        return this.createBitmapFontMessage(message);
    }

    private createBitmapFontMessage(message:string):g.Label{
        const scene = this;
        return new g.Label({
            scene: scene,
            text: message,
            fontSize: FONT_SIZE,
            font: this.font161,
        });
    };

}