import gc from "@sg/game-client-base";
import { Node, _decorator } from "cc";
import { InGameMenuEvents } from "db://shared-components/game/in-game-menu/scripts/stores/in-game-menu-events";
import { InGameMenuStore } from "db://shared-components/game/in-game-menu/scripts/stores/in-game-menu-store";
import { NodeContainer } from "db://shared-components/shared/common-components/node-container/node-container";
import Observer from "observer";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

@ccclass("BetHistoryContainer")
export default class BetHistoryRocketXContainer extends NodeContainer {
    wrapperNode: Node = null;

    @render(InGameMenuStore, (store) => store.event, { fireImmediately: false })
    openBetHistory({ event }: { event: InGameMenuEvents }) {
        if (event === InGameMenuEvents.OPEN_HISTORY) {
            this.showDialog();
        }
    }

    showDialog() {
        if (!this.wrapperNode?.active) {
            this.wrapperNode = this.createNode();
        }
    }

    @render(gc.Dialogs.DialogsStore, (store) => store.forceClosed, { fireImmediately: false })
    popupVisibility(forceClosed: any) {
        forceClosed && this.wrapperNode?.destroy();
    }
}
