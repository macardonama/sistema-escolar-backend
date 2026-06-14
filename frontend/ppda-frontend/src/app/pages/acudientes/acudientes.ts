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

import { GruposService } from '../../core/services/grupos';

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

  private gruposService =
  inject(GruposService);

  usuariosAcudientes: any[] = [];

  acudientes: any[] = [];

  usuarioId: number | null = null;

  telefono = '';

  correo = '';

  nombre = '';

  modoEdicion = false;

  filtroGrupo = 'TODOS';

  erroresAcudiente = {
    usuarioId: '',
    telefono: ''
  };

  mensajeExito = '';

  acudienteEditandoId: number | null = null;

  estudianteId: number | null = null;

  parentesco = '';

  estudiantes: any[] = [];

  filtroTexto = '';

  filtroEstudiante = 'TODOS';

  estudiantesFiltro: any[] = [];

  acudientesFiltrados: any[] = [];

  grupos: any[] = [];

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
    this.cargarGrupos();

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

  this.acudientesFiltrados =
  this.acudientes;

  this.estudiantesFiltro =
  [...new Map(
    this.acudientes
      .flatMap(a => a.estudiantes || [])
      .map(e => [
        e.estudiante?.id,
        e.estudiante
      ])
  ).values()];

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

const telefonoExiste =
  this.acudientes.some(
    acudiente =>
      acudiente.telefono === this.telefono.trim()
  );

if (telefonoExiste) {

  this.erroresAcudiente.telefono =
    'Ya existe un acudiente con este teléfono';

  return;
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

  this.erroresAcudiente.usuarioId =
    error.error?.mensaje ||
    'No fue posible crear el acudiente';

  this.cdr.detectChanges();
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
    this.cdr.detectChanges();

    return;
  }

  if (!/^\d+$/.test(this.telefono.trim())) {

    this.erroresAcudiente.telefono =
      'El teléfono solo puede contener números';
    this.cdr.detectChanges();
    return;
  }

  const telefonoExiste =
    this.acudientes.some(
      acudiente =>
        acudiente.telefono === this.telefono.trim() &&
        acudiente.id !== this.acudienteEditandoId
    );

  if (telefonoExiste) {

    this.erroresAcudiente.telefono =
      'Ya existe un acudiente con este teléfono';
    this.cdr.detectChanges();
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
    this.cdr.detectChanges();
    return;
  }

  if (!this.acudienteEditandoId) {
    this.cdr.detectChanges();
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

cerrarModalAsociar() {

  this.mostrarModalAsociar = false;

  this.estudianteId = null;

  this.parentesco = '';

  this.erroresAsociacion = {
    estudianteId: '',
    parentesco: ''
  };
}
aplicarFiltros() {

  const texto =
    this.filtroTexto.toLowerCase();

  this.acudientesFiltrados =
    this.acudientes.filter(acudiente => {

      const coincideTexto =

        !texto ||

        acudiente.nombre
          ?.toLowerCase()
          .includes(texto) ||

        acudiente.correo
          ?.toLowerCase()
          .includes(texto) ||

        acudiente.telefono
          ?.toString()
          .includes(texto);

      const coincideEstudiante =

        this.filtroEstudiante === 'TODOS' ||

        acudiente.estudiantes?.some(
          (relacion: any) =>
            relacion.estudiante?.id ==
            this.filtroEstudiante
        );

      const coincideGrupo =
  this.filtroGrupo === 'TODOS' ||
  acudiente.estudiantes?.some(
    (relacion: any) =>
      relacion.estudiante?.grupo?.id ==
      this.filtroGrupo
  );

      return (
        coincideTexto &&
        coincideEstudiante && coincideGrupo
      );
    });
}

limpiarFiltros() {

  this.filtroTexto = '';

  this.filtroEstudiante =
    'TODOS';

  this.filtroGrupo = 'TODOS';

  this.aplicarFiltros();
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
}
