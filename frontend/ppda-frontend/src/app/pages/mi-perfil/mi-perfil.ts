import {
  Component,
  inject,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { AuthService } from '../../core/services/auth';
import { SidebarComponent } from '../../shared/sidebar/sidebar';
import { HeaderComponent } from '../../shared/header/header';

import { AcudientesService } from '../../core/services/acudientes';
import { AsistenciasService } from '../../core/services/asistencias';
import { ObservacionesService } from '../../core/services/observaciones';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    HeaderComponent
  ],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.css',
})
export class MiPerfilComponent implements OnInit {

  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  private acudientesService = inject(AcudientesService);
  private asistenciasService = inject(AsistenciasService);
  private observacionesService = inject(ObservacionesService);

  usuario: any = {};

  estudiante: any = null;

  estudiantes: any[] = [];

  acudientes: any[] = [];
  acudientesEstudiante: any[] = [];

  asistenciasEstudiante: any[] = [];

  observacionesEstudiante: any[] = [];

  seccionMiPerfil = 'datos';

  ngOnInit(): void {

    this.authService.obtenerPerfil()
      .subscribe({
        next: (response: any) => {

        this.usuario = response.usuario;

        this.estudiante =
          response.usuario.estudiante;

        if (this.estudiante) {

          this.cargarAcudientes();

          this.cargarAsistencias();

          this.cargarObservaciones();
        }

        this.cdr.detectChanges();
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

        this.acudientes =
          response.acudientes;

        this.acudientesEstudiante =
          this.acudientes.filter(
            acudiente =>
              acudiente.estudiantes?.some(
                (relacion: any) =>
                  relacion.estudianteId === this.estudiante.id
              )
          );

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error(error);
      }
    });
}

  cargarAsistencias() {

    this.asistenciasService
      .listarAsistenciasPorGrupo(
        this.estudiante.grupoId
      )
      .subscribe({
        next: (response: any) => {

          this.asistenciasEstudiante =
            response.asistencias.filter(
              (asistencia: any) =>
                asistencia.estudianteId === this.estudiante.id
            );

          this.cdr.detectChanges();
        },

        error: (error) => {
          console.error(error);
        }
      });
  }

  cargarObservaciones() {

    this.observacionesService
      .listarObservacionesPorGrupo(
        this.estudiante.grupoId
      )
      .subscribe({
        next: (response: any) => {

          this.observacionesEstudiante =
            response.observaciones.filter(
              (observacion: any) =>
                observacion.estudianteId === this.estudiante.id
            );

          this.cdr.detectChanges();
        },

        error: (error) => {
          console.error(error);
        }
      });
  }

totalAsistencias() {
  return this.asistenciasEstudiante.length;
}

totalPresentes() {
  return this.asistenciasEstudiante.filter(
    asistencia => asistencia.estado === 'PRESENTE'
  ).length;
}

totalAusentes() {
  return this.asistenciasEstudiante.filter(
    asistencia => asistencia.estado === 'AUSENTE'
  ).length;
}

totalJustificadas() {
  return this.asistenciasEstudiante.filter(
    asistencia =>
      asistencia.estado === 'CITA' ||
      asistencia.estado === 'HOSPITALIZADO'
  ).length;
}

porcentajeAsistencia() {

  const total = this.totalAsistencias();

  if (total === 0) {
    return 0;
  }

  return Math.round(
    (this.totalPresentes() / total) * 100
  );
}

}