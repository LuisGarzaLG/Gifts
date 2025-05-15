import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConceptsRoutingModule } from './concepts-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbAccordionModule, NbButtonModule, NbCardModule, NbDatepickerModule, NbFormFieldModule, NbIconModule, NbInputModule, NbListModule, NbSelectModule, NbSpinnerModule, NbTabsetModule, NbThemeModule, NbToastrModule, NbToggleModule } from '@nebular/theme';
import { GiftsRoutingModule } from '../2-0-GIFTS/gifts-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ConceptsRoutingModule,
    FormsModule,
    NbAccordionModule,
    NbFormFieldModule,
    ReactiveFormsModule, 
    GiftsRoutingModule,
    NbDatepickerModule,
    NbListModule,
    NbThemeModule.forRoot(),
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
export class ConceptsModule { }
