import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EstudiantesService {

  private http = inject(HttpClient);

  private apiUrl =
    'https://sistema-escolar-backend-wlfg.onrender.com/api/estudiantes';

  listarEstudiantes() {

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

crearEstudiante(
  usuarioId: number,
  documento: string,
  grupoId: number
){

    return this.http.post(

      this.apiUrl,

      {
        usuarioId,
        documento,
        grupoId,
        
      },

      {
        headers: {
          Authorization:
            `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
  }

actualizarEstudiante(
  id: number,
  documento: string,
  grupoId: number,
  activo: boolean
) {

  const token =
    localStorage.getItem('token');

  const headers = {
    Authorization: `Bearer ${token}`
  };

  const body = {
    documento,
    grupoId,
    activo
  };

  return this.http.put(
    `${this.apiUrl}/${id}`,
    body,
    { headers }
  );
}
}