import { MessageBox } from "../lib/MessageBox";

const FONTFACE_NAME = "JFMPlus10";


function main(param: g.GameMainParameterObject): void {
	const scene = new g.Scene({
		game: g.game,
		assetIds: ["player", "shot", "se"]
	});
	scene.onLoad.add(() => {
		// ここからゲーム内容を記述します
		const playerImageAsset = scene.asset.getImageById("player");
		const shotImageAsset = scene.asset.getImageById("shot");
		const seAudioAsset = scene.asset.getAudioById("se");
		const player = new g.Sprite({
			scene: scene,
			src: playerImageAsset,
			width: playerImageAsset.width,
			height: playerImageAsset.height
		});
		player.x = (g.game.width - player.width) / 2;
		player.y = (g.game.height - player.height) / 2;
		player.onUpdate.add(() => {
			player.y = (g.game.height - player.height) / 2 + Math.sin(g.game.age % (g.game.fps * 10) / 4) * 10;
			player.modified();
		});
		scene.onPointDownCapture.add(() => {
			seAudioAsset.play();
			const shot = new g.Sprite({
				scene: scene,
				src: shotImageAsset,
				width: shotImageAsset.width,
				height: shotImageAsset.height
			});
			shot.x = player.x + player.width;
			shot.y = player.y;
			shot.onUpdate.add(() => {
				if (shot.x > g.game.width) shot.destroy();
				shot.x += 10;
				shot.modified();
			});
			scene.append(shot);
		});
		scene.append(player);
		// ここまでゲーム内容を記述します


		//自分フォントの登録と確認
		const assetConfig = g.game._assetManager.configuration;
		const fontPath = assetConfig["JF-Dot-MPlus10.ttf"].path;
		MessageBox.appendNewFontFace(fontPath, FONTFACE_NAME).then(()=>{
			const font = new g.DynamicFont({
				game: g.game, fontFamily: FONTFACE_NAME, size: 10
			});
			const label = new g.Label({
				scene: scene, font: font, fontSize: 10, textColor: "blue",
				text: `コレが俺の[${FONTFACE_NAME}]だっ！`,
			});
			scene.append(label);
		});

	});
	g.game.pushScene(scene);
}

export = main;
