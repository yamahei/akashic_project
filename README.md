akashic_project
===============

GitHub Pages

- https://yamahei.github.io/akashic_project/


概要
----

- [Akashic Engine](https://akashic-games.github.io/)を使ってゲームを作る
- いくつかの目的を同時に進めるため、`prj`配下に複数のプロジェクトを作る
  - エンジンへの習熟を兼ねたサンプルの作成
  - 手持ちのアセットを使うためのライブラリの開発
  - 設計・製造のためのツール開発
  - AIによる開発支援
  - ゲーム（目標）
- Github上で公開するためのコマンドラインツールも併せて開発する

構成
----

```sh
.
├── .github          # GitHubワークフロー、チケットテンプレートなど
│   └── ...
├── bin/             # 各種のコマンドラインツール群
│   └── ...
├── prj/             # プロジェクトルート
│   ├── assets/      # アセット格納用ディレクトリ
│   ├── lib/         # 自作ライブラリ格納用ディレクトリ
│   ├── projectA/    # プロジェクトルート（A）
│   ├── projectB/    # プロジェクトルート（B）
│   └── ...
├── publish/         # 生成したゲーム公開用
│   └── ...
├── GEMINI.md        # Geminiへの基本指示
├── README.md        # このファイル
├── ORIGINAL_ASSETS/ # 拾ったフリー素材（未加工）置き場
├── WEB_ASSETS/      # GitHub Pages用CSSとかスクリプト
└── index.html       # Github公開トップページ
```

環境構築
--------

### [NVM](https://github.com/nvm-sh/nvm)

- `README.md`記載のインストールスクリプトを実行すればインストール完了
- `nvm use node`で安定版を指定する（時々再実行する必要あるのか？

### [Akashic Engine](https://akashic-games.github.io/)

- [Akashic Engine のインストール](https://akashic-games.github.io/tutorial/v3/introduction.html#install-akashic-engine)

```sh
npm install -g @akashic/akashic-cli
```

### jq

- 設定ファイルの編集に使ってる

```sh
sudo apt install jq
```

### [markdown-to-html-cli](https://github.com/jaywcjlove/markdown-to-html-cli/)

- README.mdをHTML化するのに使う
`TODO:` 外部CSSが適用できない問題あり

```sh
npm install markdown-to-html-cli -g
```


プロジェクト
------------

「プロジェクト」とは主にAkashic Engineを使ったプロジェクトを指す。
（その他ツール等の非Akashicプロジェクトもあり得る）

- プロジェクトは直下に`README.md`を置くこと。
- ゲーム（Akashic Engine使用プログラム）でない場合は直下に`index.html`を置くこと。
- プロジェクト直下の`png`ファイルが公開サイトの画像として使われる（複数ある場合はランダム）

<details>
<summary>プロジェクト共通の情報・ルール</summary>

### 共通の情報

#### 新規プロジェクトの作成

リポジトリのルートディレクトリで以下のコマンドを実行する。
（プロジェクト名は`${PRJ_NAME}`とする）
```sh
# 共通
PRJ_NAME=PRJ_NAME
mkdir prj/${PRJ_NAME}
cd prj/${PRJ_NAME}
# echo ${PRJ_NAME} > README.md # Akashic Engine使う場合は作らない！
# echo "====" >> README.md # 同上！
akashic init -t typescript
# prompt: width:  (1280) 320 / 256
# prompt: height:  (720) 512 / 400
# prompt: fps:  (30) 
npm install # VSCode用型定義参照
akashic install @akashic-extension/akashic-label # for MessageBox
# npm audit fix --force # 余計依存が出るので放置するのがよい
ln -s ../assets assets
ln -s ../lib lib
cat tsconfig.json | jq '.include |= .+["lib/**/*.ts"]' > .jqtmp && mv .jqtmp tsconfig.json
cat tsconfig.json | jq '.compilerOptions.lib |= .+["dom"]' > .jqtmp && mv .jqtmp tsconfig.json # for refer document, fetch
cat package.json | jq '.scripts |= .+ {"debug":"npm run build && npm run start"}' > .jqtmp && mv .jqtmp package.json
cat game.json | jq '.main |= "./script/src/main.js"' > .jqtmp && mv .jqtmp game.json
npm run debug # scan & build & run
```
自動生成されるサンプルプログラムの`main`設定が変な気がするけど、毎回ではなさそう…？
→毎回ダメかも。。
```
- 	"main": "./script/main.js",
+ 	"main": "./script/src/main.js",
```

#### プロジェクトの実行
```sh
akashic sandbox #=> access to http://localhost:3000/
# or below (scan - build - start)
npm run debug
```
#### リソース（アセット）の更新
```sh
akashic scan asset
```
#### ゲームのビルド
```sh
npm run build
```
#### ゲーム(HTML)の出力
```sh
akashic export html --magnify --output "${OUTDIR}" --force
```

</details>



### プロジェクト

#### 00.hello-akashic

`akashic init -t typescript`で生成されるサンプルプログラム。
参考用に残している。

#### 01.collision_editor

キャラチップの当たり判定領域作成ツール。非Akashic。
キャラチップ設定データ`char_sprite_settings.json`を作成する。
（`prj/assets/data/`に配置する）

#### 02.lib_char_object

`01.collision_editor`の`char_sprite_settings.json`を読み込んで、いい感じにキャラクタスプライトを制御するためのオブジェクトを開発する。

#### 03.lib_object_object

オブジェクトスプライト制御クラスの開発と動作確認。
`02.lib_char_object`に似てるけど、こっちの方が簡素。

#### 04.mapchip_selector

マップチップ素材を自分ゲーム用にピックアップして1枚のマップチップ画像を作成するツール。

#### 05.flexbox_css

フレックスボックスレイアウトを提供するだけのCSSライブラリ。
`attr()`が過渡期でブラウザのサポート状況がまちまちのため、イマイチ使えない。

#### 06.digital_watch

アナログじゃない時計を表示するクラス。
カウントダウン機能付き。

#### 07.message_box

ゲームのセリフとかを表示するクラス。

その他
------

### 自作ライブラリ(`/prj/lib`)

- キャラクタ制御クラスとサンプル（`prj/02.lib_char_object/README.md`）
- オブジェクト制御クラスとサンプル（`prj/03.lib_object_object/README.md`）
- 時計表示クラスとサンプル（`prj/06.digital_watch/README.md`）

### コマンドラインツール(`/bin`)

#### split_char_images.sh

`ORIGINAL_ASSETS/char_sheets`に配置されたキャラクターシート（PNG画像）を、ゲームで利用可能な32x32のキャラクター画像に分割し、`prj/assets/image/char`に出力します。透過の指定もここで。

**実行方法**

```sh
sh ./bin/split_char_images.sh
```

**前提条件**

* `ORIGINAL_ASSETS/char_sheets`ディレクトリに、`charaXX.png`という形式で分割したい画像シートが配置されていること。
* 実行環境に`ImageMagick`がインストールされていること。


<details>
<summary>廃止になったスクリプト</summary>

#### update_prj_symlinks.sh

```
プロジェクト作成時に作成する方針に変えたので廃止。
```

`prj/`配下の（`assets`, `lib`以外の）ディレクトリ内に`prj/assets`, `prj/lib`へのシンボリックリンクを作成する。
既に存在する場合は、削除して再作成する。
スクリプトファイルの置き場を基準にパスを組み立てるので、どこから実行しても正しく動く。


#### convert_images.sh

```
役割を終えて、そのままでは使えなくなっているので、廃止扱い。
```

ORIGINAL_ASSETS/内の画像をprj/assets/image/にコピーし、PNG形式に変換します。その際、色`#007575`を透過します。

#### publish.sh

```
GitHub Actionsに移行したので廃止
```

このリポジトリをGithubPagesで公開可能にするためのHTML生成やビルドを行なう。

- markdownをhtmlに変換するツール：`markdown-to-html-cli` ~~`showdown`~~
- akashic engine製のプログラムをhtmlにビルド：`akashic export`

git周り？で変な落ち方することがあるので、成功しない場合はログを残しつつ実行するのが良さそう。

```sh
. bin/publish.sh | tee /tmp/publish.sh.log
```

</details>


Webサイト（GitHub Pages）
-------------------------

### 概要

- このリポジトリ内の全プロジェクトの説明とサンプルが動くWebサイト
- `gh-pages`ブランチを公開（GitHub Actionsで`main`リポジトリから生成）

### 内部の作り

- 雛形のhtml（`index.html`）とJS（`WEB_ASSETS/script.js`）で基本の見栄えと挙動を制御する
  - CSSは`Beer CSS`（ [公式サイト](https://www.beercss.com/)）
    →シンプルで良いのは間違いないが、、余白多めなので、カッチリしたレイアウトのツール的な画面には向かない

  - FEFWは`Vue.js`（ [公式サイト](https://ja.vuejs.org/)）
- デプロイスクリプトが各プロジェクト内を走査して作成する`prj-info.json`を読み込んでコンテンツを動的に生成する

### デプロイ

- ~~[publish.sh](#publishsh)参照~~
- GitHub Action化した
  - 中で何やってるかは`.github/scripts/deploy.sh`を参照

保守
----

### リモートブランチに存在しないのブランチをすべて削除する

```sh
git fetch -p && git branch -vv | grep ': gone]' | awk '{print $1}' | xargs git branch -D
```
