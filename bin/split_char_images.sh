#!/bin/bash

set -eu


# --- 設定 ---
# 入力元ディレクトリ (ここに分割したい画像シートを配置)
SRC_DIR="ORIGINAL_ASSETS/char"
# 出力先ディレクトリ (分割後の画像が保存される)
DST_DIR="prj/assets/image/char"
# 透過色
TRANSPARENT_COLOR="#007575"
# ----------------


# 入力元ディレクトリの存在チェック
if [ ! -d "$SRC_DIR" ]; then
  echo "エラー: 入力元ディレクトリが見つかりません: $SRC_DIR"
  echo "このディレクトリを作成し、分割したいPNG画像シートを配置してください。"
  exit 1
fi

# 出力先ディレクトリを作成 (存在しない場合)
mkdir -p "$DST_DIR"

# 出力先ディレクトリを一旦空にする
echo "出力先ディレクトリをクリーンアップします: $DST_DIR"
rm -f "$DST_DIR"/*.png

# 入力元ディレクトリ内のPNGファイルを処理
for file in "$SRC_DIR"/*.gif; do
  # globが何もマッチしなかった場合にループが意図せず実行されるのを防ぐ
  [ -e "$file" ] || continue

  echo "処理中: $file"

  # ファイル名（拡張子なし）を取得
  filename=$(basename "$file" .gif)
  
  # ImageMagickで画像を72x128に分割し、透過処理を行い、一時ディレクトリに連番で出力
  convert "$file" -crop 72x128 +repage -transparent "$TRANSPARENT_COLOR" "$DST_DIR/${filename}_%d.png"

  done

echo "画像の分割・透過処理が完了しました。"