
export class GameScene extends g.Scene {

    //ゲーム開始イベント
    private onSuccessLevel: g.Trigger<void> = new g.Trigger<void>();
    get OnSuccessLevel(): g.Trigger<void>{ return this.onSuccessLevel; }
    private onFailedLevel: g.Trigger<void> = new g.Trigger<void>();
    get OnFailedLevel(): g.Trigger<void>{ return this.onFailedLevel; }
    
    constructor(param: g.SceneParameterObject) {
        super(param);
        const scene = this;

        // scene.onLoad.add(() => {
        //     this.refresh(1);
        // });
    }

    public refresh(level: number): void {
        const scene = this;
        this.children.forEach(c => c.destroy());
        console.log(level);

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
    }
}