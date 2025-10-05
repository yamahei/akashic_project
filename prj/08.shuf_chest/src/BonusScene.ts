
import { DigitalWatch, DigitalWatchParameter } from "../lib/DigitalWatch";
import { FONT_ASSET_PATH, WATCH_PARAMS } from "./Consts";

export class BonusScene extends g.Scene {

    //ゲーム開始イベント
    private onFinishBonus: g.Trigger<void> = new g.Trigger<void>();
    get OnFinishBonus(): g.Trigger<void>{ return this.onFinishBonus; }

    public refresh(): void {
        const scene = this;
        this.children.forEach(c => c.destroy());

        //UI
        const rectFinish = new g.FilledRect({
            scene: scene, touchable: true,
            cssColor: "green", width: 20, height: 20, x: 30, y: 40,
        });
        scene.append(rectFinish);
        rectFinish.onPointDown.add((e)=>{
            this.onFinishBonus.fire();
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