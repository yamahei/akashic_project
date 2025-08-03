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
├── bin              # Github公開用のコマンドラインツール群
│   └── ...
├── prj              # Dockerコンテナにマウントする
│   ├── assets       # アセット格納用ディレクトリ
│   ├── lib          # 自作ライブラリ格納用ディレクトリ
│   ├── projectA     # プロジェクトルート（A）
│   ├── projectB     # プロジェクトルート（B）
│   └── ...
├── Dockerfile       # コンテナ定義
├── GEMINI.md        # Geminiへの基本指示
├── README.md        # このファイル
└── index.html       # Github公開トップページ
```

Dockerコンテナ
--------------

### ビルド&起動
```sh
docker build -t akashic-dev . && docker run -it --rm -v "$(pwd)/prj":/akashic/prj -p 3300:3300 -p 3000:3000 akashic-dev
```

<details>
<summary>コマンド詳細</summary>

### ビルド
```sh
docker build -t akashic-dev .
```
### 起動
```sh
docker run -it --rm -v "$(pwd)/prj":/akashic/prj -p 3300:3300 -p 3000:3000 akashic-dev
```
### ログの表示
```sh
docker logs -f $(docker ps | grep akashic-dev | gawk '{print $1}')
```
### 不要なリソースの削除
```sh
docker system prune -f
```
</details>


プロジェクト
------------

「プロジェクト」とは主にAkashic Engineを使ったプロジェクトを指す。
（その他ツール等の非Akashicプロジェクトもあり得る）
プロジェクトは直下に`README.md`を置くこと。

<details>
<summary>プロジェクト共通の情報・ルール</summary>

### 共通の情報

#### 新規プロジェクトの作成

コンテナの`WORKDIR`直下(`/akashic/prj`)で以下のコマンドを実行する。
（プロジェクト名は`${PRJ_NAME}`とする）
```sh
PRJ_NAME=PRJ_NAME
mkdir -p /akashic/prj/${PRJ_NAME}
cd /akashic/prj/${PRJ_NAME}
akashic init -t typescript
```
#### プロジェクトの実行
```sh
# プロジェクトディレクトリで実行する
akashic sandbox
```
</details>



### プロジェクト

<dl>
<dt>00.hello-akashic</dt>
<dd>akashic-cliとDockerコンテナのテストを兼ねて作成。</dd>
<dt>01.collision_editor</dt>
<dd>キャラチップの当たり判定領域作成ツール。非Akashic</dd>


</dl>


その他の詳細
----------

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

#### ~~convert_images.sh~~(廃止)

~~ORIGINAL_ASSETS/内の画像をprj/assets/image/にコピーし、PNG形式に変換します。その際、色`#007575`を透過します。~~
役割を終えて、そのままでは使えなくなっているので、廃止扱い。


保守
----

### リモートブランチに存在しないのブランチをすべて削除する

```sh
git fetch -p && git branch -vv | grep ': gone]' | awk '{print $1}' | xargs git branch -D
```
