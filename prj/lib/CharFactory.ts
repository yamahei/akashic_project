"use strict";

import { CharEntity } from "./CharEntity";

/** エフェクト画像アセットのパス */
const EFFECT_ASSET_PATH = "/assets/image/obj/effects.png";
/** キャラクタ設定アセットのパス（01.collision_editor で作成した設定json） */
const CHAR_SETTING_PATH = "/assets/data/char_sprite_settings.json";
/** キャラクタ画像の幅 */
const CHAR_IMAGE_WIDTH = 72;//px
/** キャラクタ画像の高さ */
const CHAR_IMAGE_HEIGHT = 128;//px
/** キャラクタチップの幅 */
const CHAR_CHIP_WIDTH = 24;//px
/** キャラクタチップの高さ */
const CHAR_CHIP_HEIGHT = 32;//px

/** キャラクタ設定のjsonレイアウト（1行） */
type CharFactorySetting = {
      "line": string, //ex: "../assets/image/char/char_a-01-0_1.png",
      "path": string, //ex: "../assets/image/char",
      "prefix": string, //ex: "char",
      "id": string, //ex: "a-01-0",
      "index": string, //ex: "1",
      "ext": string, //ex: "png",
      "name": string, //ex: "hero",
      "collision_x": number, //ex: 6,
      "collision_y": number, //ex: 6,
      "collision_w": number, //ex: 12,
      "collision_h": number, //ex: 25,
      "attr_job": string, //ex: "wander",
      "attr_type": string, //ex: "human",
      "attr_sex": string, //ex: "male",
      "attr_age": string, //ex: "adult"
};
type CharFactorySettings = CharFactorySetting[];

/**
 * キャラクタ生成クラス
 * スタティックメソッドのみで構成され、インスタンス化しない
 */
export class CharFactory{

    private static findSetting(settings:CharFactorySettings, name_or_id: string, color_index: string): CharFactorySetting | undefined {
        const hits:CharFactorySettings = settings.filter(setting => {
            const is_name = setting.name === name_or_id;
            const is_id = setting.id === name_or_id;
            const is_color = setting.index === color_index;
            return (is_name || is_id) && is_color;
        });
        return hits[0];
    }

    private static getAssetPath(setting: CharFactorySetting): string {
        const asset_path = setting?.line.replace(/^\.\./, "");
        console.log(`CharFactory.getAssetPath: ${asset_path}`);
        return asset_path;
    }

    private static createCharSprite(setting: CharFactorySetting): g.FrameSprite {
        const asset_path = CharFactory.getAssetPath(setting);
        return new g.FrameSprite({
            tag: "sprite",
            scene: g.game.scene(),
            src: g.game.scene().asset.getImage(asset_path),
            width: CHAR_CHIP_WIDTH,
            height: CHAR_CHIP_HEIGHT,
            x: 0,
            y: 0
        });
    }

    private static createCollisionArea(setting: CharFactorySetting): g.E {
        const collision_area = new g.E({
            tag: "hitarea",
            scene: g.game.scene(),
            x: setting.collision_x,
            y: setting.collision_y,
            width: setting.collision_w,
            height: setting.collision_h
        });
        return collision_area;
    }

    private static createEffectSprite(): g.FrameSprite {
        return new g.FrameSprite({
            tag: "effect",
            scene: g.game.scene(),
            src: g.game.scene().asset.getImage(EFFECT_ASSET_PATH),
            width: CHAR_CHIP_WIDTH,
            height: CHAR_CHIP_HEIGHT,
            x: 0,
            y: 0,
            hidden: true,
        });
    }

    /**
     * キャラクタオブジェクトを生成して返す
     * name_or_id と color_index は CharFactorySettings のフィールドを参照して指定する
     * @param {string} name_or_id キャラクタ名またはID
     * @param {string} color_index カラーインデックス（デフォルト"1"）※数字文字列
     * @returns {CharEntity} 生成したキャラクタオブジェクト
     */
    public static getCharObject(name_or_id: string, color_index: string = "1"): CharEntity {
        const settings: CharFactorySettings = g.game.scene().asset.getJSONContent(CHAR_SETTING_PATH);
        const setting = CharFactory.findSetting(settings, name_or_id, color_index);
        if (!setting) {
            throw new Error(`Character setting not found for name/id: ${name_or_id} and color index: ${color_index}`);
        }

        const sprite = CharFactory.createCharSprite(setting);
        const hitarea = CharFactory.createCollisionArea(setting);
        const effect = CharFactory.createEffectSprite();

        const char_object = new CharEntity({
            scene: g.game.scene()}, 
            sprite, hitarea, effect
        );

        return char_object;
    }

}