import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  private http =
    inject(HttpClient);

  private apiUrl =
    'https://sistema-escolar-backend-wlfg.onrender.com/api/reportes';

  obtenerResumenGrupo(grupoId: number) {

    return this.http.get(
      `${this.apiUrl}/resumen/grupo/${grupoId}`,
      {
        headers: {
          Authorization:
            `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
  }

  obtenerAsistenciaGrupo(grupoId: number) {

    return this.http.get(
      `${this.apiUrl}/asistencia/grupo/${grupoId}`,
      {
        headers: {
          Authorization:
            `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
  }

  obtenerAsistenciaEstudiante(estudianteId: number) {

  return this.http.get(
    `${this.apiUrl}/asistencia/estudiante/${estudianteId}`,
    {
      headers: {
        Authorization:
          `Bearer ${localStorage.getItem('token')}`
      }
    }
  );
}

obtenerObservacionesEstudiante(estudianteId: number) {

  return this.http.get(
    `${this.apiUrl}/observaciones/estudiante/${estudianteId}`,
    {
      headers: {
        Authorization:
          `Bearer ${localStorage.getItem('token')}`
      }
    }
  );
}
}