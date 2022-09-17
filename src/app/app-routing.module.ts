import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorPage } from './@pages/error-page/error-page.component';
import { HomePage } from './@pages/home-page/home-page.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: '**',
    component: ErrorPage,
  }
];

const imports = [ RouterModule.forRoot(routes) ];
const exports = [ RouterModule ];

@NgModule({ imports, exports })
export class AppRoutingModule { }
