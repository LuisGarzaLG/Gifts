import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/providers/services/notification/notification.service';
import { giftsrequestsprovaider } from 'src/app/providers/services/Gifts request/Giftsrequestsprovaider';
import { first } from 'rxjs/operators';


@Component({
  selector: 'app-nda',
  templateUrl: './nda.component.html',
  styleUrls: ['./nda.component.scss']
})
export class NdaComponent {
  
}

