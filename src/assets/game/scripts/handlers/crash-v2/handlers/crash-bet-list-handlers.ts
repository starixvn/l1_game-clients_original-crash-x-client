import gc from "@sg/game-client-base";
import { GameServiceMessage, IMultipleHandlers } from "@sg/game-client-base/dist/shared";
import inversify from "inversify";
import mobx from "mobx";
import { CrashBetListStore, ICrashBetList } from "../bet/crash-bet-list-store";
import { CrashOwnBets, ICrashBetResponse, MainPlayerBetData } from "../interfaces";
const { injectable, inject } = inversify;

@injectable()
export class CrashBetListHandlers implements IMultipleHandlers {
    @inject(gc.Rounds.RoundTimeStore) protected readonly roundTimeStore: gc.Rounds.RoundTimeStore;
    @inject(gc.Player.MainPlayerStore) protected readonly mainPlayerStore: gc.Player.MainPlayerStore;
    @inject(gc.GameCrash.CrashCashOut.CrashCashOutStore) protected readonly crashCashOutStore: gc.GameCrash.CrashCashOut.CrashCashOutStore;

    @inject(gc.Bet.BetStore) protected readonly betStore: gc.Bet.BetStore;
    @inject(CrashBetListStore) protected readonly betListStore: CrashBetListStore;

    constructor() {
        setTimeout(() => {
            mobx.reaction(() => this.roundTimeStore.isStartRound, this.reactionStartRound.bind(this));
            // mobx.reaction(() => this.betStore.lastReceivedBet, this.reactionLastReceivedBet.bind(this));
            mobx.reaction(() => this.crashCashOutStore.cashOut, this.reactionCashOut.bind(this));
        }, 0);
    }

    private reactionStartRound(isStartRound: boolean) {
        if (!isStartRound) {
            return;
        }

        this.resetLeaderBoard();
    }

    // private reactionLastReceivedBet(lastReceivedBet: gc.Bet.ILastReceivedBet) {
    //     if (!lastReceivedBet || lastReceivedBet.value <= 0) {
    //         return;
    //     }

    //     const player = {
    //         name: this.mainPlayerStore.name,
    //         amount: lastReceivedBet.value,
    //     };
    //     this.betListStore.mainPlayer = player;
    //     this.betListStore.updatePlayerName(this.mainPlayerStore.name);
    // }

    private reactionCashOut(cashOut: MainPlayerBetData) {
        if (!cashOut) {
            return;
        }

        cashOut.name = this.mainPlayerStore.name;
        // remove later
        const { name, amount } = this.betListStore.mainPlayer;
        const player = { name, amount, cashOut };
        this.betListStore.mainPlayer = player;
        // end remove
        this.betListStore.updateCashOutData(cashOut);
    }

    private sortDecreasedBetAmount(betPlayers: gc.GameCrash.LeaderBoardPlayer[]) {
        return betPlayers.sort((player1, player2) => player2.amount - player1.amount);
    }

    private sortByMultiplierBetAmount(newPlayers: gc.GameCrash.LeaderBoardPlayer[]) {
        const cashOutPlayers = this.sortPlayersByMultiplier(newPlayers);
        const notCashOutPlayers = this.sortPlayersByBetAmount(newPlayers);
        cashOutPlayers.push(...notCashOutPlayers);

        return cashOutPlayers;
    }

    private playerHasCashedOut(player: gc.GameCrash.LeaderBoardPlayer) {
        return player.multiplier > 0;
    }

    private sortPlayersByBetAmount(players: gc.GameCrash.LeaderBoardPlayer[]) {
        const list = players.filter((player) => !this.playerHasCashedOut(player));
        return this.sortDecreasedBetAmount(list);
    }

    private sortPlayersByMultiplier(newPlayers: gc.GameCrash.LeaderBoardPlayer[]) {
        const list = newPlayers.filter((player) => this.playerHasCashedOut(player));
        list.sort((player1, player2) => player2.multiplier - player1.multiplier);

        return list;
    }

    private generateLeaderBoardPlayers(data: ICrashBetList): gc.GameCrash.LeaderBoardPlayer[] {
        const players: gc.GameCrash.LeaderBoardPlayer[] = [];
        Object.keys(data).forEach((key) => {
            const player = data[key];

            Object.keys(player).forEach((betkey) => {
                let bet = player[betkey];
                this.generateLeaderBoardPlayer(players, bet);
            });
        });

        return players;
    }

    private generateLeaderBoardPlayer(
        players: gc.GameCrash.LeaderBoardPlayer[],
        player: gc.GameCrash.GameCrashServiceMessage.CrashOtherPlayer
    ) {
        const { amount, rate, halfCashOut, cashOut, playerId, name } = player;
        const newPlayer: gc.GameCrash.LeaderBoardPlayer = {
            playerId,
            name,
            amount,
            win: 0,
            multiplier: 0,
        };

        newPlayer.amount = gc.NumberUtils.getValueByCurrency(amount, this.mainPlayerStore.rate, rate);
        if (cashOut) {
            this.convertAmountAndWinValue(cashOut, rate);
            this.updateCashOutRow(newPlayer, cashOut);
        }
        if (halfCashOut) {
            this.convertAmountAndWinValue(halfCashOut, rate);

            const halfCashOutPlayer = this.updateAmountAndAddHalfCashOut(newPlayer, halfCashOut);
            players.push(halfCashOutPlayer);
        }
        players.push(newPlayer);
    }

