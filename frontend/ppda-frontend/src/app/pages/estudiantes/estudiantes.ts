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

import { AcudientesService } from '../../core/services/acudientes';

import { AsistenciasService } from '../../core/services/asistencias';

import { ObservacionesService } from '../../core/services/observaciones';

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

private acudientesService =
  inject(AcudientesService);

private asistenciasService =
  inject(AsistenciasService);

private observacionesService =
  inject(ObservacionesService);

estudiantes: any[] = [];

usuariosEstudiantes: any[] = [];

grupos: any[] = [];

usuario: any = {};

documento = '';

grupoId: number | null = null;

usuarioId: number | null = null;

mostrarPerfil = false;

seccionPerfilEstudiante = 'datos';

estudianteSeleccionado: any = null;

estudiantesFiltrados: any[] = [];

filtroTextoEstudiante = '';

modoEdicion = false;

estudianteEditandoId: number | null = null;

estadoEstudiante = true;

nombreUsuarioEditando = '';

acudientes: any[] = [];
acudientesEstudiante: any[] = [];

asistencias: any[] = [];
asistenciasEstudiante: any[] = [];

observaciones: any[] = [];
observacionesEstudiante: any[] = [];

filtroGrupoEstudiante = 'TODOS';

grados = [
  'Transición',
  'Primero',
  'Segundo',
  'Tercero',
  'Cuarto',
  'Quinto',
  'Sexto',
  'Séptimo',
  'Octavo',
  'Noveno',
  'Décimo',
  'Undécimo'
];

filtroGradoEstudiante = 'TODOS';

erroresEstudiante = {
  usuarioId: '',
  documento: '',
  grupoId: ''
};

mensajeErrorEstudiante = '';

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

    const usuarioGuardado =

      localStorage.getItem('usuario');

    if (usuarioGuardado) {

      this.usuario =

        JSON.parse(usuarioGuardado);

    }

      console.log(this.estudiantes);
    this.aplicarFiltrosEstudiantes();

    this.cdr.detectChanges();
  },

  error: (error) => {

    console.error(error);
  } 
  });
}

aplicarFiltrosEstudiantes() {

  const texto =
    this.filtroTextoEstudiante.toLowerCase();

  this.estudiantesFiltrados =
    this.estudiantes.filter((estudiante: any) => {

      const usuarioEstudiante =
        this.usuariosEstudiantes.find(
          usuario =>
            usuario.id === estudiante.usuarioId
        );

      const grupoEstudiante =
        this.grupos.find(
          grupo =>
            grupo.id === estudiante.grupoId
        );

      const coincideGrado =
        this.filtroGradoEstudiante === 'TODOS' ||
        grupoEstudiante?.grado ===
          this.filtroGradoEstudiante;

      const coincideTexto =
        !texto ||
        usuarioEstudiante?.nombre
          ?.toLowerCase()
          .includes(texto) ||
        estudiante.documento
          ?.toString()
          .includes(texto);

      const coincideGrupo =
        this.filtroGrupoEstudiante === 'TODOS' ||
        Number(estudiante.grupoId) ===
          Number(this.filtroGrupoEstudiante);

      return coincideTexto && coincideGrupo && coincideGrado;
    });

  this.cdr.detectChanges();
}

limpiarFiltrosEstudiantes() {

  this.filtroTextoEstudiante = '';

  this.filtroGrupoEstudiante = 'TODOS';

  this.filtroGradoEstudiante = 'TODOS';

  this.aplicarFiltrosEstudiantes();
}

cargarTodo() {

  this.usuariosService

    .listarUsuarios()

    .subscribe({

      next: (response: any) => {

        this.usuariosEstudiantes =

          response.usuarios.filter(

            (usuario: any) =>
              usuario.rol === 'ESTUDIANTE'
          );

        this.gruposService

          .listarGrupos()

          .subscribe({

            next: (response: any) => {

              this.grupos =
                response.grupos;

              this.cargarEstudiantes();
            },

            error: (error) => {

              console.error(error);
            }
          });
      },

      error: (error) => {

        console.error(error);
      }
    });
}

ngOnInit(): void {

  this.cargarTodo();

  this.cargarAcudientes();

  const usuarioGuardado =
  localStorage.getItem('usuario');

if (usuarioGuardado) {

  this.usuario =
    JSON.parse(usuarioGuardado);
}
}

cargarAcudientes() {

  this.acudientesService
    .listarAcudientes()
    .subscribe({
      next: (response: any) => {
        this.acudientes = response.acudientes;
      },
      error: (error) => {
        console.error(error);
      }
    });
}

