import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { giftsrequestsprovaider } from 'src/app/providers/services/Gifts request/Giftsrequestsprovaider';
import { Companies, CompaniesP } from 'src/app/providers/models/gifts-request-all-models';
import { NbDialogService } from '@nebular/theme';
import { AddCompanyDialogComponent } from './add-company-dialog/add-company-dialog.component';
import { AddPersonDialogComponent } from './add-person-dialog/add-person-dialog.component';
import { NotificationService } from 'src/app/providers/services/notification/notification.service';

@Component({
  selector: 'app-nda',
  templateUrl: './nda.component.html',
  styleUrls: ['./nda.component.scss']
})
export class NdaComponent implements OnInit {
  entriesToShow = 10;
  entriesToShowPeople = 10;
  searchCompanyText = '';
  searchPeopleText = '';
  totalCompanies = 0;
  totalPeople = 0;

  companyForm!: FormGroup;
  personForm!: FormGroup;
  companies: Companies[] = [];
  people: CompaniesP[] = [];
  companiesPeople: any[] = [];
  showAddCompanyModal = false;
  showAddPersonModal = false;

  newCompany = {
    name: '',
    country: ''
  };

  newPerson = {
    name: '',
    user: '',
    companyId: 0
  };
  isEditingPerson: boolean=false;

  constructor(
    private fb: FormBuilder,
    public service: giftsrequestsprovaider,
    private dialogService: NbDialogService,
    private notificationService: NotificationService
    
  ) {}

  async ngOnInit(): Promise<void> {
    console.log('ngOnInit ejecutado');
    this.initForms();
    await this.loadCompanies();
    await this.loadCompanyPeople();
  }


  private initForms(): void {
    this.companyForm = this.fb.group({
      id: [''],
      name: [''],
      lastDate:[''],
      lastUser: ['']
    });

    this.personForm = this.fb.group({
      id: [''],
      name: [''],
      lastUser: [''],
      lastDate: [''],
      companyId: ['']
    });
  }

  public async loadCompanies(): Promise<void> {
  try {
    this.companies = await this.service.GetAllCompanies();
    this.totalCompanies = this.companies.length;
  } catch (error) {
    console.error('Error al cargar compañías', error);
  }
}


  loadCompanyPeople() {
  this.service.GetAllCompaniesPeople().then((res: any[]) => {
    this.people = res.map(p => ({
      ...p,
      companyName: this.companies.find(c => c.id === p.companyId)?.name || 'Unknown'
    }));
    this.totalPeople = this.people.length;
    console.log('People data with companyName:', this.people);
  });
}


   async saveCompany(): Promise<void> {
    try {
      const formValue = {
        ...this.companyForm.value,
        id: Number(this.companyForm.value.id) || 0  // Asegura que sea número
      };
      if (formValue.id && formValue.id > 0) {
        console.log('Actualizando compañía con ID:', formValue.id);
      } else {
        console.log('Insertando nueva compañía');
      }
      await this.service.InsertOrUpdateCompany(formValue);
      this.notificationService.success('Compañía guardada correctamente');

      await this.loadCompanies(); // refrescar lista
      this.closeAddCompanyModal(); // cerrar modal

      this.companyForm.reset(); // limpiar formulario para próxima vez
    } catch (error) {
      console.error('Error al guardar compañía', error);
      this.notificationService.error('Error al guardar compañía');
      
    }
    
  }












  

openAddCompanyDialog(company?: Companies): void {
    const isEditing = !!company;

    this.dialogService.open(AddCompanyDialogComponent, {
      context: {
        isEditing: isEditing,
        companyData: company ? { ...company } : null
      }
    }).onClose.subscribe(async (result: Companies) => {
      if (result) {
        try {
          await this.service.InsertOrUpdateCompany(result);
          this.notificationService.success('Compañía guardada correctamente');
          await this.loadCompanies();
        } catch (err) {
          console.error('Error guardando compañía', err);
          this.notificationService.error('Error guardando compañía');
        }
      }
    });
  }



async openAddPersonDialog(person?: any): Promise<void> {
  // Asegurarse de que las compañías estén cargadas
  if (this.companies.length === 0) {await this.loadCompanies();}

  const isEditing = !!person;

  this.dialogService.open(AddPersonDialogComponent, {
    context: {
      isEditing: isEditing,
      personData: person ? { ...person } : null,
    },
  }).onClose.subscribe(async result => {
    if (result) {
      try {
        await this.service.InsertOrUpdateCompanyPeople(result);

        const companyName = this.companies.find(c => c.id === result.companyId)?.name || 'Unknown';

        if (isEditing) {
          const index = this.people.findIndex(p => p.id === result.id);
          if (index > -1) {
            this.people[index] = {
              ...result,
              companyName
            };
          }
        } else {
          this.people.push({
            ...result,
            companyName
          });
        }

        this.notificationService.success('Persona guardada correctamente');
      } catch (error) {
        console.error('Error al guardar persona', error);
        this.notificationService.error('Error al guardar persona');
      }
    }
  });
}






