import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NdaComponent } from './nda.component';
import { NbDatepickerModule,NbButtonModule, NbCardModule, NbIconModule, NbInputModule, NbSpinnerModule, NbTabsetModule, NbThemeModule, NbToastrModule, NbListModule, NbSelectModule, NbFormFieldModule, NbDialogModule } from '@nebular/theme';
import { AddCompanyDialogComponent } from './add-company-dialog/add-company-dialog.component';
import { AddPersonDialogComponent } from './add-person-dialog/add-person-dialog.component';




@NgModule({
  declarations: [
    NdaComponent,
    AddCompanyDialogComponent,
    AddPersonDialogComponent
  ],
  imports: [
    FormsModule,
    NbFormFieldModule,
    ReactiveFormsModule, 
    CommonModule,
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
    NbToastrModule.forRoot(),
    NbDialogModule.forChild(),
  ]
})
export class NdaModule { }
