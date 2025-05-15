import { Component, OnInit } from '@angular/core';
import { giftsrequestsprovaider } from 'src/app/providers/services/Gifts request/Giftsrequestsprovaider';
import { Employee } from 'src/app/providers/models/gifts-request-all-models';
import { NbDialogService } from '@nebular/theme';
import { NotificationService } from 'src/app/providers/services/notification/notification.service';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';
import { jsPDF } from 'jspdf';



import autoTable from 'jspdf-autotable';

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

  constructor(private giftsrequestsprovaider: giftsrequestsprovaider,private dialogService: NbDialogService,private notificationService:NotificationService) {}

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


copyTable() {
  let copyText = '';

  // Encabezados
  copyText += '#EMP\tNAME\tSUPERVISOR\tDETAILS\tAREA\tSHIFT\n';

  // Filas
  for (const emp of this.filteredEmployees) {
    copyText += `${emp.employeeNumber}\t${emp.name}\t${emp.supervisor}\t${emp.jobDescription}\t${emp.area}\t${emp.shift}\n`;
  }

  // Crear un elemento de texto invisible y copiar
  const textarea = document.createElement('textarea');
  textarea.value = copyText;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);

  this.notificationService.success('Copiado', 'Tabla copiada al portapapeles');
}



downloadCSV() {
  let csv = 'Employee Number,Name,Supervisor,Job Description,Area,Shift\n';
  this.employees.forEach(emp => {
    csv += `${emp.employeeNumber},"${emp.name}","${emp.supervisor}","${emp.jobDescription}","${emp.area}",${emp.shift}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = 'employees.csv';
  link.click();
}


downloadExcel() {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Employees');

  // Definir columnas con encabezados
  worksheet.columns = [
    { header: '#EMP', key: 'emp', width: 10 },
    { header: 'NAME', key: 'name', width: 25 },
    { header: 'SUPERVISOR', key: 'supervisor', width: 25 },
    { header: 'DETAILS', key: 'details', width: 45 }, // Más ancha para texto largo
    { header: 'AREA', key: 'area', width: 20 },
    { header: 'SHIFT', key: 'shift', width: 10 },
  ];

  // Agregar filas de datos
  this.employees.forEach(emp => {
    worksheet.addRow({
      emp: emp.employeeNumber,
      name: emp.name,
      supervisor: emp.supervisor,
      details: emp.jobDescription,
      area: emp.area,
      shift: emp.shift,
    });
  });

  // Estilo del encabezado
  const headerRow = worksheet.getRow(1);
  headerRow.eachCell(cell => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4F81BD' },
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = {
      top: { style: 'thin' },
      bottom: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
    };
  });
  headerRow.height = 25;

  // Estilo general para las celdas de datos
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;

    row.eachCell((cell, colNumber) => {
      cell.alignment = {
        vertical: 'top',
        horizontal: colNumber === 4 ? 'justify' : 'left', // Justificado en DETAILS
        wrapText: true,
      };
      cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    row.height = 40; // Alto suficiente para mostrar varias líneas si el texto es largo
  });

  // Descargar archivo
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    FileSaver.saveAs(blob, 'Employees.xlsx');
  });
}






downloadPDF() {
  const doc = new jsPDF(); // vertical por defecto
  doc.setFontSize(16);
  doc.text('EMPLOYEES REPORT', 14, 14);

  autoTable(doc, {
    head: [['#EMP', 'NAME', 'SUPERVISOR', 'DETAILS', 'AREA', 'SHIFT']],
    body: this.filteredEmployees.map(emp => [
      emp.employeeNumber,
      emp.name,
      emp.supervisor,
      emp.jobDescription,
      emp.area,
      emp.shift
    ]),
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 3,
      overflow: 'linebreak',
    },
    headStyles: {
      fillColor: [0, 98, 204],  // Azul similar al que se usa en temas corporativos
      textColor: 255,
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 18 },  // #EMP
      1: { cellWidth: 35 },  // NAME
      2: { cellWidth: 35 },  // SUPERVISOR
      3: { cellWidth: 50 },  // DETAILS
      4: { cellWidth: 25 },  // AREA
      5: { cellWidth: 20 },  // SHIFT
    },
    margin: { top: 20 },
  });

  doc.save('employees.pdf');
}







}
