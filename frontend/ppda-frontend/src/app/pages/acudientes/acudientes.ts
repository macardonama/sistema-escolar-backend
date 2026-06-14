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

  erroresAcudiente = {
    usuarioId: '',
    telefono: ''
  };

  mensajeExito = '';

  acudienteEditandoId: number | null = null;

  estudianteId: number | null = null;

  parentesco = '';

  estudiantes: any[] = [];

  erroresAsociacion = {
  estudianteId: '',
  parentesco: ''
};

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

  console.log('Acudientes cargados:', this.acudientes);

  this.cdr.detectChanges();
},

      error: (error) => {

        console.error(error);
      }
    });
}

crearAcudiente() {

this.erroresAcudiente = {
  usuarioId: '',
  telefono: ''
};

let formularioValido = true;

if (!this.usuarioId) {

  this.erroresAcudiente.usuarioId =
    'Debe seleccionar un usuario acudiente';

  formularioValido = false;
}

if (!this.telefono.trim()) {

  this.erroresAcudiente.telefono =
    'Debe ingresar un teléfono';

  formularioValido = false;
}

if (!formularioValido) {
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

soloNumeros(event: KeyboardEvent) {

  const tecla = event.key;

  if (!/[0-9]/.test(tecla)) {

    event.preventDefault();
  }
}

usuarioYaTieneAcudiente(): boolean {

  return this.acudientes.some(
    acudiente =>
      acudiente.usuarioId === this.usuarioId
  );
}

editarAcudiente(acudiente: any) {

  this.limpiarFormularioAcudiente();

  this.modoEdicion = true;

  this.acudienteEditandoId =
    acudiente.id;

  this.usuarioId =
    acudiente.usuarioId;

  this.nombre =
    acudiente.nombre;

  this.telefono =
    acudiente.telefono;

  this.correo =
    acudiente.correo;

  this.mostrarModal = true;
}

telefonoDuplicado(): boolean {

  return this.acudientes.some(
    acudiente =>
      acudiente.telefono === this.telefono
  );
}

actualizarAcudiente() {

  this.erroresAcudiente = {
    usuarioId: '',
    telefono: ''
  };

  if (!this.telefono.trim()) {

    this.erroresAcudiente.telefono =
      'Debe ingresar un teléfono';

    return;
  }

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

        this.cerrarModalAcudiente();
      },

      error: (error) => {
        console.error(error);
      }
    });
}

asociarEstudianteAcudiente() {

  this.erroresAsociacion = {
    estudianteId: '',
    parentesco: ''
  };

  let formularioValido = true;

  if (!this.estudianteId) {

    this.erroresAsociacion.estudianteId =
      'Debe seleccionar un estudiante';

    formularioValido = false;
  }

  if (!this.parentesco) {

    this.erroresAsociacion.parentesco =
      'Debe seleccionar un parentesco';

    formularioValido = false;
  }

  if (!formularioValido) {
    return;
  }

  if (!this.acudienteEditandoId) {
    return;
  }

  console.log('Asociar:', {
    estudianteId: this.estudianteId,
    acudienteId: this.acudienteEditandoId,
    parentesco: this.parentesco
  });

  this.acudientesService

 .asociarEstudiante(
  Number(this.estudianteId),
  Number(this.acudienteEditandoId),
  this.parentesco
)

    .subscribe({

      next: () => {

        this.cargarAcudientes();

        this.mostrarModalAsociar = false;

        this.estudianteId = null;

        this.parentesco = '';

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.log(error.error);

        alert(
          'No fue posible asociar el estudiante al acudiente'
        );
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

limpiarFormularioAcudiente() {

  this.usuarioId = null;
  this.telefono = '';
  this.correo = '';
  this.nombre = '';

  this.modoEdicion = false;
  this.acudienteEditandoId = null;

  this.erroresAcudiente = {
    usuarioId: '',
    telefono: ''
  };
}

abrirModalCrearAcudiente() {

  this.limpiarFormularioAcudiente();

  this.mostrarModal = true;
}

cerrarModalAcudiente() {

  this.limpiarFormularioAcudiente();

  this.mostrarModal = false;
}

}
