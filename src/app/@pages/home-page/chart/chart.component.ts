import { Component, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';
import { createChart } from 'lightweight-charts';
import { chartOptions, ChartService, ECANDLES, EINTERVALS, EMARKETS } from 'src/app/@core/services/chart.service';
import { DataService, IData } from 'src/app/@core/services/data.service';
import { IIndicator, IndicatorsService } from 'src/app/@core/services/indicators.service';
import { SeriesService } from 'src/app/@core/services/series.service';

@Component({
    selector: 'chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss'],
})

export class ChartComponent implements OnInit {
    @HostListener('window:resize', ['$event'])
    private onResize = (event: any) => {
        const { offsetWidth, offsetHeight } = this.chartContainer;
        if (this.chartService.chart) this.chartService.chart.resize(offsetWidth, offsetHeight, true)
    }

    public isIndicatorWindowsOpened: boolean = false;

    constructor(
        private elRef: ElementRef,
        private renderer2: Renderer2,
        private chartService: ChartService,
        private seriesService: SeriesService,
        private dataService: DataService,
        private indicatorsService: IndicatorsService,
    ) {}

    get chartContainer() {
        return this.elRef.nativeElement.childNodes[0];
    }

    get marketsList() {
        return Object.values(EMARKETS);
    }

    get intervalsList() {
        return Object.values(EINTERVALS);
    }

    
    get loadingData() {
        return this.dataService.inProcess;
    }

    get indicators() {
        return this.indicatorsService.indicators;
    }

    ngOnInit(): void {
        this.createChart();
        this.dataService.chartData$.subscribe(d => {
            this.seriesService.onDataChange(d);
            this.indicatorsService.onDataChange(d);
        });

        this.dataService.lastCandleData$.subscribe((d) => {
            if (!d) return;
            const existingData = this.dataService.chartData;
            const series = this.seriesService.candleStickseries;
            if (!series) return;
            console.log(d);
            if (d.isClosed) {
                const newData = [...existingData, d];
                this.dataService.chartData = newData;
            } else {
                series.update(d)
            }
        });
    }

    private createChart() {
        const childNode = this.chartContainer.childNodes[1];
        if (childNode) this.renderer2.removeChild(this.chartContainer, childNode);
        this.seriesService.removeExistingSeries();
        const chart = createChart(this.chartContainer, chartOptions);
        this.chartService.createChart(chart);
    }

    onIntervalChange(value: string) {
        this.chartService.selectedInterval = value as EINTERVALS;
        this.createChart();
    }

    onMarketChange(value: string) {
        this.chartService.selectedMarket = value as EMARKETS;
        this.createChart();
    }

    onCandlesChange(value: string) {
        this.chartService.selectedCandlesType = value as ECANDLES;
        this.seriesService.reloadCandles();
    }

    toggleIndicatorWindow() {
        this.isIndicatorWindowsOpened = !this.isIndicatorWindowsOpened;
    }

    changeIndicatorValue(event: any, indicator: IIndicator) {
        const value = parseFloat(event.target.value);
        this.indicatorsService.changeLineIndicatorValue(indicator, value);
    }
}
