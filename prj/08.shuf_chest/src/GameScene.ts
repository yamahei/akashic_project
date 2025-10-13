import { DigitalWatch, DigitalWatchParameter } from "../lib/DigitalWatch";
import { FONT_ASSET_PATH, FONT_SIZE, GET_FONT_OBJECT161, WATCH_PARAMS } from "./Consts";
import { ObjectEntity } from "../lib/ObjectEntity";
import { ObjectFactory } from "../lib/ObjectFactory";

export class GameScene extends g.Scene {

    //ゲーム開始イベント
    private onSuccessLevel: g.Trigger<void> = new g.Trigger<void>();
    get OnSuccessLevel(): g.Trigger<void>{ return this.onSuccessLevel; }
    private onFailedLevel: g.Trigger<void> = new g.Trigger<void>();
    get OnFailedLevel(): g.Trigger<void>{ return this.onFailedLevel; }

    //
    // private const HORIZONY = g.game.height / 2 - 32;
    private font161:g.BitmapFont;
    private chests:ObjectEntity[];

    constructor(param: g.SceneParameterObject) {
        super(param);
        const game = g.game;
        const scene = this;

        //ゲーム制御変数の初期値
    	game.vars.game = { selectable: null };
        //フォント生成
        this.font161 = GET_FONT_OBJECT161(scene);
        //宝箱作っておく
        const objectParam:g.EParameterObject = {
            scene: scene,
            touchable: true,
            y: game.height,//非表示,
        };
        const paramBright = { tag: "chest_bright", ...objectParam}
        const paramDark = { tag: "chest_red", ...objectParam}
        this.chests = [
            ObjectFactory.getObjectObject("chest_bright", paramBright),
            ObjectFactory.getObjectObject("chest_red", paramDark),
            ObjectFactory.getObjectObject("chest_red", paramDark),
            ObjectFactory.getObjectObject("chest_red", paramDark),
            ObjectFactory.getObjectObject("chest_red", paramDark),
        ];
        this.chests.forEach((chest)=>{
            scene.append(chest);
            chest.setAction("open");
        });
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

    	const game = g.game;
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
        const chests = this.shuffledChests();
        console.log(chests.map(c=> c.tag).join(","));

        //watch
        scene.append(this.createDigitalWatchE());

        /**
         * game
         */
    	game.vars.game = { selectable: false };
        const gameController = this.DEBUG_PROMISE("gameController");
        const appear = this.DEBUG_PROMISE("appear");
        const shuffle = this.DEBUG_PROMISE("shuffle");
        const guess = this.DEBUG_PROMISE("guess");

        Promise.resolve()
        .then(result => {return gameController(result)})
        .then(result => { return appear(result); })
        .then(result => { return shuffle(result); })
        .then(result => { return guess(result); })
        ;


    }

    private DEBUG_PROMISE(key:string):Function{
        const scene = this;
        const debug = (result:string):Promise<string>=>{
            return new Promise<string>((resolve, reject) => {
                console.log(`* debug promise [${key}] = ${result}`);
                scene.setTimeout(() => {
                    resolve(key);
                },1000);
            });
        }
        return debug;
    }

    private shuffledChests(): ObjectEntity[] {
        const chests = this.chests;
        const orders = chests.map((c, i) => {
            return {
                index: i, chest: c,
                order: g.game.random.generate(),
            };
        });
        orders.sort((a, b)=>{  return a.order - b.order; });
        return orders.map(o => o.chest);
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