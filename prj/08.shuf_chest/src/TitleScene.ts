// outer modules
import { Label } from "@akashic-extension/akashic-label";
// inner modules
import { DigitalWatch, DigitalWatchParameter } from "../lib/DigitalWatch";
import { FONT_ASSET_PATH, WATCH_PARAMS, GET_FONT_OBJECT161 } from "./Consts";

export class TitleScene extends g.Scene {

    //ゲーム開始イベント
    private onGameStart: g.Trigger<void> = new g.Trigger<void>();
    get OnGameStart(): g.Trigger<void>{ return this.onGameStart; }
    
    public refresh(): void {
        const scene = this;
        this.children.forEach(c => c.destroy());

        //UI
        const titleE = this.createTitleE();
        scene.append(titleE);

        //watch
        scene.append(scene.createDigitalWatchE());
    }

    private createTitleE():g.E{
        const scene = this;
        const image = scene.asset.getImageById("image/Title_TreasureInChest.png");
        const sprite = new g.Sprite({
            scene: scene,
            src: image,
            touchable: true,
            x: (g.game.width - image.width) / 2,
            y: g.game.height / 2 - image.height,
        });
        sprite.onPointDown.add((e)=>{
            scene.onGameStart.fire();
        });

        const titleE = new g.E({ scene: scene });
        titleE.append(sprite);

        return titleE;
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
}