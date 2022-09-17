import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

const declarations = [ AppComponent ];
const imports = [ BrowserModule, AppRoutingModule ];
const bootstrap = [ AppComponent ];

@NgModule({ declarations, imports, bootstrap })
export class AppModule { }
