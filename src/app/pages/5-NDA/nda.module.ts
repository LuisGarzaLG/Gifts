import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OvertimeRoutingModule } from '../3-OVERTIME/overtime-routing.module';
import { NdaComponent } from './nda.component';
import { NbDatepickerModule,NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbSpinnerModule, NbTabsetModule, NbThemeModule, NbToastrModule, NbListModule, NbSelectModule, NbFormFieldModule } from '@nebular/theme';




@NgModule({
  declarations: [
    NdaComponent
  ],
  imports: [
    FormsModule,
    NbFormFieldModule,
    ReactiveFormsModule, 
    CommonModule,
    OvertimeRoutingModule,
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
    NbToastrModule.forRoot()
  ]
})
export class NdaModule { }
