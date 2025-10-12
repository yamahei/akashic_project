
import { DigitalWatch, DigitalWatchParameter } from "../lib/DigitalWatch";
import { FONT_ASSET_PATH, WATCH_PARAMS } from "./Consts";

export class BonusScene extends g.Scene {

    //ゲーム開始イベント
    private onFinishBonus: g.Trigger<void> = new g.Trigger<void>();
    get OnFinishBonus(): g.Trigger<void>{ return this.onFinishBonus; }

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

    public refresh(): void {
        const scene = this;
        scene.cleanup();

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