import { ObjectEntity } from "../lib/ObjectEntity"
import { ObjectFactory } from "../lib/ObjectFactory";

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

		/**
		 * ここからオブジェクトオブジェクトの利用例
		 */
		const names = [
            "blue_book","red_book","green_book",
            "chest_bright","chest_red","chest_gold","chest_wood","chest_bronze",
            "flag_red","flag_magenda","flag_blue","flag_yellow",
            "door_wood1","door_wood1_bright","door_wood2","door_wood2_bright","door_wood3","door_wood3_bright","door_wood4","door_wood4_bright","door_iron","door_iron_bright",
            "switch_p","switch_ud","switch_lr","switch_fb",
            "treasure_pendant","treasure_key_heart","treasure_key_silver","treasure_jewel"
        ];
		names.forEach((name, index) => {
			const setting = ObjectEntity.getObjectSetting(name);
			const obj = ObjectFactory.getObjectObject(name);
			obj.x = (index % 5) * 34 + 10;
			obj.y = Math.floor(index / 5) * 42 + 10;
			scene.append(obj);
		});


	});
	g.game.pushScene(scene);
}

export = main;
