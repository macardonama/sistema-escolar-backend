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
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    HeaderComponent
  ],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.css',
})
export class MiPerfilComponent implements OnInit {

  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  usuario: any = {};

  ngOnInit(): void {

    this.authService.obtenerPerfil()
      .subscribe({
        next: (response: any) => {

          this.usuario = response.usuario;

          this.cdr.detectChanges();
        },

        error: (error) => {
          console.error(error);
        }
      });
  }
}