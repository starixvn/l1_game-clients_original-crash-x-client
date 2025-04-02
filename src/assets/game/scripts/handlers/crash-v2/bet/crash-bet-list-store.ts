import { GameCrashServiceMessage, LeaderBoardPlayer } from "@sg/game-client-base/dist/game-crash";
import inversify from "inversify";
import * as _ from "lodash";
import mobx from "mobx";
import { MainPlayerBetData } from "../interfaces";

const { injectable, inject } = inversify;

export interface ICrashBetList {
    [playerId: string]: ICrashBetListDetail;
}

export interface ICrashBetListDetail {
    [betKey: number]: GameCrashServiceMessage.CrashOtherPlayer;
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

    addAcceptedBet(acceptedBetData: MainPlayerBetData) {
        let newMainPlayerData = [];
        newMainPlayerData.push(...this.mainPlayerData);
        newMainPlayerData.push(acceptedBetData);
        this.mainPlayerData = newMainPlayerData;

        if (this.mainPlayer === null || this.mainPlayer === undefined) {
            let name = acceptedBetData.name;
            let amount = acceptedBetData.amount;
            let player = { name, amount };
            this.mainPlayer = player;
        }
    }

    updateCashOutData(cashOutData: MainPlayerBetData) {
        let cashOut = this.mainPlayerData.find((element) => element.betKey === cashOutData.betKey);
        if (cashOut != undefined) {
            cashOut.win = cashOutData.win;
            cashOut.cashOutWin = cashOutData.cashOutWin;
            cashOut.multiplier = cashOutData.multiplier;
            cashOut.reachMaxWin = cashOutData.reachMaxWin;
        }

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
