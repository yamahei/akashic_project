"use strict";

(function(g){

    const PLACE_HOLDEER = {
        TITLE: "${TITLE}",
        EXPLAIN: "${EXPLAIN}",
        IMGURL: "${IMGURL}",
        LISTMARKUP: "${LISTMARKUP}",
    };

    const searchProc = (items, match, callback) => {
        const find = items.find(item => item.match(match));
        if(find){ return callback ? callback(find) : find; }
        else{ return undefined; }
    };
    const findExplain = (items) => {
        return searchProc(items, /^#/, (input) => {
            return input.replace(/^#+/, "");
        });
    };
    const findReadme = (items) => {
        return searchProc(items, /README/, null);
    };
    const findIndex = (items) => {
        return searchProc(items, /prj\/.+index\.html/, null);
    };
    const findGame = (items) => {
        return searchProc(items, /publish\/.+index\.html/, null);
    };
    const findImage = (items) => {
        return searchProc(items, /\.png$/, null);
    };

    // HTMLでテンプレートをつくってコンポーネントを使い回す方法【templateタグ】
    // https://zenn.dev/yurukei20/articles/209109e0178ea1
    const createHtml = (data) => {

        const $$cardTemplate = document.getElementById("card_template");
        const $$linkTemplate = document.getElementById("link_template");
        const $cardContainer = document.getElementById("card_container");

        const keys = Object.keys(data);
        keys.sort().reverse();
        keys.forEach(key  => {
            const $card = $$cardTemplate.content.cloneNode(true);
            const $linkContainer = $card.querySelector(".card_link_continer");


            const title = key.replace("./prj/", "").replace("/","");
            const items = data[key];
            const explain = findExplain(items) || "（説明がありません）";
            const image = findImage(items) || "https://placehold.jp/256/888a85/eeeeec/480x480.png?text=%F0%9F%98%BA";

            $card.querySelector(".card_title").textContent = title;
            $card.querySelector(".card_explain").textContent = explain;
            $card.querySelector(".card_image").style.backgroundImage = `url('${image}')`;

            const links = [
                { text: "📖プロジェクトの仕様（README）", path: findReadme(items) },
                { text: "🌏ページ（非Akashic Engine）", path: findIndex(items) },
                { text: "🎮ゲーム（的な成果物）", path: findGame(items) }
            ];
            links.forEach(link => {
                if(link.path){
                    const $link = $$linkTemplate.content.cloneNode(true);
                    const $a = $link.querySelector("a");
                    $a.textContent = link.text;
                    $a.href = link.path;
                    $linkContainer.appendChild($link);
                }
            });
            $cardContainer.appendChild($card);
        });
    };

    g.addEventListener("load", () => {


        const PROJECT_INFO_URL = "./prj-info.json";
        fetch(PROJECT_INFO_URL).then((response) => {
            if(response.ok) return response.json();
        }).then((prjInfo) => {
            console.log(prjInfo);
            createHtml(prjInfo);
        });
    });


})(this);