import { AfterViewInit, Component, EventEmitter, NgZone, OnInit, Output } from '@angular/core';
import { LineStyleOptions } from 'lightweight-charts';
import { IIndicatorBase, IndicatorsService, INDICATORS_LIST } from 'src/app/@core/services/indicators.service';

@Component({
    selector: "indicators-windows",
    templateUrl: './indicators-windows.component.html',
    styleUrls: ['./indicators-windows.component.scss'],
})

export class IndicatorsWindowsComponent  {
    @Output() onClose = new EventEmitter();

    _selectedIndicatorIndex: number = -1;
    selectedIndicatorCode: string = 'EMA';
    indicatorName: string = `Indicator ${this.indicators.length + 1}`;
    indicatorValue: number = 7;
    indicatorLineWidth: number = 3;
    indicatorLineColor: string = 'red';

    constructor(
        private indicatorsService: IndicatorsService,
    ) {}


    get selectedIndicatorIndex() {
        return this._selectedIndicatorIndex;
    }

    set selectedIndicatorIndex(_value: number) {
        const value = typeof _value === "number" ? _value : parseFloat(_value);
        this._selectedIndicatorIndex = value;
        this.onIndicatorChange(value);
    }

    get indicatorsTypeList() {
        return INDICATORS_LIST;
    }

    get indicators() {
        return this.indicatorsService.indicators;
    }

    onIndicatorChange(index: number) {
        if (index === -1) {
            this.indicatorName = `Indicator N${this.indicators.length + 1}`;
            this.selectedIndicatorCode = `EMA`;
        } else {
            const selectedIndicator = this.indicators[index];
            if (!selectedIndicator) return;
            this.indicatorName = selectedIndicator.name;
            this.selectedIndicatorCode = selectedIndicator.base.code;
        }
    }

    preventAll(event: any) {
        event.stopPropagation();
    }

    addIndicator() {
        const code = this.selectedIndicatorCode;
        const base = Object.values(INDICATORS_LIST).find(i => i.code === code);
        if (!base) return;
        const config = { value: this.indicatorValue };
        const name = this.indicatorName;
        const lineStyle = {
            color: this.indicatorLineColor,
            lineWidth: this.indicatorLineWidth,
        } as LineStyleOptions;
        const indicator = { base, config, name, lineStyle };
        this.indicatorsService.addIndicator(indicator);
        this.closeWindow();
    }


    editIndicator() {
        const selectedIndicator = this.indicators[this.selectedIndicatorIndex];
        if (!selectedIndicator) return;
        // this.indicatorsService.editIndicator();
    }

    closeWindow() {
        this.onClose.emit();
    }
}
