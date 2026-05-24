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

  mostrarDetalleGrupo = false;

  grupoSeleccionado: any = null; 

  private docentesService =
  inject(DocentesService);

  docentes: any[] = [];

  mostrarModal = false;

  modoEdicion = false;

  grupoEditandoId: number | null = null;

  activoEditando = true;

  nombre = '';

  grado = '';

  directorId: number | null = null;

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

    this.cargarEstudiantes();
    this.docentesService

  .listarDocentes()

  .subscribe({

    next: (response: any) => {

      console.log(response);

      this.docentes =
        response.docentes;
    },

    error: (error) => {

      console.error(error);
    }
  });

  this.gruposService

    this.cargarGrupos();
}

cargarGrupos() {

  this.gruposService

    .listarGrupos()

    .subscribe({

      next: (response: any) => {

        console.log(response);

        this.grupos =
          response.grupos;
        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error(error);
      }
    });
}

crearGrupo() {

  if (!this.directorId) return;

  this.gruposService

    .crearGrupo(
      this.nombre,
      this.grado,
      this.directorId
    )

    .subscribe({

      next: (response: any) => {

        console.log(response);

        this.mostrarModal = false;

        this.cdr.detectChanges();

        this.gruposService

          this.cargarGrupos();
      },

      error: (error) => {

        console.error(error);
      }
    });
}

editarGrupo(grupo: any) {

  this.grupoSeleccionado = grupo;

  this.activoEditando = grupo.activo;

  this.modoEdicion = true;

  this.grupoEditandoId =
    grupo.id;

  this.nombre =
    grupo.nombre;

  this.grado =
    grupo.grado;

  this.directorId =
    grupo.directorDocenteId;

  this.mostrarModal = true;
}

actualizarGrupo() {

  if (
    !this.grupoEditandoId ||
    !this.directorId
  ) return;

  this.gruposService

    .actualizarGrupo(
      this.grupoEditandoId,
      this.nombre,
      this.grado,
      Number(this.directorId)
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

  this.seccionGrupo = '';

  this.mostrarDetalleGrupo = true;

  this.cargarReportesGrupo();
}
cambiarEstadoLocalGrupo() {

  this.activoEditando =
    !this.activoEditando;
}

cerrarModalGrupo() {

  this.cargarGrupos();

  this.mostrarModal = false;

  this.modoEdicion = false;

  this.grupoEditandoId = null;

  this.grupoSeleccionado = null;

  this.nombre = '';

  this.grado = '';

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
}
