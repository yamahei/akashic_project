import { FONT_ASSET_PATH } from "./Consts";
import { TitleScene } from "./TitleScene";
import { GameScene } from "./GameScene";
import { BonusScene } from "./BonusScene";
import { ObjectEntity } from "../lib/ObjectEntity";

const SCENESTATE_ACTIVE:g.SceneStateString = "active";

function main(param: g.GameMainParameterObject): void {
	const game = g.game;
	game.vars.global = { level: 1 };

	const titleScene = createTitleScene();	
	game.pushScene(titleScene);
}

function createTitleScene(): TitleScene {
	const chectSetting = ObjectEntity.getObjectSetting("chest_bright");
	const chestPath = chectSetting.asset_path;
	const titleScene =  new TitleScene({
		game: g.game,
		assetIds: [
			"image/Title_FindMeIfYouCan.png",
		],
		assetPaths: [
			...Object.values(FONT_ASSET_PATH),//要"es2017"
			chestPath,
		],
	});
	// titleScene.onLoad.add(() => {
	// 	titleScene.refresh();
	// });
	titleScene.onStateChange.add(() => {
		console.log(`TitleScene: state=${titleScene.state}`);
		if (titleScene.state === SCENESTATE_ACTIVE) {
			titleScene.refresh();
		}
	});
	titleScene.OnGameStart.add(() => {
		g.game.vars.global.level = 1;
		const gameScene: GameScene = createGameScene();
		g.game.pushScene(gameScene);
	});
	return titleScene;
}

function createGameScene(): GameScene {
	const chectSetting = ObjectEntity.getObjectSetting("chest_bright");
	const chestPath = chectSetting.asset_path;
	const gameScene =  new GameScene({
		game: g.game,
		assetPaths: [
			...Object.values(FONT_ASSET_PATH),//要"es2017"
			chestPath,
		],
	});
	// scene.onLoad.add(() => {
	//     scene.refresh(1);
	// });
	gameScene.onStateChange.add(() => {
		console.log(`GameScene: state=${gameScene.state}`);
		if (gameScene.state === SCENESTATE_ACTIVE) {
			gameScene.refresh(g.game.vars.global.level);
		}
	});
	gameScene.OnSuccessLevel.add(() => {
		g.game.vars.global.level += 1;
		const nextIsBonus = ((g.game.vars.global.level - 1) % 5 == 0);
		if (nextIsBonus) {
			const bonus: BonusScene = createBonusScene();
			g.game.pushScene(bonus);
		} else {
			gameScene.refresh(g.game.vars.global.level);
		}
	});
	gameScene.OnFailedLevel.add(() => {
		g.game.popScene();
	});
	return gameScene;
}

function createBonusScene(): BonusScene {
	const chectSetting = ObjectEntity.getObjectSetting("chest_bright");
	const chestPath = chectSetting.asset_path;
	const bonusScene =  new BonusScene({
		game: g.game,
		assetPaths: [
			...Object.values(FONT_ASSET_PATH),//要"es2017"
			chestPath,
		],
	});
	// bonusScene.onLoad.add(() => {
	// 	bonusScene.refresh();
	// });
	bonusScene.onStateChange.add(() => {
		console.log(`BonusScene: state=${bonusScene.state}`);
		if (bonusScene.state === SCENESTATE_ACTIVE) {
			bonusScene.refresh();
		}
	});
	bonusScene.OnFinishBonus.add(() => {
		g.game.popScene();
	});
	return bonusScene;
}

export = main;
