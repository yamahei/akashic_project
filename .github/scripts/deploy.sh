#!/bin/bash

set -eu

ROOTDIR=$(pwd)
PROJECTROOT=./prj
PROJECTINFO="${ROOTDIR}/prj-info.json"
PUBLISHDIR_REL=./publish # ゲームの出力先

# --- 関数定義 ---
proc_in_prj () {
    local PJDIR_REL=$1 # ex: ./prj/00.hello-akashic/
    local PJDIR_ABS=${ROOTDIR}/${PJDIR_REL}

    cd "${PJDIR_ABS}"
    echo "  - Processing in ${PJDIR_REL}"

    # `prj-info.json`にプロジェクトのキーを作成
    jq --arg dir "${PJDIR_REL}" '.[$dir] = []' < "${PROJECTINFO}" > "${PROJECTINFO}.tmp" && mv "${PROJECTINFO}.tmp" "${PROJECTINFO}"

    # index.htmlがあれば情報を記録 (コピーは不要、リポジトリのものがそのまま使われる)
    if [ -f index.html ]; then
        echo "  - Processing index.html"
        jq --arg key "${PJDIR_REL}" --arg value "${PJDIR_REL}index.html" '.[$key] += [$value]' < "${PROJECTINFO}" > "${PROJECTINFO}.tmp" && mv "${PROJECTINFO}.tmp" "${PROJECTINFO}"
    fi

    # README.mdがあればHTMLに変換してルートに配置
    if [ -f README.md ]; then
        echo "  - Processing README.md"
        local TITLE=$(head -n 1 README.md)
        jq --arg key "${PJDIR_REL}" --arg value "#${TITLE}" '.[$key] += [$value]' < "${PROJECTINFO}" > "${PROJECTINFO}.tmp" && mv "${PROJECTINFO}.tmp" "${PROJECTINFO}"
        
        # README.htmlは同じディレクトリに生成
        markdown-to-html-cli --output "README.html" --style=https://unpkg.com/mvp.css
        jq --arg key "${PJDIR_REL}" --arg value "${PJDIR_REL}README.html" '.[$key] += [$value]' < "${PROJECTINFO}" > "${PROJECTINFO}.tmp" && mv "${PROJECTINFO}.tmp" "${PROJECTINFO}"
    fi

    # game.jsonがあればakashic export
    if [ -f game.json ]; then
        echo "  - Processing game.json"
        local OUTDIR=${ROOTDIR}/${PUBLISHDIR_REL}/$(basename ${PJDIR_REL})
        
        npm install
        npm run build
        akashic export html --magnify --output "${OUTDIR}" --force
        
        jq --arg key "${PJDIR_REL}" --arg value "${PUBLISHDIR_REL}/$(basename ${PJDIR_REL})/index.html" '.[$key] += [$value]' < "${PROJECTINFO}" > "${PROJECTINFO}.tmp" && mv "${PROJECTINFO}.tmp" "${PROJECTINFO}"
    fi

    # png画像があれば情報を記録 (コピーは不要)
    IMGFILE=$(ls -1 *.png | head -n 1 || true)
    if [ -f "${IMGFILE}" ]; then
        jq --arg key "${PJDIR_REL}" --arg value "${PJDIR_REL}${IMGFILE}" '.[$key] += [$value]' < "${PROJECTINFO}" > "${PROJECTINFO}.tmp" && mv "${PROJECTINFO}.tmp" "${PROJECTINFO}"
    fi

    cd "${ROOTDIR}"
}

# --- 実処理 ---

# ゲーム出力用ディレクトリを作成
mkdir -p ${PUBLISHDIR_REL}

# トップレベルのREADME.mdをhtmlに変換
if [ -f README.md ]; then
    markdown-to-html-cli --output README.html --style=https://unpkg.com/mvp.css
fi

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

echo "Build finished."
