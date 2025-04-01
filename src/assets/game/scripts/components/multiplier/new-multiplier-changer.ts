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
    private lastNode: Node = null;
    private lastIndex = -1;

    @render(gc.GameCrash.CrashMultiplier.MultiplierStore, (store) => store.multiplier)
    private async renderMultiplier(multiplier: number) {
        if (multiplier === 1) {
            this.resetDefaultFont();
            return;
        }

        const newIndex = CrashUtils.getMultiplierIndex(multiplier);
        if (newIndex === this.lastIndex) {
            return;
        }
        this.lastIndex = newIndex;

        const prevIndex = Math.max(0, newIndex - 1);

        if (!this.lastNode) {
            this.lastNode = this.node.children[0];
        }

        const newNode = this.node.children.find((node) => node !== this.lastNode);
        const lastNode = this.lastNode;

        lastNode.setSiblingIndex(0);
        newNode.setSiblingIndex(1);

        this.lastNode = newNode;

        await this.changeFontMultiplier(lastNode, prevIndex);
        await this.changeFontMultiplier(newNode, newIndex);

        AnimationUtils.fadeIn(newNode, 0.2);
        AnimationUtils.fadeOut(lastNode, 0.2);
    }

    async resetDefaultFont() {
        const node = this.node.children[0];
        this.lastNode = node;
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
