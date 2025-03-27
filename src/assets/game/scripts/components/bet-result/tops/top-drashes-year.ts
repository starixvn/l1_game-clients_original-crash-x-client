import { _decorator } from "cc";
import { TopDrashesBody } from "./top-drashes-body";

const { ccclass } = _decorator;

@ccclass("TopDrashYear")
export class TopDrashesMonth extends TopDrashesBody {
    async fetchData() {
        let topCrashItems = await this.topResultClient.getTopCrashYearly();
        return topCrashItems;
    }
}
