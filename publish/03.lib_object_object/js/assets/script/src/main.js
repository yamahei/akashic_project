window.gLocalAssetContainer["main"] = function(g) { (function(exports, require, module, __filename, __dirname) {
"use strict";

const ObjectEntity_1 = require("../lib/ObjectEntity");
const ObjectFactory_1 = require("../lib/ObjectFactory");
function main(param) {
  const scene = new g.Scene({
    game: g.game,
    assetPaths: ["/assets/**/*"]
  });
  scene.onLoad.add(() => {
    const objects = [];
    const names = ["blue_book", "red_book", "green_book", "chest_bright", "chest_red", "chest_gold", "chest_wood", "chest_bronze", "flag_red", "flag_magenda", "flag_blue", "flag_yellow", "door_wood1", "door_wood1_bright", "door_wood2", "door_wood2_bright", "door_wood3", "door_wood3_bright", "door_iron", "door_iron_bright", "switch_p", "switch_ud", "switch_lr", "switch_fb", "treasure_pendant", "treasure_key_heart", "treasure_key_silver", "treasure_jewel"];
    names.forEach((name, index) => {
      const setting = ObjectEntity_1.ObjectEntity.getObjectSetting(name);
      const x = index % 4 * 60 + 10;
      const y = Math.floor(index / 4) * 55 + 10;
      const param = {
        scene: g.game.scene(),
        touchable: true,
        x: x,
        y: y,
        width: 24,
        height: 32
      };
      const obj = ObjectFactory_1.ObjectFactory.getObjectObject(name, param);
      scene.append(obj);
      const actions = obj.getActions();
      let action_index = 0;
      obj.onPointDown.add(() => {
        action_index = (action_index + 1) % actions.length;
        obj.setAction(actions[action_index]);
        console.log(`object '${name}' action: ${actions[action_index]}`);
      });
      objects.push(obj);
    });
    const rect = new g.FilledRect({
      scene: scene,
      touchable: true,
      width: 24,
      height: 24,
      cssColor: "black",
      opacity: 0.5,
      x: 128,
      y: 340
    });
    scene.append(rect);
    let dragging = false;
    rect.onPointDown.add(function () {
      dragging = true;
    });
    rect.onPointUp.add(function () {
      dragging = false;
    });
    rect.onPointMove.add(function (e) {
      if (dragging) {
        rect.x += e.prevDelta.x;
        rect.y += e.prevDelta.y;
        rect.modified();
      }
      const hit = objects.some(o => g.Collision.intersectEntities(rect, o.getHitArea()));
      rect.cssColor = hit ? "yellow" : "black";
      rect.modified();
    });
  });
  g.game.pushScene(scene);
}
module.exports = main;
})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}