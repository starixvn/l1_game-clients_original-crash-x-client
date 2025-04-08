export enum PeriodType {
    Monthly = 0,
    Yearly = 1,
}   

export class APISettings {
    static readonly TopWinMonthly = 
    {
        periodType: PeriodType.Monthly,
        url: "top-stats/monthly-top-cashout?gameId=",
    }

    static readonly TopWinYearly = 
    {
        periodType: PeriodType.Yearly,
        url: "top-stats/yearly-top-cashout?gameId=",
    }

    static readonly TopCrashMonthly = 
    {
        periodType: PeriodType.Monthly,
        url: "top-stats/monthly-top-results?gameId=",
    }

    static readonly TopCrashYearly = 
    {
        periodType: PeriodType.Yearly,
        url: "top-stats/yearly-top-results?gameId=",
    }
    
}

