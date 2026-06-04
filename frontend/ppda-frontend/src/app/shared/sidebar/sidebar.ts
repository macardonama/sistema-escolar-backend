import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class SidebarComponent {

  private router = inject(Router);

  usuario: any = null;

  constructor() {

    const usuarioGuardado = localStorage.getItem('usuario');

    if (usuarioGuardado) {

      this.usuario = JSON.parse(usuarioGuardado);
    }
  }

  cerrarSesion() {

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    this.router.navigate(['/login']);
  }
}