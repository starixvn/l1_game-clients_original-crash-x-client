import inversify from "inversify";
import mobx from "mobx";
const { injectable, inject } = inversify;

import gc from "@sg/game-client-base";

@injectable()
export class BetInputStore {
    @inject(gc.Rounds.RoundStore) private readonly roundStore: gc.Rounds.RoundStore;
    @inject(gc.GameConfigs.GameConfigStore) private readonly gameConfig: gc.GameConfigs.GameConfigStore;

    constructor() {
        mobx.makeAutoObservable(this);
        // setTimeout(() => {
        //     mobx.reaction(
        //         () => this.roundStore.maxBet && this.roundStore.minBet,
        //         () => {
        //             this.validCurrentBetAmounts();
        //         }
        //     );
        // }, 0);
    }

    isOpenBetAmountPopup = false;
    betAmountTemp = 0;
    isDisabledBetInput = false;

    currentBetKey: number = 0;
    enable: boolean = false;
    betAmount: number = -1;
    betAmountString: string = "0";

    get decreaseStatus(): boolean {
        return this.betAmount > this.minBet;
    }

    get increaseStatus(): boolean {
        return this.betAmount < this.maxBet;
    }

    // get betAmountRatio(): number {
    //     return this.betAmount * this.cashOutStore.ratio;
    // }

    get minBet(): number {
        return this.roundStore.minBet;
    }

    get maxBet(): number {
        return this.roundStore.maxBet;
    }

    get chips(): string[] {
        return this.gameConfig.chips;
    }

    get isAmountGreaterMinBet() {
        return this.betAmount <= Number(this.betAmountString);
    }

    get isAmountValid() {
        const betAmount = Number(this.betAmountString);
        return betAmount >= this.minBet && betAmount <= this.maxBet;
    }
}
