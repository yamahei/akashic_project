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

- [DS-Digital](https://www.dafont.com/ds-digital.font): 没
- [7セグ・14セグフォント 「DSEG」](https://www.keshikan.net/fonts.html): 没
- [Digital-7 Font Family](https://www.1001fonts.com/digital-7-font.html): 採用



### 生成コマンドの記録

```sh
CHARS='"$%&'\''*+-=.,/\#@_<>()[]{}:;|\?!`~^0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
HEIGHT=24
FONT=./digital-7.monoitalic.ttf
COLOR1='#040504'
OUTPUT1=digital-7.monoitalic.size24.black.bitmapfont.png
COLOR2='#E00504'
OUTPUT2=digital-7.monoitalic.size24.red.bitmapfont.png
# Generate
bmpfont-generator -c "${CHARS}" -H ${HEIGHT} -F ${COLOR1} ${FONT} ${OUTPUT1}
bmpfont-generator -c "${CHARS}" -H ${HEIGHT} -F ${COLOR2} ${FONT} ${OUTPUT2}
```


デジタル時計のクラス
--------------------

a
