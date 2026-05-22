import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GruposService {

  private http = inject(HttpClient);

  private apiUrl =
    'https://sistema-escolar-backend-wlfg.onrender.com/api/grupos';

  listarGrupos() {

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

  crearGrupo(
    nombre: string,
    grado: string,
    directorId: number
  ) {

    return this.http.post(

      this.apiUrl,

      {
        nombre,
        grado,
        directorId
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