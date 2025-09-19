"use strict";

const FORMAT = "$HH:$MM.$SS";

export type DigitalWatchParameter = {
    fontSize?: number;
    foreFont: string;
    foreGlyph: string;
    backFont?: string;
    backGlyph?: string;
    format?: string;
    countdownStepMinute?: number;
    countdownSecond?:number;
}

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

    constructor(param: g.EParameterObject, DWParam: DigitalWatchParameter) {
        super(param);

        const fontSize = DWParam.fontSize ?? 24;
        const foreFont = DWParam.foreFont;
        const foreGlyph = DWParam.foreGlyph;
        const backFont = DWParam.backFont ?? foreFont;
        const backGlyph = DWParam.backGlyph ?? foreGlyph;
        const format = DWParam.format ?? FORMAT;
        const countdownStepMinute = DWParam.countdownStepMinute ?? 30;
        const countdownSecond = DWParam.countdownSecond ?? 10;

        this.format = format;
        this.countdownStepMinute = countdownStepMinute;
        this.countdownSecond = countdownSecond;
        this.foreFontAsset = param.scene.asset.getImage(foreFont);
        this.foreFontGlyphAsset = param.scene.asset.getJSONContent(foreGlyph);
        this.backFontAsset = param.scene.asset.getImage(backFont);
        this.backFontGlyphAsset = param.scene.asset.getJSONContent(backGlyph);

        const foreFontBF = new g.BitmapFont({
            src: this.foreFontAsset, glyphInfo: this.foreFontGlyphAsset
        });
        const backFontBF = new g.BitmapFont({
            src: this.backFontAsset, glyphInfo: this.backFontGlyphAsset
        });

        const foreFontLabel = this.foreFontLabel = new g.Label({
            scene: param.scene, text: FORMAT,
            fontSize: fontSize, font: foreFontBF,
            x: 0, y: 0,
        });
        const backFontLabel = this.backFontLabel = new g.Label({
            scene: param.scene, text: FORMAT,
            fontSize: fontSize, font: backFontBF,
            x: 0, y: 0,
        });

        this.foreFontLabel.hide();
        this.backFontLabel.hide();

        param.scene.append(backFontLabel);
        param.scene.append(foreFontLabel);

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
        console.log({foreLabelOpacity, minutes, seconds});

        const dates = this.getDates(now);
        const timeText = this.getTimeText(dates);

        this.foreFontLabel.text = timeText;
        this.foreFontLabel.opacity = foreLabelOpacity;
        this.foreFontLabel.show();
        // this.foreFontLabel.modified();
        this.foreFontLabel.invalidate();
        this.backFontLabel.text = timeText;
        this.backFontLabel.opacity = 1 - foreLabelOpacity;
        this.backFontLabel.show();
        // this.backFontLabel.modified();
        this.backFontLabel.invalidate();
    }
    private getDates(now: Date):{ [key: string]: string } {
        return {
            "$HH": ("00" + now.getHours().toString()).slice(-2),
            "$MM": ("00" + now.getMinutes().toString()).slice(-2),
            "$SS": ("00" + now.getSeconds().toString()).slice(-2),
        };
    }

    private getTimeText(dates:{ [key: string]: string }):string{
        let label = this.format;
        Object.keys(dates).forEach(k=>{
            label = label.replace(k, dates[k] as string);
        });
        return label;
    }

}