import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosService } from '../../core/services/usuarios';
import { HeaderComponent } from '../../shared/header/header';
import { SidebarComponent } from '../../shared/sidebar/sidebar';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SidebarComponent, FormsModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css'
})
export class UsuariosComponent implements OnInit {

  private usuariosService = inject(UsuariosService);
  private cdr = inject(ChangeDetectorRef);

  usuarios: any[] = [];

  mostrarSidebar = true;

  mostrarModal = false;

  nombre = '';
  correo = '';
  password = '';
  rol = 'DOCENTE';

toggleSidebar() {

    this.mostrarSidebar =
    !this.mostrarSidebar;
}

abrirModal() {

  this.mostrarModal = true;
}

cerrarModal() {

  this.mostrarModal = false;
}

crearUsuario() {

  console.log('CLICK CREAR');

  this.usuariosService

    .crearUsuario(
      this.nombre,
      this.correo,
      this.password,
      this.rol
    )

    .subscribe({

      next: () => {

        this.mostrarModal = false;

        this.ngOnInit();

      },

      error: (error) => {

        console.error(error);
      }
    });
}

  ngOnInit(): void {

    this.usuariosService
      .listarUsuarios()   
      .subscribe({

        next: (response: any) => {

          console.log(response);

          this.usuarios = response.usuarios;
          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(error);
        }
      });
  }
}