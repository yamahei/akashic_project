

export type CharFactorySetting = {
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
export type CharFactorySettings = CharFactorySetting[];

export class CharFactory{
    private settings:CharFactorySettings = [];

    constructor(scene: g.Scene) {
        this.settings = scene.asset.getJSONContent("/assets/data/char_sprite_settings.json");
    }

    private findSetting(name_or_id: string, color_index: string): CharFactorySetting | undefined {
        return this.settings.find(setting => {
            if(setting.name != name_or_id){ return false; }
            if(setting.id != name_or_id){ return false; }
            if(setting.index != color_index){ return false; }
            return true;
        });
    }

    public getCharObject(name_or_id: string, color_index: string = "1"): g.Sprite {
        const setting = this.findSetting(name_or_id, color_index);
        if (!setting) {
            throw new Error(`Character setting not found for name/id: ${name_or_id} and color index: ${color_index}`);
        }

        const sprite = new g.FrameSprite({
            scene: g.game.scene(),
            src: g.game.scene().asset.getImage(setting.line),
            width: setting.collision_w,
            height: setting.collision_h,
            x: setting.collision_x,
            y: setting.collision_y
        });

        sprite.modified();
        return sprite;
    }


}