キャラクタの当たり判定領域作成ツール
====================================

下準備
------

1. `bin/split_char_images.sh`でキャラチップが分割済みであること
2. プロジェクトルート（`prj/01.collision_editor`）で以下のコマンドを実行し、ファイル名を抽出する

```sh
# 1. Make sure the character chips have been split using `bin/split_char_images.sh`.
# 2. Run the following command in the project root (`prj/01.collision_editor`) to extract the file name:
ls -1 ../assets/image/char/*.png > ./filenames.txt
ln -s ../assets assets
```

起動
----

プロジェクトルート（`prj/01.collision_editor`）で以下のコマンドを実行し、Webサーバを起動する
- 外部ファイル読み込み(fetch)の都合でサーバが必要

```sh
# Run the following command in the project root (`prj/01.collision_editor`) to run the web server:
ruby -run -e httpd #=> Access to http://localhost:8080/index.html
```

領域設定
--------

- webページで領域作成ツールを開き、数値と名前を入力する
  - http://localhost:8080/index.html
- 結果データをダウンロードする
- `TODO`にファイルを配置する

