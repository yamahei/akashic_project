window.gLocalAssetContainer["MessageBox"] = function(g) { (function(exports, require, module, __filename, __dirname) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MessageBox = void 0;
const akashic_label_1 = require("@akashic-extension/akashic-label");
/**
 * メッセージボックスクラス
 */
class MessageBox extends g.E {
  get OnWaitToNext() {
    return this.onWaitToNext;
  }
  get OnWaitToEnd() {
    return this.onWaitToEnd;
  }
  /**
   * [static] ブラウザに FontFaceを登録する
   * - 凝ったフォントを使いたい時に使う
   * - 呼び出し元からの`await MessageBox.appendNewFontFace(...)`が効いてない気がする
   *   - `then(...)`で受けて初期化が終わってることを確認してから使う
   * @param {string} fontPath : game.jsonに登録したフォントのパス
   * @param {string} fontFaceName : 登録したいフォント名
   */
  static appendNewFontFace(fontPath, fontFaceName) {
    return __awaiter(this, void 0, void 0, function* () {
      yield fetch(fontPath).then(b => b.blob()).then(blob => blob.arrayBuffer()).then(buf => {
        new FontFace(fontFaceName, buf).load().then(font => {
          const faceSet = document.fonts;
          // fonts.addはあるのにエラーが出るので無視する
          // https://developer.mozilla.org/ja/docs/Web/API/FontFaceSet/add
          // @ts-ignore
          faceSet.add(font);
        });
      });
    });
  }
  /**
   * コンストラクタ
   * @param {MessageBoxParam} param
   */
  constructor(param) {
    var _a, _b, _c, _d, _e, _f;
    super(param.EParam);
    //イベント
    //1段落終わった時に発生する
    this.onWaitToNext = new g.Trigger();
    //メッセージ全体が終わった時に発生する
    this.onWaitToEnd = new g.Trigger();
    //表示メッセージ
    this.paragraphList = [];
    this.listIndex = 0;
    this.charIndex = 0;
    this.showing = false; //showMessageで表示中
    this.waiting = false; //表示途中（入力待ち）
    const scene = param.EParam.scene;
    const game = scene.game;
    const fontSize = this.fontSize = param.fontSize;
    const doubleFontSize = fontSize * 2;
    const halfFontSize = fontSize / 2;
    const font = new g.DynamicFont({
      game: game,
      fontFamily: param.fontFamily,
      size: this.fontSize
    });
    const width = param.width;
    const boxBackWidth = width;
    this.boxBack = new g.FilledRect({
      scene: scene,
      cssColor: (_a = param.backgroundColor) !== null && _a !== void 0 ? _a : 'black',
      width: boxBackWidth,
      height: 0,
      x: 0,
      y: 0
    });
    this.append(this.boxBack);
    const boxLineWidth = width - fontSize;
    this.boxLine = new g.FilledRect({
      scene: scene,
      cssColor: (_b = param.fontColor) !== null && _b !== void 0 ? _b : 'white',
      width: boxLineWidth,
      height: 0,
      x: halfFontSize,
      y: halfFontSize
    });
    this.append(this.boxLine);
    const boxFillWidth = width - fontSize - 2;
    this.boxFill = new g.FilledRect({
      scene: scene,
      cssColor: (_c = param.backgroundColor) !== null && _c !== void 0 ? _c : 'black',
      width: boxFillWidth,
      height: 0,
      x: halfFontSize + 1,
      y: halfFontSize + 1
    });
    this.append(this.boxFill);
    this.messageLabel = new akashic_label_1.Label({
      scene: scene,
      text: "",
      font: font,
      fontSize: fontSize,
      textColor: (_d = param.fontColor) !== null && _d !== void 0 ? _d : 'white',
      lineGap: (_e = param.lineGap) !== null && _e !== void 0 ? _e : fontSize / 2,
      width: ((_f = param.width) !== null && _f !== void 0 ? _f : game.width) - doubleFontSize,
      x: fontSize,
      y: fontSize
    });
    this.append(this.messageLabel);
    this.onUpdate.add(() => {
      this.progress();
    });
  }
  setBox() {
    const {
      x,
      y,
      width,
      height
    } = this.messageLabel;
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
  setText(text) {
    this.messageLabel.text = text;
    this.messageLabel.invalidate();
  }
  progress() {
    if (!this.paragraphList) {
      return;
    }
    if (!this.showing) {
      return;
    }
    if (this.waiting) {
      return;
    }
    const line = this.paragraphList[this.listIndex];
    if (line) {
      //has paragraph?
      if (line.length > this.charIndex) {
        // in line
        const text = line.substring(0, this.charIndex);
        this.charIndex += 1;
        this.setText(text);
        this.setBox();
      } else {
        // next paragraph
        this.waiting = true;
        if (this.paragraphList[this.listIndex + 1]) {
          this.onWaitToNext.fire();
        } else {
          this.onWaitToEnd.fire();
        }
      }
    } else {
      //end of message
      //もうメッセージを表示し尽くしたのに`next`を呼び出したら`end`を呼ぶ
      console.log("paragraphList is over.");
      this.end();
      //TODO: auto remove?
    }
  }
  /**
   * メッセージを表示する
   * @param {MessageBoxText} message : 表示するメッセージ
   */
  showMessage(message) {
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
  /**
   * 段落終わりで停止しているメッセージを進める
   * - 全体表示終わりで呼ばれると、`end`を呼ぶ
   */
  next() {
    this.waiting = false;
    this.charIndex = 0;
    this.listIndex += 1;
  }
  /**
   * 全体表示終わりで停止しているメッセージを終了する
   * - メッセージボックス自体も非表示にする
   */
  end() {
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
exports.MessageBox = MessageBox;
})(g.module.exports, g.module.require, g.module, g.filename, g.dirname);
}