import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from './core/services/auth';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  private authService = inject(AuthService);

  email = '';
  password = '';

  login() {
    this.authService.login(this.email, this.password)
      .subscribe({
        next: (response) => {
          console.log('LOGIN EXITOSO', response);
          localStorage.setItem(
          'token',
          (response as any).token
          );
        },
        error: (error) => {
          console.error('ERROR LOGIN', error);
        }
      });
  }
}