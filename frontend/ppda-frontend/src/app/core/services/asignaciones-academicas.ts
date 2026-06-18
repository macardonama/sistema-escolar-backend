import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AsignacionesAcademicasService {

  private http = inject(HttpClient);

  private apiUrl =
    'https://sistema-escolar-backend-wlfg.onrender.com/api/asignaciones-academicas';

  listarAsignaciones() {

    return this.http.get(
      this.apiUrl,
      {
        headers: {
          Authorization:
            `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
  }

  crearAsignacion(
    docenteId: number,
    grupoId: number,
    areaId: number
  ) {

    return this.http.post(
      this.apiUrl,
      {
        docenteId,
        grupoId,
        areaId
      },
      {
        headers: {
          Authorization:
            `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
  }

  listarAsignacionesPorDocente(
    docenteId: number
  ) {

    return this.http.get(
      `${this.apiUrl}/docente/${docenteId}`,
      {
        headers: {
          Authorization:
            `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
  }

  actualizarAsignacion(
  id: number,
  docenteId: number,
  grupoId: number,
  areaId: number,
  activo: boolean
) {

  return this.http.put(
    `${this.apiUrl}/${id}`,
    {
      docenteId,
      grupoId,
      areaId,
      activo
    },
    {
      headers: {
        Authorization:
          `Bearer ${localStorage.getItem('token')}`
      }
    }
  );
}
}