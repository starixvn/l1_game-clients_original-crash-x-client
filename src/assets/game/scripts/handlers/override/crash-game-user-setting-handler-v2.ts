import gc from "@sg/game-client-base";
import inversify from "inversify";
const { injectable, inject } = inversify;
@injectable()
export class GameCrashUserSettingHandlerV2 extends gc.GameCrash.CrashGameUserSetting.GameCrashUserSettingHandler {

    saveTempStorage() { }
}
