"use strict";

import { Label } from "@akashic-extension/akashic-label";

export type MessageBoxSingleText = string;
export type MessageBoxMultilineText = Array<string>;
export type MessageBoxText = MessageBoxSingleText | MessageBoxMultilineText;

export type MessageBoxParam = {
    EParam:g.EParameterObject;
    fontFamily: string;
    fontSize: number;
    fontColor?: string;// default: 'white'
    backgroundColor?: string;// default: 'black'
    //ATTENTION: 以下、外枠の幅を含むので、実際の表示エリアはもっと小さい
    width?: number;// default: game.width
    // minHeight?: number;// default: fontSize * 4
    // maxHeight?: number;// default: game.height
    lineGap?: number;// default: fontSize / 2
};

export class MessageBox  extends g.E {

    //イベント
    //1段落終わった時に発生する
    private onWaitToNext: g.Trigger<void> = new g.Trigger<void>();
    get OnWaitToNext(): g.Trigger<void>{ return this.onWaitToNext; }
    //メッセージ全体が終わった時に発生する
    private onWaitToEnd: g.Trigger<void> = new g.Trigger<void>();
    get OnWaitToEnd(): g.Trigger<void>{ return this.onWaitToEnd; }

    //UIオブジェクト
    private boxBack:g.FilledRect;
    private boxLine:g.FilledRect;
    private boxFill:g.FilledRect;
    private messageLabel:Label;
    //表示メッセージ
    private paragraphList:string[] = [];
    private listIndex = 0;
    private charIndex = 0;
    //表示制御
    private fontSize:number;
    private showing:boolean = false;//showMessageで表示中
    private waiting:boolean = false;//表示途中（入力待ち）

    public static async appendNewFontFace(fontPath: string, fontFaceName: string):Promise<void>{

        await fetch(fontPath)
        .then(b => b.blob())
        .then(blob => blob.arrayBuffer())
        .then(buf => {
            new FontFace(fontFaceName, buf)
            .load()
            .then(font => {
                const faceSet:FontFaceSet = document.fonts;
                // fonts.addはあるのにエラーが出るので無視する
                // https://developer.mozilla.org/ja/docs/Web/API/FontFaceSet/add
                // @ts-ignore
                faceSet.add(font);
            });
        });        
    }

    constructor(param:MessageBoxParam){
        super(param.EParam);

        const scene = param.EParam.scene;
        const game = scene.game;
        const fontSize = this.fontSize = param.fontSize;
        const doubleFontSize = fontSize * 2;
        const halfFontSize = fontSize / 2;
        const font = new g.DynamicFont({
            game: game,
            fontFamily: param.fontFamily,
            size: this.fontSize,
        });

        const width = param.width;
        const boxBackWidth = width;
        this.boxBack = new g.FilledRect({
            scene: scene,
            cssColor: param.backgroundColor ?? 'black',
            width: boxBackWidth, height: 0, x: 0, y: 0,
        });
        this.append(this.boxBack);

        const boxLineWidth = width - fontSize;
        this.boxLine = new g.FilledRect({
            scene: scene,
            cssColor: param.fontColor ?? 'white',
            width: boxLineWidth, height: 0, x: halfFontSize, y: halfFontSize,
        });
        this.append(this.boxLine);

        const boxFillWidth = width - fontSize - 2;
        this.boxFill = new g.FilledRect({
            scene: scene,
            cssColor: param.backgroundColor ?? 'black',
            width: boxFillWidth, height: 0, x: halfFontSize + 1, y: halfFontSize + 1,
        });
        this.append(this.boxFill);

        this.messageLabel = new Label({
            scene: scene,
            text: "",
            font: font,
            fontSize: fontSize,
            textColor: param.fontColor ?? 'white',
            lineGap: param.lineGap ?? fontSize / 2,
            width: (param.width ?? game.width) - doubleFontSize,
            x: fontSize, y: fontSize,
        });
        this.append(this.messageLabel);

        this.onUpdate.add(()=>{ this.progress() })
    }

    private setBox(){
        const {x, y, width, height} = this.messageLabel;
        this.boxBack.x = 0;
        this.boxBack.y = 0;
        this.boxBack.width = width + this.fontSize * 2;
        this.boxBack.height = height + this.fontSize * 2;
        this.boxBack.modified();
        this.boxLine.x = this.fontSize / 2;
        this.boxLine.y = this.fontSize / 2;
        this.boxLine.width = width + this.fontSize;
        this.boxLine.height = height + this.fontSize;
        this.boxLine.modified();
        this.boxFill.x = this.fontSize / 2 + 1;
        this.boxFill.y = this.fontSize / 2 + 1;
        this.boxFill.width = width + this.fontSize - 2;
        this.boxFill.height = height + this.fontSize - 2;
        this.boxFill.modified();
        //...and set self
        this.x = this.boxBack.x;
        this.y = this.boxBack.y;
        this.width = this.boxBack.width;
        this.height = this.boxBack.height;
        this.modified();
    }

    private setText(text:string){
        this.messageLabel.text = text;
        this.messageLabel.invalidate();
    }

    private progress(){
        if(!this.paragraphList){ return; }
        if(!this.showing){ return; }
        if(this.waiting){ return; }

        const line = this.paragraphList[this.listIndex];
        if(line){//has paragraph?
            if(line.length > this.charIndex){// in line
                const text = line.substring(0, this.charIndex);
                this.charIndex += 1;
                this.setText(text);
                this.setBox();
            }else{// next paragraph
                this.waiting = true;
                if(this.paragraphList[this.listIndex + 1]){
                    this.onWaitToNext.fire();
                }else{
                    this.onWaitToEnd.fire();
                }
            }
        }else{//end of message
            //もうメッセージを表示し尽くしたのに`next`を呼び出したら`end`を呼ぶ
            console.log("paragraphList is over.");
            this.end();
            //TODO: auto remove?
        }
    }

    public showMessage(message:MessageBoxText){
        this.paragraphList = Array.isArray(message) ? message : [message];
        this.listIndex = 0;
        this.charIndex = 0;
        this.showing = true;
        this.waiting = false;

        this.messageLabel.show();
        this.boxBack.show();
        this.boxLine.show();
        this.boxFill.show();
        this.modified();
    }

    public next(){
        this.waiting = false;
        this.charIndex = 0;
        this.listIndex += 1;
    }
    public end(){
        this.paragraphList = null;
        this.listIndex = 0;
        this.charIndex = 0;
        this.showing = false;
        this.waiting = false;

        this.messageLabel.hide();
        this.boxBack.hide();
        this.boxLine.hide();
        this.boxFill.hide();
        this.modified();
    }

    

}