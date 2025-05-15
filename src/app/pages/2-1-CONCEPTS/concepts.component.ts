import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-concepts',
  templateUrl: './concepts.component.html',
  styleUrls: ['./concepts.component.scss']
})
export class ConceptsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
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
