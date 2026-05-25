import {

  Component,

  inject,

  OnInit,

  ChangeDetectorRef

} from '@angular/core';

import { SidebarComponent } from '../../shared/sidebar/sidebar';

import { HeaderComponent } from '../../shared/header/header';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { UsuariosService } from '../../core/services/usuarios';

import { AcudientesService } from '../../core/services/acudientes';

import { EstudiantesService } from '../../core/services/estudiantes';

@Component({
  selector: 'app-acudientes',

  standalone: true,

  imports: [
  CommonModule,
  FormsModule,
  SidebarComponent,
  HeaderComponent
],

  templateUrl: './acudientes.html',

  styleUrl: './acudientes.css',
})
export class AcudientesComponent implements OnInit {

  mostrarSidebar = true;
  mostrarModal = false;
  mostrarModalAsociar = false;

  private usuariosService =
    inject(UsuariosService);

  private acudientesService =
    inject(AcudientesService);

  private estudiantesService =
    inject(EstudiantesService);

  private cdr =
    inject(ChangeDetectorRef);

  usuariosAcudientes: any[] = [];

  acudientes: any[] = [];

  usuarioId: number | null = null;

  telefono = '';

  correo = '';

  nombre = '';

  modoEdicion = false;

  acudienteEditandoId: number | null = null;

  estudianteId: number | null = null;

  parentesco = '';

  estudiantes: any[] = [];

  toggleSidebar() {

    this.mostrarSidebar =
      !this.mostrarSidebar;
  }

  ngOnInit(): void {

    this.cargarTodo();
    this.cargarEstudiantes();

}

cargarTodo() {

  this.usuariosService

    .listarUsuarios()

    .subscribe({

      next: (response: any) => {

        this.usuariosAcudientes =

          response.usuarios.filter(

            (usuario: any) =>
              usuario.rol === 'ACUDIENTE'
          );

        this.cargarAcudientes();
      },

      error: (error) => {

        console.error(error);
      }
    });
}

cargarAcudientes() {

  this.acudientesService
  
    .listarAcudientes()

    .subscribe({

    next: (response: any) => {

  console.log(
    'Acudientes:',
    response.acudientes
  );

  this.acudientes =
    response.acudientes;

  this.cdr.detectChanges();
},

      error: (error) => {

        console.error(error);
      }
    });
}

crearAcudiente() {

  if (!this.usuarioId) {
  console.log('Falta seleccionar usuario');
  return;
}

  const usuarioSeleccionado =
    this.usuariosAcudientes.find(
      usuario => usuario.id == this.usuarioId
    );

  this.acudientesService

    .crearAcudiente(
      usuarioSeleccionado.nombre,
      this.telefono,
      this.correo,
      this.usuarioId
    )

    .subscribe({

      next: () => {

        this.cargarAcudientes();

        this.mostrarModal = false;

        this.usuarioId = null;

        this.telefono = '';

        this.correo = '';

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(error);
      }
    });
}

editarAcudiente(acudiente: any) {

  this.modoEdicion = true;

  this.acudienteEditandoId =
    acudiente.id;

  this.nombre =
    acudiente.nombre;

  this.telefono =
    acudiente.telefono;

  this.correo =
    acudiente.correo;

  this.mostrarModal = true;
}

actualizarAcudiente() {

  if (!this.acudienteEditandoId) return;

  this.acudientesService

    .actualizarAcudiente(
      this.acudienteEditandoId,
      this.nombre,
      this.telefono,
      this.correo
    )

    .subscribe({

      next: () => {

        this.cargarAcudientes();

        this.mostrarModal = false;

        this.modoEdicion = false;

        this.acudienteEditandoId = null;

        this.nombre = '';

        this.telefono = '';

        this.correo = '';

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(error);
      }
    });
}

asociarEstudianteAcudiente() {

  console.log('Asociar:', {
  estudianteId: this.estudianteId,
  acudienteId: this.acudienteEditandoId
});

if (
  !this.acudienteEditandoId ||
  !this.estudianteId
) return;

  this.acudientesService

    .asociarEstudiante(
      this.estudianteId,
      this.acudienteEditandoId,
    )

    .subscribe({
next: () => {

  const estudianteSeleccionado =
    this.estudiantes.find(
      estudiante =>
        estudiante.id === this.estudianteId
    );

  this.acudientes =
    this.acudientes.map(acudiente => {

      if (acudiente.id === this.acudienteEditandoId) {

        return {
          ...acudiente,
          estudiante: estudianteSeleccionado,
          estudianteId: this.estudianteId
        };
      }

      return acudiente;
    });

  this.mostrarModalAsociar = false;

  this.estudianteId = null;

  this.parentesco = '';

  this.cdr.detectChanges();
},

      error: (error) => {

  console.log(error.error);

  alert('Ese estudiante ya está asociado a este acudiente');
}
    });
}
cargarEstudiantes() {

  this.estudiantesService

    .listarEstudiantes()

    .subscribe({

      next: (response: any) => {

        this.estudiantes =
          response.estudiantes;

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(error);
      }
    });
}
abrirAsociarEstudiante(acudiente: any) {

  this.acudienteEditandoId =
    acudiente.id;

  this.estudianteId = null;

  this.parentesco = '';

  this.mostrarModalAsociar = true;
}
}
