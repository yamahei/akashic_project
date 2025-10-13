window.gLocalAssetContainer["main"] = function(g) { (function(exports, require, module, __filename, __dirname) {
"use strict";

const DigitalWatch_1 = require("../lib/DigitalWatch");
function main(param) {
  const scene = new g.Scene({
    game: g.game,
    // このシーンで利用するアセットのIDを列挙し、シーンに通知します
    assetIds: ["player", "shot", "se"],
    assetPaths: [
    //official font
    "/assets/font/font16_1.png", "/assets/font/font16_3.png", "/assets/font/glyph_area_16.json",
    //original font
    "/assets/font/digital-7.monoitalic.size48.black.bitmapfont.png", "/assets/font/digital-7.monoitalic.size48.black.bitmapfont_glyphs.json", "/assets/font/digital-7.monoitalic.size48.red.bitmapfont.png", "/assets/font/digital-7.monoitalic.size48.red.bitmapfont_glyphs.json"]
  });
  scene.onLoad.add(() => {
    // ここからゲーム内容を記述します
    // 各アセットオブジェクトを取得します
    const playerImageAsset = scene.asset.getImageById("player");
    const shotImageAsset = scene.asset.getImageById("shot");
    const seAudioAsset = scene.asset.getAudioById("se");
    // プレイヤーを生成します
    const player = new g.Sprite({
      scene: scene,
      src: playerImageAsset,
      width: playerImageAsset.width,
      height: playerImageAsset.height
    });
    // プレイヤーの初期座標を、画面の中心に設定します
    player.x = (g.game.width - player.width) / 2;
    player.y = (g.game.height - player.height) / 2;
    player.onUpdate.add(() => {
      // 毎フレームでY座標を再計算し、プレイヤーの飛んでいる動きを表現します
      // ここではMath.sinを利用して、時間経過によって増加するg.game.ageと組み合わせて
      player.y = (g.game.height - player.height) / 2 + Math.sin(g.game.age % (g.game.fps * 10) / 4) * 10;
      // プレイヤーの座標に変更があった場合、 modified() を実行して変更をゲームに通知します
      player.modified();
    });
    // 画面をタッチしたとき、SEを鳴らします
    scene.onPointDownCapture.add(() => {
      seAudioAsset.play();
      // プレイヤーが発射する弾を生成します
      const shot = new g.Sprite({
        scene: scene,
        src: shotImageAsset,
        width: shotImageAsset.width,
        height: shotImageAsset.height
      });
      // 弾の初期座標を、プレイヤーの少し右に設定します
      shot.x = player.x + player.width;
      shot.y = player.y;
      shot.onUpdate.add(() => {
        // 毎フレームで座標を確認し、画面外に出ていたら弾をシーンから取り除きます
        if (shot.x > g.game.width) shot.destroy();
        // 弾を右に動かし、弾の動きを表現します
        shot.x += 10;
        // 変更をゲームに通知します
        shot.modified();
      });
      scene.append(shot);
    });
    scene.append(player);
    // ここまでゲーム内容を記述します
    const paramOrg = {
      EParam: {
        scene: scene
      },
      //original font
      foreFont: "/assets/font/digital-7.monoitalic.size48.black.bitmapfont.png",
      foreGlyph: "/assets/font/digital-7.monoitalic.size48.black.bitmapfont_glyphs.json",
      backFont: "/assets/font/digital-7.monoitalic.size48.red.bitmapfont.png",
      backGlyph: "/assets/font/digital-7.monoitalic.size48.red.bitmapfont_glyphs.json",
      fontSize: 48,
      countdownStepMinute: 5,
      countdownSecond: 10
    };
    const watchOrg = new DigitalWatch_1.DigitalWatch(paramOrg);
    scene.append(watchOrg);
    const paramOfficial = {
      EParam: {
        scene: scene,
        touchable: true,
        x: 30,
        y: 100
      },
      //official font
      foreFont: "/assets/font/font16_1.png",
      foreGlyph: "/assets/font/glyph_area_16.json",
      backFont: "/assets/font/font16_3.png",
      backGlyph: "/assets/font/glyph_area_16.json",
      fontSize: 16,
      countdownStepMinute: 5,
      countdownSecond: 10
    };
    const watchOfficial = new DigitalWatch_1.DigitalWatch(paramOfficial);
    scene.append(watchOfficial);
    let dragging = false;
    watchOfficial.onPointDown.add(function () {
      dragging = true;
    });
    watchOfficial.onPointUp.add(function () {
      dragging = false;
    });
    watchOfficial.onPointMove.add(function (e) {
      if (dragging) {
        watchOfficial.x += e.prevDelta.x;
        watchOfficial.y += e.prevDelta.y;
        watchOfficial.modified();
      }
    });
  });
  g.game.pushScene(scene);
}
module.exports = main;
})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}