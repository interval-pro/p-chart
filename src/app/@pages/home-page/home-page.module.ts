import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartComponent } from './chart/chart.component';
import { IndicatorsWindowsComponent } from './indicators-windows/indicators-windows.component';

const COMPONENTS = [
    ChartComponent,
    IndicatorsWindowsComponent,
];

const declarations = [ ...COMPONENTS ];
const exports = [ ...COMPONENTS ];
const imports = [ CommonModule, FormsModule ];
@NgModule({ declarations, exports, imports })
export class HomePageModule { }
