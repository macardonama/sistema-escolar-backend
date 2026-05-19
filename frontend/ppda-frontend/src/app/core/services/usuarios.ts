import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private http = inject(HttpClient);

  private apiUrl =
    'https://sistema-escolar-backend-wlfg.onrender.com/api/usuarios';

  listarUsuarios() {

    const token = localStorage.getItem('token');

    return this.http.get(
      this.apiUrl,
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${token}`
        })
      }
    );
  }

  crearUsuario(
  nombre: string,
  correo: string,
  password: string,
  rol: string
) {

  return this.http.post(

    this.apiUrl,

    {
      nombre,
      correo,
      password,
      rol
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