import { _decorator, Node } from "cc";
import Observer from "observer";

import { NodeContainer } from "db://shared-components/shared/common-components/node-container/node-container";
import { AutoCashOutStore } from "../../handlers/crash-v2/bet/auto-cash-out-store";
import { AutoCashOutHandlers } from "../../handlers/crash-v2/handlers/auto-cash-out-handlers";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass
export class AutoCashOutPopupContainer extends NodeContainer {
    @property(Node)
    nodeOverlay: Node = null;

    @render(AutoCashOutStore, (store) => store.enable)
    openPopup(enable: boolean) {
        this.nodeOverlay.active = enable;
        if (this.node.children.length > 1) {
            return;
        }

        this.createNode();
    }

    @handle(AutoCashOutHandlers, (handle, enable: boolean) => handle.closeAutoCashOutPopup())
    closePopup() {
        return false;
    }
}
