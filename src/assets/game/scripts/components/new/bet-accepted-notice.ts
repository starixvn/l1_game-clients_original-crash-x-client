import gc from "@sg/game-client-base";
import { _decorator, Node, tween, UIOpacity, v3, Vec3 } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";
import { BetControlStore } from "../../handlers/crash-v2/bet/bet-control-store";

const { Connection } = gc;
const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;

@ccclass("BetAcceptedNotice")
export default class BetAcceptedNotice extends ObserverComponent {
    private isShowing = false;
    onLoad(): void {
        this.node.active = false;
        super.onLoad();
    }

    @render(BetControlStore, (store) => store.getBetAccepted(0), { fireImmediately: false })
    renderBetAccepted0(betAccepted: any) {
        this.renderBetAccepted(betAccepted);
    }

    @render(BetControlStore, (store) => store.getBetAccepted(1), { fireImmediately: false })
    renderBetAccepted1(betAccepted: any) {
        this.renderBetAccepted(betAccepted);
    }

    renderBetAccepted(betAccepted: any) {
        if (betAccepted.value > 0) {
            this.showNotice(true);
        }
    }

    showNotice(isShow: boolean) {
        if (isShow) {
            if (this.isShowing) {
                return;
            }

            this.node.active = true;
            this.show(this.node);
        } else {
            this.node.active = false;
        }
    }

    private show(node: Node) {
        this.isShowing = true;

        const opacity = node.getComponent(UIOpacity);
        opacity.opacity = 1;
        const duration = 0.2;
        const delay = 1;
        tween(opacity).to(duration, { opacity: 255 }).delay(delay).to(duration, { opacity: 0 }).start();
        tween(node)
            .to(duration, {
                scale: Vec3.ONE,
            })
            .delay(delay)
            .to(duration, {
                scale: v3(Vec3.ONE).multiplyScalar(1.5),
            })
            .call(() => {
                this.isShowing = false;
                node.active = false;
            })
            .start();
    }
}
