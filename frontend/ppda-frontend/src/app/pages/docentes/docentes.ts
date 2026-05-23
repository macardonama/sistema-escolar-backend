import {

  Component,

  inject,

  OnInit,

  ChangeDetectorRef

} from '@angular/core';
import { CommonModule } from '@angular/common';

import { SidebarComponent } from '../../shared/sidebar/sidebar';
import { HeaderComponent } from '../../shared/header/header';

import { FormsModule } from '@angular/forms';

import { UsuariosService } from '../../core/services/usuarios';
import { DocentesService } from '../../core/services/docentes';
import { GruposService } from '../../core/services/grupos';

@Component({
  selector: 'app-docentes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    HeaderComponent
  ],
  templateUrl: './docentes.html',
  styleUrl: './docentes.css'
})
export class DocentesComponent {

  mostrarSidebar = true;

  private usuariosService =
  inject(UsuariosService);

  private docentesService =
    inject(DocentesService);
    private cdr =
    inject(ChangeDetectorRef);

  private gruposService =
  inject(GruposService);

  usuariosDocentes: any[] = [];

  docentes: any[] = [];

  grupos: any[] = [];

  mostrarModal = false;

  modoEdicion = false;

  docenteEditandoId: number | null = null;

  usuarioId: number | null = null;

  documento = '';
  telefono = '';

  toggleSidebar() {

    this.mostrarSidebar =
      !this.mostrarSidebar;
  }

  ngOnInit(): void {

  this.usuariosService

    .listarUsuarios()

    .subscribe({

      next: (response: any) => {

        this.usuariosDocentes =

          response.usuarios.filter(

            (usuario: any) =>
              usuario.rol === 'DOCENTE'
          );
      },

      error: (error) => {

        console.error(error);
      }
    });

    this.cargarDocentes();
    this.cargarGrupos();
}


cargarDocentes() {

  this.docentesService

    .listarDocentes()

    .subscribe({

      next: (response: any) => {

        console.log(response);

        this.docentes =
          response.docentes;
        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(error);
      }
    });
}

cargarGrupos() {

  this.gruposService

    .listarGrupos()

    .subscribe({

      next: (response: any) => {

        this.grupos =
          response.grupos;

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(error);
      }
    });
}

crearDocente() {

  if (!this.usuarioId) return;

  this.docentesService

    .crearDocente(
      this.usuarioId,
      this.documento,
      this.telefono
    )

    .subscribe({

      next: (response: any) => {

        console.log(response);

        this.cargarDocentes();

        this.mostrarModal = false;
      },

      error: (error) => {

        console.error(error);
      }
    });
}

editarDocente(docente: any) {

  this.modoEdicion = true;

  this.docenteEditandoId =
    docente.id;

  this.documento =
    docente.documento;

  this.telefono =
    docente.telefono;

  this.usuarioId =
    docente.usuarioId;

  this.mostrarModal = true;
}

actualizarDocente() {

  if (!this.docenteEditandoId) return;

  this.docentesService
    .actualizarDocente(
      this.docenteEditandoId,
      this.documento,
      this.telefono
    )
    .subscribe({
      next: () => {
        this.mostrarModal = false;
        this.modoEdicion = false;
        this.docenteEditandoId = null;
        this.cargarDocentes();
      },
      error: (error) => {
        console.error(error);
      }
    });
}
}