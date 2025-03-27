import gc from "@sg/game-client-base";
import { _decorator, BitmapFont, Label, Node } from "cc";
import { bundleManager } from "db://shared-components/shared/common-components/bundle-manager/bundle-manager";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import { AnimationUtils } from "db://shared-components/shared/utils";
import Observer from "observer";
import { CrashUtils } from "../../crash-utils";

const { Connection } = gc;
const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;

@ccclass("NewMultiplierChanger")
export default class NewMultiplierChanger extends ObserverComponent {
    @render(gc.GameCrash.CrashMultiplier.MultiplierStore, (store) => store.multiplier)
    private async renderMultiplier(multiplier: number) {
        const newIndex = CrashUtils.getMultiplierIndex(multiplier);
        const lastIndex = Math.max(0, newIndex - 1);

        if (multiplier === 1) {
            this.resetDefaultFont();
            return;
        }

        if (newIndex === lastIndex) {
            return;
        }

        if (newIndex >= this.node.children.length) {
            return;
        }

        const newNode = this.node.children[newIndex];
        const lastNode = this.node.children[lastIndex];

        lastNode.setSiblingIndex(0);
        newNode.setSiblingIndex(1);

        await this.changeFontMultiplier(lastNode, lastIndex);
        await this.changeFontMultiplier(newNode, newIndex);

        AnimationUtils.fadeIn(newNode, 0.2);
        AnimationUtils.fadeOut(lastNode, 0.2);
    }

    async resetDefaultFont() {
        const node = this.node.children[0];
        await this.changeFontMultiplier(node, 0);
        AnimationUtils.setOpacityNode(node, 255);

        AnimationUtils.setOpacityNode(this.node.children[1], 1);
    }

    private async changeFontMultiplier(node: Node, index: number) {
        const font = CrashUtils.getFontMultiplier(index);
        node.getComponent(Label).font = await bundleManager.loadAssetsFromBundle<BitmapFont>(
            "resources",
            `fonts/${font}`,
            BitmapFont,
            null
        );
    }
}
