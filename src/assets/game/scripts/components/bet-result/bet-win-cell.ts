import { _decorator, Button, Color, Component, Label } from "cc";
const { ccclass, property } = _decorator;

@ccclass("BetWinCell")
export class BetWinCell extends Component {
    @property(Label)
    lblWin: Label = null;

    @property(Button)
    btnReachMaxWin: Button = null;

    setData(amount: string, isReachMaxWin: boolean) {
        this.lblWin.string = amount;
        this.lblWin.color = new Color().fromHEX("F1E344");
        this.btnReachMaxWin.node.active = isReachMaxWin;
        if (!isReachMaxWin) {
            this.lblWin.node.setPosition(0, 0);
        }
    }
}
