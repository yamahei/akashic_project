import { DigitalWatch, DigitalWatchParameter } from "../lib/DigitalWatch";
import { FONT_ASSET_PATH, WATCH_PARAMS } from "./Consts";

export class GameScene extends g.Scene {

    //ゲーム開始イベント
    private onSuccessLevel: g.Trigger<void> = new g.Trigger<void>();
    get OnSuccessLevel(): g.Trigger<void>{ return this.onSuccessLevel; }
    private onFailedLevel: g.Trigger<void> = new g.Trigger<void>();
    get OnFailedLevel(): g.Trigger<void>{ return this.onFailedLevel; }

    public refresh(level: number): void {

        console.log(`GameScene: level=${level}`);

        const scene = this;
        this.children.forEach(c => c.destroy());

        //UI
        const rectSuccess = new g.FilledRect({
            scene: scene, touchable: true,
            cssColor: "red", width: 20, height: 20, x: 30, y: 50,
        });
        scene.append(rectSuccess);
        rectSuccess.onPointDown.add((e)=>{
            this.onSuccessLevel.fire();
        });

        const rectFailed = new g.FilledRect({
            scene: scene, touchable: true,
            cssColor: "blue", width: 20, height: 20, x: 60, y: 50,
        });
        scene.append(rectFailed);
        rectFailed.onPointDown.add((e)=>{
            this.onFailedLevel.fire();
        });

        //watch
        scene.append(this.createDigitalWatchE());

    }

    private createDigitalWatchE():g.E{

		const param:DigitalWatchParameter = {
			EParam: {scene: this},
            ...FONT_ASSET_PATH,
			...WATCH_PARAMS,
		}
		const watch = new DigitalWatch(param);
        const digitalWatchE = new g.E({ scene: this});
        digitalWatchE.append(watch);
        return digitalWatchE;
    }

}