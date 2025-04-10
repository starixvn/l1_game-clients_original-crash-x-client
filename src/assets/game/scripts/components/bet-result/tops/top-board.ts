import { _decorator, Label, Sprite } from "cc";
import { CrashUtils } from "../../../crash-utils";
import { TabsControl } from "../tabs-control";

const { ccclass, property } = _decorator;

@ccclass("TopBoard")
export class TopBoard extends TabsControl {
    private updateTabAppearance(index: number, isActive: boolean): void {
        const sprite = this.tabButtons[index].getComponentInChildren(Sprite);
        const label = this.tabButtons[index].getComponentInChildren(Label);
        
        sprite.spriteFrame = sprite.spriteAtlas.getSpriteFrame(isActive ? "line-active" : "line");
        label.color = isActive ? CrashUtils.getColorActiveTab() : CrashUtils.getColorInActiveTab();
    }

    extendShowTab(index: number): void {
        this.updateTabAppearance(index, true);
    }

    extendHideTab(index: number): void {
        this.updateTabAppearance(index, false);
    }
}
