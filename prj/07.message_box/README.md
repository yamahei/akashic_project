メッセージボックス（改行、送り機能付き）クラス
==============================================

概要
----

ゲームで使うメッセージボックスのクラスを作る

- ありがちな機能は押さえたい
  - 外枠あり☑
  - 長い文字は自動で改行☑
  - 枠いっぱいになったら停止（クリックで進める）☑
- フォントは選択可能にしたい☑
- [akashic-label](https://github.com/akashic-games/akashic-label)を使う

### サンプルの起動方法

```sh
npm run debug # access to http://localhost:3000
```

<dl>
<dt style="color: red;">■</dt>
<dd>複数段落で表示するサンプル</dd>
<dt style="color: blue;">■</dt>
<dd>1段落で全行表示するサンプル</dd>
</dl>

メッセージボックスクラス
------------------------

### 自分の好きなフォントを登録する

```ts
const assetConfig = g.game._assetManager.configuration;
const fontPath = assetConfig["JF-Dot-MPlus10.ttf"].path;
MessageBox.appendNewFontFace(fontPath, FONTFACE_NAME).then(()=>{
  // 省略：登録したフォントの使用はこの中で
});
```

### インスタンスの生成、`scene`への追加

```ts
const messageBox = new MessageBox({
  EParam: {scene: scene, touchable: true},
  fontFamily: FONTFACE_NAME,
  fontSize: 10,
});
scene.append(messageBox);
```

### メッセージの表示

```ts
const message = [
  "メッセージは文字列か配列",
  "配列の1要素が1つの段落",
  "\nで改行"
];
messageBox.showMessage(message);
```

### メッセージを次に進める

```ts
messageBox.onPointUp.add(()=>{ messageBox.next(); });
```

- 1段落表示が終わると待ち状態になる
  - メッセージ全体を表示終わっても待ち状態になる
- `next`で次の段落に進む
  - 全体表示終わってる状態なら`end`を呼ぶ
  - 全体表示終わってる状態で`next`すると内部で`end`を呼ぶ

### イベント

```ts
// 1段落表示が終わって待ち状態になった時に発生
messageBox.OnWaitToNext.add(()=>{
  console.log("OnWaitToNext");
});
// メッセージ全体を表示終わって待ち状態になった時に発生
messageBox.OnWaitToEnd.add(()=>{
  console.log("OnWaitToEnd");
});
```


事前の準備
----------

### akashic-label のインストール

```sh
akashic install @akashic-extension/akashic-label
```
※全てのAkashicプロジェクトで必要なので手順に追加する☑

### 良さげなフォント

- [自家製ドットフォントシリーズ](http://jikasei.me/font/jf-dotfont/)
  - JFドットM+10（`JF-Dot-MPlus10.ttf`）

![](./jfdotfont-sample-mplus.png)

> JFドットM+10 … JIS X 0208：1990 対応、等幅 (太字あり)

`JIS X 0208：1990`は「JIS第1第2水準漢字」とほぼ同義（「[JIS X 0208 | Wikipedia](https://ja.wikipedia.org/wiki/JIS_X_0208)」）

### 外部フォントをAkashic Engineで使う方法

- [ニコ生ゲーにフォントを埋め込んでお洒落にする](https://isobe-yaki.hateblo.jp/entry/2023/05/15/024253)

#### ① `game.json`にフォントファイルを追加する
```json
{
  //前略
	"assets": {
    //前略
		"JF-Dot-MPlus10.ttf": {//追加
			"type": "text",
			"path": "assets/font/jfdotfont/JF-Dot-MPlus10.ttf",
			"global": true
		}
    //後略
	},
  //後略
}
```

#### ② FontFaceを登録する

Akashic Engine外のブラウザ世界にアクセスする（※1）ために、`dom`を追加しないとエラーが出ちゃうので、`tsconfig.json`を編集する（※2）。
※1: `document`,`fetch`あたりのこと。
※2: 今後のプロジェクト作成の手順に必要なので追加済み。

```json
//前略
"lib": [
  "es5",
  "dom"//これを追加
],
//後略
```

登録コードはこんな感じ。
- なぜか`document.fonts.add`がTSエラーになるので`@ts-ignore`で抑止する。
- （自前で`fetch`するため）`scene`のコンストラクタ引数`assetPaths`には書かなくて良い。

```ts
const assetConfig = g.game._assetManager.configuration;
const fontPath = assetConfig["JF-Dot-MPlus10.ttf"].path;
const fontFaceName = "MyFavoriteFont";

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
```

#### ③ FontFaceが登録できたら後はいつもの通り

```ts
const font = new g.DynamicFont({
  game: g.game, fontFamily: fontFaceName, size: 10
});
const label = new g.Label({
  scene: scene, font: font, fontSize: 10, textColor: "blue",
  text: `コレが俺の[${fontFaceName}]だっ！`,
});
scene.append(label);
```

`注意`
- Promiseの完了を待たないと適用されない！
- `fontFaceName`に変な記号が入るとエラーなく適用されない
  - `JFM+10`はダメだった
