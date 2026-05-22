import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import {

  Component,

  inject,

  OnInit,

  ChangeDetectorRef

} from '@angular/core';

import { SidebarComponent } from '../../shared/sidebar/sidebar';

import { HeaderComponent } from '../../shared/header/header';

import { EstudiantesService } from '../../core/services/estudiantes';

import { UsuariosService } from '../../core/services/usuarios';

import { GruposService } from '../../core/services/grupos';

@Component({
  selector: 'app-estudiantes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    HeaderComponent
  ],
  templateUrl: './estudiantes.html',
  styleUrl: './estudiantes.css'
})
export class EstudiantesComponent
implements OnInit {

  mostrarSidebar = true;

  mostrarModal = false;

private estudiantesService =
  inject(EstudiantesService);

private usuariosService =
  inject(UsuariosService);

private gruposService =
  inject(GruposService);

private cdr =
  inject(ChangeDetectorRef);

estudiantes: any[] = [];

usuariosEstudiantes: any[] = [];

grupos: any[] = [];

documento = '';

grupoId: number | null = null;

usuarioId: number | null = null;

mostrarPerfil = false;

estudianteSeleccionado: any = null;

  toggleSidebar() {

    this.mostrarSidebar =
      !this.mostrarSidebar;
  }

  cargarEstudiantes() {

  this.estudiantesService

    .listarEstudiantes()

    .subscribe({

  next: (response: any) => {

    console.log(response);

    this.estudiantes =
      response.estudiantes;

    this.cdr.detectChanges();
  },

  error: (error) => {

    console.error(error);
  } 
  });
}

ngOnInit(): void {

  this.cargarEstudiantes();

  this.usuariosService

    .listarUsuarios()

    .subscribe({

      next: (response: any) => {

        this.usuariosEstudiantes =

          response.usuarios.filter(

            (usuario: any) =>
              usuario.rol === 'ESTUDIANTE'
          );
      },

      error: (error) => {

        console.error(error);
      }
    });

  this.gruposService

    .listarGrupos()

    .subscribe({

      next: (response: any) => {

        this.grupos =
          response.grupos;
      },

      error: (error) => {

        console.error(error);
      }
    });
}

crearEstudiante() {

  if (!this.usuarioId || !this.grupoId) return;

 const usuarioSeleccionado =

  this.usuariosEstudiantes.find(

    usuario =>
      usuario.id == this.usuarioId
  );

  this.estudiantesService

   .crearEstudiante(

  usuarioSeleccionado.nombre,

  this.documento,

  this.grupoId,

  this.usuarioId
)

    .subscribe({

      next: (response: any) => {

        console.log(response);

        this.mostrarModal = false;

        this.cargarEstudiantes();

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(error);
      }
    });
}

abrirPerfil(estudiante: any) {

  this.estudianteSeleccionado =
    estudiante;

  this.mostrarPerfil = true;
}
}