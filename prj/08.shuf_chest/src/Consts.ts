"use strict";

export const FONT_ASSET_PATH = {
	foreFont: "/assets/font/font16_1.png",
	foreGlyph: "/assets/font/glyph_area_16.json",
	backFont: "/assets/font/font16_3.png",
	backGlyph: "/assets/font/glyph_area_16.json",
};
export const WATCH_PARAMS = {
    fontSize: 16,
    countdownStepMinute: 5,
    countdownSecond: 10,
};

export const GET_FONT_OBJECT161 = (scene: g.Scene) =>{
    const fontid = FONT_ASSET_PATH.foreFont.replace(/^\//, "");
    const glyphid = FONT_ASSET_PATH.foreGlyph.replace(/^\//, "");
    const fontimage = scene.asset.getImageById(fontid);
    const fontglyph = JSON.parse(scene.asset.getTextById(glyphid).data);
    const hasForeGlyphMap = !!fontglyph?.map;
    return new g.BitmapFont({
        src: fontimage,
        glyphInfo: hasForeGlyphMap ? fontglyph : undefined,
        map: hasForeGlyphMap ? undefined : fontglyph,
    });
};

