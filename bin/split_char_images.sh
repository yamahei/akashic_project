#!/bin/bash

# エラーが発生した場合、スクリプトを直ちに終了する
set -e

# スクリプトが設置されているディレクトリを基準にプロジェクトルートへ移動
cd "$(dirname "$0")/../"

# --- 設定 ---
# 入力元ディレクトリ (ここに分割したい画像シートを配置)
SRC_DIR="ORIGINAL_ASSETS/char_sheets"
# 出力先ディレクトリ (分割後の画像が保存される)
DST_DIR="prj/assets/image/char"
# 透過色
TRANSPARENT_COLOR="#007575"
# ----------------

# リネーム用のサフィックスを定義 (0 -> a1, 1 -> a2, ..., 7 -> b4)
SUFFIXES=(a1 a2 a3 a4 b1 b2 b3 b4)

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
for file in "$SRC_DIR"/*.png; do
  # globが何もマッチしなかった場合にループが意図せず実行されるのを防ぐ
  [ -e "$file" ] || continue

  echo "処理中: $file"

  # ファイル名（拡張子なし）を取得
  filename=$(basename "$file" .png)
  
  # 一時ディレクトリを作成
  tmp_dir=$(mktemp -d)
  # スクリプト終了時に一時ディレクトリを必ず削除する
  trap 'rm -rf "$tmp_dir"' EXIT

  # ImageMagickで画像を72x128に分割し、透過処理を行い、一時ディレクトリに連番で出力
  convert "$file" -crop 72x128 +repage -transparent "$TRANSPARENT_COLOR" "$tmp_dir/${filename}_%d.png"

  # 分割されたファイルを正しい命名規則でリネームして移動
  for i in {0..7}; do
    src_file="$tmp_dir/${filename}_${i}.png"
    dst_file="$DST_DIR/${filename}_${SUFFIXES[$i]}.png"
    
    if [ -f "$src_file" ]; then
      echo "  => ${dst_file} を作成"
      mv "$src_file" "$dst_file"
    fi
  done
  
  # このループで使った一時ディレクトリを削除
  rm -rf "$tmp_dir"
  # trapをクリア
  trap - EXIT
done

echo "画像の分割・透過処理が完了しました。"