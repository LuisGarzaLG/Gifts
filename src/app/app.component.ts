import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './providers/services/security/auth.service';
import { DefaultUrlSerializer, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { giftsrequestsprovaider } from './providers/services/Gifts request/Giftsrequestsprovaider';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  title = 'RRHH';
  isLoggedIn: boolean =  false;
  isAuthenticated = false;
  GownChangeCount: number = 0;
  user: string = ''
  private authSubscription!: Subscription;

  menuItems: any[] = [];
  private userRoles: string[] = [];
  private rolesSubscription: Subscription = new Subscription();
  currentUserName: string = ''; 

  isSidebarExpanded: boolean = false;

  // Agregar logo
logo = '/assets/images/landisGyr_1.png'
  constructor (private authService: AuthService, private router: Router, private provider: giftsrequestsprovaider) {}
 username = '';
  ngOnInit(): void {


      this.menuItems = [
        {
          title: 'EMPLOYEES',
          icon: 'people-outline',
          link: '/pages/employees',
        },
        {
          title: 'GIFTS',
          icon:'list-outline',
          children:[
          {
            title: 'GIFT',
            icon: 'gift-outline',
            link: '/pages/gifts',
          },
          {
            title: 'CONCEPTS',
            icon: 'file-add-outline',
            link: '/pages/concepts',
          },
          
          ]
        },        
        {
          title: 'REPORT',
          icon: 'file-text-outline',
          link: '/pages/reports'
        },
        {
          title: 'NDA',
          icon: 'folder-add-outline',
          link: '/pages/nda'
        },
      ];
    

  }
  navigateToEmployees() {
  this.router.navigate(['/pages/employees']);
}

  toggleSidebar(): void {
    this.isSidebarExpanded = !this.isSidebarExpanded;
  }
  
}
