
export class TitleScene extends g.Scene {

    //ゲーム開始イベント
    private onGameStart: g.Trigger<void> = new g.Trigger<void>();
    get OnGameStart(): g.Trigger<void>{ return this.onGameStart; }
    
    constructor(param: g.SceneParameterObject) {
        super(param);
        const scene = this;

        scene.onLoad.add(() => {
            this.refresh();
        });
    }

    public refresh(): void {
        const scene = this;
        this.children.forEach(c => c.destroy());

        const rectStart = new g.FilledRect({
            scene: scene, touchable: true,
            cssColor: "cyan", width: 20, height: 20, x: 30, y: 30,
        });
        scene.append(rectStart);
        rectStart.onPointDown.add((e)=>{
            this.onGameStart.fire();
        });
    }
}