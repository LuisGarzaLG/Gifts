import { Component, OnInit , Inject, Input} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogRef, NB_DIALOG_CONFIG } from '@nebular/theme';
import { NotificationService } from 'src/app/providers/services/notification/notification.service';
import { giftsrequestsprovaider } from 'src/app/providers/services/Gifts request/Giftsrequestsprovaider';

@Component({
  selector: 'app-add-company-dialog',
  templateUrl: './add-company-dialog.component.html',
  styleUrls:['./add-company-dialog.component.scss']
})
export class AddCompanyDialogComponent implements OnInit {
  companyForm!: FormGroup;
  @Input() isEditing: boolean = false;
  @Input() companyData: any;

  constructor(
    private fb: FormBuilder,
    protected ref: NbDialogRef<AddCompanyDialogComponent>,
    private giftsrequestsprovaider: giftsrequestsprovaider,
    private notificationService: NotificationService,
    @Inject(NB_DIALOG_CONFIG) public context: any
  ) {
    this.isEditing = context?.isEditing || false;
    this.companyData = context?.companyData || null;
  }

  ngOnInit(): void {
    this.companyForm = this.fb.group({
      id: [0],
      name: ['', Validators.required],
      user: [''],
    });

    if (this.isEditing && this.companyData) {
      this.companyForm.patchValue({
        id: this.companyData.id,
        name: this.companyData.name,
        user: this.companyData.user || '',
      });
    }
  }

  async submit() {
    if (!this.companyForm.valid) return;

    const formData = this.companyForm.value;

    const payload: any = {
      name: formData.name,
      user: formData.user?.trim() || 'sistema',
    };

    if (this.isEditing && formData.id && formData.id > 0) {
      payload.id = formData.id;
    }

    try {
      const result = await this.giftsrequestsprovaider.InsertOrUpdateCompany(payload);
      this.notificationService.success(this.isEditing ? 'Compañía actualizada' : 'Compañía creada');
      this.ref.close(result);
    } catch (error) {
      console.error(error);
      this.notificationService.error('Error al guardar la compañía');
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
      this.ref.close({ deleted: true }); // Puedes indicar que se eliminó para refrescar lista
    } catch (error) {
      console.error(error);
      this.notificationService.error('Error al eliminar la compañía');
    }
  }
  
}
