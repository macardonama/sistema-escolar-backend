import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../shared/sidebar/sidebar';
import { HeaderComponent } from '../../shared/header/header';

@Component({
  selector: 'app-mis-acudidos',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    HeaderComponent
  ],
  templateUrl: './mis-acudidos.html',
  styleUrl: './mis-acudidos.css',
})
export class MisAcudidosComponent {

  acudidos = [
  {
    estudianteId: 1,
    parentesco: 'Madre',
    estudiante: {
      id: 1,
      nombre: 'Estudiante Ejemplo',
      activo: true,
      grupo: {
        nombre: '10-A'
      }
    }
  },
  {
    estudianteId: 2,
    parentesco: 'Padre',
    estudiante: {
      id: 2,
      nombre: 'Segundo Estudiante',
      activo: true,
      grupo: {
        nombre: '6-1'
      }
    }
  }
];

  acudidoSeleccionado: any = null;

mostrarPerfilAcudido = false;

seccionAcudido = 'perfil';

verPerfilAcudido(acudido: any) {

  this.acudidoSeleccionado = acudido;

  this.seccionAcudido = 'perfil';

  this.mostrarPerfilAcudido = true;
}
}
