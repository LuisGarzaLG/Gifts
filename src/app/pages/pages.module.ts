import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { NbSpinnerModule, NbToastrModule } from '@nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    PagesComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    NbSpinnerModule,
    ReactiveFormsModule,
    RouterModule,
    PagesRoutingModule,
    HttpClientModule,
    NbToastrModule.forRoot(),
    
  ]
})
export class PagesModule { }
