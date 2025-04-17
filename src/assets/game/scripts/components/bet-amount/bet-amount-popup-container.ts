import { _decorator, Node } from "cc";
import Observer from "observer";

import { NodeContainer } from "db://shared-components/shared/common-components/node-container/node-container";
import { BetInputHandlers } from "../../handlers/crash-v2";
import { BetInputStore } from "../../handlers/crash-v2/bet/bet-input-store";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export class BetAmountPopupContainer extends NodeContainer {
    @property(Node)
    nodeOverlay: Node = null;

    @render(BetInputStore, (store) => store.enable)
    private renderOpenBetAmountPopup(enable: boolean) {
        this.nodeOverlay.active = enable;

        if (this.node.children.length > 1) {
            return;
        }

        this.createNode();
    }

    @handle(BetInputHandlers, (handle) => handle.closePopup())
    private onClickCloseBetAmountPopup() {}
}
