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

        const rectStart = new g.FilledRect({
            scene: scene, touchable: true,
            cssColor: "cyan", width: 20, height: 20, x: 30, y: 30,
        });
        scene.append(rectStart);
        rectStart.onPointDown.add((e)=>{
            this.onGameStart.fire();
        });

        //watch
        scene.append(scene.createDigitalWatchE());
    }

    private createTitleE():g.E{
        const scene = this;
        const font = GET_FONT_OBJECT161(scene);
        const titleLabel = new Label({
            scene: scene, font: font,
            text: "abc@123",//Treasure in Chest
            width: g.game.width, textAlign: "center",
            fontSize: 16, lineGap: 8, x: 0, y: 50,
            // textColor: 'black',
            // touchable: true,
        });
        // const y = (g.game.height - titleLabel.height) / 2;
        // titleLabel.y = y;
        // titleLabel.modified();
        // titleLabel.onPointDown.add((e)=>{
        //     scene.onGameStart.fire();
        // });

        const titleE = new g.E({ scene: scene });
        //TODO: not apperar .. why?
        titleE.append(titleLabel);
        //TODO: not apperar .. why?

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