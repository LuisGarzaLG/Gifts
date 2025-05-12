import { Component } from '@angular/core';


@Component({
  selector: 'app-ovetime',
  templateUrl: './overtime.component.html',
  styleUrls: ['./overtime.component.scss']
})
export class OvertimeComponent {
  employeePhoto: string = '';  // URL o base64
  employeeId: string = '';
  employeeName: string = '';
  supervisor: string = '';
  area: string = '';
  size: string = '';
  shift: string = '';

  loadEmployeeData(): void {
    // Aquí debes cargar los datos reales del empleado con el ID escaneado
    // Simulamos valores por ahora:
    this.employeePhoto = '/assets/images/logo.png';
    this.employeeId='1'
    this.employeeName = 'John Doe';
    this.supervisor = 'Jane Smith';
    this.area = 'Producción';
    this.size = 'M';
    this.shift = 'Turno 1';
  }

  isAddingConcept = false;
  
    concept = {
      name: '',
      description: '',
      startDate: '',
      endDate: ''
    };
  
  toggleConceptMode() {
    this.isAddingConcept = !this.isAddingConcept;
  }
  
  saveConcept() {
    // Aquí puedes guardar el concepto o hacer lo que necesites
    console.log('Concepto guardado:', this.concept);
    this.toggleConceptMode(); // Vuelve al modo anterior
  }
  cancelConcept() {
    this.concept = { name: '', description: '', startDate: '', endDate: '' };
  }
  

}
