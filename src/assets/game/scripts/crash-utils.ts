import { _decorator, Color, Component } from "cc";
const { ccclass, property } = _decorator;

export class CrashUtils extends Component {
    static readonly config = {
        thresholds: [2, 5, 10],
        colors: ["01d8ff", "ff9601", "ff010d", "D608FB"],
        colorNames: ["blue", "orange", "red", "purple"],
        whiteColor: "E6E5DF",
    };

    static getMultiplierIndex(multiplier: number): number {
        const index = CrashUtils.config.thresholds.findIndex((threshold) => multiplier <= threshold);
        return index === -1 ? CrashUtils.config.thresholds.length : index;
    }

    static getMultiplierColor(multiplier: number): Color {
        const index = CrashUtils.getMultiplierIndex(multiplier);
        return new Color().fromHEX(CrashUtils.config.colors[index]);
        // 7b32f3 old purple
        // E6E5DF near white
    }

    static getWhiteColor(): Color {
        return new Color().fromHEX(CrashUtils.config.whiteColor);
    }

    static getMultiplierColorByIndex(index: number): Color {
        return new Color().fromHEX(CrashUtils.config.colors[index]);
    }

    static getMultiplierColorName(index: number): string {
        return CrashUtils.config.colorNames[index];
    }

    static getFontMultiplier(multiplierIndex: number): string {
        return multiplierIndex < CrashUtils.config.colorNames.length
            ? `${CrashUtils.config.colorNames[multiplierIndex]}-number`
            : CrashUtils.config.colorNames[CrashUtils.config.colorNames.length - 1];
    }

    static encryptedName(name: string): string {
        return `${name.substring(0, 1)}***${name.substring(name.length - 3, name.length)}`;
    }
}
