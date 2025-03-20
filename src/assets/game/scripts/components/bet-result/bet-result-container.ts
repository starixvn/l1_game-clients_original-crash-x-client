import { _decorator, Color, Label } from "cc";
import { TabsControl } from "./tabs-control";
const { ccclass, property } = _decorator;

@ccclass("BetResultContainer")
export class BetResultContainer extends TabsControl {
    extendShowTab(index: number): void {
        this.tabButtons[index].getComponentInChildren(Label).color = new Color().fromHEX("30df0a");
    }

    extendHideTab(index: number): void {
        this.tabButtons[index].getComponentInChildren(Label).color = new Color().fromHEX("E6E5DF");
    }
}
