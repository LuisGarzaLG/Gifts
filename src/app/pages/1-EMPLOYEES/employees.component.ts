import { ChangeDetectorRef, Component,ViewChild, ElementRef , ViewEncapsulation } from '@angular/core';
import { NotificationService } from 'src/app/providers/services/notification/notification.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { qualityrequestsprovaider } from 'src/app/providers/services/Gifts request/Giftsrequestsprovaider';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-add',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EmployeesComponent {

  
}
