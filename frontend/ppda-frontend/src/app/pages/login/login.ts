import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone: true
})
export class LoginComponent {

  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  errorLogin = false;

  login() {

  this.authService
    .login(this.email, this.password)
    .subscribe({

      next: (response: any) => {

        this.errorLogin = false;

        localStorage.setItem(
          'token',
          response.token
        );

        this.router.navigate(['/dashboard']);
      },

      error: () => {

        this.errorLogin = true;
      }
    });
}
}
