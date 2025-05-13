import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddRoutingModule } from './employees-routing.module';
import { EmployeesComponent } from './employees.component';
import { NbDatepickerModule,NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbSpinnerModule, NbTabsetModule, NbThemeModule, NbToastrModule, NbListModule, NbSelectModule, NbFormFieldModule } from '@nebular/theme';




@NgModule({
  declarations: [
    EmployeesComponent
  ],
  imports: [
    FormsModule,
    NbFormFieldModule,
    ReactiveFormsModule, 
    CommonModule,
    AddRoutingModule,
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
export class EmployeesModule { }
