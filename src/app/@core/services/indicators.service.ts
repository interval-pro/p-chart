import { Injectable } from "@angular/core";
import { ISeriesApi, LineStyleOptions, SeriesType } from "lightweight-charts";
import { ChartService } from "./chart.service";
import { IData } from "./data.service";

const emaCalc = (mArray: any[], mRange: number) =>{
    if (!mArray.length) return [];
    var k = 2/(mRange + 1);
    const emaArray = [{time: mArray[0].time, value: mArray[0].close }];
    for (var i = 1; i < mArray.length; i++) {
        const value = mArray[i].close * k + emaArray[i - 1].value * (1 - k);
        emaArray.push({ time: mArray[i].time, value });
    }
    return emaArray.slice(mRange, emaArray.length)
};

export const INDICATORS_LIST = {
    EMA: {
        full: "Exponential Moving Average",
        short: "EMA",
        series: 'LINE',
        code: "EMA",
        payload: emaCalc,
    } as IIndicatorBase,
    SMA: {
        full: "Simple Moving Average",
        short: "SMA",
        series: 'LINE',
        code: "SMA",
        payload: emaCalc,
    } as IIndicatorBase,
};

type TIndicatorSeries = 'LINE';

export interface IIndicatorBase {
    full: string;
    short: string;
    series: TIndicatorSeries;
    code: string;
    payload: (mArray: any[], mRange: number) => any[];
}

export interface IIndicator extends IIndicatorRaw {
    series: ISeriesApi<any>;
}

interface IIndicatorRaw {
    base: IIndicatorBase;
    config: {
        value: number,
    };
    name: string;
    lineStyle: LineStyleOptions,
}

@Injectable({
    providedIn: 'root',
})

export class IndicatorsService {
    private _indicators: IIndicator[] = [];

    get indicators() {
        return this._indicators;
    }

    set indicators(value: IIndicator[]) {
        this._indicators = value;
    }

    constructor(
        private chartService: ChartService,
    ) {}

    onDataChange(data: IData[]) {
        console.log(`On Data Change`)
    }

    private createSeries(indicator: IIndicatorRaw) {
        if (!this.chartService.chart) return null;
        return indicator.base.series === "LINE"
            ? this.chartService.chart.addLineSeries(indicator.lineStyle)
            : null;
    };

    addIndicator(indicatorConfig: IIndicatorRaw) {
        const indicator = this.buildIndicator(indicatorConfig);
        if (!indicator) return;
        this.indicators = [...this.indicators, indicator];
    }

    editIndicator() {

    }

    private buildIndicator(rawIndicator: IIndicatorRaw) {
        const series = this.createSeries(rawIndicator);
        if (!series) return;
        const candlesData = this.chartService.chartData;
        const seriesData = rawIndicator.base.payload(candlesData, rawIndicator.config.value)
        series.setData(seriesData);
        const indicator: IIndicator = { ...rawIndicator, series };
        return indicator;
    }

    changeLineIndicatorValue(indicator: IIndicator, value: number) {
        const candlesData = this.chartService.chartData;
        const seriesData = indicator.base.payload(candlesData, value);
        indicator.config.value = value;
        indicator.series.setData(seriesData);
    }
}