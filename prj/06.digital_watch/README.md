デジタル表示のBitmapFontとデジタル時計のクラス
==============================================

概要
----

BitmapFontの作り方
------------------

### Akashic Engine 公式

- [bmpfont-generator の仕様](https://akashic-games.github.io/reference/tool/bmpfont-generator.html)

> bmpfont-generator は以下のコマンドでインストールすることができます。
> ```bash
> npm install -g @akashic/bmpfont-generator
> ```

<details>
<summary>エラーが出た。</summary>
Copilotに聞いたら、ローカルビルドに必要なライブラリが足りないとのこと。
以下のコマンドでインストールするってコトまで教えてくれた。

```sh
sudo apt update
sudo apt install -y build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev pkg-config libpixman-1-dev
```

インストール後に再実行したらうまく行った。

</details>



> bmpfont-generator の典型的な実行方法は次のようなものです。
> ```bash
> bmpfont-generator --chars '0123456789' --height 14 --fill '#ff0000' sourceFont.ttf bitmap.png
> ```

汎化するとこんな感じ

```sh
CHARS=0123456789
HEIGHT=14
COLOR=FF0000
FONT=sourceFont.ttf
OUTPUT=bitmap.png
# Generate
bmpfont-generator --chars ${CHARS} --height ${HEIGHT} --fill ${COLOR} ${FONT} ${OUTPUT}
```

### デジタル時計風のフォント

<details>
<summary>没フォント</summary>
- [7セグ・14セグフォント 「DSEG」](https://www.keshikan.net/fonts.html)

サポートしてる文字かつ特殊文字じゃないものをBitmapFont化する

```js
const xpath = "//table[@class='center']//tr/td[2]";
[...$x(xpath)].map(e=>e.textContent).join("");
//主力結果の「0(ALL SEGMENT)」以降を削除して使用する
//=>'"$%&\'()*+,-./0123456789:<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ\\^_`abcdefghijklmnopqrstuvwxyz|~\\¦°±（後略）'
// シングルクオート（'）と円記号（\）がクォートされているので注意
```

フォントは「DSEG14 Classic Mini Bold Italic」が良さそう

```
./fonts-DSEG_v046/DSEG14-Classic-MINI/DSEG14ClassicMini-BoldItalic.ttf
```

</details>


- [DS-Digital](https://www.dafont.com/ds-digital.font)




### 生成コマンドの記録

```sh
CHARS='"$%&'\''*+-=.,/\#@_<>()[]{}:;|\?!`~^0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
HEIGHT=24
FONT=./fonts-ds_digital/DS-DIGIB.TTF
COLOR1='#040504'
OUTPUT1=ds_digital.bold.size24.black.bitmapfont.png
COLOR2='#E00504'
OUTPUT2=ds_digital.bold.size24.red.bitmapfont.png
# Generate
bmpfont-generator -c "${CHARS}" -H ${HEIGHT} -F ${COLOR1} ${FONT} ${OUTPUT1}
bmpfont-generator -c "${CHARS}" -H ${HEIGHT} -F ${COLOR2} ${FONT} ${OUTPUT2}
```


デジタル時計のクラス
--------------------

a
