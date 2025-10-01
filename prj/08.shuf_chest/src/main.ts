import { TitleScene } from "./TitleScene";
import { GameScene } from "./GameScene";
import { BonusScene } from "./BonusScene";

const SCENESTATE_ACTIVE:g.SceneStateString = "active";

function main(param: g.GameMainParameterObject): void {
	const game = g.game;
	let level = 1;

	const titleScene = createTitleScene();	
	titleScene.OnGameStart.add(() => {
		console.log("titleScene.OnGameStart");
		level = 1;
		const gameScene: GameScene = createGameScene(level);
		g.game.pushScene(gameScene);
	});
	game.pushScene(titleScene);
}

function createTitleScene(): TitleScene {
	const scene =  new TitleScene({
		game: g.game,
		// assetIds: ["player", "shot", "se"]
	});
	scene.onStateChange.add(() => {
		console.log(`titleScene.onStateChange: state=${scene.state}`);
		if (scene.state === SCENESTATE_ACTIVE) {
			scene.refresh();
		}
	});
	return scene;
}

function createGameScene(level:number): GameScene {
	const scene =  new GameScene({
		game: g.game,
		// assetIds: ["player", "shot", "se"]
	});
	scene.OnSuccessLevel.add(() => {
		console.log("gameScene.OnSuccessLevel");
		level += 1;
		const nextIsBonus = ((level - 1) % 5 == 0);
		if (nextIsBonus) {
			console.log("game.replaceScene(bonusScene)");
			const bonus: BonusScene = createBonusScene();
			g.game.pushScene(bonus);
		} else {
			console.log(`gameScene.refresh(level=${level});`);
			scene.refresh(level);
		}
	});
	scene.OnFailedLevel.add(() => {
		console.log("gameScene.OnFailedLevel");
		g.game.popScene();
	});
	scene.onStateChange.add(() => {
		console.log(`gameScene.onStateChange: state=${scene.state}`);
		if (scene.state === SCENESTATE_ACTIVE) {
			scene.refresh(level);
		}
	});
	return scene;
}

function createBonusScene(): BonusScene {
	const scene =  new BonusScene({
		game: g.game,
		// assetIds: ["player", "shot", "se"]
	});
	scene.OnFinishBonus.add(() => {
		console.log("bonusScene.OnFinishBonus");
		g.game.popScene();
	});
	return scene;
}

export = main;
