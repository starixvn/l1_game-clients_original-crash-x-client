import { _decorator, Node } from "cc";
import Observer from "observer";

import { NodeContainer } from "db://shared-components/shared/common-components/node-container/node-container";
import { BetControlStore } from "../../handlers/crash-v2/bet/bet-control-store";
import { CrashBetHandler } from "../../handlers/override/crash-bet-handler";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export class AutoCashOutPopupContainer extends NodeContainer {
    @property(Node)
    nodeOverlay: Node = null;

    @render(BetControlStore, (store) => store.enableAutoCashOut)
    openPopup(enable: boolean) {
        this.nodeOverlay.active = enable;
        if (this.node.children.length > 1) {
            return;
        }

        this.createNode();
    }

    @handle(CrashBetHandler, (handle, enable: boolean) => handle.closeAutoCashOutPopup())
    closePopup() {
        return false;
    }
}
