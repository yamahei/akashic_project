window.gLocalAssetContainer["main"] = function(g) { (function(exports, require, module, __filename, __dirname) {
"use strict";

const Consts_1 = require("./Consts");
const TitleScene_1 = require("./TitleScene");
const GameScene_1 = require("./GameScene");
const BonusScene_1 = require("./BonusScene");
const ObjectEntity_1 = require("../lib/ObjectEntity");
const SCENESTATE_ACTIVE = "active";
function main(param) {
  const game = g.game;
  game.vars.global = {
    level: 1
  };
  const titleScene = createTitleScene();
  game.pushScene(titleScene);
}
function createTitleScene() {
  const chectSetting = ObjectEntity_1.ObjectEntity.getObjectSetting("chest_bright");
  const chestPath = chectSetting.asset_path;
  const titleScene = new TitleScene_1.TitleScene({
    game: g.game,
    assetIds: ["image/Title_FindMeIfYouCan.png"],
    assetPaths: [...Object.values(Consts_1.FONT_ASSET_PATH),
    //要"es2017"
    chestPath]
  });
  // titleScene.onLoad.add(() => {
  // 	titleScene.refresh();
  // });
  titleScene.onStateChange.add(() => {
    console.log(`TitleScene: state=${titleScene.state}`);
    if (titleScene.state === SCENESTATE_ACTIVE) {
      titleScene.refresh();
    }
  });
  titleScene.OnGameStart.add(() => {
    g.game.vars.global.level = 1;
    const gameScene = createGameScene();
    g.game.pushScene(gameScene);
  });
  return titleScene;
}
function createGameScene() {
  const chectSetting = ObjectEntity_1.ObjectEntity.getObjectSetting("chest_bright");
  const chestPath = chectSetting.asset_path;
  const gameScene = new GameScene_1.GameScene({
    game: g.game,
    assetPaths: [...Object.values(Consts_1.FONT_ASSET_PATH),
    //要"es2017"
    chestPath]
  });
  // scene.onLoad.add(() => {
  //     scene.refresh(1);
  // });
  gameScene.onStateChange.add(() => {
    console.log(`GameScene: state=${gameScene.state}`);
    if (gameScene.state === SCENESTATE_ACTIVE) {
      gameScene.refresh(g.game.vars.global.level);
    }
  });
  gameScene.OnSuccessLevel.add(() => {
    g.game.vars.global.level += 1;
    const nextIsBonus = (g.game.vars.global.level - 1) % 5 == 0;
    if (nextIsBonus) {
      const bonus = createBonusScene();
      g.game.pushScene(bonus);
    } else {
      gameScene.refresh(g.game.vars.global.level);
    }
  });
  gameScene.OnFailedLevel.add(() => {
    g.game.popScene();
  });
  return gameScene;
}
function createBonusScene() {
  const chectSetting = ObjectEntity_1.ObjectEntity.getObjectSetting("chest_bright");
  const chestPath = chectSetting.asset_path;
  const bonusScene = new BonusScene_1.BonusScene({
    game: g.game,
    assetPaths: [...Object.values(Consts_1.FONT_ASSET_PATH),
    //要"es2017"
    chestPath]
  });
  // bonusScene.onLoad.add(() => {
  // 	bonusScene.refresh();
  // });
  bonusScene.onStateChange.add(() => {
    console.log(`BonusScene: state=${bonusScene.state}`);
    if (bonusScene.state === SCENESTATE_ACTIVE) {
      bonusScene.refresh();
    }
  });
  bonusScene.OnFinishBonus.add(() => {
    g.game.popScene();
  });
  return bonusScene;
}
module.exports = main;
})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}