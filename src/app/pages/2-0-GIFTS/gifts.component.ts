import { Component, OnInit } from '@angular/core';
import { giftsrequestsprovaider } from 'src/app/providers/services/Gifts request/Giftsrequestsprovaider';
import { Concept, Gift } from 'src/app/providers/models/gifts-request-all-models';
import { debounceTime, Subject } from 'rxjs';
import { NotificationService } from 'src/app/providers/services/notification/notification.service';

@Component({
  selector: 'app-gifts',
  templateUrl: './gifts.component.html',
  styleUrls: ['./gifts.component.scss']
})
export class GiftsComponent implements OnInit {

  private employeeNumberChanged: Subject<string> = new Subject<string>();

  employeePhoto: string = '';
  employeeNumber: string = '';
  employeeName: string = '';
  supervisor: string = '';
  area: string = '';
  size: string = '';
  shift: string = '';
  employeeInputClass: string = '';


  concepts: Concept[] = [];
  newGift: Gift = {
    id: 0,
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    lastDate: '',
    conceptId: null
  };

  selectedConceptId: number | null = null;
  currentUser: string = '' // Ajusta según cómo obtienes el usuario
  

  constructor(
    private giftsRequestProvider: giftsrequestsprovaider,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
  const storedUser = sessionStorage.getItem('userName') || '';
  let decodedUser = decodeURIComponent(storedUser);

  if (!decodedUser) {
    return;
  }

  if (!decodedUser.startsWith('AM\\')) {
    decodedUser = `AM\\${decodedUser}`;
  }

  this.currentUser = decodedUser;

  this.loadConcepts();

  this.employeeNumberChanged.pipe(debounceTime(500)).subscribe(value => {
    this.employeeNumber = value;
    this.loadEmployeeData();
  });
}


  onEmployeeNumberChange(value: string) {
    this.employeeNumberChanged.next(value);

    if (!value.trim()) {
      this.resetEmployeeData();
    }
  }

  async loadConcepts() {
  try {
    const result = await this.giftsRequestProvider.GetAllConcepts();
    const today = new Date();

    // Filtrar conceptos no vencidos
    this.concepts = result
      .filter(concept => {
        if (!concept.endDate) return true; // Si no tiene endDate, se asume válido
        const conceptEndDate = new Date(concept.endDate);
        return conceptEndDate >= today;
      })
      .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));
  } catch (error) {
    console.error('Error loading concepts:', error);
    this.notificationService.error('Error al cargar los conceptos.');
  }
}


  async loadEmployeeData(): Promise<void> {
    const employeeNumber = parseInt(this.employeeNumber, 10);
    if (isNaN(employeeNumber)) return;

    try {
      const employee = await this.giftsRequestProvider.GetEmployeeById(employeeNumber);
      if (!employee) {
        this.notificationService.warning('Empleado no encontrado. Verifica el número e intenta de nuevo.');
        return;
      }

      this.employeeName = employee.fullName;
      this.supervisor = employee.supervisorName;
      this.area = employee.area;
      this.shift = employee.shiftDescription;
      //this.size = employee.shiftId;

      this.newGift = {
        id: 0,
        name: employee.fullName,
        description: `Reconocimiento por desempeño en ${employee.area}`,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        lastDate: new Date().toISOString(),
        conceptId: this.selectedConceptId !== null ? this.selectedConceptId.toString() : null
      };
    } catch (error) {
      console.error('Error al cargar los datos del empleado:', error);
      this.notificationService.error('Error al cargar datos del empleado.');
    }
  }

  resetEmployeeData() {
    this.employeeNumber = '';
    this.employeeName = '';
    this.supervisor = '';
    this.area = '';
    this.shift = '';
    this.size = '';
    this.newGift = {
      id: 0,
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      lastDate: '',
      conceptId: null
    };
  }

  resetNewGift() {
    this.newGift = {
      id: 0,
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      lastDate: '',
      conceptId: null
    };
    this.selectedConceptId = null;
  }

   async createGift() {
  if (!this.currentUser || this.currentUser.trim() === '') {
    this.notificationService.warning('Es necesario iniciar sesión antes de crear un regalo.');
    this.employeeInputClass = 'input-error';
    setTimeout(() => { this.employeeInputClass = ''; }, 5000);
    return;
  }

  if (!this.selectedConceptId) {
    this.notificationService.warning('Debes seleccionar un concepto antes de agregar el regalo.');
    this.employeeInputClass = 'input-error';
    return;
  }

  const employeeIds = this.employeeNumber.trim();
  const conceptId = this.selectedConceptId;
  const user = this.currentUser;

  if (!employeeIds || !conceptId || !user) {
    this.notificationService.error('Faltan datos para crear el regalo.');
    this.employeeInputClass = 'input-error';
    return;
  }

  try {
    const result = await this.giftsRequestProvider.CreateGift(employeeIds, conceptId, user);

    if (result?.data?.duplicates?.length > 0) {
      this.notificationService.warning(`El empleado ${employeeIds} ya ha sido registrado previamente.`);
      this.employeeInputClass = 'input-error';
      this.resetEmployeeData();
      this.resetNewGift();
      setTimeout(() => { this.employeeInputClass = ''; }, 1000);
      return;
    }

    if (result?.succeeded) {
      this.notificationService.success('Regalo creado exitosamente.');
      this.employeeInputClass = 'input-success';
      setTimeout(() => { this.employeeInputClass = ''; }, 1000);
      this.resetNewGift();
      this.resetEmployeeData();
      this.employeeNumber = '';
      await this.loadConcepts();
    } else {
      this.notificationService.error('No se pudo crear el regalo.');
      this.employeeInputClass = 'input-error';
      this.resetEmployeeData();
      this.resetNewGift();
      setTimeout(() => { this.employeeInputClass = ''; }, 1000);
    }

  } catch (error) {
    console.error('Error creating gift:', error);
    this.notificationService.error('Error al crear el regalo.');
    this.employeeInputClass = 'input-error';
    this.resetEmployeeData();
      this.resetNewGift();
    setTimeout(() => { this.employeeInputClass = ''; }, 1000);
  }
}





  
  
}
