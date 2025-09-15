マップチップの選定と画像作成ツール
==================================

概要
----

`/ORIGINAL_ASSETS/map`配下の画像は、FirstSeedMaterialで配布されていた、RPGツクール想定のマップチップ各種。
自作ゲームで利用するには規模が大きすぎるので、自分ゲーム向けに選定して、1枚画像を作成したい。
このプロジェクトでは、そのためのツールを作成する。

操作方法
--------

### 下準備：元画像のパスをjson化する

※シンボリックリンクはGitHub Actionsで削除されてしまい、GitHub Pages上で参照できないので、実態をコピーして使う

```sh
rm -f -r -d ./CP_ASSETS_MAPS
cp -rp ./assets/image/map ./CP_ASSETS_MAPS
ls -1 ./CP_ASSETS_MAPS/* | jq -R . | jq -s . > original_mapchips.json
```

### 起動

リソース読み込みの都合上、Webサーバ上で実行する必要がある

```sh
# Run the following command in the project root (`prj/04.mapchip_selector`) to run the web server:
ruby -run -e httpd #=> Access to http://localhost:8080/index.html
```

### 画面

![](./screen.drawio.svg)

<dl>
<dt>①View切り替え</dt>
<dd>
サイドビュー用とトップビュー用のマップチップを分けて管理しようと思ったけど、、いらないかも。削除したい。
</dd>
<dt>②ソースファイル</dt>
<dd>取得元の複数マップチップ画像の表示と切り替え（⑧ソース画像に作用する）。</dd>
<dt>③スケール変更</dt>
<dd>⑧ソース画像の表示倍率変更。※⑨出力先は未対応</dd>
<dt>④背景選択</dt>
<dd>マップチップの透過部分に表示する画像を選択する（あちこちに作用する）。</dd>
<dt>⑤ソース/出力先切り替え</dt>
<dd>⑧ソース画像と⑨出力先の表示を切り替える。</dd>
<dt>⑥選択チップ一覧</dt>
<dd>⑧ソース画像で選択したチップが並ぶ。</dd>
<dt>⑦チップ詳細</dt>
<dd>チップの詳細の表示と編集。チップ矩形は変更するとNxM矩形を束ねられる。属性（メモ）は使いみちがイマイチ決めきれず。</dd>
<dt>⑧ソース画像</dt>
<dd>選択可能なマップチップ。</dd>
<dt>⑨出力先</dt>
<dd>選択したチップを並べて、自分用のマップチップを作成する。</dd>
</dl>

#### ⑧ソース画像 の操作詳細

- マウスオーバーでカーソル的なものを表示（みやすさのため）
- クリックするとチップ選択（⑥選択チップ一覧に1x1チップとして追加）
  - 選択済みチップの場合、⑦チップ詳細に選択される
  - Shiftクリックすると、⑦チップ詳細で選択されているチップの右下矩形を選択する（📍p2のショートカット）

#### ⑨出力先 の操作詳細

- マウスオーバーでカーソル的なものを表示（みやすさのため）
- クリックした場合：
  - ⑦チップ詳細で選択されているチップを配置する
  - 既に配置されているチップをクリックすると⑦チップ詳細に選択する


自分のマップチップ画像を作成する方法
------------------------------------

`TODO:` ⑨出力先の内容で画像を出力するコマンドを作る？

<details>
<summary>AIに相談</summary>

### AIへの入力メモ

実現したい操作：

1. 複数の元画像a,b,c,...を元に、1枚の結果画像を作成したい
2. 元画像から任意の矩形を選択する（a1:x1,y1-x2,y2など）
3. 矩形a1,a2,..を結果画像の任意の位置に配置する

質問：

1. 上記の操作を行なうシェルスクリプトが作りたい場合、ImageMagickを使うのが一般的でしょうか？
2. ImageMagickよりも良い選択（分かりやすさ、環境構築のしやすさ、結果コードの短さなどの観）があれば提案して欲しい
3. サンプルコードを提示して欲しい

### AI(Copilot)の回答

以下は、複数の画像から矩形領域を切り出し、1枚のキャンバスに合成する例です。

```sh
#!/bin/bash

# 元画像と切り出し座標の定義
declare -A crops
crops[a.jpg]="100x100+10+10"
crops[b.jpg]="80x120+30+40"
crops[c.jpg]="50x50+0+0"

# 結果画像のサイズ
canvas_width=300
canvas_height=200
output="result.png"

# 空のキャンバス作成（白背景）
convert -size ${canvas_width}x${canvas_height} xc:white "$output"

# 合成位置の定義（画像ごとに任意に設定）
positions=("0x0" "100x50" "200x100")
i=0

# 各画像を切り出して合成
for img in "${!crops[@]}"; do
  crop="${crops[$img]}"
  pos="${positions[$i]}"
  tmp="tmp_$i.png"

  # 矩形切り出し
  convert "$img" -crop "$crop" +repage "$tmp"

  # 合成
  composite -geometry +${pos/x/+}+"${pos#*x}" "$tmp" "$output" "$output"

  ((i++))
done

# 一時ファイル削除
rm tmp_*.png

```

📝 補足
- `-crop WxH+X+Y`：画像から矩形領域を切り出す
- `composite -geometry +X+Y`：指定位置に画像を合成
- `xc:white`：白背景のキャンバスを作成
- `+repage`：切り出し後の余白を除去
</details>


<details>
<summary>ImageMagickコマンド調査</summary>

- [Command-line Tools: Convert | ImageMagick](https://imagemagick.org/script/convert.php)


### 空のキャンバス（画像）作成（透過背景）

背景が透明なら`xc:none`にします

```sh
convert -size "${WIDTH}x${HEIGHT}" xc:none "${CANVASFILE}"
```

- [-size - Command-line Options | ImageMagick](https://imagemagick.org/script/command-line-options.php#size)

> -size width[xheight][+offset]
> Set the width and height of the image.


### 矩形の切り出し

- [-crop - Command-line Options | ImageMagick](https://imagemagick.org/script/command-line-options.php#crop)
- [Image Geometry - Command-line Processing | ImageMagick](https://imagemagick.org/script/command-line-processing.php#geometry)

> -crop geometry{@}{!}
> Cut out one or more rectangular regions of the image.

| サイズ | 一般的な説明（実際の動作はオプションや設定によって異なる場合があります） |
|---|---|
| 幅×高さ | 高さと幅の最大値が指定され、アスペクト比が維持されます。 |

```sh
# crop ex: -crop '100x200+20+40'
convert "${SRCFILE}" -crop "${WIDTH}x${HEIGHT}+${X}+${Y}" +repage "${CHIPFILE}"
```


### 画像の合成

切り出した矩形を空のキャンバスに合成する。

- [Command-line Tools: Composite | ImageMagick](https://imagemagick.org/script/composite.php)

```sh
composite -geometry +"${X}"+"${Y}" "${CHIPFILE}" "${CANVASFILE}" "${OUTPUTFILE}"
```
※複数の`${CHIPFILE}`を`${CANVASFILE}`に重ねたい場合は、`${OUTPUTFILE}`に`${CANVASFILE}`を指定して上書きする。

</details>

#### 操作方法

1. `📜Command`ボタン押下でコマンドダイアログを表示する。
1. ダイアログ内の`📔Copy`ボタンでコマンドをクリップボードにコピーする
1. プロジェクトの階層（`prj/04.mapchip_selector`）でコマンド実行（ペースト）
   - ※ImageMagicが必要
1. `mapchip.png`が作成される
   - ※`prj/assets/image/map`へのコピーは自分でやる

