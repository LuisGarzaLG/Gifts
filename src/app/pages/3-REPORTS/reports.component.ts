import { Component, OnInit } from '@angular/core';
import { Report } from 'src/app/providers/models/gifts-request-all-models';
import { giftsrequestsprovaider } from 'src/app/providers/services/Gifts request/Giftsrequestsprovaider';
import { NotificationService } from 'src/app/providers/services/notification/notification.service';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BehaviorSubject } from 'rxjs';

type ReportWithBorders = Report & {
  isGroupStart: boolean;
  isGroupEnd: boolean;
  isInGroup: boolean;
};

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  data: Report[] = [];
  loading: boolean = false;

  // Filtros
  searchTerm: string = '';
  startDate: string = '';
  endDate: string = '';
  selectedConcept: string | null = null;

  availableConcepts: string[] = [];

  filteredReports: Report[] = [];
  currentPage: number = 1;
  totalPages: number = 0;

  entriesOptions = [12, 25, 50, 100, 0];
  selectedEntries = 12;

  private reportsSubject = new BehaviorSubject<Report[]>([]);
  reports$ = this.reportsSubject.asObservable();

  constructor(
    private giftsRequestProvider: giftsrequestsprovaider,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.getReports();
  }

  async getReports(): Promise<void> {
    this.loading = true;
    const cacheKey = 'giftReports';
    const cacheTimestampKey = 'giftReportsTimestamp';
    const cacheTTL = 5 * 60 * 1000; // 5 minutos
    const now = Date.now();

    try {
      let data: Report[] = [];

      // Cargar reportes con cache
      const cachedData = localStorage.getItem(cacheKey);
      const cachedTimestamp = localStorage.getItem(cacheTimestampKey);

      if (cachedData && cachedTimestamp && now - parseInt(cachedTimestamp, 10) < cacheTTL) {
        data = JSON.parse(cachedData);
        console.log('Datos cargados desde la caché.');
      } else {
        data = await this.giftsRequestProvider.GetAllReports();
        localStorage.setItem(cacheKey, JSON.stringify(data));
        localStorage.setItem(cacheTimestampKey, now.toString());
        console.log('Datos obtenidos de la API y almacenados en la caché.');
      }

      // Obtener conceptos de la API (sin cache)
      const conceptsFromAPI: any[] = await this.giftsRequestProvider.GetAllConcepts();

      // Extraemos solo los nombres
      const conceptNamesFromAPI = conceptsFromAPI.map(c => c.name);

      this.reportsSubject.next(data); // carga reactiva
      this.data = data;
      this.filteredReports = [...data];

      // Combinar conceptos extraídos de reportes + los obtenidos de GetAllConcepts()
      const conceptsFromReports = [...new Set(data.map(item => item.name))];
      const allConcepts = [...new Set([...conceptsFromReports, ...conceptNamesFromAPI])].sort((a, b) =>
        a.localeCompare(b)
      );

      this.availableConcepts = allConcepts;

      this.currentPage = 1;
      this.updatePagination();
    } catch (error) {
      console.error('Error al cargar los reportes', error);
      this.notificationService.error('Error', 'No se pudieron cargar los reportes');
    } finally {
      this.loading = false;
    }
  }

  updateAvailableConcepts(): void {
    const filtered = this.data.filter(item => {
      const itemDate = item.lastDate ? new Date(item.lastDate) : null;
      const matchesStartDate = this.startDate ? itemDate && itemDate >= new Date(this.startDate) : true;
      const matchesEndDate = this.endDate ? itemDate && itemDate <= new Date(this.endDate) : true;
      return matchesStartDate && matchesEndDate;
    });

    const conceptsFromFiltered = [...new Set(filtered.map(item => item.name))];
    this.availableConcepts = [...new Set([...conceptsFromFiltered, ...this.availableConcepts])].sort((a, b) =>
      a.localeCompare(b)
    );
  }

  applyFilters(): void {
    const start = this.startDate ? new Date(this.startDate) : null;
    const end = this.endDate ? new Date(this.endDate) : null;

    this.filteredReports = this.data.filter(item => {
      const itemDate = item.lastDate ? new Date(item.lastDate) : null;

      const matchesConcept = this.selectedConcept ? item.name === this.selectedConcept : true;
      const matchesSearch = this.searchTerm
        ? Object.values(item).some(value => String(value).toLowerCase().includes(this.searchTerm.toLowerCase()))
        : true;
      const matchesStartDate = start ? itemDate && itemDate >= start : true;
      const matchesEndDate = end ? itemDate && itemDate <= end : true;

      return matchesConcept && matchesSearch && matchesStartDate && matchesEndDate;
    });

    this.currentPage = 1;
    this.updatePagination();
  }

  onStartDateChange() {
    this.updateAvailableConcepts();
  }

  onEndDateChange() {
    this.updateAvailableConcepts();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.startDate = '';
    this.endDate = '';
    this.selectedConcept = null;
    this.filteredReports = [...this.data];
    this.updateAvailableConcepts();
  }

  onSearchTermChange(value: string) {
    this.searchTerm = value;
    this.applyFilters();
  }

  get pagedData(): Report[] {
    const entries = +this.selectedEntries;
    if (entries === 0) return this.filteredReports;

    const startIndex = (this.currentPage - 1) * entries;
    const endIndex = startIndex + entries;
    return this.filteredReports.slice(startIndex, endIndex);
  }

  updatePagination(): void {
    const entries = +this.selectedEntries;
    this.totalPages = entries === 0 ? 1 : Math.ceil(this.filteredReports.length / entries);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
  }

  get pagedDataWithBorders(): ReportWithBorders[] {
    const entries = +this.selectedEntries;
    if (this.filteredReports.length === 0) return [];

    const startIndex = entries === 0 ? 0 : (this.currentPage - 1) * entries;
    const endIndex = entries === 0 ? this.filteredReports.length : startIndex + entries;

    const sliceData = this.filteredReports.slice(startIndex, endIndex);
    if (sliceData.length === 0) return [];

    const result: ReportWithBorders[] = [];
    let count = 1;
    let groupStartIndex = 0;

    for (let i = 0; i < sliceData.length; i++) {
      const current = sliceData[i];
      const next = sliceData[i + 1];
      const isSameEmployeeNext = next && next.employeeNumber === current.employeeNumber;

      if (!isSameEmployeeNext) {
        const groupSize = count;
        for (let j = groupStartIndex; j <= i; j++) {
          result.push({
            ...sliceData[j],
            isGroupStart: groupSize >= 5 ? j === groupStartIndex : false,
            isGroupEnd: groupSize >= 5 ? j === i : false,
            isInGroup: groupSize >= 5
          });
        }
        count = 1;
        groupStartIndex = i + 1;
      } else {
        count++;
      }
    }

    return result;
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  changePage(direction: 'prev' | 'next'): void {
    if (direction === 'prev' && this.currentPage > 1) {
      this.currentPage--;
    } else if (direction === 'next' && this.currentPage < this.totalPages) {
      this.currentPage++;
    }
    this.updatePagination();
  }

  copyTable() {
    let copyText = '';
    copyText += '#EMP\tNAME\tCONCEPT\tSHIFT\tDATE\tDELIVERED BY\n';
    for (const rep of this.filteredReports) {
      copyText += `${rep.employeeNumber}\t${rep.name}\t${rep.description}\t${rep.shift}\t${rep.lastDate}\t${rep.lastUser}\n`;
    }

    const textarea = document.createElement('textarea');
    textarea.value = copyText;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    this.notificationService.success('Copiado', 'Tabla copiada al portapapeles');
  }

  downloadCSV() {
    let csv = 'Employee Number,Name,Concept,Shift,Date,Delivered By\n';
    this.data.forEach(rep => {
      csv += `"${rep.employeeNumber}","${rep.name}","${rep.description}","${rep.shift}","${rep.lastDate}","${rep.lastUser}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'Report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  downloadExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Report');

    worksheet.columns = [
      { header: '#EMP', key: 'employeeNumber', width: 10 },
      { header: 'NAME', key: 'name', width: 25 },
      { header: 'CONCEPT', key: 'description', width: 35 },
      { header: 'SHIFT', key: 'shift', width: 10 },
      { header: 'DATE', key: 'lastDate', width: 20 },
      { header: 'DELIVERED BY', key: 'lastUser', width: 15 },
    ];

    this.data.forEach(rep => {
      worksheet.addRow({
        employeeNumber: rep.employeeNumber,
        name: rep.name,
        description: rep.description,
        shift: rep.shift,
        lastDate: rep.lastDate,
        lastUser: rep.lastUser
      });
    });

    const headerRow = worksheet.getRow(1);
    headerRow.eachCell(cell => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF298B9C' } };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
      cell.border = { top: { style: 'thin' }, bottom: { style: 'thin' } };
    });

    worksheet.columns.forEach(col => {
      col.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    });

    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(blob, 'Report.xlsx');
    });
  }

downloadPDF() {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text('EMPLOYEES REPORT', 14, 14);

  autoTable(doc, {
    head: [['#EMP', 'NAME', 'CONCEPT', 'SHIFT', 'DATE', 'DELIVERED BY']],
    body: this.data.map(rep => [
      rep.employeeNumber ?? '',
      rep.name ?? '',
      rep.description ?? '',
      rep.shift ?? '',
      rep.lastDate ? new Date(rep.lastDate).toLocaleDateString() : '',
      rep.lastUser ?? ''
    ]),
    theme: 'grid',
    styles: {
      fontSize: 9.5,
      cellPadding: { top: 3, right: 2, bottom: 3, left: 2 },
      overflow: 'linebreak',
      valign: 'top',
    },
    headStyles: {
      fillColor: [14, 139, 156],
      textColor: 255,
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle'
    },
    columnStyles: {
      0: { cellWidth: 14, halign: 'center' },   // #EMP
      1: { cellWidth: 38, halign: 'left' },     // NAME
      2: { cellWidth: 70, halign: 'justify' },  // CONCEPT
      3: { cellWidth: 14, halign: 'center' },   // SHIFT
      4: { cellWidth: 22, halign: 'center' },   // DATE
      5: { cellWidth: 30, halign: 'right' },    // DELIVERED BY
    },
    margin: { top: 22, left: 10, right: 5 }, // <<< más cerca de los bordes
    tableWidth: 'auto', // se ajusta a columnas, no estira innecesariamente
  });

  doc.save('Report.pdf');
}
}
