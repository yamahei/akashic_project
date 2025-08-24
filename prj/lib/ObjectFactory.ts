"use strict";

import { ObjectEntity } from "./ObjectEntity";

/** 画像アセットのパス */
const xxx_ASSET_PATH = "/assets/image/obj/xxxx.png";

/** キャラクタ画像の幅 */
const OBJECT_IMAGE_WIDTH = 72;//px
/** キャラクタ画像の高さ */
const OBJECT_IMAGE_HEIGHT = 128;//px
/** キャラクタチップの幅 */
const OBJECT_CHIP_WIDTH = 24;//px
/** キャラクタチップの高さ */
const OBJECT_CHIP_HEIGHT = 32;//px

/**
 * オブジェクト生成クラス
 * スタティックメソッドのみで構成され、インスタンス化しない
 */
export class ObjectFactory{

    private static createObjectSprite(asset_path:string): g.FrameSprite {
        return new g.FrameSprite({
            tag: "object",
            scene: g.game.scene(),
            src: g.game.scene().asset.getImage(asset_path),
            width: OBJECT_CHIP_WIDTH,
            height: OBJECT_CHIP_HEIGHT,
            x: 0, y: 0
        });
    }

    private static createCollisionArea(x:number, y:number, width:number, height:number): g.E {
        const collision_area = new g.E({
            tag: "hitarea",
            scene: g.game.scene(),
            x: x, y: y, width: width, height: height
        });
        return collision_area;
    }


    /**
     * オブジェクトオブジェクトを生成して返す
     * name は object_settings のフィールドを参照して指定する
     * @param {string} name オブジェクト名
     * @returns {ObjectEntity} 生成したオブジェクトオブジェクト
     */
    public static getObjectObject(name: string): ObjectEntity {
        const setting = ObjectEntity.getObjectSetting(name);
        const patterns = setting.animation_patterns;
        const sprite = ObjectFactory.createObjectSprite(setting.asset_path);
        const hitarea = ObjectFactory.createCollisionArea(setting.collision_x, setting.collision_y, setting.collision_w, setting.collision_h);

        const entity = new ObjectEntity(
            { scene: g.game.scene() }, sprite, hitarea, patterns
        );

        return entity;
    }

}