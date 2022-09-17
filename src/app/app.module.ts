import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { FullChartLayout } from './@layouts/full-chart/full-chart.layout';
import { PagesModule } from './@pages/pages.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

const imports = [ BrowserModule, AppRoutingModule, PagesModule, HttpClientModule ];
const declarations = [ AppComponent, FullChartLayout ];
const bootstrap = [ AppComponent ];
@NgModule({ declarations, imports, bootstrap })
export class AppModule { }
