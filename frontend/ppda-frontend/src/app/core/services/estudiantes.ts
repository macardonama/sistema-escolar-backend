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
  nombre: string,
  documento: string,
  grupoId: number,
  usuarioId: number
) {

    return this.http.post(

      this.apiUrl,

      {
        nombre,
        documento,
        grupoId,
        usuarioId
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