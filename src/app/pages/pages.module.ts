import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { NbButtonModule, NbCardModule, NbInputModule, NbSpinnerModule, NbToastrModule } from '@nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ConceptsComponent } from './2-1-CONCEPTS/concepts.component';



@NgModule({
  declarations: [
    PagesComponent,
    ConceptsComponent
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
    NbCardModule,
    NbButtonModule,
    NbInputModule,
    
  ]
})
export class PagesModule { }
