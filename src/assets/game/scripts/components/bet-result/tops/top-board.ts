import { _decorator, Color, Label, Sprite } from "cc";
import { TabsControl } from "../tabs-control";
const { ccclass, property } = _decorator;

@ccclass("TopBoard")
export class TopBoard extends TabsControl {
    extendShowTab(index: number): void {
        const sprite = this.tabButtons[index].getComponentInChildren(Sprite);
        sprite.spriteFrame = sprite.spriteAtlas.getSpriteFrame("line-active");
        this.tabButtons[index].getComponentInChildren(Label).color = new Color().fromHEX("30df0a");
    }

    extendHideTab(index: number): void {
        const sprite = this.tabButtons[index].getComponentInChildren(Sprite);
        sprite.spriteFrame = sprite.spriteAtlas.getSpriteFrame("line");
        this.tabButtons[index].getComponentInChildren(Label).color = new Color().fromHEX("E6E5DF");
    }
}
