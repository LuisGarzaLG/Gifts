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

  
  

}
