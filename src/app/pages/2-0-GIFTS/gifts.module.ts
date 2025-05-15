import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NbAccordionModule,NbDatepickerModule,NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbSpinnerModule, NbTabsetModule, NbThemeModule, NbToastrModule, NbListModule, NbSelectModule, NbFormFieldModule, NbToggleModule } from '@nebular/theme';
import { GiftsComponent } from './gifts.component';
import { GiftsRoutingModule } from './gifts-routing.module';



@NgModule({
  declarations: [
    GiftsComponent
  ],
  imports: [
    FormsModule,
    NbAccordionModule,
    NbFormFieldModule,
    ReactiveFormsModule, 
    CommonModule,
    GiftsRoutingModule,
    NbDatepickerModule,
    NbListModule,
    NbThemeModule.forRoot(),
    NbThemeModule,
    NbInputModule,
    NbCardModule,
    NbButtonModule,
    NbSpinnerModule,
    NbIconModule,
    NbTabsetModule,
    NbSelectModule,
    NbToggleModule,
    NbToastrModule.forRoot()
  ]
})
export class GiftsModule { }
