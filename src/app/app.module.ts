import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app.-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbThemeModule, NbLayoutModule, NbSidebarModule, NbMenuModule, NbIconModule, NbToastrModule, NbDatepickerModule, NbInputModule, NbSelectModule , NbOptionModule,NbCardModule , NbDialogModule} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NbAuthModule, NbAuthService } from '@nebular/auth';
import { PagesRoutingModule } from './pages/pages-routing.module';
import { Ng2CompleterModule } from 'ng2-completer';
import { HttpClientModule } from '@angular/common/http';
import { AddEmployeeModalComponent } from './pages/1-EMPLOYEES/add-employee-modal/add-employee-modal.component';


@NgModule({
  declarations: [
    AppComponent,
    AddEmployeeModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbThemeModule.forRoot({ name: 'corporate' }),
    NbLayoutModule,
    NbInputModule,
    NbEvaIconsModule,
    NbIconModule,
    Ng2CompleterModule,
    HttpClientModule,
    NbDatepickerModule,
    PagesRoutingModule,
    NbToastrModule.forRoot(),
    NbLayoutModule,
    NbEvaIconsModule,
    NbSelectModule,
    NbOptionModule,
    FormsModule,
    NbDialogModule.forRoot(),
    NbAuthModule.forRoot({
      strategies: [],
      forms: {},
    })
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [NbAuthService],
  bootstrap: [AppComponent]
  
})
export class AppModule { }
