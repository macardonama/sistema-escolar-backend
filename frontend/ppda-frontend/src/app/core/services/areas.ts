import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AreasService {

  private http = inject(HttpClient);

  private apiUrl =
    'https://sistema-escolar-backend-wlfg.onrender.com/api/areas';

  crearArea(
    nombre: string,
    descripcion: string
  ) {

    return this.http.post(
      this.apiUrl,
      {
        nombre,
        descripcion
      },
      {
        headers: {
          Authorization:
            `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
  }

  listarAreas(activo?: boolean) {

  const url =
    activo === undefined
      ? this.apiUrl
      : `${this.apiUrl}?activo=${activo}`;

  return this.http.get(
    url,
    {
      headers: {
        Authorization:
          `Bearer ${localStorage.getItem('token')}`
      }
    }
  );
}

actualizarArea(
  id: number,
  nombre: string,
  descripcion: string,
  activo: boolean
) {

  return this.http.put(
    `${this.apiUrl}/${id}`,
    {
      nombre,
      descripcion,
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