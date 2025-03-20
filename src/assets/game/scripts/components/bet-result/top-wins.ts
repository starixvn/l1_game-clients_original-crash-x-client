import { _decorator, Sprite } from "cc";
import { TabsControl } from "./tabs-control";
const { ccclass, property } = _decorator;

@ccclass("TopWins")
export class TopWins extends TabsControl {
    extendShowTab(index: number): void {
        this.tabButtons[index].getComponent(Sprite).enabled = true;
    }

    extendHideTab(index: number): void {
        this.tabButtons[index].getComponent(Sprite).enabled = false;
    }
}
