import gc from "@sg/game-client-base";
import { _decorator, Node, sp, Tween, tween, v3 } from "cc";
import { AnimationUtils } from "db://shared-components/shared/utils";
import Observer from "observer";

import { ObserverComponent } from "../../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";
import { CrashUtils } from "../../crash-utils";

const { ccclass, property } = _decorator;

const { handle, render } = Observer;
const { GameCrash } = gc;

@ccclass
export class RocketFly extends ObserverComponent {
    @property(sp.Skeleton)
    spinePlanet: sp.Skeleton = null;

    @property(sp.Skeleton)
    spineRocket: sp.Skeleton = null;

    @property(Node)
    landingNode: Node = null;

    private readonly smallExplosionMultiplier = 1.02;
    private preparingRocket = false;
    private multiplierIndex = 0;
    private flying = false;
    private flyingTween: Tween<Node> = null;
    private crashed = false;

    onLoad() {
        this.spineRocket.node.active = false;
        super.onLoad();
    }

    @render(GameCrash.CrashMultiplier.MultiplierStore, (store) => store.multiplier)
    private renderCurrentMultiplier(multiplier: number) {
        if (this.crashed) {
            return;
        }

        this.spineRocket.node.active = true;

        const index = CrashUtils.getMultiplierIndex(multiplier);
        this.multiplierIndex = index;

        const current = this.spineRocket.getCurrent(0).animation.name;
        const animName = `bay-lv${this.multiplierIndex + 1}`;
        if (current !== animName) {
            AnimationUtils.playSpine(this.spineRocket, animName, true);
        }
    }

    @render(gc.Settlements.SettlementStore, (store) => store.result, {
        fireImmediately: false,
    })
    async renderRocketExplosion(result: gc.GameServiceMessage.TResult) {
        if (result) {
            this.preparingRocket = false;
            +result < this.smallExplosionMultiplier && (await AnimationUtils.delayTime(0.5));
            this.explodeRocket();
        }
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.isInRoundTime)
    renderInRoundTime(isInRoundTime: boolean) {
        if (isInRoundTime && !this.preparingRocket) {
            this.prepareForRocket(false);
        }
    }

    @render(gc.Rounds.RoundTimeStore, (store) => store.isStartRound)
    startNewRound(isStartRound: boolean) {
        if (!isStartRound) {
            return;
        }
        this.prepareForRocket(true);
    }

    private prepareForRocket(animated: boolean) {
        this.preparingRocket = true;
        this.spineRocket.node.active = true;

        this.spineRocket.setAnimation(0, "idle", true);
        this.spineRocket.node.position = v3(this.landingNode.position);

        this.spinePlanet.timeScale = 0;
        this.spinePlanet.setAnimation(0, "hanhtinh", true);

        this.crashed = false;
    }

    @render(GameCrash.CrashMultiplier.MultiplierStore, (store) => store.time, { fireImmediately: false })
    private renderCurrentTime(time: number) {
        if (time === 0) {
            this.rocketStartFlying();
        }
    }

    private rocketStartFlying() {
        if (this.flying) {
            return;
        }
        this.flying = true;
        this.flyingTween = tween(this.spineRocket.node)
            .to(0.7, { position: v3(0, 0, 0) }, { easing: "sineInOut" })
            .start();

        this.spinePlanet.timeScale = 1;
        this.spinePlanet.setAnimation(0, "hanhtinh", true);
    }

    explodeRocket() {
        const animName = `crash${this.multiplierIndex + 1}`;
        AnimationUtils.playSpine(this.spineRocket, animName, false);

        this.crashed = true;

        this.spinePlanet.timeScale = 0;
        this.flying = false;
        this.flyingTween?.stop();
    }
}
