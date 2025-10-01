window.gLocalAssetContainer["GameScene"] = function(g) { (function(exports, require, module, __filename, __dirname) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GameScene = void 0;
class GameScene extends g.Scene {
  get OnSuccessLevel() {
    return this.onSuccessLevel;
  }
  get OnFailedLevel() {
    return this.onFailedLevel;
  }
  constructor(param) {
    super(param);
    //ゲーム開始イベント
    this.onSuccessLevel = new g.Trigger();
    this.onFailedLevel = new g.Trigger();
    const scene = this;
    // scene.onLoad.add(() => {
    //     this.refresh(1);
    // });
  }
  refresh(level) {
    const scene = this;
    this.children.forEach(c => c.destroy());
    console.log(level);
    const rectSuccess = new g.FilledRect({
      scene: scene,
      touchable: true,
      cssColor: "red",
      width: 20,
      height: 20,
      x: 30,
      y: 50
    });
    scene.append(rectSuccess);
    rectSuccess.onPointDown.add(e => {
      this.onSuccessLevel.fire();
    });
    const rectFailed = new g.FilledRect({
      scene: scene,
      touchable: true,
      cssColor: "blue",
      width: 20,
      height: 20,
      x: 60,
      y: 50
    });
    scene.append(rectFailed);
    rectFailed.onPointDown.add(e => {
      this.onFailedLevel.fire();
    });
  }
}
exports.GameScene = GameScene;
})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}