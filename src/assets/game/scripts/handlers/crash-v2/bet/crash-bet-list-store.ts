import { GameCrashServiceMessage, LeaderBoardPlayer } from "@sg/game-client-base/dist/game-crash";
import inversify from "inversify";
import * as _ from "lodash";
import mobx from "mobx";
import { ICrashBetResponse, MainPlayerBetData } from "../interfaces";

const { injectable, inject } = inversify;

export interface ICrashBetList {
    [playerId: string]: GameCrashServiceMessage.CrashOtherPlayer;
}

@injectable()
export class CrashBetListStore {
    private _otherPlayers: LeaderBoardPlayer[] = [];
    private _mainPlayer: GameCrashServiceMessage.CrashOtherPlayer = null;
    private _mainPlayerData: MainPlayerBetData[] = [];

    constructor() {
        mobx.makeAutoObservable(this);
    }

    set otherPlayers(value: LeaderBoardPlayer[]) {
        this._otherPlayers = value;
    }

    get otherPlayers(): LeaderBoardPlayer[] {
        return this._otherPlayers;
    }

    set mainPlayer(value: GameCrashServiceMessage.CrashOtherPlayer) {
        this._mainPlayer = value;
    }

    get mainPlayer(): GameCrashServiceMessage.CrashOtherPlayer {
        return this._mainPlayer;
    }

    set mainPlayerData(value: MainPlayerBetData[]) {
        this._mainPlayerData = value;
    }

    get mainPlayerData(): MainPlayerBetData[] {
        return this._mainPlayerData;
    }

    addAcceptedBet(value: ICrashBetResponse) {
        let cashOutData = new MainPlayerBetData();
        cashOutData.betKey = value.betKey;
        cashOutData.amount = value.endBet;
        let newMainPlayerData = [];
        newMainPlayerData.push(...this.mainPlayerData);
        newMainPlayerData.push(cashOutData);
        this.mainPlayerData = newMainPlayerData;
    }

    updateCashOutData(value: MainPlayerBetData) {
        let cashOut = this.mainPlayerData.find((element) => element.betKey === value.betKey);
        cashOut.win = value.win;
        cashOut.cashOutWin = value.cashOutWin;
        cashOut.multiplier = value.multiplier;
        cashOut.reachMaxWin = value.reachMaxWin;

        let newMainPlayerData = [];
        newMainPlayerData.push(...this.mainPlayerData);
        this.mainPlayerData = newMainPlayerData;
    }

    updatePlayerName(name: string) {
        this._mainPlayerData.forEach((element) => {
            element.name = name;
        });
    }

    private groupPlayersByName(playerList: any) {
        const playerByGroup = _.groupBy(playerList, (item) => item.name);
        return Object.keys(playerByGroup).length;
    }

    get noOfPlayerBet(): number {
        const countMainPlayer = this.mainPlayer ? 1 : 0;
        return this.groupPlayersByName(this.otherPlayers) + countMainPlayer;
    }

    get noOfPlayerCashOut(): number {
        const players = [];
        this.otherPlayers.forEach((player: LeaderBoardPlayer) => {
            player.win > 0 && players.push(player);
        });
        const countMainPlayer = this.mainPlayer?.cashOut || this.mainPlayer?.halfCashOut ? 1 : 0;
        return this.groupPlayersByName(players) + countMainPlayer;
    }

    get totalCashOut(): number {
        let otherPlayersCashOut = 0;

        this.otherPlayers.forEach((player) => {
            otherPlayersCashOut += player.win;
        });

        const mainPlayerCashOut = (this.mainPlayer?.cashOut?.win ?? 0) + (this.mainPlayer?.halfCashOut?.win ?? 0);

        return otherPlayersCashOut + mainPlayerCashOut;
    }
}
