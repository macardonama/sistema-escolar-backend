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

  usuariosFiltrados: any[] = [];

  filtroRol = 'TODOS';

  mostrarSidebar = true;

  mostrarModal = false;

  nombre = '';
  correo = '';
  password = '';
  rol = 'DOCENTE';

  modoEdicion = false;

  usuarioEditandoId: number | null = null;

toggleSidebar() {

    this.mostrarSidebar =
    !this.mostrarSidebar;
}

filtrarUsuarios() {

  if (this.filtroRol === 'TODOS') {

    this.usuariosFiltrados =
      this.usuarios;

    return;
  }

  this.usuariosFiltrados =
    this.usuarios.filter(

      usuario =>
        usuario.rol === this.filtroRol
    );
}

abrirModal() {

  this.mostrarModal = true;
}

cerrarModal() {

  this.mostrarModal = false;
}

editarUsuario(usuario: any) {

  this.modoEdicion = true;

  this.usuarioEditandoId = usuario.id;

  this.nombre = usuario.nombre;
  this.correo = usuario.correo;
  this.rol = usuario.rol;

  this.password = '';

  this.mostrarModal = true;
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

actualizarUsuario() {

  if (!this.usuarioEditandoId) return;

  this.usuariosService

    .actualizarUsuario(
      this.usuarioEditandoId,
      this.nombre,
      this.correo,
      this.rol
    )

    .subscribe({

      next: () => {

        this.mostrarModal = false;

        this.modoEdicion = false;

        this.ngOnInit();
      },

      error: (error) => {

        console.error(error);
      }
    });
}

desactivarUsuario(id: number) {

  this.usuariosService

    .desactivarUsuario(id)

    .subscribe({

      next: () => {

        this.usuarios =

          this.usuarios.map(

            usuario => {

              if (usuario.id === id) {

                return {

                  ...usuario,

                  activo: false
                };
              }

              return usuario;
            }
          );
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
          this.usuariosFiltrados =
          response.usuarios;
          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(error);
        }
      });
  }
}