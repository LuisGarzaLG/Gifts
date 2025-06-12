import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './providers/services/security/auth.service';
import { DefaultUrlSerializer, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { giftsrequestsprovaider } from './providers/services/Gifts request/Giftsrequestsprovaider';
import Swal from 'sweetalert2';
import { NbMenuService } from '@nebular/theme';

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
  constructor (private menuService: NbMenuService,private authService: AuthService, private router: Router, private provider: giftsrequestsprovaider) {}
 username = '';
  ngOnInit(): void {
    this.isAuthenticated = this.authService.IsLoggedIn();
    

    this.authSubscription = this.authService.isAuthenticated$.subscribe(
      (authStatus) => {
        this.isAuthenticated = authStatus;
      }
    );
    console.log(sessionStorage)
this.rolesSubscription = this.authService.getRolesObservable().subscribe((currentUser: string[]) => {
  this.userRoles = currentUser;
  console.log('Roles del usuario:',currentUser);
  this.currentUserName = this.authService.getCurrentUserName();
      this.menuItems = [
        {
          title: 'EMPLOYEES',
          icon: 'people-outline',
          link: '/pages/employees',
          roles: ['HR']
        },
        {
          title: 'GIFTS',
          icon:'list-outline',
          children:[
          {
            title: 'GIFT',
            icon: 'gift-outline',
            link: '/pages/gifts',
            roles: ['HR']
          },
          {
            title: 'CONCEPTS',
            icon: 'file-add-outline',
            link: '/pages/concepts',
            roles: ['HR']
          },
          
          ]
        },        
        {
          title: 'REPORT',
          icon: 'file-text-outline',
          link: '/pages/reports',
          roles: ['HR']
        },
        {
          title: 'NDA',
          icon: 'folder-add-outline',
          link: '/pages/nda',
          roles: ['HR']
        },
      ];
    this.menuItems = this.filterMenuItemsByRoles(this.menuItems);

      this.menuService.onItemClick().subscribe(() => {
    this.isSidebarExpanded = false;
  });
      
    });

  }

  filterMenuItemsByRoles(items: any[]): any[] {
    return items.filter(item => {
      if (!item.roles) {
        return true;
      }
      return this.userHasRole(item.roles);
    }).map(item => {
      if (item.children) {
        item.children = this.filterMenuItemsByRoles(item.children);
      }
      return item;
    });
  }

  userHasRole(allowedRoles: string[]): boolean {
    return this.userRoles.some(role => allowedRoles.includes(role));
  }

onUserIconClick() {
  if (this.authService.IsLoggedIn()) {
    // Si hay sesión activa, preguntar antes de cerrar
    this.confirmLogout();
  } else {
    // Si no hay sesión, redirigir al login
    this.router.navigate(['auth/login']);
  }
}

  confirmLogout(): void {
  Swal.fire({
    title: '¿Deseas cerrar sesión?',
    text: 'Tu sesión actual se cerrará.',
    icon: 'warning',
    showCancelButton: true,
    background: '#333',
    color: '#fff',
    customClass: {
      title: 'custom-toast-title',
      popup: 'swal2-borderless'
    },
    confirmButtonColor: '#4370fc',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, cerrar sesión',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      sessionStorage.clear();
      this.authService.logout();
      this.currentUserName = '';
      this.isAuthenticated = false;
      this.isSidebarExpanded = false;

      // Aquí cambia la ruta para redirigir al login
      this.router.navigate(['auth/login']);
    }
  });
}

  navigateToEmployees() {
  this.router.navigate(['/pages/employees']);
}

  toggleSidebar(): void {
    this.isSidebarExpanded = !this.isSidebarExpanded;
  }

  ngOnDestroy(): void {
    this.rolesSubscription.unsubscribe();
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
  
}
