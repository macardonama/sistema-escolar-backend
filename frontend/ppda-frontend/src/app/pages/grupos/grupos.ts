import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SidebarComponent } from '../../shared/sidebar/sidebar';
import { HeaderComponent } from '../../shared/header/header';

import { inject, OnInit } from '@angular/core';
import { GruposService } from '../../core/services/grupos';

import { FormsModule } from '@angular/forms';

import { DocentesService } from '../../core/services/docentes';
import { EstudiantesService } from '../../core/services/estudiantes';
import { AsistenciasService } from '../../core/services/asistencias';
import { ObservacionesService } from '../../core/services/observaciones';
import { ReportesService } from '../../core/services/reportes';

@Component({
  selector: 'app-grupos',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    FormsModule,
    HeaderComponent
  ],
  templateUrl: './grupos.html',
  styleUrl: './grupos.css'
})
export class GruposComponent implements OnInit {

  mostrarSidebar = true;

  private gruposService =
  inject(GruposService);
  private cdr =
  inject(ChangeDetectorRef);

  private estudiantesService =
  inject(EstudiantesService);

  estudiantes: any[] = [];

  private asistenciasService =
  inject(AsistenciasService);

  asistenciasGrupo: any[] = [];

  seccionGrupo = 'estudiantes';

  grupos: any[] = [];

  gruposFiltrados: any[] = [];

  filtroTextoGrupo = '';

  filtroGrado = 'TODOS';

  filtroDirector = 'TODOS';

  filtroEstado = 'TODOS';

  mostrarDetalleGrupo = false;

  grupoSeleccionado: any = null; 

  private docentesService =
  inject(DocentesService);

  usuario: any = {};

  docenteActual: any = null;

  docentes: any[] = [];

  mostrarModal = false;

  modoEdicion = false;

  grupoEditandoId: number | null = null;

  activoEditando = true;

  nombre = '';

  grado = '';

  identificador = '';

  directorId: number | null = null;

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
  'Once'
];

identificadores = [
  'A',
  'B',
  'C',
  'D',
  '1',
  '2',
  '3',
  '4'
];

  mensajeErrorGrupo = '';

erroresGrupo = {
  grado: '',
  identificador: ''
};

  mostrarFormularioAsistencia = false;

  estudianteAsistenciaId: number | null = null;

  estadoAsistencia = 'PRESENTE';

  emocionAsistencia = '😊';

  observacionAsistencia = '';

  modoEdicionAsistencia = false;

  asistenciaEditandoId: number | null = null;

  private observacionesService =
  inject(ObservacionesService);

  observacionesGrupo: any[] = [];

  mostrarFormularioObservacion = false;

  modoEdicionObservacion = false;

  observacionEditandoId:
    number | null = null;

  tipoObservacion = 'GENERAL';

  descripcionObservacion = '';

  enviarAcudiente = false;

  estudianteObservacionId:
    number | null = null;

  private reportesService =
  inject(ReportesService);

  resumenGrupo: any = null;

  reporteAsistenciaGrupo: any = null;

  estudianteReporteId: number | null = null;

  reporteAsistenciaEstudiante: any = null;

  reporteObservacionesEstudiante: any = null;
  toggleSidebar() {

    this.mostrarSidebar =
      !this.mostrarSidebar;
  }

ngOnInit(): void {

  const usuarioGuardado =
    localStorage.getItem('usuario');

  if (usuarioGuardado) {

    this.usuario =
      JSON.parse(usuarioGuardado);
  }

  this.cargarEstudiantes();

  this.docentesService
    .listarDocentes()
    .subscribe({

      next: (response: any) => {

        this.docentes =
          response.docentes;

        this.cargarGrupos();
      },

      error: (error) => {

        console.error(error);
      }
    });
}

limpiarFiltros() {

  this.filtroGrado = 'TODOS';

  this.filtroDirector = 'TODOS';

  this.filtroEstado = 'TODOS';

  this.aplicarFiltrosGrupos();
}

cargarGrupos() {

  this.gruposService
    .listarGrupos()
    .subscribe({

      next: (response: any) => {

        const todosLosGrupos = response.grupos;

        if (this.usuario?.rol === 'DOCENTE') {

          this.docenteActual =
            this.docentes.find(
              docente =>
                docente.usuarioId === this.usuario.id
            );

          this.grupos =
            todosLosGrupos.filter(
              (grupo: any) =>
                grupo.directorDocenteId === this.docenteActual?.id
            );

        } else {

          this.grupos = todosLosGrupos;
        }

        this.aplicarFiltrosGrupos();
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error(error);
      }
    });
}

