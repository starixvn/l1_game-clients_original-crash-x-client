import gc from "@sg/game-client-base";
import { _decorator, Component, Label, Node } from "cc";

const { ccclass, property } = _decorator;
const { FormatUtils } = gc;

interface ILeaderBoardCashOutData {
    name: string;
    amount: number;
    multiplier?: number;
    win?: number;
}

@ccclass
export class LeaderBoardCashOut extends Component {
    @property(Label)
    lblName: Label = null;

    @property(Label)
    lblMultiplier: Label = null;

    @property(Label)
    lblWin: Label = null;

    @property(Label)
    lblBetAmount: Label = null;

    @property(Node)
    nodeBackground: Node = null;

    setData(data: ILeaderBoardCashOutData, index: number) {
        this.nodeBackground.active = index % 2 > 0;
        const { name, multiplier, win, amount } = data;
        try {
            this.lblName.string = this.encryptedName(name);
        } catch (excep) {
            console.log(data);
        }

        this.lblBetAmount.string = FormatUtils.numberWithCommas(amount, 2);
        const hasCashedOut = multiplier > 0;
        this.lblMultiplier.string = hasCashedOut ? `${FormatUtils.numberWithCommas(multiplier, 2, false)}x` : "-";
        this.lblWin.string = hasCashedOut ? FormatUtils.numberWithCommas(win, 2) : "-";
    }

    private encryptedName(name: string): string {
        return `${name.substring(0, 1)}***${name.substring(name.length - 3, name.length)}`;
    }
}