  editCompany(company: Companies): void {
    this.openAddCompanyDialog(company); 
  }
getCompanies() {
  this.service.GetAllCompanies().then(data => {
    this.companies = data;
  });
}


async deleteCompany(id: number) {
  // Validar ID
  if (!id || id === 0) {
    this.notificationService.warning('No se puede eliminar una compañía nueva o sin ID');
    return;
  }

  // Confirmación del usuario
  const confirmed = await this.notificationService.confirmHtml(
    'Eliminar compañía',
    '¿Estás seguro de que deseas eliminar esta compañía?<br>Se eliminarán también todos los usuarios asociados.',
    'Sí, eliminar',
    'Cancelar'
  );

  if (!confirmed) return;

  // Intentar eliminación
  try {
    await this.service.DeleteCompany(id);
    this.notificationService.success('Compañía eliminada correctamente');
    this.getCompanies(); // Refrescar la lista
  } catch (error) {
    console.error('[Error al eliminar compañía]', error);
    this.notificationService.error('Ocurrió un error al intentar eliminar la compañía');
  }
}



    async saveCompanyPerson(): Promise<void> {
    try {
      const person = this.personForm.value;
      // El backend decide si es insert o update según si hay id

      await this.service.InsertOrUpdateCompanyPeople(person);
      this.notificationService.success('Compañía guardada correctamente');

      await this.loadCompanies(); // refrescar lista
      this.closeAddCompanyModal(); // cerrar modal

      this.personForm.reset(); // limpiar formulario para próxima vez
    } catch (error) {
      console.error('Error al guardar compañía', error);
      this.notificationService.error('Error al guardar compañía');
    }
  }


editPerson(person: any): void {
  if (!person || !person.id) {
    this.notificationService.warning('Persona inválida para editar');
    return;
  }

  this.openAddPersonDialog(person);
}


addPerson(): void {
  this.personForm.reset();
  this.isEditingPerson = false;  // Está en modo agregar
  this.showAddPersonModal = true;
}



async deletePerson(personId: number): Promise<void> {
  if (!personId || personId === 0) {
    this.notificationService.warning('No se puede eliminar una persona sin ID válido');
    return;
  }

  const confirmed = await this.notificationService.confirmHtml(
    'Eliminar persona',
    '¿Estás seguro de que deseas eliminar esta persona?',
    'Sí, eliminar',
    'Cancelar'
  );

  if (!confirmed) return;

  try {
    await this.service.DeleteCompanyPeople(personId);
    this.notificationService.success('Persona eliminada correctamente');
    this.loadCompanyPeople(); // Recargar lista
  } catch (error) {
    console.error('[Error al eliminar persona]', error);
    this.notificationService.error('Error al intentar eliminar persona');
  }
}


  openAddCompanyModal() {
    this.newCompany = { name: '', country: '' };
    this.showAddCompanyModal = true;
  }

  closeAddCompanyModal() {
    this.showAddCompanyModal = false;
  }
  
}
