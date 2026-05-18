import {
  Component,
  inject,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  usuario: any = {};

  ngOnInit(): void {

    this.authService.obtenerPerfil()
      .subscribe({
        next: (response: any) => {

          console.log('RESPUESTA', response);

          this.usuario = response.usuario;

          this.cdr.detectChanges();

        },
        error: (error) => {
          console.error(error);
        }
      });
  }
}