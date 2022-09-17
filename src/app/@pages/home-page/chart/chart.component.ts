import { Component, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';
import { createChart } from 'lightweight-charts';
import { chartOptions, ChartService, ECANDLES, EINTERVALS, EMARKETS } from 'src/app/@core/services/chart.service';
import { DataService } from 'src/app/@core/services/data.service';
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

    constructor(
        private elRef: ElementRef,
        private renderer2: Renderer2,
        private chartService: ChartService,
        private seriesService: SeriesService,
        private dataService: DataService,
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

    ngOnInit(): void {
        this.createChart();
        this.dataService.chartData$.subscribe(d => this.seriesService.onDataChange(d));
    }

    private createChart() {
        if (this.chartContainer.childNodes[1]) {
            this.renderer2.removeChild(this.chartContainer, this.chartContainer.childNodes[1]);
        }
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
}
