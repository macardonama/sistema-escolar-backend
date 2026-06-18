import {
  Component,
  inject,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SidebarComponent } from '../../shared/sidebar/sidebar';
import { HeaderComponent } from '../../shared/header/header';

import { AsignacionesAcademicasService } from '../../core/services/asignaciones-academicas';
import { DocentesService } from '../../core/services/docentes';
import { GruposService } from '../../core/services/grupos';
import { AreasService } from '../../core/services/areas';

@Component({
  selector: 'app-asignaciones-academicas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    HeaderComponent
  ],
  templateUrl: './asignaciones-academicas.html',
  styleUrl: './asignaciones-academicas.css'
})
export class AsignacionesAcademicasComponent implements OnInit {

  private asignacionesService =
    inject(AsignacionesAcademicasService);

  private docentesService =
    inject(DocentesService);

  private gruposService =
    inject(GruposService);

  private areasService =
    inject(AreasService);

  private cdr =
    inject(ChangeDetectorRef);

  asignaciones: any[] = [];

  docentes: any[] = [];

  grupos: any[] = [];

  areas: any[] = [];

  mostrarModal = false;

  docenteId: number | null = null;

  grupoId: number | null = null;

  areaId: number | null = null;

  modoEdicion = false;

  asignacionEditandoId: number | null = null;

  activo = true;

  asignacionesFiltradas: any[] = [];

  filtroDocente = 'TODOS';
  filtroGrupo = 'TODOS';
  filtroArea = 'TODOS';
  filtroEstado = 'TODOS';

  mensajeErrorAsignacion = '';

  erroresAsignacion = {
    docenteId: '',
    grupoId: '',
    areaId: ''
  };

  ngOnInit(): void {

    this.cargarDatos();
  }

  cargarDatos() {

    this.cargarAsignaciones();

    this.cargarDocentes();

    this.cargarGrupos();

    this.cargarAreas();
  }

  cargarAsignaciones() {

    this.asignacionesService
      .listarAsignaciones()
      .subscribe({
        next: (response: any) => {

          this.asignaciones =
            response.asignaciones;

          this.asignacionesFiltradas =
            response.asignaciones;

          this.cdr.detectChanges();
        },

        error: (error) => {
          console.error(error);
        }
      });
  }

  cargarDocentes() {

    this.docentesService
      .listarDocentes()
      .subscribe({
        next: (response: any) => {

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

  cargarAreas() {

    this.areasService
      .listarAreas(true)
      .subscribe({
        next: (response: any) => {

          this.areas =
            response.areas;

          this.cdr.detectChanges();
        },

        error: (error) => {
          console.error(error);
        }
      });
  }
abrirModal() {

  this.modoEdicion = false;

  this.asignacionEditandoId = null;

  this.activo = true;

  this.mostrarModal = true;

  this.docenteId = null;

  this.grupoId = null;

  this.areaId = null;

  this.mensajeErrorAsignacion = '';

  this.erroresAsignacion = {
    docenteId: '',
    grupoId: '',
    areaId: ''
  };
}

  cerrarModal() {

    this.mostrarModal = false;

    this.docenteId = null;

    this.grupoId = null;

    this.areaId = null;

    this.mensajeErrorAsignacion = '';

    this.erroresAsignacion = {
      docenteId: '',
      grupoId: '',
      areaId: ''
    };
  }

  crearAsignacion() {

    this.mensajeErrorAsignacion = '';

    this.erroresAsignacion = {
      docenteId: '',
      grupoId: '',
      areaId: ''
    };

    let hayErrores = false;

    if (!this.docenteId) {

      this.erroresAsignacion.docenteId =
        'Debe seleccionar un docente';

      hayErrores = true;
    }

    if (!this.grupoId) {

      this.erroresAsignacion.grupoId =
        'Debe seleccionar un grupo';

      hayErrores = true;
    }

    if (!this.areaId) {

      this.erroresAsignacion.areaId =
        'Debe seleccionar un área';

      hayErrores = true;
    }

    if (hayErrores) {
      return;
    }

    this.asignacionesService
      .crearAsignacion(
        this.docenteId!,
        this.grupoId!,
        this.areaId!
      )
      .subscribe({
        next: () => {

          this.cargarAsignaciones();

          this.cerrarModal();
        },

      error: (error) => {

        this.mensajeErrorAsignacion =
          error.error?.mensaje || 'No se pudo crear la asignación';

        this.cdr.detectChanges();
      }
      });
  }
editarAsignacion(asignacion: any) {

  this.modoEdicion = true;

  this.asignacionEditandoId =
    asignacion.id;

  this.docenteId =
    asignacion.docenteId;

  this.grupoId =
    asignacion.grupoId;

  this.areaId =
    asignacion.areaId;

  this.activo =
    asignacion.activo;

  this.erroresAsignacion = {
    docenteId: '',
    grupoId: '',
    areaId: ''
  };

  this.mostrarModal = true;
}

actualizarAsignacion() {

  this.mensajeErrorAsignacion = '';

  this.erroresAsignacion = {
    docenteId: '',
    grupoId: '',
    areaId: ''
  };

  let hayErrores = false;

  if (!this.docenteId) {

    this.erroresAsignacion.docenteId =
      'Debe seleccionar un docente';

    hayErrores = true;
  }

  if (!this.grupoId) {

    this.erroresAsignacion.grupoId =
      'Debe seleccionar un grupo';

    hayErrores = true;
  }

  if (!this.areaId) {

    this.erroresAsignacion.areaId =
      'Debe seleccionar un área';

    hayErrores = true;
  }

  if (hayErrores) {
    return;
  }

  if (!this.asignacionEditandoId) return;

  this.asignacionesService
    .actualizarAsignacion(
      this.asignacionEditandoId,
      Number(this.docenteId),
      Number(this.grupoId),
      Number(this.areaId),
      this.activo
    )
    .subscribe({
      next: () => {

        this.cargarAsignaciones();

        this.cerrarModal();
      },

      error: (error) => {

        this.mensajeErrorAsignacion =
          error.error?.mensaje || 'No se pudo actualizar la asignación';

        this.cdr.detectChanges();
      }
    });
}

aplicarFiltros() {

  this.asignacionesFiltradas =
    this.asignaciones.filter(
      asignacion => {

        const coincideDocente =
          this.filtroDocente === 'TODOS' ||
          asignacion.docenteId === Number(this.filtroDocente);

        const coincideGrupo =
          this.filtroGrupo === 'TODOS' ||
          asignacion.grupoId === Number(this.filtroGrupo);

        const coincideArea =
          this.filtroArea === 'TODOS' ||
          asignacion.areaId === Number(this.filtroArea);

        const coincideEstado =
          this.filtroEstado === 'TODOS' ||
          asignacion.activo === (this.filtroEstado === 'ACTIVO');

        return (
          coincideDocente &&
          coincideGrupo &&
          coincideArea &&
          coincideEstado
        );
      }
    );
}
limpiarFiltros() {

  this.filtroDocente = 'TODOS';

  this.filtroGrupo = 'TODOS';

  this.filtroArea = 'TODOS';

  this.filtroEstado = 'TODOS';

  this.aplicarFiltros();
}
}
