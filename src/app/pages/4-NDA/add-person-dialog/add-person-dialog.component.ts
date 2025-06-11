import { Component, OnInit, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NB_DIALOG_CONFIG } from '@nebular/theme';
import { giftsrequestsprovaider } from 'src/app/providers/services/Gifts request/Giftsrequestsprovaider';
import { NotificationService } from 'src/app/providers/services/notification/notification.service';

@Component({
  selector: 'app-add-person-dialog',
  templateUrl: './add-person-dialog.component.html',
  styleUrls: ['./add-person-dialog.component.scss']
})
export class AddPersonDialogComponent implements OnInit {
  companyForm!: FormGroup;
  companies: any[] = [];

  @Input() isEditing: boolean = false;
  @Input() personData: any;

  constructor(
    private fb: FormBuilder,
    protected ref: NbDialogRef<AddPersonDialogComponent>,
    private giftsrequestsprovaider: giftsrequestsprovaider,
    private notificationService: NotificationService,
    @Inject(NB_DIALOG_CONFIG) public context: any
  ) {
    this.isEditing = context?.isEditing || false;
    this.personData = context?.personData || null;
  }

  // 👉 Métodos generales primero

  async loadCompanies() {
    try {
      const data = await this.giftsrequestsprovaider.GetAllCompanies();
      this.companies = data;
    } catch (err) {
      console.error(err);
      this.notificationService.error('Error al cargar compañías');
    }
  }

  cancel() {
    this.ref.close();
  }

  async deleteCompany() {
    const companyId = this.companyForm.get('id')?.value;
    if (!companyId || companyId === 0) {
      this.notificationService.warning('No se puede eliminar una compañía nueva o sin ID');
      return;
    }

    const confirmed = confirm('¿Seguro que deseas eliminar esta compañía?');
    if (!confirmed) return;

    try {
      await this.giftsrequestsprovaider.DeleteCompany(companyId);
      this.notificationService.success('Compañía eliminada correctamente');
      this.ref.close({ deleted: true });
    } catch (error) {
      console.error(error);
      this.notificationService.error('Error al eliminar la compañía');
    }
  }

  // 👉 Luego el método submit

  async submit() {
  if (!this.companyForm.valid) return;

  const formData = this.companyForm.value;

  const payload: any = {
    name: formData.name,
    user: formData.user?.trim() || 'sistema',
    companyid: formData.companyid
  };

  // ✅ Agregar el ID solo si estás editando
  if (this.isEditing && formData.id && formData.id > 0) {
    payload.id = formData.id;
  }

  try {
    const result = await this.giftsrequestsprovaider.InsertOrUpdateCompanyPeople(payload);
    this.notificationService.success(this.isEditing ? 'Persona actualizada' : 'Persona creada');
    this.ref.close(result);
  } catch (error) {
    console.error(error);
    this.notificationService.error('Error al guardar la persona');
  }
}


  // 👉 Finalmente ngOnInit al final

  ngOnInit(): void {
    this.companyForm = this.fb.group({
      id: [0],
      name: ['', Validators.required],
      user: [''],
      companyid: [0, Validators.required],
    });

    this.loadCompanies();

    if (this.isEditing && this.personData) {
      this.companyForm.patchValue({
        id: this.personData.id,
        name: this.personData.name || this.personData.user || '',
        companyid: this.personData.companyid || this.personData.companyId || 0,
      });
    }
  }
}

