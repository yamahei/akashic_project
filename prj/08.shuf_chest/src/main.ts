import { FONT_ASSET_PATH } from "./Consts";
import { TitleScene } from "./TitleScene";
import { GameScene } from "./GameScene";
import { BonusScene } from "./BonusScene";

const SCENESTATE_ACTIVE:g.SceneStateString = "active";

function main(param: g.GameMainParameterObject): void {
	const game = g.game;
	game.vars.level = 1;

	const titleScene = createTitleScene();	
	game.pushScene(titleScene);
}

function createTitleScene(): TitleScene {
	const titleScene =  new TitleScene({
		game: g.game,
		assetPaths: [
			...Object.values(FONT_ASSET_PATH),//要"es2017"
		],
	});
	// titleScene.onLoad.add(() => {
	// 	titleScene.refresh();
	// });
	titleScene.onStateChange.add(() => {
		if (titleScene.state === SCENESTATE_ACTIVE) {
			titleScene.refresh();
		}
	});
	titleScene.OnGameStart.add(() => {
		g.game.vars.level = 1;
		const gameScene: GameScene = createGameScene();
		g.game.pushScene(gameScene);
	});
	return titleScene;
}

function createGameScene(): GameScene {
	const gameScene =  new GameScene({
		game: g.game,
		assetPaths: [
			...Object.values(FONT_ASSET_PATH),//要"es2017"
		],
	});
	// scene.onLoad.add(() => {
	//     scene.refresh(1);
	// });
	gameScene.onStateChange.add(() => {
		if (gameScene.state === SCENESTATE_ACTIVE) {
			gameScene.refresh(g.game.vars.level);
		}
	});
	gameScene.OnSuccessLevel.add(() => {
		g.game.vars.level += 1;
		const nextIsBonus = ((g.game.vars.level - 1) % 5 == 0);
		if (nextIsBonus) {
			const bonus: BonusScene = createBonusScene();
			g.game.pushScene(bonus);
		} else {
			gameScene.refresh(g.game.vars.level);
		}
	});
	gameScene.OnFailedLevel.add(() => {
		g.game.popScene();
	});
	return gameScene;
}

function createBonusScene(): BonusScene {
	const bonusScene =  new BonusScene({
		game: g.game,
		assetPaths: [
			...Object.values(FONT_ASSET_PATH),//要"es2017"
		],
	});
	// bonusScene.onLoad.add(() => {
	// 	bonusScene.refresh();
	// });
	bonusScene.onStateChange.add(() => {
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
