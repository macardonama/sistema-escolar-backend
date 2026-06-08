import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent implements OnInit {

  private authService = inject(AuthService);

  usuario: any = {};

ngOnInit(): void {

  const usuarioGuardado =
    localStorage.getItem('usuario');

  if (usuarioGuardado) {

    this.usuario =
      JSON.parse(usuarioGuardado);
  }

  this.authService.obtenerPerfil()
    .subscribe({

      next: (response: any) => {

        this.usuario =
          response.usuario;

        localStorage.setItem(
          'usuario',
          JSON.stringify(response.usuario)
        );
      },

      error: (error) => {

        console.error(error);
      }
    });
}

      @Output()
    toggleSidebarEvent =
      new EventEmitter<void>();

    toggleSidebar() {

      this.toggleSidebarEvent.emit();
    }
}