import { _decorator, Button, Component, Label, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("BetWinCell")
export class BetWinCell extends Component {
    @property(Label)
    lblWin: Label = null;

    @property(Button)
    btnReachMaxWin: Button = null;

    onLoad() {
        this.btnReachMaxWin.node.getComponentInChildren(Button).node.active = false;
        this.btnReachMaxWin.node.on(Node.EventType.MOUSE_ENTER, this.onHover, this);

        this.btnReachMaxWin.node.on(Node.EventType.MOUSE_LEAVE, this.onExitHover, this);
    }
    onDestroy() {
        if (this.btnReachMaxWin.node !== null) {
            this.btnReachMaxWin.node.off(Node.EventType.MOUSE_ENTER, this.onHover, this);
            this.btnReachMaxWin.node.off(Node.EventType.MOUSE_LEAVE, this.onExitHover, this);
        }
    }

    onHover() {
        this.btnReachMaxWin.node.getComponentInChildren(Button).node.active = true;
    }

    onExitHover() {
        this.btnReachMaxWin.node.getComponentInChildren(Button).node.active = false;
    }

    setData(amount: number, isReachMaxWin: boolean) {
        this.lblWin.string = amount.toString();
        this.btnReachMaxWin.node.active = isReachMaxWin;
        if (!isReachMaxWin) {
            this.lblWin.node.setPosition(0, 0);
        }
    }
}