aplicarFiltrosGrupos() {

  this.gruposFiltrados =
    this.grupos.filter((grupo: any) => {

      const coincideGrado =
        this.filtroGrado === 'TODOS' ||
        grupo.grado === this.filtroGrado;

      const coincideDirector =
        this.filtroDirector === 'TODOS' ||
        Number(grupo.directorDocenteId) ===
          Number(this.filtroDirector);

      const coincideEstado =
        this.filtroEstado === 'TODOS' ||
        (
          this.filtroEstado === 'ACTIVO' &&
          grupo.activo === true
        ) ||
        (
          this.filtroEstado === 'INACTIVO' &&
          grupo.activo === false
        );

      return (
        coincideGrado &&
        coincideDirector &&
        coincideEstado
      );
    });

  this.cdr.detectChanges();
}

validarFormularioGrupo(): boolean {

  this.erroresGrupo = {
    grado: '',
    identificador: ''
  };

  this.mensajeErrorGrupo = '';

  let formularioValido = true;

  if (!this.grado) {

    this.erroresGrupo.grado =
      'Debe seleccionar un grado.';

    formularioValido = false;
  }

  if (!this.identificador) {

    this.erroresGrupo.identificador =
      'Debe seleccionar un identificador.';

    formularioValido = false;
  }

  return formularioValido;
}

existeGrupoConMismoNombre(
  nombreGrupo: string
): boolean {

  return this.grupos.some(
    grupo =>
      grupo.nombre?.toUpperCase() ===
      nombreGrupo.toUpperCase()
  );
} 

crearGrupo() {

  if (!this.validarFormularioGrupo()) {

    return;
  }

  const nombreGrupo =
  this.obtenerNombreGrupo();

  if (this.existeGrupoConMismoNombre(nombreGrupo)) {

   this.mensajeErrorGrupo =
  `No es posible crear el grupo porque ${nombreGrupo} ya existe.`;

    return;
  }

  this.gruposService

    .crearGrupo(
      nombreGrupo,
      this.grado,
      this.directorId
    )

    .subscribe({

      next: (response: any) => {

        console.log(response);

        this.mostrarModal = false;

        this.nombre = '';
        this.grado = '';
        this.identificador = '';
        this.directorId = null;

        this.mensajeErrorGrupo = '';

        this.erroresGrupo = {
          grado: '',
          identificador: ''
        };

        this.cargarGrupos();

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(error);

        this.mensajeErrorGrupo =
          error.error?.mensaje ||
          error.error?.message ||
          'No fue posible crear el grupo. Verifica la información ingresada.';

        this.cdr.detectChanges();
      }
    });
}

obtenerNombreGrupo(): string {

  if (!this.grado || !this.identificador) {

    return '';
  }

  const mapaGrados: any = {
    'Transición': '0',
    'Primero': '1',
    'Segundo': '2',
    'Tercero': '3',
    'Cuarto': '4',
    'Quinto': '5',
    'Sexto': '6',
    'Séptimo': '7',
    'Octavo': '8',
    'Noveno': '9',
    'Décimo': '10',
    'Once': '11'
  };

  return `${mapaGrados[this.grado]}-${this.identificador}`;
}

obtenerIdentificadorDesdeNombre(
  nombre: string
): string {

  if (!nombre) return '';

  const partes = nombre.split('-');

  return partes[1] || '';
} 

editarGrupo(grupo: any) {

  this.mensajeErrorGrupo = '';

  this.grupoSeleccionado = grupo;

  this.activoEditando = grupo.activo;

  this.modoEdicion = true;

  this.grupoEditandoId =
    grupo.id;

  this.nombre =
    grupo.nombre;

  this.grado =
    grupo.grado;

  this.identificador =
  this.obtenerIdentificadorDesdeNombre(grupo.nombre);

  this.directorId =
    grupo.directorDocenteId;

  this.mostrarModal = true;
}

actualizarGrupo() {

if (!this.activoEditando) {
  return;
}

if (!this.grupoEditandoId) return;

if (!this.validarFormularioGrupo()) {
  return;
}

const nombreGrupo =
  this.obtenerNombreGrupo();

  const existeOtroGrupoConMismoNombre =
  this.grupos.some(
    grupo =>
      grupo.id !== this.grupoEditandoId &&
      grupo.nombre?.toUpperCase() ===
        nombreGrupo.toUpperCase()
  );

if (existeOtroGrupoConMismoNombre) {

  this.mensajeErrorGrupo =
    `No es posible actualizar el grupo porque ${nombreGrupo} ya existe.`;

  return;
}

  this.gruposService

    .actualizarGrupo(
      this.grupoEditandoId,
      nombreGrupo,
      this.grado,
      this.directorId ? Number(this.directorId) : null
    )

    .subscribe({

      next: () => {

        if (
          this.grupoSeleccionado.activo
          !== this.activoEditando
        ) {

          const accionEstado =
            this.activoEditando
              ? this.gruposService.activarGrupo(this.grupoEditandoId!)
              : this.gruposService.desactivarGrupo(this.grupoEditandoId!);

          accionEstado.subscribe({

            next: () => {

              this.cerrarModalGrupo();
            },

            error: (error) => {

              console.error(error);
            }
          });

        } else {

          this.cerrarModalGrupo();
        }
      },

      error: (error) => {

        console.error(error);
      }
    });
}

