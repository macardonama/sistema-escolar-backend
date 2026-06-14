import {
  Component,
  inject,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth';
import { SidebarComponent } from '../../shared/sidebar/sidebar';
import { HeaderComponent } from '../../shared/header/header';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent, HeaderComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  usuario: any = {};

  mostrarSidebar = true;

toggleSidebar() {

  this.mostrarSidebar =
    !this.mostrarSidebar;
}

  ngOnInit(): void {

    this.authService.obtenerPerfil()
      .subscribe({
        next: (response: any) => {

          console.log('RESPUESTA', response);

          this.usuario = response.usuario;

          this.cdr.detectChanges();

        },
        error: (error) => {
          console.error(error);
        }
      });
  }
}