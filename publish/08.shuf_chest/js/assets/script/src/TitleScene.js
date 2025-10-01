window.gLocalAssetContainer["TitleScene"] = function(g) { (function(exports, require, module, __filename, __dirname) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TitleScene = void 0;
class TitleScene extends g.Scene {
  get OnGameStart() {
    return this.onGameStart;
  }
  constructor(param) {
    super(param);
    //ゲーム開始イベント
    this.onGameStart = new g.Trigger();
    const scene = this;
    scene.onLoad.add(() => {
      this.refresh();
    });
  }
  refresh() {
    const scene = this;
    this.children.forEach(c => c.destroy());
    const rectStart = new g.FilledRect({
      scene: scene,
      touchable: true,
      cssColor: "cyan",
      width: 20,
      height: 20,
      x: 30,
      y: 30
    });
    scene.append(rectStart);
    rectStart.onPointDown.add(e => {
      this.onGameStart.fire();
    });
  }
}
exports.TitleScene = TitleScene;
})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}