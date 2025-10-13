window.gLocalAssetContainer["TitleScene"] = function(g) { (function(exports, require, module, __filename, __dirname) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TitleScene = void 0;
// inner modules
const DigitalWatch_1 = require("../lib/DigitalWatch");
const Consts_1 = require("./Consts");
class TitleScene extends g.Scene {
  constructor() {
    super(...arguments);
    //ゲーム開始イベント
    this.onGameStart = new g.Trigger();
  }
  get OnGameStart() {
    return this.onGameStart;
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
    const title = this.createTitleSprite();
    scene.append(title);
    //watch
    scene.append(scene.createDigitalWatchE());
  }
  createTitleSprite() {
    const scene = this;
    const image = scene.asset.getImageById("image/Title_FindMeIfYouCan.png");
    const sprite = new g.Sprite({
      scene: scene,
      src: image,
      touchable: true,
      x: (g.game.width - image.width) / 2,
      y: g.game.height / 2 - image.height
    });
    sprite.onPointDown.add(e => {
      scene.onGameStart.fire();
    });
    return sprite;
  }
  createDigitalWatchE() {
    const scene = this;
    const param = Object.assign(Object.assign({
      EParam: {
        scene: scene
      }
    }, Consts_1.FONT_ASSET_PATH), Consts_1.WATCH_PARAMS);
    const watch = new DigitalWatch_1.DigitalWatch(param);
    const digitalWatchE = new g.E({
      scene: scene
    });
    digitalWatchE.append(watch);
    return digitalWatchE;
  }
}
exports.TitleScene = TitleScene;
})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}