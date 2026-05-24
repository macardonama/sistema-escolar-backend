import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ObservacionesService {

  private http =
    inject(HttpClient);

  private apiUrl =
    'https://sistema-escolar-backend-wlfg.onrender.com/api/observaciones';

  listarObservacionesPorGrupo(
    grupoId: number
  ) {

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

  registrarObservacion(
    payload: any
  ) {

    return this.http.post(

      this.apiUrl,

      payload,

      {
        headers: {
          Authorization:
            `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
  }

  actualizarObservacion(
    id: number,
    payload: any
  ) {

    return this.http.put(

      `${this.apiUrl}/${id}`,

      payload,

      {
        headers: {
          Authorization:
            `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
  }
}
