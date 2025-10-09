window.gLocalAssetContainer["GameScene"] = function(g) { (function(exports, require, module, __filename, __dirname) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GameScene = void 0;
const DigitalWatch_1 = require("../lib/DigitalWatch");
const Consts_1 = require("./Consts");
class GameScene extends g.Scene {
  constructor() {
    super(...arguments);
    //ゲーム開始イベント
    this.onSuccessLevel = new g.Trigger();
    this.onFailedLevel = new g.Trigger();
  }
  get OnSuccessLevel() {
    return this.onSuccessLevel;
  }
  get OnFailedLevel() {
    return this.onFailedLevel;
  }
  refresh(level) {
    console.log(`GameScene: level=${level}`);
    const scene = this;
    this.children.forEach(c => c.destroy());
    //UI
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
exports.GameScene = GameScene;
})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}