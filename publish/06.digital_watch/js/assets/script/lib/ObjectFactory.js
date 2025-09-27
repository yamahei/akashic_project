window.gLocalAssetContainer["ObjectFactory"] = function(g) { (function(exports, require, module, __filename, __dirname) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ObjectFactory = void 0;
const ObjectEntity_1 = require("./ObjectEntity");
/** キャラクタ画像の幅 */
const OBJECT_IMAGE_WIDTH = 72; //px
/** キャラクタ画像の高さ */
const OBJECT_IMAGE_HEIGHT = 128; //px
/** キャラクタチップの幅 */
const OBJECT_CHIP_WIDTH = 24; //px
/** キャラクタチップの高さ */
const OBJECT_CHIP_HEIGHT = 32; //px
/**
 * オブジェクト生成クラス
 * スタティックメソッドのみで構成され、インスタンス化しない
 */
class ObjectFactory {
  static createObjectSprite(asset_path) {
    return new g.FrameSprite({
      tag: "object",
      scene: g.game.scene(),
      src: g.game.scene().asset.getImage(asset_path),
      width: OBJECT_CHIP_WIDTH,
      height: OBJECT_CHIP_HEIGHT,
      x: 0,
      y: 0
    });
  }
  static createCollisionArea(x, y, width, height) {
    const collision_area = new g.E({
      tag: "hitarea",
      scene: g.game.scene(),
      x: x,
      y: y,
      width: width,
      height: height
    });
    return collision_area;
  }
  static getAnimationPatterns(patterns, offset) {
    const clone = JSON.parse(JSON.stringify(patterns));
    clone.forEach(pattern => {
      pattern.frames = pattern.frames.map(f => f + offset);
    });
    return clone;
  }
  /**
   * オブジェクトオブジェクトを生成して返す
   * name は object_settings のフィールドを参照して指定する
   * @param {string} name オブジェクト名
   * @param {g.EParameterObject} param g.E のパラメータ
   * @returns {ObjectEntity} 生成したオブジェクトオブジェクト
   */
  static getObjectObject(name, param = {
    scene: g.game.scene()
  }) {
    const setting = ObjectEntity_1.ObjectEntity.getObjectSetting(name);
    const patterns = ObjectFactory.getAnimationPatterns(setting.animation_patterns, setting.animation_offset);
    const sprite = ObjectFactory.createObjectSprite(setting.asset_path);
    const hitarea = ObjectFactory.createCollisionArea(setting.collision_x, setting.collision_y, setting.collision_w, setting.collision_h);
    const entity = new ObjectEntity_1.ObjectEntity(Object.assign({
      scene: g.game.scene()
    }, param), sprite, hitarea, patterns);
    console.log(`ObjectFactory: created object '${name}'`);
    return entity;
  }
}
exports.ObjectFactory = ObjectFactory;
})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}