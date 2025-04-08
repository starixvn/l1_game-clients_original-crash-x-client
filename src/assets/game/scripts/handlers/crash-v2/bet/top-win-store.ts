import inversify from "inversify";
import mobx from "mobx";
import { TopWinItem } from "../../api-client/top-result-client";

const { injectable, inject } = inversify;


@injectable()
export class TopWinStore {

    constructor() {
        mobx.makeAutoObservable(this);
    }

    private _topWinItems: TopWinItem[] = [];

    set topWinItems(value: TopWinItem[]) {
        this._topWinItems = value;
    }

    get topWinItems(): TopWinItem[] {
        return this._topWinItems;
    }  
    
    getTopWinItemByRoundId(roundId: number) {
        return this.topWinItems.find(item => item.provablyFair?.roundId === roundId);
    }
}
