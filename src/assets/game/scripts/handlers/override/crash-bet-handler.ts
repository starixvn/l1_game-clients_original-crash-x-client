import gc from "@sg/game-client-base";
import inversify from "inversify";
import { BetControlStore } from "../new/bet/bet-control-store";
const { injectable, inject } = inversify;

@injectable()
export class CrashBetHandler extends gc.GameCrash.CrashBet.CrashBetHandler {
    @inject(BetControlStore) private betControlStore: BetControlStore;

    processing = {};

    handle() {}

    callBet(betKey: number) {
        const setting = this.betControlStore.getBetSetting(betKey);
        const betData = this.createBetData({});
        Object.assign(betData, {
            autoCashOut: setting.autoCashOut ? setting.cashOutAt : undefined,
            amount: setting.amount,
            betKey: betKey,
        });

        this.newHandleBetData(betData, betKey);
    }

    newHandleBetData(data: any, betKey: number) {
        const amount = data.amount;
        if (this.isValidBet(amount) && !this.betControlStore.processing[betKey]) {
            this.betControlStore.processing[betKey] = true;
            this.connectionStore.send(gc.GameClientEmitMessage.Bet.eventName, data);
            this.retryGameHandler.handle();
        }
    }

    autoPlaceBet() {
        this.betControlStore.settings.forEach((setting, index) => {
            if (setting.isAuto && setting.autoBet) {
                this.callBet(index);
            }
        });
    }
}
