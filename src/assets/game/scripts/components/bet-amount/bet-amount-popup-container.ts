import gc from "@sg/game-client-base";
import { _decorator, Node } from "cc";
import Observer from "observer";

import { NodeContainer } from "db://shared-components/shared/common-components/node-container/node-container";
import { BetInputStore } from "../../handlers/crash-v2/bet/bet-input-store";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export class BetAmountPopupContainer extends NodeContainer {
    @property(Node)
    nodeOverlay: Node = null;

    @render(BetInputStore, (store) => store.isOpenBetAmountPopup)
    private renderOpenBetAmountPopup(isOpenBetAmountPopup: boolean) {
        this.nodeOverlay.active = isOpenBetAmountPopup;

        if (this.node.children.length > 1) {
            return;
        }

        this.createNode();
    }

    @handle(gc.GameCrash.BetInput.BetInputHandler, (handle) => handle.closeBetAmountPopup())
    private onClickCloseBetAmountPopup(event) {}
}
