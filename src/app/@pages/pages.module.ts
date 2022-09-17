import { NgModule } from '@angular/core';
import { ErrorPage } from './error-page/error-page.component';
import { HomePage } from './home-page/home-page.component';
import { HomePageModule } from './home-page/home-page.module';

const declarations = [ HomePage, ErrorPage ];
const imports = [ HomePageModule ];
@NgModule({ imports, declarations })
export class PagesModule { }
