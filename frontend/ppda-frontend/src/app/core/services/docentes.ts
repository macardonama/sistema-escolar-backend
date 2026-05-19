import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocentesService {

  private http = inject(HttpClient);

  private apiUrl =
    'https://sistema-escolar-backend-wlfg.onrender.com/api/docentes';

  crearDocente(
    usuarioId: number,
    documento: string,
    telefono: string
  ) {

    return this.http.post(

      this.apiUrl,

      {
        usuarioId,
        documento,
        telefono
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