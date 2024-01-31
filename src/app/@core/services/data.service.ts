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
    isClosed: boolean;
};

@Injectable({
    providedIn: 'root',
})

export class DataService {
    private _inProcess: boolean = false;
    private _chartData: IData[] = [];
    private lastCandleData: IData | null= null;
    private lastCandleWS: WebSocket | null = null;

    public chartData$: BehaviorSubject<IData[]> = new BehaviorSubject(this.chartData);
    public lastCandleData$: BehaviorSubject<IData | null> = new BehaviorSubject(this.lastCandleData);

    constructor(
        private binanceApiService: BinanceApiService,
    ) {}

    get chartData() {
        return this._chartData;
    }

    set chartData(candles: IData[]) {
        this._chartData = candles;
        this.chartData$.next(candles);
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
        this.chartData = !firstCandleTime ? [...data] : [...data, ...this.chartData];
        
        if (getFirst) this.subscribeToLast(symbol, interval);
        this.inProcess = false;
    }

    private subscribeToLast(symbol: string, interval: string) {
        if (this.lastCandleWS) {
            this.lastCandleWS.close();
            this.lastCandleWS = null;
        }
        this.lastCandleWS = this.binanceApiService.getCnadlesSocketData(symbol, interval);
        this.lastCandleWS.onmessage = (event: any) => {
            try {
                const eventData = JSON.parse(event.data);
                if (!eventData) throw new Error("Error Parsing Data. Code 1");
                const data = eventData.k;
                if (!data) throw new Error("Error Parsing Data. Code 2");
                const parsedData = {
                    time: data.t / 1000,
                    open: data.o * 1,
                    high: data.h * 1,
                    low: data.l * 1,
                    close: data.c * 1,
                    volume: data.V * 1,
                    isClosed: +data.x,
                } as any;

                if (!parsedData) throw new Error("Error Parsing Data. Code 3");
                this.lastCandleData = parsedData as IData;
                this.lastCandleData$.next(parsedData);
            } catch (error) {
                console.log(error);
            }
        }
    }

    private binanceCandlesMapping(d: any) {
        return {
            time: d[0] / 1000,
            open: d[1] * 1,
            high: d[2] * 1,
            low: d[3] * 1,
            close: d[4] * 1,
            volume: d[5] * 1,
            isClosed: 1,
        }
    };
}
