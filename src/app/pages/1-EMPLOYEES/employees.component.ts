import { Component, OnInit } from '@angular/core';
import { giftsrequestsprovaider } from 'src/app/providers/services/Gifts request/Giftsrequestsprovaider';
import { Employee } from 'src/app/providers/models/gifts-request-all-models';
import { NbDialogService } from '@nebular/theme';
import { AddEmployeeModalComponent } from './add-employee-modal/add-employee-modal.component';

@Component({
  selector: 'app-add',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
})
export class EmployeesComponent implements OnInit {
  employees: Employee[] = [];
  paginatedEmployees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  entriesPerPage: number | 'All' = 10;
  currentPage: number = 1;
  totalEmployees: number = 0;
  totalPages: number = 0;
  startIndex: number = 0;
  endIndex: number = 0;
  searchTerm: string = ''; // Campo para el texto de búsqueda

  constructor(private giftsrequestsprovaider: giftsrequestsprovaider,private dialogService: NbDialogService) {}

  ngOnInit() {
    this.loadEmployees();
  }

  async loadEmployees() {
    try {
      this.employees = await this.giftsrequestsprovaider.GetAllEmployees();
      this.filteredEmployees = [...this.employees]; // Copia inicial
      this.totalEmployees = this.filteredEmployees.length;
      this.calculateTotalPages();
      this.updateTable();
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  }

  onEntriesPerPageChange(): void {
    this.currentPage = 1;
    this.calculateTotalPages();
    this.updateTable();
  }

  calculateTotalPages(): void {
    if (this.entriesPerPage === 'All') {
      this.totalPages = 1;
    } else {
      this.totalPages = Math.ceil(this.filteredEmployees.length / <number>this.entriesPerPage);
    }
  }

  updateTable(): void {
    if (this.entriesPerPage === 'All') {
      this.paginatedEmployees = [...this.filteredEmployees];
    } else {
      this.startIndex = (this.currentPage - 1) * <number>this.entriesPerPage;
      this.endIndex = Math.min(this.startIndex + <number>this.entriesPerPage, this.filteredEmployees.length);
      this.paginatedEmployees = this.filteredEmployees.slice(this.startIndex, this.endIndex);
    }
  }

  changePage(direction: string): void {
    if (direction === 'prev' && this.currentPage > 1) {
      this.currentPage--;
    } else if (direction === 'next' && this.currentPage < this.totalPages) {
      this.currentPage++;
    }
    this.updateTable();
  }

  // Filtro de búsqueda
  onSearchChange(): void {
  const term = this.searchTerm.toLowerCase();

  this.filteredEmployees = this.employees.filter(emp => {
    return (
      emp.employeeNumber.toString().toLowerCase().includes(term) ||
      emp.name.toLowerCase().includes(term) ||
      emp.jobDescription.toLowerCase().includes(term) ||
      emp.supervisor.toLowerCase().includes(term) ||
      emp.area.toLowerCase().includes(term) ||
      emp.shift.toLowerCase().includes(term)
    );
  });

  this.calculateTotalPages();
  this.updateTable();
}

 openAddEmployeeModal() {
    this.dialogService.open(AddEmployeeModalComponent);
  }









}
