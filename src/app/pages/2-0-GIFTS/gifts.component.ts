import { Component, OnInit } from '@angular/core';
import { giftsrequestsprovaider } from 'src/app/providers/services/Gifts request/Giftsrequestsprovaider';
import { Concept } from 'src/app/providers/models/gifts-request-all-models';

@Component({
  selector: 'app-gifts',
  templateUrl: './gifts.component.html',
  styleUrls: ['./gifts.component.scss']
})
export class GiftsComponent implements OnInit {
  employeePhoto: string = '';
  employeeId: string = '';
  employeeName: string = '';
  supervisor: string = '';
  area: string = '';
  size: string = '';
  shift: string = '';

  concepts: Concept[] = []; // Aquí se guardarán los conceptos
  selectedConceptId: number | null = null;

  constructor(private giftsRequestProvider: giftsrequestsprovaider) {}

  ngOnInit() {
    this.loadConcepts();
  }

  async loadConcepts() {
    try {
      const result = await this.giftsRequestProvider.GetAllConcepts();
      // Ordenar por nombre si deseas
      this.concepts = result.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));
    } catch (error) {
      console.error('Error loading concepts:', error);
    }
  }

  loadEmployeeData(): void {
    // Aquí va la lógica para cargar datos del empleado
  }
}
