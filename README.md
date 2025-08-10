akashic_project
===============

概要
----

- [Akashic Engine](https://akashic-games.github.io/)を使ってゲームを作る
- いくつかの目的を同時に進めるため、ちょっと特殊な構成にする
  - エンジンへの習熟を兼ねたサンプルの作成
  - 手持ちのアセットを使うためのライブラリの開発
  - 設計・製造のためのツール開発
- Github上で公開するためのコマンドラインツールも併せて開発する

構成
----

```sh
.
├── bin              # 各種のコマンドラインツール群
│   └── ...
├── prj              # プロジェクトルート
│   ├── assets       # アセット格納用ディレクトリ
│   ├── lib          # 自作ライブラリ格納用ディレクトリ
│   ├── projectA     # プロジェクトルート（A）
│   ├── projectB     # プロジェクトルート（B）
│   └── ...
├── GEMINI.md        # Geminiへの基本指示
├── README.md        # このファイル
└── index.html       # Github公開トップページ
```

環境構築
--------

### NVM
---

- https://github.com/nvm-sh/nvm
- `README.md`記載のインストールスクリプトを実行すればインストール完了
- `nvm use node`で安定版を指定する（時々再実行する必要あるのか？

### Akashic Engine

- [Akashic Engine のインストール](https://akashic-games.github.io/tutorial/v3/introduction.html#install-akashic-engine)
- 公式のインストールコマンド
- ATTENTION: VSCode名前解決のためにプロジェクトごとに`npm install`が必要

### jq

```sh
sudo apt  install jq
```


プロジェクト
------------

「プロジェクト」とは主にAkashic Engineを使ったプロジェクトを指す。
（その他ツール等の非Akashicプロジェクトもあり得る）
プロジェクトは直下に`README.md`を置くこと。

<details>
<summary>プロジェクト共通の情報・ルール</summary>

### 共通の情報

#### 新規プロジェクトの作成

プロジェクト(`prj/`)配下で以下のコマンドを実行する。
（プロジェクト名は`${PRJ_NAME}`とする）
```sh
PRJ_NAME=PRJ_NAME
mkdir -p /akashic/prj/${PRJ_NAME}
cd /akashic/prj/${PRJ_NAME}
akashic init -t typescript
ln -s ../assets assets
ln -s ../lib lib
cat tsconfig.json | jq '.include |= .+["lib/**/*.ts"]' > .jqtmp && mv .jqtmp tsconfig.json
npm install # VSCode用型定義参照
```

PRJ_NAME=02.lib_char_object


初期化時に聞かれる設定値は、以下を標準とする。
（このリポジトリでは）

- `width`: 320
- `height`: 512
- `fps`: 30


#### プロジェクトの実行
```sh
# プロジェクトディレクトリで実行する
akashic sandbox #=> access to http://localhost:3000/
```

#### リソース（アセット）の更新
```sh
# プロジェクトディレクトリで実行する
akashic scan assets
```

</details>



### プロジェクト

<dl>
<dt>00.hello-akashic</dt>
<dd>akashic-cliとDockerコンテナのテストを兼ねて作成。</dd>
<dt>01.collision_editor</dt>
<dd>
  キャラチップの当たり判定領域作成ツール。非Akashic。
  キャラチップ設定データ`char_sprite_settings.json`を作成する。
  （`prj/assets/data/`に配置する）
</dd>
<dt>02.lib_char_object</dt>
<dd>`01.collision_editor`を読み込んで、いい感じにキャラクタスプライトを制御するためのオブジェクトのクラスを開発する</dd>

</dl>



その他
------

### TODO: 自作ライブラリ(`/prj/lib`)
### コマンドラインツール(`/bin`)

#### split_char_images.sh

`ORIGINAL_ASSETS/char_sheets`に配置されたキャラクターシート（PNG画像）を、ゲームで利用可能な32x32のキャラクター画像に分割し、`prj/assets/image/char`に出力します。透過の指定もここで。

**実行方法**
```sh
./bin/split_char_images.sh
```

**前提条件**

*   `ORIGINAL_ASSETS/char_sheets`ディレクトリに、`charaXX.png`という形式で分割したい画像シートが配置されていること。
*   実行環境にImageMagickがインストールされていること。


#### ~~update_prj_symlinks.sh~~(廃止)

~~`prj/`配下の（`assets`, `lib`以外の）ディレクトリ内に`prj/assets`, `prj/lib`へのシンボリックリンクを作成する。~~
~~既に存在する場合は、削除して再作成する。~~
~~スクリプトファイルの置き場を基準にパスを組み立てるので、どこから実行しても正しく動く。~~
プロジェクト作成時に作成する方針に変えたので廃止。

#### ~~convert_images.sh~~(廃止)

~~ORIGINAL_ASSETS/内の画像をprj/assets/image/にコピーし、PNG形式に変換します。その際、色`#007575`を透過します。~~
役割を終えて、そのままでは使えなくなっているので、廃止扱い。


保守
----

### リモートブランチに存在しないのブランチをすべて削除する

```sh
git fetch -p && git branch -vv | grep ': gone]' | awk '{print $1}' | xargs git branch -D
```
