window.gLocalAssetContainer["ObjectEntity"] = function(g) { (function(exports, require, module, __filename, __dirname) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ObjectEntity = void 0;
const object_interval = 200; //ms
const object_interval_fast = 90; //ms
const object_type_settings = [{
  type: "book",
  asset_path: "/assets/image/obj/books.png",
  collision_x: 5,
  collision_y: 24,
  collision_w: 15,
  collision_h: 7,
  animation_patterns: [{
    name: "open",
    frames: [0],
    loop: false,
    default: true
  }, {
    name: "flip",
    frames: [0, 3, 6, 9, 0],
    loop: false,
    interval: object_interval
  }, {
    name: "back",
    frames: [0, 9, 6, 3, 0],
    loop: false,
    interval: object_interval
  }, {
    name: "flipping",
    frames: [0, 3, 6, 9],
    loop: true,
    interval: object_interval_fast
  }, {
    name: "backing",
    frames: [0, 9, 6, 3],
    loop: true,
    interval: object_interval_fast
  }]
}, {
  type: "chest",
  asset_path: "/assets/image/obj/chests.png",
  collision_x: 4,
  collision_y: 19,
  collision_w: 16,
  collision_h: 12,
  animation_patterns: [{
    name: "open",
    frames: [15, 10, 5, 0],
    loop: false
  }, {
    name: "close",
    frames: [0, 5, 10, 15],
    loop: false,
    default: true
  }]
}, {
  type: "flag",
  asset_path: "/assets/image/obj/flags.png",
  collision_x: 8,
  collision_y: 6,
  collision_w: 7,
  collision_h: 24,
  animation_patterns: [{
    name: "stop",
    frames: [1],
    loop: false,
    default: true
  }, {
    name: "wave",
    frames: [1, 0, 1, 2],
    loop: true,
    interval: object_interval
  }, {
    name: "flutter",
    frames: [1, 0, 1, 2],
    loop: true,
    interval: object_interval_fast
  }]
}, {
  type: "door",
  asset_path: "/assets/image/obj/doors.png",
  collision_x: 0,
  collision_y: 0,
  collision_w: 23,
  collision_h: 31,
  animation_patterns: [{
    name: "open",
    frames: [18, 12, 6, 0],
    loop: false,
    interval: object_interval_fast
  }, {
    name: "close",
    frames: [0, 6, 12, 18],
    loop: false,
    interval: object_interval_fast,
    default: true
  }]
}, {
  type: "switch",
  asset_path: "/assets/image/obj/switches.png",
  // collision rect set in object_setting
  animation_patterns: [{
    name: "on",
    frames: [2, 1, 0],
    loop: false,
    interval: object_interval_fast
  }, {
    name: "off",
    frames: [0, 1, 2],
    loop: false,
    interval: object_interval_fast,
    default: true
  }]
}, {
  type: "treasure",
  asset_path: "/assets/image/obj/treasures.png",
  // collision rect set in object_setting
  animation_patterns: [{
    name: "stop",
    frames: [2],
    loop: false,
    interval: object_interval_fast,
    default: true
  }, {
    name: "bright",
    frames: [0, 1, 2],
    loop: false,
    interval: object_interval_fast
  }, {
    name: "brighting",
    frames: [0, 1, 2, 0, 1, 2, 2, 2, 2],
    loop: true,
    interval: object_interval_fast
  }]
}];
const object_settings = [{
  type: "book",
  name: "blue_book",
  animation_offset: 0
}, {
  type: "book",
  name: "red_book",
  animation_offset: 1
}, {
  type: "book",
  name: "green_book",
  animation_offset: 2
}, {
  type: "chest",
  name: "chest_bright",
  animation_offset: 0
}, {
  type: "chest",
  name: "chest_red",
  animation_offset: 1
}, {
  type: "chest",
  name: "chest_gold",
  animation_offset: 2
}, {
  type: "chest",
  name: "chest_wood",
  animation_offset: 3
}, {
  type: "chest",
  name: "chest_bronze",
  animation_offset: 4
}, {
  type: "flag",
  name: "flag_red",
  animation_offset: 0
}, {
  type: "flag",
  name: "flag_magenda",
  animation_offset: 3
}, {
  type: "flag",
  name: "flag_blue",
  animation_offset: 6
}, {
  type: "flag",
  name: "flag_yellow",
  animation_offset: 9
}, {
  type: "door",
  name: "door_wood1",
  animation_offset: 0
}, {
  type: "door",
  name: "door_wood1_bright",
  animation_offset: 24
}, {
  type: "door",
  name: "door_wood2",
  animation_offset: 1
}, {
  type: "door",
  name: "door_wood2_bright",
  animation_offset: 25
}, {
  type: "door",
  name: "door_wood3",
  animation_offset: 2
}, {
  type: "door",
  name: "door_wood3_bright",
  animation_offset: 26
}, {
  type: "door",
  name: "door_iron",
  animation_offset: 3
}, {
  type: "door",
  name: "door_iron_bright",
  animation_offset: 27
}, {
  type: "switch",
  name: "switch_p",
  animation_offset: 0,
  collision_x: 4,
  collision_y: 20,
  collision_w: 16,
  collision_h: 11
}, {
  type: "switch",
  name: "switch_ud",
  animation_offset: 3,
  collision_x: 6,
  collision_y: 4,
  collision_w: 12,
  collision_h: 17
}, {
  type: "switch",
  name: "switch_lr",
  animation_offset: 6,
  collision_x: 5,
  collision_y: 17,
  collision_w: 14,
  collision_h: 14
}, {
  type: "switch",
  name: "switch_fb",
  animation_offset: 9,
  collision_x: 8,
  collision_y: 15,
  collision_w: 9,
  collision_h: 16
}, {
  type: "treasure",
  name: "treasure_pendant",
  animation_offset: 0,
  collision_x: 7,
  collision_y: 20,
  collision_w: 12,
  collision_h: 11
}, {
  type: "treasure",
  name: "treasure_key_heart",
  animation_offset: 3,
  collision_x: 6,
  collision_y: 20,
  collision_w: 12,
  collision_h: 11
}, {
  type: "treasure",
  name: "treasure_key_silver",
  animation_offset: 6,
  collision_x: 7,
  collision_y: 19,
  collision_w: 11,
  collision_h: 12
}, {
  type: "treasure",
  name: "treasure_jewel",
  animation_offset: 9,
  collision_x: 9,
  collision_y: 26,
  collision_w: 6,
  collision_h: 5
}];
/**
 * キャラクタオブジェクトクラス
 */
class ObjectEntity extends g.E {
  static getObjectSetting(name) {
    const setting = object_settings.filter(s => s.name == name)[0];
    const type = object_type_settings.filter(t => t.type == (setting === null || setting === void 0 ? void 0 : setting.type))[0];
    if (!setting) {
      throw new Error(`Object setting not found for name: ${name}`);
    }
    if (!type) {
      throw new Error(`Type setting not found for name: ${setting === null || setting === void 0 ? void 0 : setting.type}`);
    }
    const result = Object.assign(Object.assign({}, setting), type);
    return result;
  }
  /**
   * コンストラクタ
   * @param {g.EParameterObject} param
   * @param {g.FrameSprite} sprite
   * @param {g.E} hitarea
   * @param {g.FrameSprite} effect
   * @returns {CharEntity} 生成したキャラクタオブジェクト
   */
  constructor(param, sprite, hitarea, patterns) {
    super(param);
    this.sprite = sprite;
    this.append(this.sprite);
    this.hitarea = hitarea;
    this.append(this.hitarea);
    this.animations = patterns;
    // build actions
    patterns.sort((a, b) => {
      return ((a === null || a === void 0 ? void 0 : a.default) ? 0 : 1) - ((b === null || b === void 0 ? void 0 : b.default) ? 0 : 1);
    });
    console.log(patterns);
    this.actions = patterns.map(p => p.name);
    // set first action
    const actions = this.getActions();
    this.setAction(actions[0]);
  }
  getActions() {
    return this.actions;
  }
  /**
   * 衝突判定用エリアを取得する
   * @return {g.E} 衝突判定用エリア
   * */
  getHitArea() {
    return this.hitarea;
  }
  /**
   * キャラクタのアクション指定
   * @param {char_actions} action
   */
  setAction(action) {
    const is_action = this.actions.filter(a => a == action)[0];
    if (!is_action) {
      throw new Error(`Action not found for action: ${action}`);
    }
    this.action = action;
    this.setSpriteAnimation();
  }
  setSpriteAnimation() {
    const action = this.action;
    const patterns = this.animations.filter(a => a.name == action);
    const pattern = patterns[0];
    if (!pattern) {
      throw new Error(`Animation pattern not found for action: ${action}`);
    }
    console.log(Object.assign({
      frameNumber: this.sprite.frameNumber
    }, pattern));
    this.sprite.stop();
    this.sprite.frames = pattern.frames;
    this.sprite.frameNumber = 0;
    this.sprite.interval = pattern.interval;
    this.sprite.loop = pattern.loop;
    this.sprite.modified();
    this.sprite.start();
  }
}
exports.ObjectEntity = ObjectEntity;
})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}