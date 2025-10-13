window.gLocalAssetContainer["DigitalWatch"] = function(g) { (function(exports, require, module, __filename, __dirname) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DigitalWatch = void 0;
/**
 * 時計の表示形式
 * 今のところサポートしているのは時分秒のみ（$HH: 時、$MM: 分、$SS: 秒）
 * 年月日とか曜日とかを増やしたいなら`DigitalWatch#getDates`を拡張する
 */
const FORMAT = "$HH:$MM:$SS";
/**
 * デジタル時計クラス
 */
class DigitalWatch extends g.E {
  /**
   * コンストラクタ
   * @param {DigitalWatchParameter} param
   */
  constructor(param) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    super(param.EParam);
    const scene = param.EParam.scene;
    const fontSize = (_a = param.fontSize) !== null && _a !== void 0 ? _a : 48;
    const foreFont = param.foreFont;
    const foreGlyph = param.foreGlyph;
    const backFont = (_b = param.backFont) !== null && _b !== void 0 ? _b : foreFont;
    const backGlyph = (_c = param.backGlyph) !== null && _c !== void 0 ? _c : foreGlyph;
    const format = (_d = param.format) !== null && _d !== void 0 ? _d : FORMAT;
    const countdownStepMinute = (_e = param.countdownStepMinute) !== null && _e !== void 0 ? _e : 30;
    const countdownSecond = (_f = param.countdownSecond) !== null && _f !== void 0 ? _f : 10;
    this.format = format;
    this.countdownStepMinute = countdownStepMinute;
    this.countdownSecond = countdownSecond;
    this.foreFontAsset = scene.asset.getImage(foreFont);
    this.foreFontGlyphAsset = scene.asset.getJSONContent(foreGlyph);
    this.backFontAsset = scene.asset.getImage(backFont);
    this.backFontGlyphAsset = scene.asset.getJSONContent(backGlyph);
    const hasForeGlyphMap = !!((_g = this.foreFontGlyphAsset) === null || _g === void 0 ? void 0 : _g.map);
    const foreFontBF = new g.BitmapFont({
      src: this.foreFontAsset,
      glyphInfo: hasForeGlyphMap ? this.foreFontGlyphAsset : undefined,
      map: hasForeGlyphMap ? undefined : this.foreFontGlyphAsset,
      defaultGlyphWidth: fontSize,
      defaultGlyphHeight: fontSize
    });
    const hasBackGlyphMap = !!((_h = this.backFontGlyphAsset) === null || _h === void 0 ? void 0 : _h.map);
    const backFontBF = new g.BitmapFont({
      src: this.backFontAsset,
      glyphInfo: hasBackGlyphMap ? this.backFontGlyphAsset : undefined,
      map: hasBackGlyphMap ? undefined : this.backFontGlyphAsset,
      defaultGlyphWidth: fontSize,
      defaultGlyphHeight: fontSize
    });
    const foreFontLabel = this.foreFontLabel = new g.Label({
      scene: scene,
      text: "",
      //FORMAT,
      fontSize: fontSize,
      font: foreFontBF,
      x: 0,
      y: 0
    });
    const backFontLabel = this.backFontLabel = new g.Label({
      scene: scene,
      text: "",
      //FORMAT,
      fontSize: fontSize,
      font: backFontBF,
      x: 0,
      y: 0
    });
    this.append(backFontLabel); //backを先に
    this.append(foreFontLabel);
    this.onUpdate.add(() => {
      this.tick();
    });
  }
  tick() {
    const now = new Date();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const millisec = now.getMilliseconds();
    const countdownStepMinute = this.countdownStepMinute;
    const countdownSecond = this.countdownSecond;
    let foreLabelOpacity = 1;
    if ((minutes + 1) % countdownStepMinute == 0) {
      if (60 - countdownSecond <= seconds) {
        foreLabelOpacity = millisec / 1000;
      }
    }
    const dates = this.getDates(now);
    const timeText = this.getTimeText(dates);
    this.foreFontLabel.text = timeText;
    this.foreFontLabel.opacity = foreLabelOpacity;
    this.foreFontLabel.invalidate();
    this.backFontLabel.text = timeText;
    this.backFontLabel.opacity = foreLabelOpacity == 1 ? 0 : 1;
    this.backFontLabel.invalidate();
    //E自身に大きさがないと、クリックや衝突が起きない
    this.width = Math.max(this.foreFontLabel.width, this.backFontLabel.width);
    this.height = Math.max(this.foreFontLabel.height, this.backFontLabel.height);
    this.modified();
  }
  getDates(now) {
    return {
      "$HH": ("00" + now.getHours().toString()).slice(-2),
      "$MM": ("00" + now.getMinutes().toString()).slice(-2),
      "$SS": ("00" + now.getSeconds().toString()).slice(-2)
    };
  }
  getTimeText(dates) {
    let text = this.format;
    Object.keys(dates).forEach(k => {
      text = text.replace(k, dates[k]);
    });
    return text;
  }
}
exports.DigitalWatch = DigitalWatch;
})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}