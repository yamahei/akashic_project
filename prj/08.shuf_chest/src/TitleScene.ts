// outer modules
import { Label } from "@akashic-extension/akashic-label";
// inner modules
import { DigitalWatch, DigitalWatchParameter } from "../lib/DigitalWatch";
import { FONT_ASSET_PATH, WATCH_PARAMS, GET_FONT_OBJECT161 } from "./Consts";

export class TitleScene extends g.Scene {

    //ゲーム開始イベント
    private onGameStart: g.Trigger<void> = new g.Trigger<void>();
    get OnGameStart(): g.Trigger<void>{ return this.onGameStart; }
    
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
        const title = this.createTitleSprite();
        scene.append(title);

        //watch
        scene.append(scene.createDigitalWatchE());
    }

    private createTitleSprite():g.Sprite{
        const scene = this;
        const image = scene.asset.getImageById("image/Title_FindMeIfYouCan.png");
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
        return sprite;
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