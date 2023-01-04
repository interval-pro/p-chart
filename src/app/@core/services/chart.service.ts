import { Injectable } from "@angular/core";
import { ChartOptions, DeepPartial, IChartApi } from "lightweight-charts";
import { DataService } from "./data.service";

export enum ECANDLES {
    CANDLES = "CANDLES",
    HEIKIN_ASHI= "HEIKIN_ASHI",
}

export enum EMARKETS {
    BTCUSDT = "BTCUSDT",
    ETHUSDT = "ETHUSDT",
    ADAUSDT = "ADAUSDT",
    LTCUSDT = "LTCUSDT",
    ETCUSDT = "ETCUSDT",
    ETHBTC = "ETHBTC",
}

export enum EINTERVALS {
    "1m" = "1m",
    "3m" = "3m",
    "5m" = "5m",
    "15m" = "15m",
    "30m" = "30m",
    "1h" = "1h",
    "2h" = "2h",
    "4h" = "4h",
    "6h" = "6h",
    "8h" = "8h",
    "12h" = "12h",
    "1d" = "1d",
    "3d" = "3d",
    "1w" = "1w",
    "1M" = "1M",
}

export const chartOptions: DeepPartial<ChartOptions> = {
    watermark: {
        color: "rgba(255, 255, 255, 0.1)",
        text: "P-Chart",
        visible: true,
        fontSize: 120,
        fontFamily: 'PlovdivSans',
    },
    layout: {
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        textColor: "rgba(255,255,255,0.9)",
    },
    grid: {
        vertLines: {
            color: "rgba(255, 255, 255, 0.2)"
        },
        horzLines: {
            color: "rgba(255, 255, 255, 0.2)"
        }
    },
    crosshair: {
        mode: 0,
    },
    timeScale: {
        rightOffset: 50,
        tickMarkFormatter: (t: any) => {
            const date = new Date(parseFloat(`${t}000`)).toString();
            const arr = date.split(" ");
            const month = arr[1];
            const day = arr[2];
            const hours = arr[4].split(":")
            return `${day} ${month} ${hours[0]}:${hours[1]}`
        }
    }
};

@Injectable({
    providedIn: 'root',
})

export class ChartService {
    private _chart: IChartApi | undefined;
    selectedInterval: EINTERVALS = EINTERVALS["1h"];
    selectedMarket: EMARKETS = EMARKETS.ETHUSDT;
    selectedCandlesType: ECANDLES = ECANDLES.CANDLES;

    constructor(
        private dataService: DataService,
    ) {}

    
    get chart() {
        return this._chart;
    }

    private set chart(chart: IChartApi | undefined) {
        this._chart = chart;
    }

    get chartData() {
        return this.dataService.chartData;
    }

    createChart(chart: IChartApi) {
        this.chart = chart;
        this.dataService.retrieveData(this.selectedMarket, this.selectedInterval);
        this.chart.timeScale()
            .subscribeVisibleTimeRangeChange((timeRange) => {
                if (!timeRange) return;
                const { from, to } = timeRange;
                const firstCandleTime = this.dataService.chartData?.[0]?.time;
                if (firstCandleTime === from) {
                    this.dataService.retrieveData(this.selectedMarket, this.selectedInterval, false);
                }
            });
    }
}