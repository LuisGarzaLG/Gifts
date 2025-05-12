import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { EmployeesComponent } from './1-EMPLOYEES/employees.component';
import { GiftsComponent } from './2-GIFTS/gifts.component';
import { OvertimeComponent } from './3-OVERTIME/overtime.component';
import { ReportsComponent } from './4-REPORTS/reports.component';
import { NdaComponent } from './5-NDA/nda.component';


const routes: Routes =[
  {
      path: '',
      component: PagesComponent,
      children:[
          
          {
            path: 'employees',
            component: EmployeesComponent,
            loadChildren:() => import ('./1-EMPLOYEES/employees.module').then(m => m.EmployeesModule)
          },
          {
            path: 'gifts',
            component: GiftsComponent,
            loadChildren:()=> import('./2-GIFTS/gifts.module').then(m=> m.GiftsModule)
          },
          {
            path: 'overtime',
            component: OvertimeComponent,
            loadChildren:() => import ('./3-OVERTIME/overtime.module').then(m => m.OvertimeModule)
          },
          {
            path: 'reports',
            component: ReportsComponent,
            loadChildren:()=> import ('./4-REPORTS/reports.module').then(m=>m.ReportsModule)
          },
          {
            path: 'nda',
            component: NdaComponent,
            loadChildren:()=> import ('./5-NDA/nda.module').then(m=>m.NdaModule)
          },
          {
              path: '',
              redirectTo: 'employees',
              pathMatch:'full',
          },
      ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule{}
