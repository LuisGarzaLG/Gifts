import { Component, OnInit } from '@angular/core';
import { giftsrequestsprovaider } from 'src/app/providers/services/Gifts request/Giftsrequestsprovaider';
import { Concept} from 'src/app/providers/models/gifts-request-all-models';
import { NbToastrService } from '@nebular/theme';
import { BehaviorSubject } from 'rxjs';



@Component({
  selector: 'app-concepts',
  templateUrl: './concepts.component.html',
  styleUrls: ['./concepts.component.scss']
})
export class ConceptsComponent implements OnInit {

  private conceptSubject = new BehaviorSubject<Concept[]>([]);
concepts: Concept[] = []; 

  filteredConcepts: Concept[] = [];
  pagedConcepts: Concept[] = [];

  searchTerm: string = '';
  pageSizes = [12, 25, 50, 100];
  itemsPerPage: number = 12;

  currentPage: number = 1;
  totalPages: number = 1;
  pages: number[] = [];

  editingConcept: Concept | null = null;

  // Variables auxiliares para fechas en string yyyy-MM-dd para inputs type="date"
  startDateStr: string = '';
  endDateStr: string = '';

  newConcept: Partial<Concept> = { name: '', description: '', startDate: null, endDate: null };
newStartDateStr: string = '';
newEndDateStr: string = '';

  constructor(private GiftsRequestProvaider: giftsrequestsprovaider,private toastrService: NbToastrService) {}

  ngOnInit() {
    this.loadConcepts();
  }

  async loadConcepts() {
  try {
    const result = await this.GiftsRequestProvaider.GetAllConcepts();

    // Ordenar alfabéticamente por name
    result.sort((a, b) => (a.name?.toLowerCase() || '').localeCompare(b.name?.toLowerCase() || ''));

    this.conceptSubject.next(result);
    this.concepts = result.slice();
    this.filteredConcepts = result.slice();
    this.updatePagination();
  } catch (error) {
    console.error('Error loading concepts:', error);
  }
}



  filterConcepts() {
    const term = this.searchTerm.trim().toLowerCase();
    if (term === '') {
      this.filteredConcepts = this.concepts.slice();
    } else {
      this.filteredConcepts = this.concepts.filter(c =>
        (c.name?.toLowerCase().includes(term)) ||
        (c.description?.toLowerCase().includes(term))
      );
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredConcepts.length / this.itemsPerPage) || 1;
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.goToPage(this.currentPage);
  }

  goToPage(page: number) {
    if (page < 1) page = 1;
    if (page > this.totalPages) page = this.totalPages;
    this.currentPage = page;

    const start = (page - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.pagedConcepts = this.filteredConcepts.slice(start, end);
  }

  prevPage() {
    if (this.currentPage > 1) this.goToPage(this.currentPage - 1);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.goToPage(this.currentPage + 1);
  }

 editConcept(concept: Concept) {
  console.log('Editando concepto:', concept);
  this.editingConcept = { ...concept };

  if (this.editingConcept.startDate) {
    this.startDateStr = this.formatDateForInput(this.editingConcept.startDate);
  } else {
    this.startDateStr = '';
  }
  if (this.editingConcept.endDate) {
    this.endDateStr = this.formatDateForInput(this.editingConcept.endDate);
  } else {
    this.endDateStr = '';
  }
}




  formatDateForInput(date: Date): string {
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }

  cancelEdit() {
    this.editingConcept = null;
    this.startDateStr = '';
    this.endDateStr = '';
  }

  // Limpiar formulario de nuevo concepto
cancelAdd() {
  this.newConcept = { name: '', description: '', startDate: null, endDate: null };
  this.newStartDateStr = '';
  this.newEndDateStr = '';
}

// Agregar nuevo concepto
addNewConcept() {
  if (!this.newConcept.name || !this.newStartDateStr || !this.newEndDateStr) {
    this.toastrService.show('Por favor, completa todos los campos.', 'Advertencia', { status: 'warning' });
    return;
  }

  const conceptToSend: Partial<Concept> = {
    name: this.newConcept.name,
    description: this.newConcept.description,
    startDate: new Date(this.newStartDateStr),
    endDate: new Date(this.newEndDateStr)
  };

  this.GiftsRequestProvaider.AddConcept(conceptToSend as Concept)
    .then(() => {
      this.toastrService.show('Concepto creado correctamente.', 'Éxito', { status: 'success' });

      const updatedList = [...this.conceptSubject.value, conceptToSend as Concept];

      // Ordenar alfabéticamente por name
      updatedList.sort((a, b) => (a.name?.toLowerCase() || '').localeCompare(b.name?.toLowerCase() || ''));

      this.conceptSubject.next(updatedList);
      this.concepts = updatedList;
      this.filteredConcepts = updatedList;
      this.updatePagination();

      this.cancelAdd();
    });
}





saveConcept() {
  if (!this.editingConcept) return;
  this.editingConcept.startDate = this.startDateStr ? this.parseDateLocal(this.startDateStr) : null;
this.editingConcept.endDate = this.endDateStr ? this.parseDateLocal(this.endDateStr) : null;


  this.GiftsRequestProvaider.UpdateConcept(this.editingConcept)
    .then(() => {
      this.toastrService.show('Concepto actualizado correctamente.', 'Éxito', { status: 'success' });

      const updatedList = this.conceptSubject.value.map(c =>
        c.id === this.editingConcept!.id ? this.editingConcept! : c
      );

      // Ordenar alfabéticamente por name
      updatedList.sort((a, b) => (a.name?.toLowerCase() || '').localeCompare(b.name?.toLowerCase() || ''));

      this.conceptSubject.next(updatedList);
      this.concepts = updatedList;
      this.filteredConcepts = updatedList;
      this.updatePagination();

      this.editingConcept = null;
      this.startDateStr = '';
      this.endDateStr = '';
    })

    .catch(error => {
      console.error('Error actualizando concepto:', error);
      this.toastrService.show('No se pudo actualizar el concepto.', 'Error', { status: 'danger' });
    });
}


parseDateLocal(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

}
