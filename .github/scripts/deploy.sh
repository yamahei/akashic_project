#!/bin/bash

set -eu

ROOTDIR=$(pwd)
PROJECTROOT=./prj
PUBLISHDIR=${ROOTDIR}/publish
PROJECTINFO="${ROOTDIR}/prj-info.json"

# 関数定義
proc_in_prj () {
    local PJDIR_REL=$1 # ex: ./prj/00.hello-akashic/
    local PJDIR_ABS=${ROOTDIR}/${PJDIR_REL}

    cd "${PJDIR_ABS}"
    echo "  - Processing in ${PJDIR_REL}"

    # `prj-info.json`にプロジェクトのキーを作成
    jq --arg dir "${PJDIR_REL}" '.[$dir] = []' < "${PROJECTINFO}" > "${PROJECTINFO}.tmp" && mv "${PROJECTINFO}.tmp" "${PROJECTINFO}"

    # index.htmlがあればコピー
    if [ -f index.html ]; then
        echo "  - Processing index.html"
        # `prj-info.json`に記録
        jq --arg key "${PJDIR_REL}" --arg value "${PJDIR_REL}index.html" '.[$key] += [$value]' < "${PROJECTINFO}" > "${PROJECTINFO}.tmp" && mv "${PROJECTINFO}.tmp" "${PROJECTINFO}"
    fi

    # README.mdがあればHTMLに変換
    if [ -f README.md ]; then
        echo "  - Processing README.md"
        local TITLE=$(head -n 1 README.md)
        # `prj-info.json`にタイトルを記録
        jq --arg key "${PJDIR_REL}" --arg value "#${TITLE}" '.[$key] += [$value]' < "${PROJECTINFO}" > "${PROJECTINFO}.tmp" && mv "${PROJECTINFO}.tmp" "${PROJECTINFO}"
        
        # HTMLに変換してpublishディレクトリに配置
        markdown-to-html-cli --output "${PUBLISHDIR}/$(basename ${PJDIR_REL}).html" --style=https://unpkg.com/mvp.css
        
        # `prj-info.json`にHTMLファイルへのパスを記録
        jq --arg key "${PJDIR_REL}" --arg value "./publish/$(basename ${PJDIR_REL}).html" '.[$key] += [$value]' < "${PROJECTINFO}" > "${PROJECTINFO}.tmp" && mv "${PROJECTINFO}.tmp" "${PROJECTINFO}"
    fi

    # game.jsonがあればakashic export
    if [ -f game.json ]; then
        echo "  - Processing game.json"
        local OUTDIR=${PUBLISHDIR}/$(basename ${PJDIR_REL})
        
        npm install
        npm run build
        akashic export html --magnify --output "${OUTDIR}" --force
        
        # `prj-info.json`に記録
        jq --arg key "${PJDIR_REL}" --arg value "./publish/$(basename ${PJDIR_REL})/index.html" '.[$key] += [$value]' < "${PROJECTINFO}" > "${PROJECTINFO}.tmp" && mv "${PROJECTINFO}.tmp" "${PROJECTINFO}"
    fi

    # png画像があれば背景画像用にパスを記録
    IMGFILE=$(ls -1 *.png | head -n 1 || true)
    if [ -f "${IMGFILE}" ]; then
        # `prj-info.json`に記録
        jq --arg key "${PJDIR_REL}" --arg value "${PJDIR_REL}${IMGFILE}" '.[$key] += [$value]' < "${PROJECTINFO}" > "${PROJECTINFO}.tmp" && mv "${PROJECTINFO}.tmp" "${PROJECTINFO}"
    fi

    cd "${ROOTDIR}"
}

# --- 実処理 ---

# 出力用ディレクトリを初期化
echo "Preparing ${PUBLISHDIR}"
rm -rf ${PUBLISHDIR}
mkdir -p ${PUBLISHDIR}

# トップレベルのREADME.mdをhtmlに変換
markdown-to-html-cli --output ${PUBLISHDIR}/README.html --style=https://unpkg.com/mvp.css

# `prj-info.json`を初期化
echo "{}" > "${PROJECTINFO}"

# プロジェクトDIR内の作業(`prj/`直下のディレクトリでループする)
for PROJECTDIR_REL in ${PROJECTROOT}/*/; do
    echo "Processing ${PROJECTDIR_REL}"
    CURRDIR=$(basename ${PROJECTDIR_REL})
    if [ ! -d "${PROJECTDIR_REL}" ]; then continue; fi
    if [ ${CURRDIR} = "assets" ]; then continue; fi
    if [ ${CURRDIR} = "lib" ]; then continue; fi

    proc_in_prj "${PROJECTDIR_REL}"
done

# 全てのシンボリックリンクを削除
if [ -n "$(find . -type l)" ]; then
    find . -type l | xargs rm
fi

# 生成物をpublishディレクトリに移動
mv "${PROJECTINFO}" ${PUBLISHDIR}/
# `publish`ディレクトリ以外のシンボリックリンクや生成物をコピー
# (今回はactions-gh-pagesがpublish_dirのみを見るので不要)

echo "Build finished."