"use strict";

/**
 * 時計の表示形式
 * 今のところサポートしているのは時分秒のみ（$HH: 時、$MM: 分、$SS: 秒）
 * 年月日とか曜日とかを増やしたいなら`DigitalWatch#getDates`を拡張する
 */
const FORMAT = "$HH:$MM:$SS";

/**
 * デジタル時計クラス生成パラメータ
 */
export type DigitalWatchParameter = {
    //実体のEに渡すパラメータ：このsceneに追加される
    EParam: g.EParameterObject;
    //フォントサイズ：bitmapfontに合わせるのが綺麗
    fontSize?: number;
    //全景用フォント
    foreFont: string;
    foreGlyph: string;
    //背景用フォント：X秒前の表示用にforeFontと同型、色違いを指定する想定
    backFont?: string;
    backGlyph?: string;
    //時計のフォーマット
    format?: string;
    //何分刻みでカウントダウンするか
    countdownStepMinute?: number;
    //何秒前からカウントダウンするか
    countdownSecond?:number;
}

/**
 * デジタル時計クラス
 */
export class DigitalWatch extends g.E {

    private foreFontAsset?:g.ImageAsset;
    private foreFontGlyphAsset?:any
    private backFontAsset?:g.ImageAsset;
    private backFontGlyphAsset?:any

    private foreFontLabel?:g.Label;
    private backFontLabel?:g.Label;

    private format:string;
    private countdownStepMinute:number;
    private countdownSecond:number;

    /**
     * コンストラクタ
     * @param {DigitalWatchParameter} param
     */
    constructor(param: DigitalWatchParameter) {
        super(param.EParam);

        const scene = param.EParam.scene;
        const fontSize = param.fontSize ?? 48;
        const foreFont = param.foreFont;
        const foreGlyph = param.foreGlyph;
        const backFont = param.backFont ?? foreFont;
        const backGlyph = param.backGlyph ?? foreGlyph;
        const format = param.format ?? FORMAT;
        const countdownStepMinute = param.countdownStepMinute ?? 30;
        const countdownSecond = param.countdownSecond ?? 10;

        this.format = format;
        this.countdownStepMinute = countdownStepMinute;
        this.countdownSecond = countdownSecond;
        this.foreFontAsset = scene.asset.getImage(foreFont);
        this.foreFontGlyphAsset = scene.asset.getJSONContent(foreGlyph);
        this.backFontAsset = scene.asset.getImage(backFont);
        this.backFontGlyphAsset = scene.asset.getJSONContent(backGlyph);

        const hasForeGlyphMap = !!this.foreFontGlyphAsset?.map;
        const foreFontBF = new g.BitmapFont({
            src: this.foreFontAsset, 
            glyphInfo: hasForeGlyphMap ? this.foreFontGlyphAsset : undefined,
            map: hasForeGlyphMap ? undefined : this.foreFontGlyphAsset,
            defaultGlyphWidth: fontSize, defaultGlyphHeight: fontSize
        });
        const hasBackGlyphMap = !!this.backFontGlyphAsset?.map;
        const backFontBF = new g.BitmapFont({
            src: this.backFontAsset,
            glyphInfo: hasBackGlyphMap ? this.backFontGlyphAsset : undefined,
            map: hasBackGlyphMap ? undefined : this.backFontGlyphAsset,
            defaultGlyphWidth: fontSize, defaultGlyphHeight: fontSize
        });

        const foreFontLabel = this.foreFontLabel = new g.Label({
            scene: scene, text: "",//FORMAT,
            fontSize: fontSize, font: foreFontBF,
            x: 0, y: 0,
        });
        const backFontLabel = this.backFontLabel = new g.Label({
            scene: scene, text: "",//FORMAT,
            fontSize: fontSize, font: backFontBF,
            x: 0, y: 0,
        });

        this.append(backFontLabel);//backを先に
        this.append(foreFontLabel);

        this.onUpdate.add(() => { this.tick(); });
    }

    private tick(){
        const now = new Date();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const millisec = now.getMilliseconds();
        const countdownStepMinute = this.countdownStepMinute;
        const countdownSecond = this.countdownSecond;

        let foreLabelOpacity = 1;
        if((minutes + 1) % countdownStepMinute == 0){
            if((60 - countdownSecond) <= seconds){
                foreLabelOpacity = millisec / 1000;
            }
        }

        const dates = this.getDates(now);
        const timeText = this.getTimeText(dates);

        this.foreFontLabel.text = timeText;
        this.foreFontLabel.opacity = foreLabelOpacity;
        this.foreFontLabel.invalidate();
        this.backFontLabel.text = timeText;
        this.backFontLabel.opacity = (foreLabelOpacity == 1 ? 0 : 1);
        this.backFontLabel.invalidate();

        //E自身に大きさがないと、クリックや衝突が起きない
        this.width = Math.max(this.foreFontLabel.width, this.backFontLabel.width);
        this.height = Math.max(this.foreFontLabel.height, this.backFontLabel.height);
        this.modified();
    }
    private getDates(now: Date):{ [key: string]: string } {
        return {
            "$HH": ("00" + now.getHours().toString()).slice(-2),
            "$MM": ("00" + now.getMinutes().toString()).slice(-2),
            "$SS": ("00" + now.getSeconds().toString()).slice(-2),
        };
    }
    private getTimeText(dates:{ [key: string]: string }):string{
        let text = this.format;
        Object.keys(dates).forEach(k=>{
            text = text.replace(k, dates[k] as string);
        });
        return text;
    }
}