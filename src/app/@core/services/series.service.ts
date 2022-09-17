import { Injectable } from "@angular/core";
import { CandlestickData, ISeriesApi } from "lightweight-charts";
import { ChartService, ECANDLES } from "./chart.service";
import { IData } from "./data.service";

const safeNumber = (n: number, d: number = 8) => parseFloat(n.toFixed(d)); 

const standartCandlesMap: (d: IData) => CandlestickData =
     ({ time, open, close, high, low }) => ({time, open, close, high, low});

const heikinAshiMap: (d: IData, i: number, arr: IData[]) => CandlestickData
    = (d: IData, i: number, arr: IData[]) => {
        const prev = arr[i - 1] || d;
        const close = safeNumber((d.open + d.high + d.low + d.close) / 4)
        const open = safeNumber((prev.open + prev.close) / 2);
        d.open = open;
        d.close = close
        const high = Math.max(d.high, d.open, d.close);
        const low = Math.min(d.low, d.open, d.close);
        const time = d.time;
        return { time, open, close, high, low };
    };

const blueAndWhiteCandlesOption = {
    upColor: '#5b9cf6',
    borderUpColor: '#5b9cf6',
    wickUpColor: '#5b9cf6',
    downColor: '#d1d4dc',
    borderDownColor: '#d1d4dc',
    wickDownColor: '#d1d4dc',
};

const greenAndRedCandlesOption = {
    upColor: '#22ab94',
    borderUpColor: '#22ab94',
    wickUpColor: '#22ab94',
    downColor: '#ef5350',
    borderDownColor: '#ef5350',
    wickDownColor: '#ef5350',
};

@Injectable({
    providedIn: 'root',
})

export class SeriesService {
    private _candleStickseries: ISeriesApi<"Candlestick"> | null = null;

    constructor(
        private chartService: ChartService,
    ) {}

    onDataChange(data: IData[]) {
        this.addCandleData(data);
    }

    get chart() {
        return this.chartService.chart;
    }

    get candleStickseries() {
        return this._candleStickseries;
    }

    private set candleStickseries(candles: ISeriesApi<"Candlestick"> | null) {
        this._candleStickseries = candles;
    }

    private addCandleData(_data: IData[]) {
        if (!this.chart) return;
        const mapFunction = this.chartService.selectedCandlesType === ECANDLES.CANDLES
            ? standartCandlesMap
            : heikinAshiMap;

        const data = JSON.parse(JSON.stringify(_data)).map(mapFunction);

        const candlesColorScheme = this.chartService.selectedCandlesType === ECANDLES.CANDLES
            ? blueAndWhiteCandlesOption 
            : greenAndRedCandlesOption;

        !this.candleStickseries
            ? this.candleStickseries = this.chart.addCandlestickSeries(candlesColorScheme)
            : this.candleStickseries.applyOptions(candlesColorScheme);

        this.candleStickseries?.setData(data);
    }

    reloadCandles() {
        this.addCandleData(this.chartService.chartData);
    }

    removeExistingSeries() {
        this.candleStickseries = null;
    }
}