import { _decorator, Color, Component } from "cc";
const { ccclass, property } = _decorator;

export class CrashUtils extends Component {
    static getMultiplierIndex(multiplier: number): number {
        const thresholds = [2, 5, 10];
        const index = thresholds.findIndex((threshold) => multiplier <= threshold);
        return index === -1 ? thresholds.length : index;
    }

    static getMultiplierColor(multiplier: number): Color {
        if (multiplier < 1) return new Color().fromHEX("E6E5DF");
        if (multiplier <= 2) return new Color().fromHEX("01d8ff");
        if (multiplier <= 5) return new Color().fromHEX("7b32f3");
        if (multiplier < 10) return new Color().fromHEX("ff9601");
        return new Color().fromHEX("ff010d");
    }

    static encryptedName(name: string): string {
        return `${name.substring(0, 1)}***${name.substring(name.length - 3, name.length)}`;
    }
}
