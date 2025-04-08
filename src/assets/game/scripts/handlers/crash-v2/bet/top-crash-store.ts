import inversify from "inversify";
import mobx from "mobx";
import { TopCrashItem } from "../../api-client/top-result-client";

const { injectable, inject } = inversify;


@injectable()
export class TopCrashStore {

    constructor() {
        mobx.makeAutoObservable(this);
    }

    private _topCrashItems: TopCrashItem[] = [];

    set topCrashItems(value: TopCrashItem[]) {
        this._topCrashItems = value;
    }

    get topCrashItems(): TopCrashItem[] {
        return this._topCrashItems;
    }
    
    getTopCrashItemByRoundId(roundId: number) {
        return this.topCrashItems.find(item => item.provablyFair?.roundId === roundId);
    }
    
}
