import gc from "@sg/game-client-base";
import inversify from "inversify";
import { BetControlStore } from "../crash-v2/bet/bet-control-store";
const { injectable, inject } = inversify;

@injectable()
export class CrashBetHandler extends gc.GameCrash.CrashBet.CrashBetHandler {
    @inject(BetControlStore) private betControlStore: BetControlStore;

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
        this.betControlStore.setEarlyBet(betKey, true);
    }

    cancelEarlyBet(betKey: number) {
        this.betControlStore.setEarlyBet(betKey, false);
    }

    newHandleBetData(data: any, betKey: number) {
        const amount = data.amount;
        const control = this.betControlStore.controls[betKey];
        if (this.isValidBet(amount) && !control.processing[betKey]) {
            this.betControlStore.setProcessing(betKey, true);
            this.connectionStore.send(gc.GameClientEmitMessage.Bet.eventName, data);
            this.retryGameHandler.handle();
        }
    }

    autoPlaceBet() {
        Object.values(this.betControlStore.controls).forEach((control, index) => {
            const earlyBet = control.earlyBet[index];
            if (control.setting.autoBet || earlyBet) {
                this.callBet(index);
                if (earlyBet) {
                    control.earlyBet[index] = false;
                }
            }
        });
    }

    stopAutoBet() {
        Object.keys(this.betControlStore.controls).forEach((betKey) => {
            this.betControlStore.setAutoBet(+betKey, false);
        });
    }
}
