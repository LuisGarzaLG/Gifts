import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { EmployeesComponent } from './1-EMPLOYEES/employees.component';
import { GiftsComponent } from './2-0-GIFTS/gifts.component';
import { ReportsComponent } from './3-REPORTS/reports.component';
import { NdaComponent } from './4-NDA/nda.component';
import { ConceptsComponent } from './2-1-CONCEPTS/concepts.component';


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
            loadChildren:()=> import('./2-0-GIFTS/gifts.module').then(m=> m.GiftsModule)
          },
          {
            path: 'reports',
            component: ReportsComponent,
            loadChildren:()=> import ('./3-REPORTS/reports.module').then(m=>m.ReportsModule)
          },
          {
            path: 'concepts',
            component: ConceptsComponent,
            loadChildren:()=> import('./2-1-CONCEPTS/concepts.module').then(m=>m.ConceptsModule)
          },
          {
            path: 'nda',
            component: NdaComponent,
            loadChildren:()=> import ('./4-NDA/nda.module').then(m=>m.NdaModule)
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
