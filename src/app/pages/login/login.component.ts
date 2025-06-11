import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../providers/services/security/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {
  private tokenRefreshInterval: any;

  constructor(private authService: AuthService, private route: Router, private formBuilder: FormBuilder) {}

  Login = this.formBuilder.group({
    userName: ['', [Validators.required]],
    password: ['', [Validators.required]],
    rememberMe: ['false']
  });

  get userName() {
    return this.Login.get('userName');
  }
  get password() {
    return this.Login.get('password');
  }

  time: number = 0;
  submitted: boolean = false;
  rememberMe: boolean = false;
  loading: boolean = false;

  ngOnInit(): void {
    const remember = localStorage.getItem('rememberMe') === 'true';
    const isLogged = this.authService.IsLoggedIn();

    if (remember && isLogged) {
      this.authService.GetNormalizedUserName(); // opcional
      this.authService.GetRoles();              // opcional
      this.route.navigate(['home']);
    } else {
      this.authService.logout();
    }
  }

  async submit(): Promise<any> {
    this.loading = true;

    if (!this.Login.valid) {
      Swal.fire({
        icon: 'warning',
        title: 'All fields are required!',
        showConfirmButton: false,
        timer: 1800,
        background: '#333',
        color: '#fff',
        customClass: { title: 'custom-toast-title' }
      });
      this.loading = false;
      return;
    }

    const userName = this.Login.get('userName')?.value;
    sessionStorage.setItem('userName', userName);

    const form = this.Login.getRawValue();

    if (this.Login.get('rememberMe')?.value) {
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('rememberMe');
    }

    await this.authService.Login(form).then(async (response) => {
      if (response === true) {
        this.time = Number(sessionStorage.getItem('tokenExpirationTime'));
        await this.authService.GetNormalizedUserName();
        await this.authService.GetRoles();
        this.route.navigate(['home']);
      }
    });

    this.loading = false;
  }

 ngAfterViewInit() {
  if (this.authService.IsLoggedIn()) {
    this.tokenRefreshInterval = setInterval(() => {
      this.authService.GetNewToken();
    }, this.time);
  }
}



}
