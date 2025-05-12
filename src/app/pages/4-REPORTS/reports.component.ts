import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  concepts: string[] = ['']; // Puedes adaptar esto
  data: any[] = [];  // Aquí irán los datos de la tabla
  loading: boolean = false;

  constructor() {}

  ngOnInit(): void {
    // Simulación de carga de datos
    this.loading = true;
    setTimeout(() => {
      this.data = [
        {
        }
        // Puedes añadir más objetos aquí
      ];
      this.loading = false;
    }, 1000);
  }
}
