window.gLocalAssetContainer["BonusScene"] = function(g) { (function(exports, require, module, __filename, __dirname) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BonusScene = void 0;
const DigitalWatch_1 = require("../lib/DigitalWatch");
const Consts_1 = require("./Consts");
class BonusScene extends g.Scene {
  constructor() {
    super(...arguments);
    //ゲーム開始イベント
    this.onFinishBonus = new g.Trigger();
  }
  get OnFinishBonus() {
    return this.onFinishBonus;
  }
  cleanup() {
    const scene = this;
    while (scene.children.length > 0) {
      // scene.children.forEachだと
      // なぜか全部消えないので
      // whileで（過剰に）頑張る
      const c = scene.children.shift();
      if (c) {
        c.y = scene.game.height + 100;
      } // 隠し
      if (c) {
        c.hide();
      } // 消し
      if (c) {
        c.destroy();
      } // 捨てる
    }
  }
  refresh() {
    const scene = this;
    scene.cleanup();
    //UI
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
    //watch
    scene.append(this.createDigitalWatchE());
  }
  createDigitalWatchE() {
    const param = Object.assign(Object.assign({
      EParam: {
        scene: this
      }
    }, Consts_1.FONT_ASSET_PATH), Consts_1.WATCH_PARAMS);
    const watch = new DigitalWatch_1.DigitalWatch(param);
    const digitalWatchE = new g.E({
      scene: this
    });
    digitalWatchE.append(watch);
    return digitalWatchE;
  }
}
exports.BonusScene = BonusScene;
})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}