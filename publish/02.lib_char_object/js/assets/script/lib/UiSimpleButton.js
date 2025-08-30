window.gLocalAssetContainer["UiSimpleButton"] = function(g) { (function(exports, require, module, __filename, __dirname) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UiSimpleButton = void 0;
const DEFAULT_FONT_SIZE = 16;
const DEFAULT_FONT_COLOR = "white";
const DEFAULT_BACKGROUND_COLOR = "gray";
const PADDING_VERTICAL = DEFAULT_FONT_SIZE / 2;
const PADDING_HORIZONTAL = DEFAULT_FONT_SIZE;
class UiSimpleButton extends g.E {
  constructor(param) {
    var _a, _b, _c, _d, _e, _f;
    const font = new g.DynamicFont({
      game: g.game,
      fontFamily: "monospace",
      size: (_a = param.fontSize) !== null && _a !== void 0 ? _a : DEFAULT_FONT_SIZE
    });
    const label = new g.Label({
      font: font,
      x: PADDING_HORIZONTAL,
      y: PADDING_VERTICAL,
      scene: param.scene,
      text: param.text,
      fontSize: (_b = param.fontSize) !== null && _b !== void 0 ? _b : DEFAULT_FONT_SIZE,
      textColor: (_c = param.cssColor) !== null && _c !== void 0 ? _c : DEFAULT_FONT_COLOR
    });
    const textWidth = param.text.split("").map(c => c.match(/^[^\x01-\x7E\xA1-\xDF]+$/) ? 2 : 1).reduce((acc, cur) => acc + cur, 0);
    const buttonWidth = textWidth * ((_d = param.fontSize) !== null && _d !== void 0 ? _d : DEFAULT_FONT_SIZE) + PADDING_HORIZONTAL * 2;
    const buttonHeight = ((_e = param.fontSize) !== null && _e !== void 0 ? _e : DEFAULT_FONT_SIZE) + PADDING_VERTICAL * 2;
    const rect = new g.FilledRect({
      scene: param.scene,
      width: buttonWidth,
      height: buttonHeight,
      touchable: true,
      cssColor: (_f = param.cssBackgroundColor) !== null && _f !== void 0 ? _f : DEFAULT_BACKGROUND_COLOR
    });
    super(Object.assign(Object.assign({}, param), {
      width: buttonWidth,
      height: buttonHeight,
      touchable: true
    }));
    this.append(rect);
    this.append(label);
  }
}
exports.UiSimpleButton = UiSimpleButton;
})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}