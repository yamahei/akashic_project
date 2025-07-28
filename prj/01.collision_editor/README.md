キャラクタの当たり判定領域作成ツール
====================================

下準備
------

ファイル名抽出コマンドをプロジェクトルートで実行

```sh
# exec below command in "akashic_project/prj/01.collision_editor"
ls -1 ../assets/image/char/*.png > ./filenames.txt
ln -s ../assets assets
```

起動
----

Webサーバ起動コマンドをプロジェクトルートで実行
（fetchの都合でサーバが必要）

```sh
ruby -run -e httpd #=> Access to http://localhost:8080/index.html
```