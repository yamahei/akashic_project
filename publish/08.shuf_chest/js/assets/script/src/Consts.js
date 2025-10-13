window.gLocalAssetContainer["Consts"] = function(g) { (function(exports, require, module, __filename, __dirname) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GET_FONT_OBJECT161 = exports.WATCH_PARAMS = exports.FONT_ASSET_PATH = exports.FONT_SIZE = void 0;
exports.FONT_SIZE = 16;
exports.FONT_ASSET_PATH = {
  foreFont: "/assets/font/font16_1.png",
  foreGlyph: "/assets/font/glyph_area_16.json",
  backFont: "/assets/font/font16_3.png",
  backGlyph: "/assets/font/glyph_area_16.json"
};
exports.WATCH_PARAMS = {
  fontSize: exports.FONT_SIZE,
  countdownStepMinute: 5,
  countdownSecond: 10
};
const GET_FONT_OBJECT161 = scene => {
  const fontid = exports.FONT_ASSET_PATH.foreFont.replace(/^\//, "");
  const glyphid = exports.FONT_ASSET_PATH.foreGlyph.replace(/^\//, "");
  const fontimage = scene.asset.getImageById(fontid);
  const fontglyph = JSON.parse(scene.asset.getTextById(glyphid).data);
  const hasForeGlyphMap = !!(fontglyph === null || fontglyph === void 0 ? void 0 : fontglyph.map);
  return new g.BitmapFont({
    src: fontimage,
    glyphInfo: hasForeGlyphMap ? fontglyph : undefined,
    map: hasForeGlyphMap ? undefined : fontglyph,
    defaultGlyphWidth: exports.FONT_SIZE,
    defaultGlyphHeight: exports.FONT_SIZE
  });
};
exports.GET_FONT_OBJECT161 = GET_FONT_OBJECT161;
})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}