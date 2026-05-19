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

  cerrarSesion() {

    localStorage.removeItem('token');

    this.router.navigate(['/login']);
  }
}