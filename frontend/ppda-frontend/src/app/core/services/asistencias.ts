import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AsistenciasService {

  private http =
    inject(HttpClient);

  private apiUrl =
    'https://sistema-escolar-backend-wlfg.onrender.com/api/asistencias';

  listarAsistenciasPorGrupo(grupoId: number) {

    return this.http.get(

      `${this.apiUrl}?grupoId=${grupoId}`,

      {
        headers: {
          Authorization:
            `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
  }

  registrarAsistencia(
  estudianteId: number,
  docenteId: number,
  grupoId: number,
  estado: string,
  emocion: string | null,
  observacion: string
) {

  return this.http.post(

    this.apiUrl,

    {
      estudianteId,
      docenteId,
      grupoId,
      estado,
      emocion,
      observacion
    },

    {
      headers: {
        Authorization:
          `Bearer ${localStorage.getItem('token')}`
      }
    }
  );
}

actualizarAsistencia(
  id: number,
  estado: string,
  emocion: string | null,
  observacion: string
) {

  return this.http.put(

    `${this.apiUrl}/${id}`,

    {
      estado,
      emocion,
      observacion
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
