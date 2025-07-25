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

プロジェクト
----------

### プロジェクトA(`/prj/projectA`)
### プロジェクトB(`/prj/projectB`)

その他の詳細
----------

### TODO: 自作ライブラリ(`/prj/lib`)
### TODO: コマンドラインツール(`/bin`)
### TODO: Dockerコンテナ(`/Dockerfile`)

保守
----

### リモートブランチに存在しないのブランチをすべて削除する

```sh
git fetch -p && git branch -vv | grep ': gone]' | awk '{print $1}' | xargs git branch -D
```
