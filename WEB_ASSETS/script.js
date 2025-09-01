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
    const createHtml = (data, cardTemplateHTML, $cardContainer) => {
        const keys = Object.keys(data);
        keys.sort();
        keys.forEach(key  => {
            const title = key.replace("./prj/", "").replace("/","");
            let template = cardTemplateHTML.replace(PLACE_HOLDEER.TITLE, title);
            const items = data[key];
            const explain = findExplain(items);
            if(explain) { template = template.replace(PLACE_HOLDEER.EXPLAIN, explain); }
            const image = findImage(items);
            if(image) { template = template.replace(PLACE_HOLDEER.IMGURL, image); }
            const links = [
                { text: "📖プロジェクトの仕様（README）", path: findReadme(items) },
                { text: "🌏ページ（非Akashic Engine）", path: findIndex(items) },
                { text: "🎮ゲーム（的な成果物）", path: findGame(items) }
            ];
            console.log({key, items, title, links});
            let $_list = "";
            links.forEach(link => {
                if(link.path){
                    $_list += `<li><a class="link" href="${link.path}">${link.text}</a></li>`;
                }
            });
            template = template.replace(PLACE_HOLDEER.LISTMARKUP, $_list);
            $cardContainer.insertAdjacentHTML("beforeend", template);
        });
    };

    g.addEventListener("load", () => {

        const $cardTemplate = document.querySelector("[data-template='card']");
        const cardTemplateHTML = $cardTemplate.outerHTML;
        $cardTemplate.remove();
        const $cardContainer = document.querySelector("[data-container='card-container']");
        $cardContainer.innerHTML = "";


        const PROJECT_INFO_URL = "./prj-info.json";
        fetch(PROJECT_INFO_URL).then((response) => {
            if(response.ok) return response.json();
        }).then((prjInfo) => {
            console.log(prjInfo);
            createHtml(prjInfo, cardTemplateHTML, $cardContainer);
        });
    });


})(this);