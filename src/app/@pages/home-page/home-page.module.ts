import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ChartComponent } from './chart/chart.component';

const COMPONENTS = [ ChartComponent ];

const declarations = [ ...COMPONENTS ];
const exports = [ ...COMPONENTS ];
const imports = [ CommonModule ];
@NgModule({ declarations, exports, imports })
export class HomePageModule { }
