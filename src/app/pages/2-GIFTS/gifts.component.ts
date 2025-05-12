import { Component } from '@angular/core';


@Component({
  selector: 'app-gifts',
  templateUrl: './gifts.component.html',
  styleUrls: ['./gifts.component.scss']
})
export class GiftsComponent {
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
    this.employeeName = 'John Doe';
    this.supervisor = 'Jane Smith';
    this.area = 'Producción';
    this.size = 'M';
    this.shift = 'Turno 1';
  }

  isAddingConcept = false;
  concepts = [
    {
      name: 'ASISTENCIA PERFECTA ENERO - ABRIL 2024',
      description: '2 BOLETOS DE CINE – ASISTENCIA PERFECTA ENERO-ABRIL',
      startDate: new Date('2024-05-22T08:00:00'),
      endDate: new Date('2024-05-22T00:00:00')
    },];
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
