import { _decorator } from "cc";
import { TopWinsBody } from "./top-wins-body";

const { ccclass } = _decorator;

@ccclass("TopWinsMonth")
export class TopWinsMonth extends TopWinsBody {
    async fetchData() {
        let topWinItems = await this.topResultClient.getTopWinMonthly();
        return topWinItems;
    }
}
