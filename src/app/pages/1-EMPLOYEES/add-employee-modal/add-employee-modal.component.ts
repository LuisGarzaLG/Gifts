import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { giftsrequestsprovaider } from 'src/app/providers/services/Gifts request/Giftsrequestsprovaider';
import { Employee } from 'src/app/providers/models/gifts-request-all-models';
import { NotificationService } from 'src/app/providers/services/notification/notification.service';

@Component({
  selector: 'app-add-employee-modal',
  templateUrl: './add-employee-modal.component.html',
  styleUrls: ['./add-employee-modal.component.scss']
})
export class AddEmployeeModalComponent {
  addEmployeeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: NbDialogRef<AddEmployeeModalComponent>,
    private giftsService: giftsrequestsprovaider,
    private toastr: NbToastrService,
    private notificationService: NotificationService
  ) {
    this.addEmployeeForm = this.fb.group({
      name: ['', Validators.required],
      supervisor: ['', Validators.required],
      jobDescription: ['', Validators.required],
      area: ['', Validators.required],
      employeeNumber: ['', Validators.required],
      shift: ['', Validators.required]
    });
  }

  

  submitEmployee() {
    // Verificar si el formulario es inválido
    if (this.addEmployeeForm.invalid) {
    // Mostrar una notificación general que indique que los campos son obligatorios
    this.toastr.warning('Por favor, complete todos los campos obligatorios.', 'Campos incompletos', {
      status: 'warning',
      duration: 1500, // Duración de la notificación en milisegundos
    });
    return;
  }
    this.closeModal();
    this.toastr.success('Empleado agregado con éxito', 'Éxito', {
      status: 'success',
      duration: 1500,
    });
  }

  private showMissingFields() {
    const controls = this.addEmployeeForm.controls;
    for (const key in controls) {
      if (controls[key].invalid) {
      }
    }
  }

  private getFieldLabel(key: string): string {
    const labels: { [key: string]: string } = {
      name: 'Employee Name',
      supervisor: 'Employee Supervisor',
      jobDescription: 'Job Description',
      area: 'Area',
      employeeNumber: 'Employee ID',
      shift: 'Shift'
    };
    return labels[key] || key;
  }





  closeModal() {
    this.dialogRef.close();
  }
}