const GAME_NAME = "RocketX";

export const settings = {
    id: 113,
    name: GAME_NAME,
    observerNamespace: GAME_NAME,
    namespaces: [GAME_NAME, "Spaceflight"],
    durations: {
        wholeRound: 14,
        lockingBet: 3,
        placingBet: 10,
        generatingResult: 0,
        startRound: 1,
    },
    numberOfRoundHistory: 7,
    validateBalanceWhenBet: true,
};