    convertAmountAndWinValue(cashOut: gc.GameCrash.GameCrashServiceMessage.CashOutReceive, rate: number) {
        const { amount, win } = cashOut;

        cashOut.win = gc.NumberUtils.getValueByCurrency(win, this.mainPlayerStore.rate, rate);
        cashOut.amount = gc.NumberUtils.getValueByCurrency(amount, this.mainPlayerStore.rate, rate);
    }

    private resetLeaderBoard() {
        this.betListStore.otherPlayers = [];
        this.betListStore.mainPlayer = null;
        this.betListStore.mainPlayerData = [];
    }

    handleNewOtherCashOut(otherPlayer: gc.GameCrash.GameCrashServiceMessage.CrashOtherPlayer) {
        const { playerId, halfCashOut, cashOut, rate } = otherPlayer;
        cashOut && this.convertAmountAndWinValue(cashOut, rate);
        const notCashedOut = this.betListStore.otherPlayers.find(
            (player) => player.playerId === playerId && !this.playerHasCashedOut(player)
        );

        if (!notCashedOut) {
            return;
        }

        if (halfCashOut) {
            const newHalfCashOutPlayer = this.updateAmountAndAddHalfCashOut(notCashedOut, halfCashOut);
            this.betListStore.otherPlayers.push(newHalfCashOutPlayer);
        } else if (cashOut) {
            this.updateCashOutRow(notCashedOut, cashOut);
        }

        this.betListStore.otherPlayers = this.sortByMultiplierBetAmount(this.betListStore.otherPlayers);
    }

    private updateCashOutRow(
        notCashedOutRow: gc.GameCrash.LeaderBoardPlayer,
        cashOut: gc.GameCrash.GameCrashServiceMessage.CashOutReceive
    ) {
        notCashedOutRow.amount = cashOut.amount;
        notCashedOutRow.win = cashOut.win;
        notCashedOutRow.multiplier = cashOut.multiplier;
    }

    private updateAmountAndAddHalfCashOut(
        notCashedOutRow: gc.GameCrash.LeaderBoardPlayer,
        halfCashOut: gc.GameCrash.GameCrashServiceMessage.CashOutReceive
    ) {
        const { amount } = halfCashOut;
        notCashedOutRow.amount = amount;

        return this.createHalfCashOut(notCashedOutRow, halfCashOut);
    }

    private createHalfCashOut(
        notCashedOutRow: gc.GameCrash.LeaderBoardPlayer,
        halfCashOut: gc.GameCrash.GameCrashServiceMessage.CashOutReceive
    ) {
        return { ...notCashedOutRow, ...halfCashOut };
    }

    private handleBetList(betList: ICrashBetList) {
        const list = this.generateLeaderBoardPlayers(betList);
        this.betListStore.otherPlayers = this.sortByMultiplierBetAmount(list);
    }

    private handlePlayerChip(playerChip: GameServiceMessage.PlayerChip) {
        const newPlayerBet: gc.GameCrash.LeaderBoardPlayer = this.convertCurrencyForPlayerChip(playerChip);
        this.betListStore.otherPlayers.push(newPlayerBet);
        this.betListStore.otherPlayers = this.sortPlayersByBetAmount(this.betListStore.otherPlayers);
    }

    private convertCurrencyForPlayerChip(playerChip: GameServiceMessage.PlayerChip): gc.GameCrash.LeaderBoardPlayer {
        const { amount, rate, playerId, name } = playerChip;
        return {
            playerId,
            name,
            amount: gc.NumberUtils.getValueByCurrency(amount, this.mainPlayerStore.rate, rate),
            multiplier: 0,
            win: 0,
        };
    }

    handleResponseByBetKey(betResponseData: ICrashBetResponse) {
        if (betResponseData.endBet > 0) {
            let betData = new MainPlayerBetData();
            betData.name = this.mainPlayerStore.name;
            betData.betKey = betResponseData.betKey;
            betData.amount = betResponseData.endBet;
            this.betListStore.addAcceptedBet(betData);
        }
    }

    handleOwnBets(ownBets: CrashOwnBets) {
        Object.keys(ownBets).forEach((betKey) => {
            const data = ownBets[betKey] as gc.GameCrash.GameCrashServiceMessage.CrashOwnBets;
            let betData = new MainPlayerBetData();
            betData.name = this.mainPlayerStore.name;
            betData.betKey = Number(betKey);
            betData.amount = data.amount;
            if (!data.cashOut && data.cashOut !== undefined) {
                betData.multiplier = data.cashOut?.multiplier;
                betData.win = data.cashOut?.win;
                betData.cashOutWin = data.cashOut?.cashOutWin;
            }
            this.betListStore.addAcceptedBet(betData);
        });
    }

    eventHandleList = [
        {
            name: gc.GameCrash.GameCrashServiceMessage.BetList.eventName,
            handle: this.handleBetList,
        },
        {
            name: gc.GameServiceMessage.PlayerChip.eventName,
            handle: this.handlePlayerChip,
        },
        {
            name: gc.GameCrash.GameCrashServiceMessage.CrashOtherPlayer.eventName,
            handle: this.handleNewOtherCashOut,
        },
    ];
}
