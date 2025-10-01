
export class BonusScene extends g.Scene {

    //ゲーム開始イベント
    private onFinishBonus: g.Trigger<void> = new g.Trigger<void>();
    get OnFinishBonus(): g.Trigger<void>{ return this.onFinishBonus; }
    
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

        const rectFinish = new g.FilledRect({
            scene: scene, touchable: true,
            cssColor: "green", width: 20, height: 20, x: 30, y: 40,
        });
        scene.append(rectFinish);
        rectFinish.onPointDown.add((e)=>{
            this.onFinishBonus.fire();
        });
    }
}