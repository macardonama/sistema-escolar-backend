import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SidebarComponent } from '../../shared/sidebar/sidebar';
import { HeaderComponent } from '../../shared/header/header';

@Component({
  selector: 'app-estudiantes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    HeaderComponent
  ],
  templateUrl: './estudiantes.html',
  styleUrl: './estudiantes.css'
})
export class EstudiantesComponent {

  mostrarSidebar = true;

  toggleSidebar() {

    this.mostrarSidebar =
      !this.mostrarSidebar;
  }
}