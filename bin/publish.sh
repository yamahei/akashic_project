#!/bin/bash

set -eu

#############################################################
# 1. リポジトリのルートディレクトリで実行する
#    1. `prj-info.json`を初期化する（配下の情報を保持するリスト）
# 1. プロジェクトDIR内の作業(`prj/`直下のディレクトリでループする)
#    1. `prj-info.json`に`prj/${PROJECT_NAME}`を記録する
#    1. `index.html`ファイルがあれば、そのまま利用する
#       1. `prj-info.json`に`prj/${PROJECT_NAME}/index.html`を記録する
#    1. `README.md`ファイルがあれば、`showdown`コマンドでHTMLに変換する
#       - ファイル名は`README.html`
#       - 出力先は`publish/${PROJECT_NAME}`
#       - 同名のファイルがあれば削除してから実行する
#       - 参考：[docs/cli.md](https://github.com/showdownjs/showdown/blob/master/docs/cli.md)
#       - `prj-info.json`に`prj/${PROJECT_NAME}/README.html`を記録する
#    1. `game.json`ファイルがあれば、`npm run export-html`コマンドでゲーム化する
#       - 出力先は`publish/${PROJECT_NAME}/game/`
#       - 同名のディレクトリがあれば削除してから実行する
#       - 参考：[HTML5 ゲームとして出力する｜Akashic Engine](https://akashic-games.github.io/reverse-reference/v3/release/export-html.html)
#       - `prj-info.json`に`prj/${PROJECT_NAME}/game/index.html`を記録する
# 1. トップレベルの`README.md`ファイルがあれば、`showdown`コマンドでHTMLに変換する
#    - ファイル名は`README.html`
#    - 出力先は`publish/${PROJECT_NAME}/README.html`
#############################################################

STARTDIR=$(pwd) # full path
SCRIPTDIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd) # full path
ROOTDIR=$(cd "${SCRIPTDIR}/.." && pwd) # full path
PROJECTROOT=./prj # relative path
PUBLISHDIR=${ROOTDIR}/publish # full path
PUBLISHDIR_REL=./publish # relative path
PROJECTINFO="${ROOTDIR}/prj-info.json" # full path

#######
# 関数
#######

error_handler() {
    git checkout . # 変更を破棄
    git checkout main # gh-pagesブランチに移動
    cd "${STARTDIR}" # 実行時のディレクトリに戻る
}
trap error_handler ERR
trap error_handler EXIT 

proc_in_prj () {
    local PJDIR=$1
    
    cd "${PJDIR}"
    echo "  - Processing in ${PJDIR}"

    cat ${PROJECTINFO} | \
    jq --arg dir "${PJDIR}" '.[$dir] |= .+[]' > \
    .jqtmp && mv .jqtmp ${PROJECTINFO}
    #    1. `index.html`ファイルがあれば、そのまま利用する
    if [ -f index.html ]; then
        echo "  - Processing index.html"
        cat ${PROJECTINFO} | \
        jq --arg key "${PJDIR}" --arg value "${PJDIR}index.html" '.[$key] += [$value]' > \
        .jqtmp && mv .jqtmp ${PROJECTINFO}
    fi
    #    1. `README.md`ファイルがあれば、`showdown`コマンドでHTMLに変換する
    if [ -f README.md ]; then
        echo "  - Processing README.md"
        local TITLE=$(head -n 1 README.md)
        cat ${PROJECTINFO} | \
        jq --arg key "${PJDIR}" --arg value "#${TITLE}" '.[$key] += [$value]' > \
        .jqtmp && mv .jqtmp ${PROJECTINFO}
        npx showdown makehtml -i README.md -o README.html
        cat ${PROJECTINFO} | \
        jq --arg key "${PJDIR}" --arg value "${PJDIR}README.html" '.[$key] += [$value]' > \
        .jqtmp && mv .jqtmp ${PROJECTINFO}
    fi

    #    1. `game.json`ファイルがあれば、`npm run export-html`コマンドでゲーム化する
    if [ -f game.json ]; then
        echo "  - Processing game.json"
        local OUTDIR=${PUBLISHDIR}/$(basename ${PJDIR})
        local OUTDIR_REL=${PUBLISHDIR_REL}/$(basename ${PJDIR})
        mkdir -p "${OUTDIR}"
        npm install
        npm run build
        akashic export html --magnify --output "${OUTDIR}" --force
        cat ${PROJECTINFO} | \
        jq --arg key "${PJDIR}" --arg value "${OUTDIR_REL}/index.html" '.[$key] += [$value]' > \
        .jqtmp && mv .jqtmp ${PROJECTINFO}
    fi

    # ディレクトリ戻しておく
    cd -
}

###########
# ここから
# 実処理
###########


git checkout gh-pages # gh-pagesブランチに移動
CLEAN=$(git status | grep "nothing to commit" | wc -l)
if [ ${CLEAN} -ne 1 ]; then
    echo "ERROR: gh-pages branch is not clean. Please commit or stash your changes."
    return
fi
git reset --hard main # mainブランチの最新に強制的に合わせる


# 1. リポジトリのルートディレクトリで実行する
cd "${ROOTDIR}"

# 出力用ディレクトリを初期化する
echo "Preparing ${PUBLISHDIR}"
if [ -d ${PUBLISHDIR} ]; then
    rm -d -f -r 
fi
mkdir -p ${PUBLISHDIR}

#    1. `prj-info.json`を初期化する（配下の情報を保持するリスト）
echo "{}" > ${PROJECTINFO}

# 1. プロジェクトDIR内の作業(`prj/`直下のディレクトリでループする)
for PROJECTDIR in "${PROJECTROOT}"/*/
do
    echo "Processing ${PROJECTDIR}" # ex: ./prj/00.hello-akashic/
    CURRDIR=$(basename ${PROJECTDIR})
    if [ ! -d "${PROJECTDIR}" ]; then continue; fi
    if [ ${CURRDIR} = "assets" ]; then continue; fi
    if [ ${CURRDIR} = "lib" ]; then continue; fi

    # プロジェクト配下での処理
    proc_in_prj "${PROJECTDIR}"
done

# 全てのシンボリックリンクを削除
find . -type l | xargs rm

git status
git add .
git commit -m "Update publish at $(date +'%Y-%m-%d %H:%M:%S')"
git push origin gh-pages



