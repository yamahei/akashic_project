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


		//自前フォントの登録と確認
		const assetConfig = g.game._assetManager.configuration;
		const fontPath = assetConfig["JF-Dot-MPlus10.ttf"].path;
		MessageBox.appendNewFontFace(fontPath, FONTFACE_NAME).then(()=>{
			scene.append(getSampleLabel(scene, FONTFACE_NAME));

			const messageBox = new MessageBox({
				EParam: {scene: scene, touchable: true},
				fontFamily: FONTFACE_NAME,
				fontSize: 10,
				// fontColor: 'black',
				// backgroundColor: 'blue',
			});
			scene.append(messageBox);
			messageBox.onPointUp.add(()=>{ messageBox.next(); });
			messageBox.OnWaitToNext.add(()=>{
				console.log("OnWaitToNext");
			});
			messageBox.OnWaitToEnd.add(()=>{
				console.log("OnWaitToEnd");
			});

			const message = [
				[
					"メロスは激怒した。必ず、かの邪智暴虐の王を除かなければならぬと決意した。",
					"メロスには政治がわからぬ。",
					"メロスは、村の牧人である。",
				].join("\n"),
				[
					"笛を吹き、羊と遊んで暮して来た。けれども邪悪に対しては、人一倍に敏感であった。",
					"きょう未明メロスは村を出発し、野を越え山越え、十里はなれた此このシラクスの市にやって来た。",
					"メロスには父も、母も無い。",
					"女房も無い。",

				].join("\n"),
				[
					"十六の、内気な妹と二人暮しだ。",
					"この妹は、村の或る律気な一牧人を、近々、花婿として迎える事になっていた。",
					"結婚式も間近かなのである。",
				].join("\n")
			];


			const rect1 = new g.FilledRect({
				scene: scene,
				cssColor: "red",
				width: 20, height: 20,
				x: 30, y: 250,
				touchable: true,
			});
			scene.append(rect1);
			rect1.onPointDown.add((e)=>{
				messageBox.showMessage(message);
			});

			const rect2 = new g.FilledRect({
				scene: scene,
				cssColor: "blue",
				width: 20, height: 20,
				x: 60, y: 250,
				touchable: true,
			});
			scene.append(rect2);
			rect2.onPointDown.add((e)=>{
				messageBox.showMessage(message.join("\n"));
			});

		});


	});
	g.game.pushScene(scene);
}

function getSampleLabel(scene:g.Scene, fontFamily:string):g.Label{
	const font = new g.DynamicFont({
		game: g.game, fontFamily: fontFamily, size: 10
	});
	const label = new g.Label({
		scene: scene, font: font, fontSize: 10, textColor: "blue",
		text: `コレが俺の[${fontFamily}]だっ！`,
	});
	return label;
}

export = main;
