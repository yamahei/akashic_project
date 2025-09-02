#!/bin/bash

set -eu

PROJECTROOT=./prj
PUBLISHDIR=./publish
PROJECTINFO=./prj-info.json

# 出力用ディレクトリを初期化
rm -rf ${PUBLISHDIR}
mkdir -p ${PUBLISHDIR}

# トップレベルのREADME.mdをhtmlに変換
if [ -f README.md ]; then
    npm install -g markdown-to-html-cli
    markdown-to-html-cli --output ${PUBLISHDIR}/index.html --style=https://unpkg.com/mvp.css
fi

# prj-info.jsonを初期化
echo "{}" > ${PROJECTINFO}

# prj/配下のディレクトリをループ処理
for PROJECTDIR in ${PROJECTROOT}/*/; do
    echo "Processing ${PROJECTDIR}"
    CURRDIR=$(basename ${PROJECTDIR})
    if [ ! -d "${PROJECTDIR}" ]; then continue; fi
    if [ ${CURRDIR} = "assets" ]; then continue; fi
    if [ ${CURRDIR} = "lib" ]; then continue; fi

    # プロジェクト配下での処理
    cd "${PROJECTDIR}"

    # prj-info.jsonにプロジェクト情報を記録
    cat ${PROJECTINFO} | jq --arg dir "${CURRDIR}" '. + {($dir): {}}' > ../.jqtmp && mv ../.jqtmp ${PROJECTINFO}

    # index.htmlがあればコピー
    if [ -f index.html ]; then
        echo "  - Processing index.html"
        cp index.html ../../${PUBLISHDIR}/${CURRDIR}.html
        cat ${PROJECTINFO} | jq --arg key "${CURRDIR}" --arg value "${CURRDIR}.html" '.[$key].url = $value' > ../.jqtmp && mv ../.jqtmp ${PROJECTINFO}
    fi

    # README.mdがあればHTMLに変換
    if [ -f README.md ]; then
        echo "  - Processing README.md"
        TITLE=$(head -n 1 README.md | sed 's/# //')
        cat ${PROJECTINFO} | jq --arg key "${CURRDIR}" --arg value "${TITLE}" '.[$key].title = $value' > ../.jqtmp && mv ../.jqtmp ${PROJECTINFO}
        if [ ! -f index.html ]; then # index.htmlがなければREADMEをトップにする
            markdown-to-html-cli --output ../../${PUBLISHDIR}/${CURRDIR}.html --style=https://unpkg.com/mvp.css
            cat ${PROJECTINFO} | jq --arg key "${CURRDIR}" --arg value "${CURRDIR}.html" '.[$key].url = $value' > ../.jqtmp && mv ../.jqtmp ${PROJECTINFO}
        fi
    fi

    # game.jsonがあればakashic export
    if [ -f game.json ]; then
        echo "  - Processing game.json"
        OUTDIR=../../${PUBLISHDIR}/${CURRDIR}
        npm install
        akashic export html --magnify --output "${OUTDIR}" --force
        cat ${PROJECTINFO} | jq --arg key "${CURRDIR}" --arg value "${CURRDIR}/index.html" '.[$key].url = $value' > ../.jqtmp && mv ../.jqtmp ${PROJECTINFO}
        if [ -z "$(cat ${PROJECTINFO} | jq '.[$key].title')" ]; then
            TITLE=$(cat game.json | jq -r '.name')
            cat ${PROJECTINFO} | jq --arg key "${CURRDIR}" --arg value "${TITLE}" '.[$key].title = $value' > ../.jqtmp && mv ../.jqtmp ${PROJECTINFO}
        fi
    fi

    # png画像があれば背景画像用にパスを記録
    IMGFILE=$(ls -1 *.png | head -n 1 || true)
    if [ -f "${IMGFILE}" ]; then
        cp ${IMGFILE} ../../${PUBLISHDIR}/
        cat ${PROJECTINFO} | jq --arg key "${CURRDIR}" --arg value "${IMGFILE}" '.[$key].image = $value' > ../.jqtmp && mv ../.jqtmp ${PROJECTINFO}
    fi

    cd ../..
done

# prj-info.jsonをpublishディレクトリに移動
mv ${PROJECTINFO} ${PUBLISHDIR}/
