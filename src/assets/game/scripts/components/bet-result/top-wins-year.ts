import { _decorator } from "cc";
import { TopWinsBody } from "./top-wins-body";

const { ccclass } = _decorator;

@ccclass("TopWinsYear")
export class TopWinsYear extends TopWinsBody {
    async fetchData() {
        let topWinItems = await this.topResultClient.getTopWinYearly();
        return topWinItems;
    }
}
