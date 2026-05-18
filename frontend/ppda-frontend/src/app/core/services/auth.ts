import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

  private apiUrl = 'https://sistema-escolar-backend-wlfg.onrender.com';

  login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/api/auth/login`, {
      correo: email,
      password
    });
  }

  obtenerPerfil() {

    const token = localStorage.getItem('token');

    return this.http.get(
      `${this.apiUrl}/api/auth/perfil`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }
}