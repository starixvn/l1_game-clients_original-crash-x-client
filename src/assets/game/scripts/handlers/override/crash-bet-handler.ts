import gc from "@sg/game-client-base";
import inversify from "inversify";
import { BetControlStore } from "../crash-v2/bet/bet-control-store";
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

    callCashOut(betKey: number) {
        const cashOutData = {
            betKey,
            username: this.mainPlayerStore.name,
            roundId: this.roundStore.clientRoundId,
            clientSendTime: new Date(),
            m: 1,
        };
        this.connectionStore.send(gc.GameCrash.GameCrashEmitMessage.CashOut.eventName, cashOutData);
        this.retryGameHandler.handle();
    }

    setEarlyBet(betKey: number) {
        this.betControlStore.earlyBet[betKey] = true;
    }

    cancelEarlyBet(betKey: number) {
        this.betControlStore.earlyBet[betKey] = false;
    }

    newHandleBetData(data: any, betKey: number) {
        const amount = data.amount;
        if (this.isValidBet(amount) && !this.betControlStore.processing[betKey]) {
            this.betControlStore.setProcessing(betKey, true);
            this.connectionStore.send(gc.GameClientEmitMessage.Bet.eventName, data);
            this.retryGameHandler.handle();
        }
    }

    autoPlaceBet() {
        this.betControlStore.settings.forEach((setting, index) => {
            const earlyBet = this.betControlStore.earlyBet[index];
            if ((setting.isAuto && setting.autoBet) || earlyBet) {
                this.callBet(index);
                if (earlyBet) {
                    this.betControlStore.earlyBet[index] = false;
                }
            }
        });
    }

    stopAutoBet() {
        Object.keys(this.betControlStore.settings).forEach((betKey) => {
            this.betControlStore.setAutoBet(+betKey, false);
        });
    }
}
