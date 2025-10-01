window.gLocalAssetContainer["main"] = function(g) { (function(exports, require, module, __filename, __dirname) {
"use strict";

const TitleScene_1 = require("./TitleScene");
const GameScene_1 = require("./GameScene");
const BonusScene_1 = require("./BonusScene");
const SCENESTATE_ACTIVE = "active";
function main(param) {
  const game = g.game;
  let level = 1;
  const titleScene = createTitleScene();
  titleScene.OnGameStart.add(() => {
    console.log("titleScene.OnGameStart");
    level = 1;
    const gameScene = createGameScene(level);
    g.game.pushScene(gameScene);
  });
  game.pushScene(titleScene);
}
function createTitleScene() {
  const scene = new TitleScene_1.TitleScene({
    game: g.game
    // assetIds: ["player", "shot", "se"]
  });
  scene.onStateChange.add(() => {
    console.log(`titleScene.onStateChange: state=${scene.state}`);
    if (scene.state === SCENESTATE_ACTIVE) {
      scene.refresh();
    }
  });
  return scene;
}
function createGameScene(level) {
  const scene = new GameScene_1.GameScene({
    game: g.game
    // assetIds: ["player", "shot", "se"]
  });
  scene.OnSuccessLevel.add(() => {
    console.log("gameScene.OnSuccessLevel");
    level += 1;
    const nextIsBonus = (level - 1) % 5 == 0;
    if (nextIsBonus) {
      console.log("game.replaceScene(bonusScene)");
      const bonus = createBonusScene();
      g.game.pushScene(bonus);
    } else {
      console.log(`gameScene.refresh(level=${level});`);
      scene.refresh(level);
    }
  });
  scene.OnFailedLevel.add(() => {
    console.log("gameScene.OnFailedLevel");
    g.game.popScene();
  });
  scene.onStateChange.add(() => {
    console.log(`gameScene.onStateChange: state=${scene.state}`);
    if (scene.state === SCENESTATE_ACTIVE) {
      scene.refresh(level);
    }
  });
  return scene;
}
function createBonusScene() {
  const scene = new BonusScene_1.BonusScene({
    game: g.game
    // assetIds: ["player", "shot", "se"]
  });
  scene.OnFinishBonus.add(() => {
    console.log("bonusScene.OnFinishBonus");
    g.game.popScene();
  });
  return scene;
}
module.exports = main;
})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}