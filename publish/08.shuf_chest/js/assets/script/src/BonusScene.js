window.gLocalAssetContainer["BonusScene"] = function(g) { (function(exports, require, module, __filename, __dirname) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BonusScene = void 0;
class BonusScene extends g.Scene {
  get OnFinishBonus() {
    return this.onFinishBonus;
  }
  constructor(param) {
    super(param);
    //ゲーム開始イベント
    this.onFinishBonus = new g.Trigger();
    const scene = this;
    scene.onLoad.add(() => {
      this.refresh();
    });
  }
  refresh() {
    const scene = this;
    this.children.forEach(c => c.destroy());
    const rectFinish = new g.FilledRect({
      scene: scene,
      touchable: true,
      cssColor: "green",
      width: 20,
      height: 20,
      x: 30,
      y: 40
    });
    scene.append(rectFinish);
    rectFinish.onPointDown.add(e => {
      this.onFinishBonus.fire();
    });
  }
}
exports.BonusScene = BonusScene;
})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}