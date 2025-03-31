import { _decorator } from "cc";
import { startGame } from "db://shared-components/shared/scripts/startup";
import Observer from "observer";

import GameCrashComponent from "../../../../extensions/shared-components/assets/game-crash/scripts/components/game-crash-component";
import { siteConfigs } from "../../../scripts/site-configs";
import { containerOptions, settings } from "../game-settings";
import { CrashBetHandler } from "../handlers/override/crash-bet-handler";
import "./../../../resources/i18n";

startGame(settings.name, containerOptions, siteConfigs);

const { ccclass } = _decorator;
const { observer, handle } = Observer;

@ccclass
@observer(settings.name)
export default class Game extends GameCrashComponent {
    override namespace = settings.name;
    override containerOptions = containerOptions;

    onHideGame() {
        this.stopAutoBet();
        super.onHideGame();
    }

    @handle(CrashBetHandler, (handler) => handler.stopAutoBet())
    stopAutoBet() {}
}
