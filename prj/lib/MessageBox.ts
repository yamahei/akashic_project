"use strict";

export class MessageBox  extends g.E {

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

}