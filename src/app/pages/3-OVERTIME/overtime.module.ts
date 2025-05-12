import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbDatepickerModule,NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbSpinnerModule, NbTabsetModule, NbThemeModule, NbToastrModule, NbListModule, NbSelectModule, NbFormFieldModule } from '@nebular/theme';
import { OvertimeComponent } from './overtime.component';
import { OvertimeRoutingModule } from './overtime-routing.module';



@NgModule({
  declarations: [
    OvertimeComponent
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
export class OvertimeModule { }