abrirDetalleGrupo(grupo: any) {

  this.grupoSeleccionado = grupo;

  this.seccionGrupo = 'estudiantes';

  this.mostrarDetalleGrupo = true;

  this.cargarEstudiantes();

  this.cdr.detectChanges();
}

volverAListadoGrupos() {

  this.mostrarDetalleGrupo = false;

  this.grupoSeleccionado = null;

  this.seccionGrupo = 'estudiantes';

  this.cdr.detectChanges();
}


cambiarEstadoLocalGrupo() {

  this.activoEditando =
    !this.activoEditando;
}

cerrarModalGrupo() {

  this.mensajeErrorGrupo = '';

  this.cargarGrupos();

  this.mostrarModal = false;

  this.modoEdicion = false;

  this.grupoEditandoId = null;

  this.grupoSeleccionado = null;

  this.nombre = '';

  this.grado = '';

  this.identificador = '';

  this.directorId = null;

  this.cdr.detectChanges();
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

cargarAsistenciasGrupo() {

  if (!this.grupoSeleccionado) return;

  this.asistenciasService

    .listarAsistenciasPorGrupo(
      this.grupoSeleccionado.id
    )

    .subscribe({

      next: (response: any) => {

        console.log(response);

        this.asistenciasGrupo =
          response.asistencias;

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(error);
      }
    });
}

registrarAsistenciaGrupo() {

  if (
    !this.estudianteAsistenciaId ||
    !this.grupoSeleccionado?.directorDocenteId
  ) return;

  const emocion =
    this.estadoAsistencia === 'PRESENTE'
      ? this.emocionAsistencia
      : null;

  this.asistenciasService
    .registrarAsistencia(
      this.estudianteAsistenciaId,
      this.grupoSeleccionado.directorDocenteId,
      this.grupoSeleccionado.id,
      this.estadoAsistencia,
      emocion,
      this.observacionAsistencia
    )
    .subscribe({

      next: () => {

        this.mostrarFormularioAsistencia = false;

        this.estudianteAsistenciaId = null;

        this.estadoAsistencia = 'PRESENTE';

        this.emocionAsistencia = '😊';

        this.observacionAsistencia = '';

        this.cargarAsistenciasGrupo();
      },

      error: (error) => {

        console.error(error);
      }
    });
}

editarAsistencia(asistencia: any) {

  this.modoEdicionAsistencia = true;

  this.mostrarFormularioAsistencia = true;

  this.asistenciaEditandoId =
    asistencia.id;

  this.estudianteAsistenciaId =
    asistencia.estudianteId;

  this.estadoAsistencia =
    asistencia.estado;

  this.emocionAsistencia =
    asistencia.emocion || '😊';

  this.observacionAsistencia =
    asistencia.observacion || '';
}

actualizarAsistenciaGrupo() {

  if (!this.asistenciaEditandoId) return;

  const emocion =
    this.estadoAsistencia === 'PRESENTE'
      ? this.emocionAsistencia
      : null;

  this.asistenciasService
    .actualizarAsistencia(
      this.asistenciaEditandoId,
      this.estadoAsistencia,
      emocion,
      this.observacionAsistencia
    )
    .subscribe({

      next: () => {

      this.cargarAsistenciasGrupo();

      this.mostrarFormularioAsistencia = false;

      this.modoEdicionAsistencia = false;

      this.asistenciaEditandoId = null;

      this.estudianteAsistenciaId = null;

      this.estadoAsistencia = 'PRESENTE';

      this.emocionAsistencia = '😊';

      this.observacionAsistencia = '';

      this.cdr.detectChanges();
    },

      error: (error) => {

        console.error(error);
      }
    });
}

abrirSeccionAsistencia() {

  this.seccionGrupo = 'asistencia';

  this.cdr.detectChanges();

  this.cargarAsistenciasGrupo();
}

cargarObservacionesGrupo() {

  if (!this.grupoSeleccionado)
    return;

  this.observacionesService

    .listarObservacionesPorGrupo(
      this.grupoSeleccionado.id
    )

    .subscribe({

      next: (response: any) => {

        this.observacionesGrupo =
          response.observaciones;

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(error);
      }
    });
}

abrirSeccionObservaciones() {

  this.seccionGrupo =
    'observaciones';

  this.cdr.detectChanges();

  this.cargarObservacionesGrupo();
}

registrarObservacionGrupo() {

  if (!this.grupoSeleccionado) return;

  const payload: any = {
    docenteId: this.grupoSeleccionado.directorDocenteId,
    grupoId: this.grupoSeleccionado.id,
    tipo: this.tipoObservacion,
    descripcion: this.descripcionObservacion,
    enviarAcudiente: this.enviarAcudiente
  };

  if (this.tipoObservacion === 'INDIVIDUAL') {
    payload.estudianteId = this.estudianteObservacionId;
  }

  this.observacionesService
    .registrarObservacion(payload)
    .subscribe({

      next: () => {

      this.cargarObservacionesGrupo();

      this.mostrarFormularioObservacion = false;

      this.tipoObservacion = 'GENERAL';

      this.descripcionObservacion = '';

      this.enviarAcudiente = false;

      this.estudianteObservacionId = null;

      this.cdr.detectChanges();
    },

      error: (error) => {
        console.error(error);
      }
    });
}

editarObservacion(observacion: any) {

  this.modoEdicionObservacion = true;

  this.mostrarFormularioObservacion = true;

  this.observacionEditandoId =
    observacion.id;

  this.tipoObservacion =
    observacion.tipo;

  this.descripcionObservacion =
    observacion.descripcion;

  this.enviarAcudiente =
    observacion.enviarAcudiente;

  this.estudianteObservacionId =
    observacion.estudianteId || null;
}

actualizarObservacionGrupo() {

  if (!this.observacionEditandoId) return;

  const payload: any = {
    tipo: this.tipoObservacion,
    descripcion: this.descripcionObservacion,
    enviarAcudiente: this.enviarAcudiente
  };

  if (this.tipoObservacion === 'INDIVIDUAL') {
    payload.estudianteId =
      this.estudianteObservacionId;
  }

console.log('ID observación:', this.observacionEditandoId);
console.log('Payload observación:', payload);
  this.observacionesService

    .actualizarObservacion(
      this.observacionEditandoId,
      payload
    )

    .subscribe({

      next: () => {

      this.cargarObservacionesGrupo();

      this.mostrarFormularioObservacion = false;

      this.modoEdicionObservacion = false;

      this.observacionEditandoId = null;

      this.tipoObservacion = 'GENERAL';

      this.descripcionObservacion = '';

      this.enviarAcudiente = false;

      this.estudianteObservacionId = null;

      this.cdr.detectChanges();
    },

      error: (error) => {

        console.error('Error actualizar observación:', error.error);
      }
    });
}

cargarReportesGrupo() {

  if (!this.grupoSeleccionado) return;

  this.reportesService
    .obtenerResumenGrupo(this.grupoSeleccionado.id)
    .subscribe({
      next: (response: any) => {
        this.resumenGrupo = response;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
      }
    });

  this.reportesService
    .obtenerAsistenciaGrupo(this.grupoSeleccionado.id)
    .subscribe({
      next: (response: any) => {
        this.reporteAsistenciaGrupo = response;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
      }
    });
}

cargarReportesEstudiante() {

  if (!this.estudianteReporteId) return;

  this.reportesService
    .obtenerAsistenciaEstudiante(this.estudianteReporteId)
    .subscribe({
      next: (response: any) => {
        this.reporteAsistenciaEstudiante = response;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
      }
    });

  this.reportesService
    .obtenerObservacionesEstudiante(this.estudianteReporteId)
    .subscribe({
      next: (response: any) => {
        this.reporteObservacionesEstudiante = response;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
      }
    });
}

abrirReportesEstudiante() {

  this.cdr.detectChanges();

  setTimeout(() => {

    this.cargarReportesEstudiante();

  }, 0);
}

abrirSeccionReportes() {

  this.seccionGrupo = 'reportes';

  this.cdr.detectChanges();

  setTimeout(() => {

    this.cargarReportesGrupo();

  }, 0);
}

cargarReportesEstudiantePorId(
  estudianteId: number
) {

  this.estudianteReporteId =
    Number(estudianteId);

  this.reporteAsistenciaEstudiante = null;

  this.reporteObservacionesEstudiante = null;

  this.cargarReportesEstudiante();
}

abrirModalGrupo() {

  this.modoEdicion = false;

  this.grupoEditandoId = null;

  this.grupoSeleccionado = null;

  this.nombre = '';

  this.grado = '';

  this.identificador = '';

  this.directorId = null;

  this.mensajeErrorGrupo = '';

  this.erroresGrupo = {
    grado: '',
    identificador: ''
  };

  this.mostrarModal = true;
}

cargarDocentes() {

  this.docentesService
    .listarDocentes()
    .subscribe({

      next: (response: any) => {

        this.docentes = response.docentes;

        this.cargarGrupos();
      },

      error: (error) => {
        console.error(error);
      }
    });
}
}