crearEstudiante() {

if (!this.validarFormularioEstudiante()) {

  this.cdr.detectChanges();

  return;
}

  this.estudiantesService

    .crearEstudiante(
      Number(this.usuarioId),
      this.documento,
      Number(this.grupoId)
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


soloNumeros(event: KeyboardEvent) {

  const tecla = event.key;

  if (!/[0-9]/.test(tecla)) {

    event.preventDefault();
  }
}

validarFormularioEstudiante(): boolean {

  this.erroresEstudiante = {
    usuarioId: '',
    documento: '',
    grupoId: ''
  };

  this.mensajeErrorEstudiante = '';

  let formularioValido = true;

  if (!this.usuarioId) {

    this.erroresEstudiante.usuarioId =
      'Debe seleccionar un usuario estudiante.';

    formularioValido = false;
  }

  if (!this.documento.trim()) {

    this.erroresEstudiante.documento =
      'El documento es obligatorio.';

    formularioValido = false;

  } else if (!/^\d+$/.test(this.documento.trim())) {

    this.erroresEstudiante.documento =
      'El documento solo puede contener números.';

    formularioValido = false;
  }

  if (!this.grupoId) {

    this.erroresEstudiante.grupoId =
      'Debe seleccionar un grupo.';

    formularioValido = false;
  }

    if (!this.modoEdicion) {

      const existeEstudiante =
        this.estudiantes.some(
          estudiante =>
            Number(estudiante.usuarioId) === Number(this.usuarioId)
        );

      if (existeEstudiante) {

        this.erroresEstudiante.usuarioId =
          'Este usuario ya tiene un estudiante asociado.';

        formularioValido = false;
      }

    }
  const existeDocumento =
    this.estudiantes.some(
      estudiante =>
        estudiante.documento === this.documento.trim() &&
        estudiante.id !== this.estudianteEditandoId
    );

  if (existeDocumento) {

    this.erroresEstudiante.documento =
      'Ya existe un estudiante con este documento.';

    formularioValido = false;
  }

  return formularioValido;
}

abrirPerfil(estudiante: any) {

  this.estudianteSeleccionado = estudiante;

  this.seccionPerfilEstudiante = 'datos';

  this.acudientesEstudiante =
    this.acudientes.filter(
      acudiente =>
        acudiente.estudiantes?.some(
          (relacion: any) =>
            relacion.estudianteId === estudiante.id
        )
    );

  this.asistenciasService
    .listarAsistenciasPorGrupo(estudiante.grupoId)
    .subscribe({
      next: (response: any) => {

        this.asistenciasEstudiante =
          response.asistencias.filter(
            (asistencia: any) =>
              asistencia.estudianteId === estudiante.id
          );

        this.cdr.detectChanges();
      }
    });

  this.observacionesService
    .listarObservacionesPorGrupo(estudiante.grupoId)
    .subscribe({
      next: (response: any) => {

        this.observacionesEstudiante =
          response.observaciones.filter(
            (observacion: any) =>
              observacion.estudianteId === estudiante.id
          );

        this.cdr.detectChanges();
      }
    });

  this.mostrarPerfil = true;
}

editarEstudiante(estudiante: any) {

  this.modoEdicion = true;

  this.estudianteEditandoId =
    estudiante.id;

  this.usuarioId =
    estudiante.usuarioId;

  this.documento =
    estudiante.documento;

  this.grupoId =
    estudiante.grupoId;

  this.estadoEstudiante =
    estudiante.activo;

  this.nombreUsuarioEditando =
    this.usuariosEstudiantes.find(
      usuario =>
        usuario.id === estudiante.usuarioId
    )?.nombre || '';

  this.mostrarModal = true;
}

actualizarEstudiante() {

    if (!this.validarFormularioEstudiante()) {

    this.cdr.detectChanges();

    return;

  }

  if (!this.estudianteEditandoId) {

    return;
  }

  this.estudiantesService
    .actualizarEstudiante(
      this.estudianteEditandoId,
      this.documento,
      Number(this.grupoId),
      this.estadoEstudiante
    )
    .subscribe({

      next: () => {

        this.mostrarModal = false;

        this.modoEdicion = false;

        this.estudianteEditandoId = null;

        this.cargarEstudiantes();

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(error);
      }
    });
}

limpiarFormularioEstudiante() {

  this.usuarioId = null;
  this.documento = '';
  this.grupoId = null;

  this.modoEdicion = false;
  this.estudianteEditandoId = null;
  this.nombreUsuarioEditando = '';

  this.erroresEstudiante = {
    usuarioId: '',
    documento: '',
    grupoId: ''
  };

  this.mensajeErrorEstudiante = '';
}

abrirModalEstudiante() {

  this.limpiarFormularioEstudiante();

  this.mostrarModal = true;
}
cerrarModalEstudiante() {

  this.limpiarFormularioEstudiante();

  this.mostrarModal = false;
}
}