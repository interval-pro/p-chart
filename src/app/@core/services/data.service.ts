import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { BinanceApiService } from "../api/binance.api";

export interface IData {
    time: string;
    close: number;
    open: number;
    high: number;
    low: number;
    volume: number;
};

@Injectable({
    providedIn: 'root',
})

export class DataService {
    private _inProcess: boolean = false;
    private _chartData: IData[] = [];
    public chartData$: BehaviorSubject<IData[]> = new BehaviorSubject(this.chartData);

    constructor(
        private binanceApiService: BinanceApiService,
    ) {}

    get chartData() {
        return this._chartData;
    }

    set chartData(candles: IData[]) {
        this.chartData$.next(candles);
        this._chartData = candles;
    }

    get inProcess() {
        return this._inProcess;
    }

    private set inProcess(value: boolean) {
        this._inProcess = value;
    }

    async retrieveData(symbol: string, interval: string, getFirst: boolean = true) {
        if (this.inProcess) return;
        this.inProcess = true;
        const firstCandleTime = !getFirst && this.chartData[0]
            ? this.chartData?.[0]?.time ? +`${this.chartData?.[0]?.time}000` : undefined
            : undefined;
        const data = await this.binanceApiService.getCandlesData(symbol, interval, firstCandleTime)
            .then(data => data.map(this.binanceCandlesMapping))
            .catch(() => []);
        this.chartData = !firstCandleTime ? data : [...data, ...this.chartData];
        this.inProcess = false;
    }

    private binanceCandlesMapping(d: any) {
        return {
            time: d[0] / 1000,
            open: d[1] * 1,
            high: d[2] * 1,
            low: d[3] * 1,
            close: d[4] * 1,
            volume: d[5] * 1,
        }
    };
}
