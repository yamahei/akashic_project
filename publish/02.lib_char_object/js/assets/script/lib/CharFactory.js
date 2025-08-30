window.gLocalAssetContainer["CharFactory"] = function(g) { (function(exports, require, module, __filename, __dirname) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CharFactory = void 0;
const CharEntity_1 = require("./CharEntity");
const EFFECT_ASSET_PATH = "/assets/image/obj/effects.png";
const CHAR_SETTING_PATH = "/assets/data/char_sprite_settings.json";
const CHAR_IMAGE_WIDTH = 72; //px
const CHAR_IMAGE_HEIGHT = 128; //px
const CHAR_CHIP_WIDTH = 24; //px
const CHAR_CHIP_HEIGHT = 32; //px
class CharFactory {
  static findSetting(settings, name_or_id, color_index) {
    const hits = settings.filter(setting => {
      const is_name = setting.name === name_or_id;
      const is_id = setting.id === name_or_id;
      const is_color = setting.index === color_index;
      return (is_name || is_id) && is_color;
    });
    return hits[0];
  }
  static getAssetPath(setting) {
    const asset_path = setting === null || setting === void 0 ? void 0 : setting.line.replace(/^\.\./, "");
    console.log(`CharFactory.getAssetPath: ${asset_path}`);
    return asset_path;
  }
  static createCharSprite(setting) {
    const asset_path = CharFactory.getAssetPath(setting);
    return new g.FrameSprite({
      tag: "sprite",
      scene: g.game.scene(),
      src: g.game.scene().asset.getImage(asset_path),
      width: CHAR_CHIP_WIDTH,
      height: CHAR_CHIP_HEIGHT,
      x: 0,
      y: 0
    });
  }
  static createCollisionArea(setting) {
    const collision_area = new g.E({
      tag: "hitarea",
      scene: g.game.scene(),
      x: setting.collision_x,
      y: setting.collision_y,
      width: setting.collision_w,
      height: setting.collision_h
    });
    return collision_area;
  }
  static getCharObject(name_or_id, color_index = "1") {
    const settings = g.game.scene().asset.getJSONContent(CHAR_SETTING_PATH);
    const setting = CharFactory.findSetting(settings, name_or_id, color_index);
    if (!setting) {
      throw new Error(`Character setting not found for name/id: ${name_or_id} and color index: ${color_index}`);
    }
    const sprite = CharFactory.createCharSprite(setting);
    const hitarea = CharFactory.createCollisionArea(setting);
    const effect = CharFactory.createEffectSprite();
    const char_object = new CharEntity_1.CharEntity({
      scene: g.game.scene()
    }, sprite, hitarea, effect);
    return char_object;
  }
  static createEffectSprite() {
    return new g.FrameSprite({
      tag: "effect",
      scene: g.game.scene(),
      src: g.game.scene().asset.getImage(EFFECT_ASSET_PATH),
      width: CHAR_CHIP_WIDTH,
      height: CHAR_CHIP_HEIGHT,
      x: 0,
      y: 0,
      hidden: true
    });
  }
}
exports.CharFactory = CharFactory;
})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}