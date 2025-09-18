"use strict";

const FORMAT = "$HH:$MM.$SS";

class DigitalWatch extends g.E {

    private format:string;

    private foreFontAsset?:g.ImageAsset;
    private foreFontGlyphAsset?:any
    private backFontAsset?:g.ImageAsset;
    private backFontGlyphAsset?:any

    private foreFontLabel?:g.Label;
    private backFontLabel?:g.Label;

    constructor(param: g.EParameterObject, fontSize=24, foreFont: string, foreGlyph: string, backFont: string=null, backGlyph: string=null, format: string=FORMAT) {
        super(param);
        this.format = format;
        this.foreFontAsset = param.scene.asset.getImage(foreFont);
        this.foreFontGlyphAsset = param.scene.asset.getJSONContent(foreGlyph);
        if(backFont && backGlyph){
            this.backFontAsset = param.scene.asset.getImage(backFont);
            this.backFontGlyphAsset = param.scene.asset.getJSONContent(backGlyph);
        }else{
            this.backFontAsset = this.foreFontAsset;
            this.backFontGlyphAsset = this.backFontGlyphAsset;
        }

        const foreFontBF = new g.BitmapFont({
            src: this.foreFontAsset, glyphInfo: this.foreFontGlyphAsset
        });
        const backFontBF = new g.BitmapFont({
            src: this.backFontAsset, glyphInfo: this.backFontGlyphAsset
        });

        this.foreFontLabel = new g.Label({
            scene: param.scene, text: FORMAT,
            fontSize: fontSize, font: foreFontBF,
            x: 0, y: 0,
        });
        this.backFontLabel = new g.Label({
            scene: param.scene, text: FORMAT,
            fontSize: fontSize, font: backFontBF,
            x: 0, y: 0,
        });

        this.foreFontLabel.hide();
        this.backFontLabel.hide();

        param.scene.append(this.backFontLabel);
        param.scene.append(this.foreFontLabel);

        this.onUpdate.add(this.tick);
    }

    private tick(){
        const now = new Date();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const millisec = now.getMilliseconds();
        const countdownMinutes = [29, 59];
        const countdownSeconds = 5;

        let foreLabelOpacity = 1;
        if(countdownMinutes.indexOf(minutes) <= 0){
            if((60-countdownSeconds) >= seconds){
                foreLabelOpacity = millisec;
            }
        }

        const dates = this.getDates(now);
        const timeText = this.getTimeText(dates);

        this.foreFontLabel.text = timeText;
        this.foreFontLabel.opacity = foreLabelOpacity;
        this.foreFontLabel.show();
        this.foreFontLabel.modified();
        this.backFontLabel.text = timeText;
        this.backFontLabel.opacity = 1;
        this.backFontLabel.show();
        this.backFontLabel.modified();
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