import gc from "@sg/game-client-base";
import inversify from "inversify";
import { BetControlStore } from "../crash-v2/bet/bet-control-store";
import { CrashCashOutData, CrashOwnBets } from "../crash-v2/interfaces";
const { injectable, inject } = inversify;

@injectable()
export class CrashCashOutHandlers extends gc.GameCrash.CrashCashOut.CrashCashOutHandlers {
    eventHandleList = [
        {
            name: gc.GameCrash.GameCrashServiceMessage.CrashCashOut.cashOutEventName,
            handle: this.handleCashOutFull,
        },
        {
            name: gc.GameServiceMessage.OwnBets.eventName,
            handle: this.handleOwnBets,
        },
    ];

    @inject(BetControlStore) private betControlStore: BetControlStore;

    protected handleMultiplier() {
        //dont need, compute by betControlStore.getCashedOutValue(betKey)
    }

    protected handleCashOutFull(cashOut: CrashCashOutData) {
        this.retryGameHandler.clearInterval();
        this.betControlStore.setCashedOut(cashOut);
        this.handleCashOutMessage(cashOut);
        this.cashOutStore.setCashOutNotice(cashOut);

        if (this.isCashedOutAllBets()) {
            setTimeout(() => {
                this.resetCashOut();
            }, this.displayCashedOutDuration);
        }
    }

    protected isCashedOutAllBets() {
        return this.betControlStore.isCashedOutAllBets();
    }

    protected handleOwnBets(ownBets: CrashOwnBets) {
        //TODO:handle own bets when resume game with bet
    }

    protected resetCashOut() {
        this.betControlStore.resetLastBet();
        this.betStore.lastReceivedBet = null;
    }
}
