import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AcudientesService {

  private http =
    inject(HttpClient);

  private apiUrl =
    'https://sistema-escolar-backend-wlfg.onrender.com/api/acudientes';

listarAcudientes() {

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

crearAcudiente(
  nombre: string,
  telefono: string,
  correo: string,
  usuarioId?: number | null
) {

  const body: any = {
    nombre,
    telefono,
    correo
  };

  if (usuarioId) {

    body.usuarioId = usuarioId;
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

actualizarAcudiente(
  id: number,
  nombre: string,
  telefono: string,
  correo: string
) {

  return this.http.put(

    `${this.apiUrl}/${id}`,

    {
      nombre,
      telefono,
      correo
    },

    {
      headers: {
        Authorization:
          `Bearer ${localStorage.getItem('token')}`
      }
    }
  );
}

asociarEstudiante(
  estudianteId: number,
  acudienteId: number,
  parentesco: string
) {

  return this.http.post(

    `${this.apiUrl}/asociar-estudiante`,

    {
      estudianteId: Number(estudianteId),
      acudienteId: Number(acudienteId),
      parentesco
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