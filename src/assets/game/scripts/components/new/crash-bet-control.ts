import gc from "@sg/game-client-base";
import { _decorator, Button, EditBox, Label, Node, Toggle, warn } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";
import Observer from "observer";
import { BetControlStore } from "../../handlers/crash-v2/bet/bet-control-store";
import { ButtonState, IBetControlSettings } from "../../handlers/crash-v2/interfaces";
import { CrashBetHandler } from "../../handlers/override/crash-bet-handler";
import { InputValueItem } from "./input-value-item";

const { Connection } = gc;
const { ccclass, property } = _decorator;
const { observer, render, handle } = Observer;

@ccclass("CrashBetControl")
export default class CrashBetControl extends ObserverComponent {
    @property(Toggle)
    toggleAutoBet: Toggle = null;

    @property(Toggle)
    toggleAutoCashOut: Toggle = null;

    @property(EditBox)
    inputBetAmount: EditBox = null;

    @property(EditBox)
    inputCashOutAt: EditBox = null;

    @property(Node)
    nodePlaceBet: Node = null;

    @property(Node)
    nodeAcceptedBet: Node = null;

    @property(Node)
    nodeCashOut: Node = null;

    @property(Node)
    nodeBetNextRound: Node = null;

    @property(Node)
    nodeWaitingNextRound: Node = null;

    @property(Label)
    labelCashOutValue: Label = null;

    @property(Label)
    labelBetValue: Label = null;

    @property(Node)
    nodeInputValues: Node = null;

    @property(Node)
    nodePreventInput: Node = null;

    betKey = 0;

    @handle(CrashBetHandler, (handler, betKey: number) => handler.callBet(betKey))
    onClickBet() {
        return this.betKey;
    }

    @handle(CrashBetHandler, (handler, betKey: number) => handler.callCashOut(betKey))
    onClickCashOut() {
        return this.betKey;
    }

    @handle(CrashBetHandler, (handler, betKey: number) => handler.setEarlyBet(betKey))
    onClickBetNextRound() {
        return this.betKey;
    }

    @handle(CrashBetHandler, (handler, betKey: number) => handler.cancelEarlyBet(betKey))
    onClickCancelEarlyBet() {
        return this.betKey;
    }

    @handle(CrashBetHandler, (handler, betKey: number) => handler.toggleAutoBet(betKey))
    onToggleAutoBet() {
        return this.betKey;
    }

    @handle(BetControlStore, (handler, betKey: number) => handler.toggleAutoCashOut(betKey))
    onToggleAutoCashOut() {
        return this.betKey;
    }

    renderBetState(state: string) {
        this.nodeCashOut.active = state === ButtonState.CASH_OUT;

        this.nodeAcceptedBet.active = state === ButtonState.BET_ACCEPTED;
        this.nodePlaceBet.active = state === ButtonState.PLACE_BET;
        this.nodePlaceBet.parent.active = this.nodePlaceBet.active || this.nodeAcceptedBet.active;

        this.nodeBetNextRound.active = state === ButtonState.BET_NEXT_ROUND;
        this.nodeWaitingNextRound.active = state === ButtonState.CANCEL_BET;
        this.nodeBetNextRound.parent.active = this.nodeWaitingNextRound.active || this.nodeBetNextRound.active;

        const disableInput = state === ButtonState.BET_ACCEPTED || state === ButtonState.CASH_OUT;
        this.nodePreventInput.active = disableInput;
    }

    renderSetting(setting: IBetControlSettings) {
        this.toggleAutoBet.isChecked = setting.autoBet;
        this.toggleAutoCashOut.isChecked = setting.autoCashOut;
        const betValue = gc.FormatUtils.numberWithCommas(setting.amount, 2);
        this.inputBetAmount.string = betValue;
        this.labelBetValue.string = betValue;
        this.inputBetAmount.placeholder = betValue;
        this.inputCashOutAt.string = `${gc.FormatUtils.numberWithCommas(setting.cashOutAt, 2, false)}x`;
        this.inputCashOutAt.placeholder = this.inputCashOutAt.string;
    }

    onLoad() {
        this.inputBetAmount.node.on(EditBox.EventType.EDITING_DID_ENDED, this.onEditEndBetAmount, this);
        this.inputBetAmount.node.on(EditBox.EventType.EDITING_DID_BEGAN, this.onEditBegin, this);
        this.inputCashOutAt.node.on(EditBox.EventType.EDITING_DID_ENDED, this.onEditEndBetCashOutAt, this);
        this.inputCashOutAt.node.on(EditBox.EventType.EDITING_DID_BEGAN, this.onEditBegin, this);

        this.nodeInputValues.children.forEach((child, index) => {
            child.on(Button.EventType.CLICK, () => {
                this.onClickInputValue(index);
            });
        });
        super.onLoad();
    }

    onEditBegin(editBox: EditBox) {
        const text = editBox.string;
        const cleanText = text.replace(/,/g, "");
        const numValue = Number(cleanText);
        editBox.string = numValue.toString();
        editBox.placeholder = numValue.toString();
    }

    onEditEndBetAmount(editBox: EditBox) {
        try {
            const value = Number(editBox.string);
            this.setValidBetAmount(value);
        } catch (error) {
            warn("input bet amount error ----------------- ", editBox.string);
        }
    }

    onEditEndBetCashOutAt(editBox: EditBox) {
        try {
            const value = Number(editBox.string);
            this.setValidCashOutAt(value);
        } catch (error) {
            warn("input cash out at error ----------------- ", editBox.string);
        }
    }

    @handle(BetControlStore, (handler, data: { betKey: number; amount: number }) => handler.setValidBetAmount(data.betKey, data.amount))
    setValidBetAmount(value: number) {
        return {
            betKey: this.betKey,
            amount: value,
        };
    }

    @handle(BetControlStore, (handler, data: { betKey: number; cashOutAt: number }) =>
        handler.setValidCashOutAt(data.betKey, data.cashOutAt)
    )
    setValidCashOutAt(value: number) {
        return {
            betKey: this.betKey,
            cashOutAt: value,
        };
    }

    renderCashOutValue(value: number) {
        this.labelCashOutValue.string = gc.FormatUtils.numberWithCommas(value, 2, false);
    }

    renderInputValues(values: number[]) {
        this.nodeInputValues.children.forEach((child, index) => {
            const item = child.getComponent(InputValueItem);
            if (index < values.length) {
                item.setValue(values[index]);
            }
        });
    }

    @handle(BetControlStore, (handler, data: { betKey: number; index: number }) => handler.selectBetInput(data.betKey, data.index))
    onClickInputValue(index: number) {
        return {
            betKey: this.betKey,
            index: index,
        };
    }

    @handle(BetControlStore, (handler, data: { betKey: number; increase: boolean }) => handler.changeBetAmount(data.betKey, data.increase))
    onClickInreaseBet() {
        return {
            betKey: this.betKey,
            increase: true,
        };
    }

    @handle(BetControlStore, (handler, data: { betKey: number; increase: boolean }) => handler.changeBetAmount(data.betKey, data.increase))
    onClickDecreaseBet() {
        return {
            betKey: this.betKey,
            increase: false,
        };
    }
}
