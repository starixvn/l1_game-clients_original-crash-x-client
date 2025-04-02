import gc from "@sg/game-client-base";
import { _decorator, Label } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";
import { CrashBetListStore } from "../../handlers/crash-v2/bet/crash-bet-list-store";

const { ccclass, property } = _decorator;
const { render, handle } = Observer;

const { GameCrash, FormatUtils } = gc;

@ccclass
export class LeaderBoardGeneralInfoV2 extends ObserverComponent {
    @property(Label)
    lblNoOfPlayersBet: Label = null;

    @property(Label)
    lblNoOfPlayerCashOut: Label = null;

    @property(Label)
    lblTotalCashOut: Label = null;

    @render(CrashBetListStore, (store) => store.noOfPlayerBet)
    private updateNoOfPlayersBet(noOfPlayers: number) {
        this.lblNoOfPlayersBet.string = noOfPlayers.toString();
    }

    @render(CrashBetListStore, (store) => store.noOfPlayerCashOut)
    private updateNoOfPlayersCashOut(noOfPlayerCashOut: number) {
        this.lblNoOfPlayerCashOut.string = noOfPlayerCashOut.toString();
    }

    @render(CrashBetListStore, (store) => store.totalCashOut)
    private updateTotalCashOut(totalCashOut: number) {
        this.lblTotalCashOut.string = FormatUtils.numberWithCommas(totalCashOut, 2, true);
    }
}
