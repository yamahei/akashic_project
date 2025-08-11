import { CharFactory } from "../lib/CharFactory";
import { CharEntity } from "../lib/CharEntity";

function main(param: g.GameMainParameterObject): void {
	const scene = new g.Scene({
		game: g.game,
		// このシーンで利用するアセットのIDを列挙し、シーンに通知します
		assetIds: ["player", "shot", "se"],
		assetPaths: ["/assets/**/*"]
	});
	scene.onLoad.add(() => {
		// ここからゲーム内容を記述します

		// 各アセットオブジェクトを取得します
		const playerImageAsset = scene.asset.getImageById("player");
		const shotImageAsset = scene.asset.getImageById("shot");
		const seAudioAsset = scene.asset.getAudioById("se");

		// プレイヤーを生成します
		const player = new g.Sprite({
			scene: scene,
			src: playerImageAsset,
			width: playerImageAsset.width,
			height: playerImageAsset.height
		});

		// プレイヤーの初期座標を、画面の中心に設定します
		player.x = (g.game.width - player.width) / 2;
		player.y = (g.game.height - player.height) / 2;
		player.onUpdate.add(() => {
			// 毎フレームでY座標を再計算し、プレイヤーの飛んでいる動きを表現します
			// ここではMath.sinを利用して、時間経過によって増加するg.game.ageと組み合わせて
			player.y = (g.game.height - player.height) / 2 + Math.sin(g.game.age % (g.game.fps * 10) / 4) * 10;

			// プレイヤーの座標に変更があった場合、 modified() を実行して変更をゲームに通知します
			player.modified();
		});

		// 画面をタッチしたとき、SEを鳴らします
		scene.onPointDownCapture.add(() => {
			seAudioAsset.play();

			// プレイヤーが発射する弾を生成します
			const shot = new g.Sprite({
				scene: scene,
				src: shotImageAsset,
				width: shotImageAsset.width,
				height: shotImageAsset.height
			});

			// 弾の初期座標を、プレイヤーの少し右に設定します
			shot.x = player.x + player.width;
			shot.y = player.y;
			shot.onUpdate.add(() => {
				// 毎フレームで座標を確認し、画面外に出ていたら弾をシーンから取り除きます
				if (shot.x > g.game.width) shot.destroy();

				// 弾を右に動かし、弾の動きを表現します
				shot.x += 10;

				// 変更をゲームに通知します
				shot.modified();
			});
			scene.append(shot);
		});
		scene.append(player);
		// ここまでゲーム内容を記述します

		const hero = CharFactory.getCharObject("hero");
		scene.append(hero);

		const directions = ["back", "right", "fore", "left"];
		const actions = ["stop", "walk", "jump", "attack", "die"];

		const common_rect_params = {scene: scene, touchable: true, width: 30, height: 30, /*x: 20,*/ y:70, /*cssColor: "red"*/}


		const rect1 = new g.FilledRect({...common_rect_params, x: 20, cssColor: "red"});
		scene.append(rect1);
		rect1.onPointDown.add(function () {
			//@ts-ignore
			hero.setDirection(directions[0]);
			directions.push(directions.shift());
		});

		const rect2 = new g.FilledRect({...common_rect_params, x: 80, cssColor: "blue"});
		scene.append(rect2);
		rect2.onPointDown.add(function () {
			//@ts-ignore
			hero.setAction(actions[0]);
			actions.push(actions.shift());
		});
		
		let flag = false;
		const rect3 = new g.FilledRect({...common_rect_params, x: 140, cssColor: "green"});
		scene.append(rect3);
		rect3.onPointDown.add(function () {flag = !flag;});
		hero.onUpdate.add(() => {
			// in hero(=this)
			if (flag) {
				console.debug({
					frameNumber: hero.sprite.frameNumber,
				});
			}
		});

	});
	g.game.pushScene(scene);
}

export = main;
