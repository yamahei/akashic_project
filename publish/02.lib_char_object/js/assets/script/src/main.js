window.gLocalAssetContainer["main"] = function(g) { (function(exports, require, module, __filename, __dirname) {
"use strict";

const CharFactory_1 = require("../lib/CharFactory");
function main(param) {
  const scene = new g.Scene({
    game: g.game,
    // このシーンで利用するアセットのIDを列挙し、シーンに通知します
    assetIds: ["player", "shot", "se"],
    assetPaths: ["/assets/**/*"]
  });
  scene.onLoad.add(() => {
    const hero = CharFactory_1.CharFactory.getCharObject("hero");
    hero.x = 64;
    hero.y = 256;
    // scene.append(hero);
    const directions = ["back", "right", "fore", "left"];
    const actions = ["stop", "walk", "jump", "attack", "die"];
    const effects = ["normal", "silent", "sleep", "angry", "trouble", "emergency", "shine1", "shine2", "shine3", "shine4"];
    const common_rect_params = {
      scene: scene,
      touchable: true,
      width: 30,
      height: 30,
      /*x: 20,*/y: 70 /*cssColor: "red"*/
    };
    const rect1 = new g.FilledRect(Object.assign(Object.assign({}, common_rect_params), {
      x: 20,
      cssColor: "red"
    }));
    scene.append(rect1);
    rect1.onPointDown.add(function () {
      //@ts-ignore
      hero.setDirection(directions[0]);
      directions.push(directions.shift());
    });
    const rect2 = new g.FilledRect(Object.assign(Object.assign({}, common_rect_params), {
      x: 80,
      cssColor: "blue"
    }));
    scene.append(rect2);
    rect2.onPointDown.add(function () {
      //@ts-ignore
      hero.setAction(actions[0]);
      actions.push(actions.shift());
    });
    const rect3 = new g.FilledRect(Object.assign(Object.assign({}, common_rect_params), {
      x: 140,
      cssColor: "green"
    }));
    scene.append(rect3);
    rect3.onPointDown.add(function () {
      //@ts-ignore
      hero.setMental(effects[0]);
      effects.push(effects.shift());
    });
    const rect4 = new g.FilledRect(Object.assign(Object.assign({}, common_rect_params), {
      x: 200,
      cssColor: "cyan"
    }));
    scene.append(rect4);
    rect4.onPointDown.add(function () {
      hero.setDamage();
    });
    for (let i = 0; i < 3; i++) {
      const rect = new g.FilledRect({
        scene: scene,
        touchable: true,
        width: 30,
        height: 30,
        cssColor: "black",
        opacity: 0.5,
        x: g.game.random.generate() * (g.game.width - 30),
        y: g.game.random.generate() * (g.game.height - 30)
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
        const hit = g.Collision.intersectEntities(rect, hero.getHitArea());
        rect.cssColor = hit ? "yellow" : "black";
        rect.modified();
      });
    }
    scene.append(hero);
  });
  g.game.pushScene(scene);
}
module.exports = main;
})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}