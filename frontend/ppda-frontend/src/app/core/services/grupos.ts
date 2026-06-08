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
  directorId?: number | null
) {

  const body: any = {
    nombre,
    grado
  };

  if (directorId) {
    body.directorDocenteId = directorId;
  }

  return this.http.post(

    this.apiUrl,

    body,

    {
      headers: {
        Authorization:
          `Bearer ${localStorage.getItem('token')}`
      }
    }
  );
}

actualizarGrupo(
  id: number,
  nombre: string,
  grado: string,
  directorId?: number | null
) {

  const body: any = {
    nombre,
    grado
  };

  if (directorId) {
    body.directorDocenteId = directorId;
  }

  return this.http.put(
    `${this.apiUrl}/${id}`,
    body,
    {
      headers: {
        Authorization:
          `Bearer ${localStorage.getItem('token')}`
      }
    }
  );
}

desactivarGrupo(id: number) {

  return this.http.patch(
    `${this.apiUrl}/${id}/desactivar`,
    {},
    {
      headers: {
        Authorization:
          `Bearer ${localStorage.getItem('token')}`
      }
    }
  );
}

activarGrupo(id: number) {

  return this.http.patch(
    `${this.apiUrl}/${id}/activar`,
    {},
    {
      headers: {
        Authorization:
          `Bearer ${localStorage.getItem('token')}`
      }
    }
  );
}

}