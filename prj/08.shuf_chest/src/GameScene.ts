import { DigitalWatch, DigitalWatchParameter } from "../lib/DigitalWatch";
import { FONT_ASSET_PATH, FONT_SIZE, GET_FONT_OBJECT161, WATCH_PARAMS } from "./Consts";
import { ObjectEntity } from "../lib/ObjectEntity";
import { ObjectFactory } from "../lib/ObjectFactory";


const HORIZONY = g.game.height / 2 - 32;

const ANIMATION_MS = 5;
const MAX_VERTICAL_SPEED = 16;
const VERTICAL_ACCEL = 0.5;


export class GameScene extends g.Scene {

    //ゲーム開始イベント
    private onSuccessLevel: g.Trigger<void> = new g.Trigger<void>();
    get OnSuccessLevel(): g.Trigger<void>{ return this.onSuccessLevel; }
    private onFailedLevel: g.Trigger<void> = new g.Trigger<void>();
    get OnFailedLevel(): g.Trigger<void>{ return this.onFailedLevel; }

    //
    private font161:g.BitmapFont;
    private chestsE:g.E;

    constructor(param: g.SceneParameterObject) {
        super(param);
        const game = g.game;
        const scene = this;

        //ゲーム制御変数の初期値
    	game.vars.game = { selectable: null };
        //フォント生成
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

        //watch
        scene.append(this.createDigitalWatchE());

        //chests
        const chestsE = this.chestsE = this.createChestsE();
        scene.append(chestsE);

        /**
         * game
         */
    	game.vars.game = { selectable: false };
        const gameController = this.getEmptyPromise("gameController");
        const appear = this.getAppearPromise("appear");
        const shuffle = this.getEmptyPromise("shuffle");
        const guess = this.getEmptyPromise("guess");

        Promise.resolve()
        .then(result => {return gameController(result)})
        .then(result => { return appear(result); })
        .then(result => { return shuffle(result); })
        .then(result => { return guess(result); })
        ;


    }
    getAppearPromise(key: string) {
        const scene = this;
        const chestsE = this.chestsE;
        const promise = (result:string):Promise<string>=>{
            chestsE.y = 0;
            chestsE.modified();
            let speed = 0.1;
            return new Promise<string>((resolve, reject) => {
                const animation = () => {
                    scene.setTimeout(() => {
                        if(chestsE.y < HORIZONY){
                            speed += VERTICAL_ACCEL;
                            if(speed > MAX_VERTICAL_SPEED) { speed = MAX_VERTICAL_SPEED };
                            chestsE.y += speed;
                            chestsE.modified();
                            animation();//next
                        }else{
                            if(Math.floor(chestsE.y) == HORIZONY){
                                chestsE.y = HORIZONY;
                                chestsE.modified();
                                resolve(key);//end
                            }else{
                                speed *= -0.55;
                                chestsE.y = HORIZONY + speed;
                                chestsE.modified();
                                animation();//next
                            }
                        }
                    }, ANIMATION_MS);
                };
                animation();
            });
        }
        return promise;
    }

    private getEmptyPromise(key:string):Function{
        const scene = this;
        const debug = (result:string):Promise<string>=>{
            return new Promise<string>((resolve, reject) => {
                console.log(`* debug promise [${key}] = ${result}`);
                scene.setTimeout(() => {
                    resolve(key);
                },300);
            });
        }
        return debug;
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

    private createChestsE():g.E{
        const scene:g.Scene = this;
        const game = scene.game;
        const chestsE = new g.E({ scene: scene, y: game.height });//隠しておく
        const objectParam:g.EParameterObject = {
            scene: scene, touchable: true, y: 0
        };
        const paramBright = { tag: "chest_bright", ...objectParam}
        const paramDark = { tag: "chest_red", ...objectParam}
        const chests = [
            ObjectFactory.getObjectObject("chest_bright", paramBright),
            ObjectFactory.getObjectObject("chest_red", paramDark),
            ObjectFactory.getObjectObject("chest_red", paramDark),
            ObjectFactory.getObjectObject("chest_red", paramDark),
            ObjectFactory.getObjectObject("chest_red", paramDark),
        ];
        this.shuffleArray(chests);

        chests.forEach((chest, index)=>{
            chest.x = (game.width / 2) + ((index - 2) * (game.width / 6)) - (chest.width / 2);
            chestsE.append(chest);
            chest.setAction("close");
            // chest.setAction("open");
        });
        return chestsE;
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

    private shuffleArray(array:any[]){
        array.sort(()=>{
            return g.game.random.generate() - g.game.random.generate();
        });
    }

}