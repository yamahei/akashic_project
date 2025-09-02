マップチップの選定と画像作成ツール
==================================

概要
----

`/ORIGINAL_ASSETS/map`配下の画像は、FirstSeedMaterialで配布されていた、RPGツクール想定のマップチップ各種。
自作ゲームで利用するには規模が大きすぎるので、横スクロールゲーム向けに選定して、1枚画像を作成したい。
このプロジェクトでは、そのためのツールを作成する。

操作方法
--------

### 下準備：元画像のパスをjson化する

```sh
ls -1 ./assets/image/map/* | jq -R . | jq -s . > original_mapchips.json
```

### 起動

リソース読み込みの都合上、Webサーバ上で実行する必要がある

```sh
# Run the following command in the project root (`prj/04.mapchip_selector`) to run the web server:
ruby -run -e httpd #=> Access to http://localhost:8080/index.html
```
