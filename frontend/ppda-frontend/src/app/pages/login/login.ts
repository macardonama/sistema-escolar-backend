import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';

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
  private cdr = inject(ChangeDetectorRef);

  email = '';
  password = '';
  errorLogin = false;
  mensajeError = '';

  login() {

  this.authService
    .login(this.email, this.password)
   .subscribe({

  next: (response: any) => {

    if (response.usuario?.activo === false) {

      this.errorLogin = true;

      this.mensajeError =
        'Tu usuario se encuentra inactivo. Comunícate con el administrador.';

      this.cdr.detectChanges();

      return;
    }

    this.errorLogin = false;

    this.cdr.detectChanges();

    localStorage.setItem(
      'token',
      response.token
    );

    localStorage.setItem(
      'usuario',
      JSON.stringify(response.usuario)
    );

  const rol = response.usuario?.rol;

switch (rol) {

  case 'ADMINISTRATIVO':
  case 'DOCENTE':
  case 'ESTUDIANTE':
  case 'ACUDIENTE':

    this.router.navigate(['/dashboard']);
    break;

  default:

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    this.errorLogin = true;

    this.mensajeError =
      'Rol no reconocido. Comunícate con el administrador.';

    this.cdr.detectChanges();
}
  },

error: (error) => {

  this.errorLogin = true;

  this.mensajeError =
    error.error?.mensaje ||
    error.error?.message ||
    'Correo o contraseña incorrectos.';

  this.cdr.detectChanges();
}
});
}
}
